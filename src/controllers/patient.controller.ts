import { NextFunction, Response } from 'express';
import patientService from '@/services/patient.service';
import { RequestWithInfo } from '@/interfaces/auth.interface';
import { DYNAMODB_TABLE_INDEX, DYNAMODB_TABLE_NAMES } from '@/database/constants';
import { generateUuid, getCurrentTimeEpoch } from '@/utils/util';
import HealthGorillaService from '@/services/healthGorilla.service';
import PythoScoreService from '@/services/pythoScore.service';
import { Patient, PatientParamsInput, PatientUpdateInput } from '@/interfaces/patient.interface';
import patientsData from '@/data/patients-data.json';

class PatientController {
  public patientService = new patientService();
  public healthGorillaService = new HealthGorillaService();
  public pythoScoreService = new PythoScoreService();

  public pythoScore = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const id: string = req.body.id; // TODO: need to check how to handle this
      const identifier: string = req.body.identifier;
      let score: string;
      let createPatientResponse: Patient;
      const currentTimestamp = getCurrentTimeEpoch();

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
        const patientHG: any = await this.healthGorillaService.getPatientInfo(id); // TODO: Need to check how to get info by identifier

        if (patientHG && patientHG?.entry?.length) {
          let resourceData = patientHG.entry[0].resource;
          resourceData = { ...resourceData, identifier: resourceData.id };
          resourceData.createdAt = currentTimestamp;
          delete resourceData.id;

          // Insert the user data into the DB
          const patientData: PatientParamsInput = {
            TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
            Item: {
              id: `${generateUuid()}`,
              ...resourceData,
              pythoScore: '0',
            },
          };

          createPatientResponse = await this.patientService.createPatient(patientData);
        }
      }

      if (patient || createPatientResponse) {
        // Use Health Gorilla response and call Pytho Score API using Pytho Service
        score = await this.pythoScoreService.getPythoScore(identifier, true);

        let data: Patient;

        if (patient) {
          patient.updatedAt = currentTimestamp;
          data = {
            ...patient,
            pythoScore: score,
          };
        } else {
          createPatientResponse.updatedAt = currentTimestamp;
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

  public importData = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      for (const record of patientsData) {
        const currentTimestamp = getCurrentTimeEpoch();
        const findPatientParams = {
          TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
          IndexName: DYNAMODB_TABLE_INDEX.PATIENT_IDENTIFIER_INDEX,
          KeyConditionExpression: 'identifier = :identifier',
          ExpressionAttributeValues: {
            ':identifier': record.identifier,
          },
        };

        // Check patient in the DynamoDB Database
        const patient = await this.patientService.findPatientById(findPatientParams);

        if (patient) {
          // Call Get Pytho Score API
          const pythoScore = await this.pythoScoreService.getPythoScore(patient.identifier);
          // Insert the user data into the DB
          const patientData: PatientUpdateInput = {
            TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
            Item: {
              ...patient,
              updatedAt: currentTimestamp,
              pythoScore: pythoScore ?? '0',
            },
          };

          // Insert record in Patients table
          await this.patientService.updatePatient(patientData);
        } else {
          // Call Get Pytho Score API
          const pythoScore = await this.pythoScoreService.getPythoScore(record.identifier);
          // Insert the user data into the DB
          const patientData: PatientParamsInput = {
            TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
            Item: {
              id: `${generateUuid()}`,
              ...record,
              updatedAt: currentTimestamp,
              pythoScore: pythoScore ?? '0',
            },
          };

          await this.patientService.createPatient(patientData);
        }
      }

      res.status(200).json({ message: 'Records processed successfully.' });
    } catch (error) {
      next(error);
    }
  };
}

export default PatientController;
