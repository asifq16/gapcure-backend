import { Patient } from '@/interfaces/patient.interface';

class HealthGorillaService {
  public async getPatientInfo(): Promise<Patient[]> {
    // Call HealthGorilla API
    const patient: Patient[] = [];
    return patient;
  }
}

export default HealthGorillaService;
