import { NextFunction, Response } from 'express';
import { PatientDto } from '@/dtos/patient.dto';
import patientService from '@/services/patient.service';
import { RequestWithInfo } from '@/interfaces/auth.interface';
import { Patient } from '@/interfaces/patient.interface';
import { DYNAMODB_TABLE_NAMES } from '@/database/constants';
import { generateUuid } from '@/utils/util';

class PatientController {
  public patientService = new patientService();

  public createPatient = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const userData: PatientDto = req.body;
      userData.unique_id = `${generateUuid()}`;
      const params = {
        TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
        Item: userData,
      };
      const createUserData: object = await this.patientService.createPatient(params);
      res.status(201).json({ data: createUserData });
    } catch (error) {
      next(error);
    }
  };

  public getPatients = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    const params = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      Item: {},
    };
    try {
      const findAllUsersData: Patient[] = await this.patientService.findAllPatient(params);
      res.status(200).json({ data: findAllUsersData });
    } catch (error) {
      next(error);
    }
  };

  public getPatientById = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    const patientId: string = req.params.id;
    const params = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      Key: {
        unique_id: `${patientId}`,
      },
    };
    try {
      const patientData: Patient = await this.patientService.findPatientById(patientId, params);
      res.status(200).json({ data: patientData });
    } catch (error) {
      next(error);
    }
  };

  public deletePatientById = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const patientId: string = req.params.id;
      const params = {
        TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
        Key: {
          unique_id: `${patientId}`,
          name: 'David',
        },
      };
      const patientData: Patient = await this.patientService.deletePatientById(patientId, params);
      res.status(200).json({ data: patientData });
    } catch (error) {
      next(error);
    }
  };

  public updatePatient = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const userData: PatientDto = req.body;
      const params = {
        TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
        Item: userData,
      };
      await this.patientService.updatePatient(params);
      res.status(201).json({ data: 'Item updated successfully' });
    } catch (error) {
      next(error);
    }
  };
  public getByQuery = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    const patientId: string = req.params.id;
    const params = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      ExpressionAttributeNames: {
        '#attributeName': patientId, // Replace with the actual attribute name
      },
      ExpressionAttributeValues: {},
    } as AWS.DynamoDB.DocumentClient.ScanInput;

    const filterValue = 'david'; // Replace with the desired attribute value

    if (filterValue) {
      params.FilterExpression = '#attributeName = :value';
      params.ExpressionAttributeValues[':value'] = { S: filterValue };
    }
    try {
      const patientData: Patient = await this.patientService.findByQuery(params);
      res.status(200).json({ data: patientData });
    } catch (error) {
      next(error);
    }
  };
}

export default PatientController;
