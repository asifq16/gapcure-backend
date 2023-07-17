import { Router } from 'express';
import PatientController from '@/controllers/patient.controller';
import { PythoScoreDto } from '@/dtos/patient.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';

class UsersRoute implements Routes {
  public path = '/patient';
  public router = Router();
  public patientController = new PatientController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/pytho-score`, validationMiddleware(PythoScoreDto, 'body'), this.patientController.pythoScore);
  }
}

export default UsersRoute;
