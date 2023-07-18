import { NextFunction, Response } from 'express';
import patientService from '@/services/patient.service';
import { RequestWithInfo } from '@/interfaces/auth.interface';
import { DYNAMODB_TABLE_INDEX, DYNAMODB_TABLE_NAMES } from '@/database/constants';
import { generateUuid } from '@/utils/util';
import HealthGorillaService from '@/services/healthGorilla.service';
import PythoScoreService from '@/services/pythoScore.service';
import { Patient, PatientParamsInput, PatientUpdateInput } from '@/interfaces/patient.interface';

class PatientController {
  public patientService = new patientService();
  public healthGorillaService = new HealthGorillaService();
  public pythoScoreService = new PythoScoreService();

  public pythoScore = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const identifier: string = req.body.identifier;
      const mock = true;
      let score: string;
      let createPatientResponse: Patient;

      const findPatientParams = {
        TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
        IndexName: DYNAMODB_TABLE_INDEX.PATIENT_IDENTIFIER_INDEX,
        KeyConditionExpression: 'identifier = :identifier',
        ExpressionAttributeValues: {
          ':identifier': identifier,
        },
      };

      // Check patient in the DynamoDB Database
      const patient = await this.patientService.findPatientById(findPatientParams);
      if (!patient) {
        // Patient not found in the DB, call Health Gorilla Service
        const patientHG = await this.healthGorillaService.getPatientInfo(identifier, mock);

        if (patientHG) {
          // Insert the user data into the DB
          const patientData: PatientParamsInput = {
            TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
            Item: {
              id: `${generateUuid()}`,
              ...patientHG,
              pythoScore: '0',
            },
          };

          createPatientResponse = await this.patientService.createPatient(patientData);
        }
      }

      if (patient || createPatientResponse) {
        // Use Health Gorilla response and call Pytho Score API using Pytho Service
        score = await this.pythoScoreService.getPythoScore(identifier, mock);

        let data: Patient;

        if (patient) {
          data = {
            ...patient,
            pythoScore: score,
          };
        } else {
          data = {
            ...createPatientResponse,
            pythoScore: score,
          };
        }

        const updatePatientParams: PatientUpdateInput = {
          TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
          Item: {
            ...data,
          },
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
