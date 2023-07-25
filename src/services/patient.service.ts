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
        active: result.active,
        name: result.name,
        telecom: result.telecom,
        gender: result.gender,
        birthDate: result.birthDate,
        deceasedBoolean: result.deceasedBoolean,
        address: result.address,
        maritalStatus: result.maritalStatus,
        multipleBirthBoolean: result.multipleBirthBoolean,
        photo: result.photo,
        contact: result.contact,
        communication: result.communication,
        generalPractitioner: result.generalPractitioner,
        managingOrganization: result.managingOrganization,
        link: result.link,
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
        active: patientData.active,
        name: patientData.name,
        telecom: patientData.telecom,
        gender: patientData.gender,
        birthDate: patientData.birthDate,
        deceasedBoolean: patientData.deceasedBoolean,
        address: patientData.address,
        maritalStatus: patientData.maritalStatus,
        multipleBirthBoolean: patientData.multipleBirthBoolean,
        photo: patientData.photo,
        contact: patientData.contact,
        communication: patientData.communication,
        generalPractitioner: patientData.generalPractitioner,
        managingOrganization: patientData.managingOrganization,
        link: patientData.link,
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
        active: result.active,
        name: result.name,
        telecom: result.telecom,
        gender: result.gender,
        birthDate: result.birthDate,
        deceasedBoolean: result.deceasedBoolean,
        address: result.address,
        maritalStatus: result.maritalStatus,
        multipleBirthBoolean: result.multipleBirthBoolean,
        photo: result.photo,
        contact: result.contact,
        communication: result.communication,
        generalPractitioner: result.generalPractitioner,
        managingOrganization: result.managingOrganization,
        link: result.link,
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
        active: item.active,
        name: item.name,
        telecom: item.telecom,
        gender: item.gender,
        birthDate: item.birthDate,
        deceasedBoolean: item.deceasedBoolean,
        address: item.address,
        maritalStatus: item.maritalStatus,
        multipleBirthBoolean: item.multipleBirthBoolean,
        photo: item.photo,
        contact: item.contact,
        communication: item.communication,
        generalPractitioner: item.generalPractitioner,
        managingOrganization: item.managingOrganization,
        link: item.link,
      }));

      return patientData;
    }

    return [];
  }
}

export default PatientService;
