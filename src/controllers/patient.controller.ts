import { NextFunction, Response } from 'express';
import { PatientDto } from '@/dtos/patient.dto';
import patientService from '@/services/patient.service';
import { RequestWithInfo } from '@/interfaces/auth.interface';
import { Patient } from '@/interfaces/patient.interface';

class PatientController {
  public patientService = new patientService();

  public createPatient = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const userData: PatientDto = req.body;
      const createUserData: object = await this.patientService.createPatient(userData);

      res.status(201).json({ data: createUserData });
    } catch (error) {
      next(error);
    }
  };

  public getPatients = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: Patient[] = await this.patientService.findAllPatient();
      res.status(200).json({ data: findAllUsersData });
    } catch (error) {
      next(error);
    }
  };

  public getPatientById = async (req: RequestWithInfo, res: Response, next: NextFunction) => {
    try {
      const patientId: string = req.params.id;
      const patientData: Patient = await this.patientService.findPatientById(patientId);

      res.status(200).json({ data: patientData });
    } catch (error) {
      next(error);
    }
  };
}

export default PatientController;
