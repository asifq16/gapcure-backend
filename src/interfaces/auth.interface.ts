import { Request } from 'express';
import { Patient } from '@/interfaces/patient.interface';

export interface DataStoredInToken {
  userId: string;
  organizationId: string;
  employeeId: string;
  email: string;
}

export interface TokenData {
  id: string;
  expiresIn: string;
  iat: number;
}

export interface RequestWithInfo extends Request {
  patient: Patient;
}
