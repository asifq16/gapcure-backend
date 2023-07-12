import { NextFunction, Response } from 'express';
import { PatientDto } from '@/dtos/patient.dto';
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
    const filterValue = req.query;

    const params = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      Item: {},
      FilterExpression: '',
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {},
      ProjectionExpression: '#name, uniqueId, address',
    };

    const param = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      Item: {},
    };

    if (filterValue !== undefined) {
      const filterExpressionParts = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      Object.entries(filterValue).forEach(([attribute, value]) => {
        const expressionAttributeKey = `#${attribute}`;
        const expressionAttributeValueKey = `:${attribute}`;

        filterExpressionParts.push(`${expressionAttributeKey} = ${expressionAttributeValueKey}`);
        expressionAttributeNames[expressionAttributeKey] = attribute;
        expressionAttributeValues[expressionAttributeValueKey] = value;
      });

      params.FilterExpression = filterExpressionParts.join(' AND ');
      params.ExpressionAttributeNames = expressionAttributeNames;
      params.ExpressionAttributeValues = expressionAttributeValues;
    }
    try {
      const patientData = await this.patientService.findAllPatient(Object.keys(filterValue).length === 0 ? param : params);
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
