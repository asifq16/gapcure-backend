import { NextFunction, Response } from 'express';
import { PatientDto } from '@/dtos/patient.dto';
import patientService from '@/services/patient.service';
import { RequestWithInfo } from '@/interfaces/auth.interface';
import { DYNAMODB_TABLE_NAMES } from '@/database/constants';
import { generateUuid } from '@/utils/util';
import HealthGorillaService from '@/services/healthGorilla.service';
import PythoScoreService from '@/services/pythoScore.service';

class PatientController {
  public patientService = new patientService();
  public healthGorillaService = new HealthGorillaService();
  public pythoScoreService = new PythoScoreService();
  public getPythoScore = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      let score: string;
      const moke = true;
      const identifier: string = req.body.identifier;
      const idParams = {
        TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
        Item: identifier,
      };
      const patientData = await this.healthGorillaService.getPatientInfo(moke, idParams);
      if (patientData) {
        score = await this.pythoScoreService.getPythoScore(moke, identifier);
        const data: PatientDto = {
          id: `${generateUuid()}`,
          name: patientData.name, // Set the name value
          identifier: patientData.identifier,
          pythoScore: score,
          patientData: patientData,
        };
        const params = {
          TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
          Item: data,
        };
        const response = await this.patientService.updatePatient(params);
        return res.status(200).json({ data: response, pythoScore: score });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default PatientController;
