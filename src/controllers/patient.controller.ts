import { NextFunction, Response } from 'express';
import { PatientDto, PatientQueryParamsDto } from '@/dtos/patient.dto';
import patientService from '@/services/patient.service';
import { RequestWithInfo } from '@/interfaces/auth.interface';
import { DYNAMODB_TABLE_NAMES } from '@/database/constants';
import { generateUuid } from '@/utils/util';
import HealthGorillaService from '@/services/healthGorilla.service';

class PatientController {
  public patientService = new patientService();
  public healthGorillaService = new HealthGorillaService();

  public createPatient = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const patientData: PatientDto = req.body;
      patientData.uniqueId = `${generateUuid()}`;
      const params = {
        TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
        Item: patientData,
      };
      const result = await this.patientService.createPatient(params);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getPatients = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    const params = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      Item: {},
      FilterExpression: '#name = :name AND #address = :address',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#address': 'address',
      },
      ExpressionAttributeValues: {
        ':name': 'John',
        ':address': 'nStreet',
      },
      ProjectionExpression: '#name, uniqueId, #address',
    };

    try {
      const patientData = await this.patientService.findAllPatient(params);
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
      const result = await this.patientService.updatePatient(params);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getByQuery = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    const patientId: string = req.params.id || '1e054a0e-ef55-443d-92ed-1b4db0166aa5';
    const params: PatientQueryParamsDto = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      KeyConditionExpression: 'uniqueId = :patientId',
      FilterExpression: 'address = :address',
      ExpressionAttributeValues: {
        ':patientId': patientId,
        ':address': 'new Street1',
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

  public getPythoScore = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const identifier: string = req.body.identifier;
      const patientData = await this.healthGorillaService.getPatientInfo(identifier);
      res.status(200).json({ data: patientData });
    } catch (error) {
      next(error);
    }
  };
}

export default PatientController;
