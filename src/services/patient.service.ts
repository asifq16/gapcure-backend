import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import DynamoDB from '@/database/dynamoDB';
import { PatientByQueryDto } from '@/dtos/patient.dto';
import { PatientParamsInput, PatientUpdateInput, Patient } from '@/interfaces/patient.interface';

class PatientService {
  public dynamoDB = new DynamoDB();

  public async createPatient(params: PatientParamsInput): Promise<Patient> {
    const result = await this.dynamoDB.createItem(params);

    if (result) {
      const patient: Patient = {
        id: result.id,
        identifier: result.identifier,
        name: result.name,
        telecom: result.telecom,
        gender: result.gender,
        birthDate: result.birthDate,
        address: result.address,
        link: result.link,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      return patient;
    }
    return null;
  }

  public async findPatientById(params: PatientByQueryDto): Promise<Patient> {
    if (isEmpty(params?.KeyConditionExpression)) throw new HttpException(400, 'Incorrect patient identifier');

    const result = await this.dynamoDB.getItemByQuery(params);

    if (result?.length) {
      const patientData = result[0];

      const patient: Patient = {
        id: patientData.id,
        identifier: patientData.identifier,
        name: patientData.name,
        telecom: patientData.telecom,
        gender: patientData.gender,
        birthDate: patientData.birthDate,
        address: patientData.address,
        link: patientData.link,
        createdAt: patientData.createdAt,
        updatedAt: patientData.updatedAt,
      };

      return patient;
    }
    return null;
  }

  public async updatePatient(params: PatientUpdateInput): Promise<Patient> {
    const result = await this.dynamoDB.updateItem(params);

    if (result) {
      const patientData: Patient = {
        id: result.id,
        identifier: result.identifier,
        name: result.name,
        telecom: result.telecom,
        gender: result.gender,
        birthDate: result.birthDate,
        address: result.address,
        link: result.link,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      return patientData;
    }
    return null;
  }

  public async getAllPatientData(params: PatientParamsInput): Promise<Patient[]> {
    const result = await this.dynamoDB.scanItem(params);

    if (result) {
      const patientData: Patient[] = result.map(item => ({
        id: item.id,
        identifier: item.identifier,
        name: item.name,
        telecom: item.telecom,
        gender: item.gender,
        birthDate: item.birthDate,
        address: item.address,
        link: item.link,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      return patientData;
    }

    return [];
  }
}

export default PatientService;
