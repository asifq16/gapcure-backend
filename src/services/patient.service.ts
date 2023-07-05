import { PatientDto } from '@/dtos/patient.dto';
import { HttpException } from '@exceptions/HttpException';
import { Patient } from '@/interfaces/patient.interface';
import { isEmpty } from '@utils/util';
import { createToken } from '@/utils/jwt';

class PatientService {
  public async findAllPatient(): Promise<Patient[]> {
    // const patient: Patient[] = await database.find(connection.models.Patient, {});
    const patient: Patient[] = [];
    return patient;
  }

  public async findPatientById(patientId: string): Promise<Patient> {
    if (isEmpty(patientId)) throw new HttpException(400, 'Incorrect patient id');

    // const patient: Patient = await database.findOne(connection.models.Patient, { _id: userId });
    const patient: Patient = {
      id: '1',
      uniqueId: '123',
      name: 'David',
      address: 'Main street',
      metaData: {
        yesCount: 0,
        noCount: 1,
      },
    };
    if (!patient) throw new HttpException(404, 'Record not found');

    return patient;
  }

  public async createPatient(patientDataPayload: PatientDto): Promise<object> {
    const jwtEncryptionObject: object = {
      id: 'id',
    };

    const token: string = await createToken(jwtEncryptionObject, '24h');
    return { user: patientDataPayload, token };
  }
}

export default PatientService;
