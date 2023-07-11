import { Router } from 'express';
import PatientController from '@/controllers/patient.controller';
import { PatientDto } from '@/dtos/patient.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/patient';
  public router = Router();
  public patientController = new PatientController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.patientController.createPatient);
    this.router.get(`${this.path}`, authMiddleware, this.patientController.getPatients);
    this.router.get(`${this.path}/:id`, authMiddleware, this.patientController.getPatientById);
    this.router.get(`${this.path}/delete/:id`, authMiddleware, this.patientController.deletePatientById);
    this.router.post(`${this.path}/update`, validationMiddleware(PatientDto, 'body'), this.patientController.updatePatient);
  }
}

export default UsersRoute;
