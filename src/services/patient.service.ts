import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import DynamoDB from '@/database/dynamoDB';
import { PatientByQueryDto } from '@/dtos/patient.dto';
import { PatientInfOutput, PatientUpdateOutPut, patientCreateOutput, patientParamsInput, patientUpdateInput } from '@/interfaces/patient.interface';

class PatientService {
  public dynamoDB = new DynamoDB();

  public async createPatient(params: patientParamsInput): Promise<patientCreateOutput> {
    const result = await this.dynamoDB.createItem(params);
    if (result) {
      const patientData: PatientInfOutput = {
        resourceType: result.resourceType,
        identifier: result.Identifier,
        active: result.patientData.active,
        name: result.name,
        telecom: result.patientData.telecom,
        gender: result.patientData.gender,
        birthDate: result.patientData.birthDate,
        deceasedBoolean: result.patientData.deceasedBoolean,
        address: result.patientData.address,
        maritalStatus: result.patientData.maritalStatus,
        multipleBirthBoolean: result.patientData.multipleBirthBoolean,
        photo: result.patientData.photo,
        contact: result.patientData.contact,
        communication: result.patientData.communication,
        generalPractitioner: result.patientData.generalPractitioner,
        managingOrganization: result.patientData.managingOrganization,
        link: result.patientData.link,
      };

      const output: patientCreateOutput = {
        patientData,
        id: result.id,
      };
      return output;
    }
  }

  public async findPatientById(params: PatientByQueryDto): Promise<PatientInfOutput[]> {
    if (isEmpty(params)) throw new HttpException(400, 'Incorrect patient id');
    const result = await this.dynamoDB.getItemByQuery(params);
    if (result && result.length > 0) {
      const patientsData: PatientInfOutput[] = result.map(item => ({
        resourceType: item.patientData.resourceType,
        identifier: item.identifier,
        active: item.patientData.active,
        name: item.name,
        telecom: item.patientData.telecom,
        gender: item.patientData.gender,
        birthDate: item.patientData.birthDate,
        deceasedBoolean: item.patientData.deceasedBoolean,
        address: item.patientData.address,
        maritalStatus: item.patientData.maritalStatus,
        multipleBirthBoolean: item.patientData.multipleBirthBoolean,
        photo: item.patientData.photo,
        contact: item.patientData.contact,
        communication: item.patientData.communication,
        generalPractitioner: item.patientData.generalPractitioner,
        managingOrganization: item.patientData.managingOrganization,
        link: item.patientData.link,
        id: item.id,
      }));

      return patientsData;
    }
  }

  public async updatePatient(params: patientUpdateInput): Promise<PatientUpdateOutPut> {
    const result = await this.dynamoDB.updateItem(params);
    const patientData: PatientInfOutput = {
      resourceType: result.resourceType,
      identifier: result.Identifier,
      active: result.patientData.active,
      name: result.name,
      telecom: result.patientData.telecom,
      gender: result.patientData.gender,
      birthDate: result.patientData.birthDate,
      deceasedBoolean: result.patientData.deceasedBoolean,
      address: result.patientData.address,
      maritalStatus: result.patientData.maritalStatus,
      multipleBirthBoolean: result.patientData.multipleBirthBoolean,
      photo: result.patientData.photo,
      contact: result.patientData.contact,
      communication: result.patientData.communication,
      generalPractitioner: result.patientData.generalPractitioner,
      managingOrganization: result.patientData.managingOrganization,
      link: result.patientData.link,
    };

    const output: PatientUpdateOutPut = {
      patient: patientData,
    };
    return output;
  }
}

export default PatientService;
