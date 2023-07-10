import { NextFunction, Response } from 'express';
import { PatientDto, PatientQueryParamsDto } from '@/dtos/patient.dto';
import patientService from '@/services/patient.service';
import { RequestWithInfo } from '@/interfaces/auth.interface';
import { DYNAMODB_TABLE_NAMES } from '@/database/constants';
import { generateUuid } from '@/utils/util';

class PatientController {
  public patientService = new patientService();

  public createPatient = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const patientData: PatientDto = req.body;
      patientData.uniqueId = `${generateUuid()}`;
      const params = {
        TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
        Item: patientData,
      };
      const result = await this.patientService.createPatient(params);
      res.status(201).json({ data: result, message: 'Patient created successfully' });
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
      const patientData: Object[] = await this.patientService.findAllPatient(params);
      res.status(200).json({ data: patientData });
    } catch (error) {
      next(error);
    }
  };

  public getPatientById = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    const patientId: string = req.params.id;
    const params = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      Key: {
        uniqueId: `${patientId}`,
      },
    };
    try {
      const patientData = await this.patientService.findPatientById(patientId, params);
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
          uniqueId: `${patientId}`,
        },
      };
      await this.patientService.deletePatientById(patientId, params);
      res.status(200).json({ data: 'Item deleted successfully' });
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
      res.status(200).json({ data: 'Item updated successfully' });
    } catch (error) {
      next(error);
    }
  };
  public getByQuery = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    const patientId: string = req.params.id;
    const params: PatientQueryParamsDto = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      KeyConditionExpression: 'uniqueId = :patientId',
      ExpressionAttributeValues: {
        ':patientId': patientId,
      },
      Key: {},
    };

    const filterValue = ''; // Replace with the desired attribute value

    if (filterValue) {
      params.ExpressionAttributeValues[':value'] = { S: filterValue };
    }
    try {
      const patientData = await this.patientService.findByQuery(params);
      res.status(200).json({ data: patientData });
    } catch (error) {
      next(error);
    }
  };
}

export default PatientController;
