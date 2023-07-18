import { NextFunction, Response } from 'express';
import { PatientDto } from '@/dtos/patient.dto';
import patientService from '@/services/patient.service';
import { RequestWithInfo } from '@/interfaces/auth.interface';
import { DYNAMODB_TABLE_INDEX, DYNAMODB_TABLE_NAMES } from '@/database/constants';
import { generateUuid } from '@/utils/util';
import HealthGorillaService from '@/services/healthGorilla.service';
import PythoScoreService from '@/services/pythoScore.service';
import { patientCreateOutput, patientParamsInput, patientUpdateInput } from '@/interfaces/patient.interface';

class PatientController {
  public patientService = new patientService();
  public healthGorillaService = new HealthGorillaService();
  public pythoScoreService = new PythoScoreService();

  public pythoScore = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      let score: string;
      let createPatientResponse: patientCreateOutput; // Declare createPatientResponse outside the block
      const mock = true;
      const identifier: string = req.body.identifier;

      const findPatientParams = {
        TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
        IndexName: DYNAMODB_TABLE_INDEX.INDEX,
        KeyConditionExpression: 'identifier = :identifier',
        ExpressionAttributeValues: {
          ':identifier': req.body.identifier,
        },
      };

      // Call Patient service to check if the user exists in the DB
      const response = await this.patientService.findPatientById(findPatientParams);

      if (response && response.length) {
        // If user not found in the DB, call Health Gorilla Service to search for the user
        const responseData = await this.healthGorillaService.getPatientInfo(identifier, mock);

        if (responseData) {
          // Insert the user data into the DB
          const createPatientParams: patientParamsInput = {
            TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
            Item: {
              id: `${generateUuid()}`,
              name: responseData.name,
              identifier: responseData.identifier,
              patientData: responseData,
              pythoScore: '0',
            },
          };

          createPatientResponse = await this.patientService.createPatient(createPatientParams);
        }
      }

      if ((response && response.length) || createPatientResponse) {
        // Use Health Gorilla response and call Pytho Score API using Pytho Service
        score = await this.pythoScoreService.getPythoScore(identifier, mock);

        const data: PatientDto = {
          pythoScore: score,
          patientData: response ? response[0] : createPatientResponse,
          id: response ? response[0].id : createPatientResponse.id,
        };

        const updatePatientParams: patientUpdateInput = {
          TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
          Item: data,
        };

        // Update Pytho Score in database
        const updatePatientResponse = await this.patientService.updatePatient(updatePatientParams);

        // Return the Pytho score in response
        return res.status(200).json({ data: updatePatientResponse, pythoScore: score });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default PatientController;
