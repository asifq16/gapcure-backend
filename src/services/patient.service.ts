import { HttpException } from '@exceptions/HttpException';
import { MetaDta, Patient, PatientCreateOutPutDto, PatientUpdateOutPutDto } from '@/interfaces/patient.interface';
import { isEmpty } from '@utils/util';
import { createToken } from '@/utils/jwt';
import DynamoDB from '@/database/dynamoDB';
import { DYNAMODB_TABLE_NAMES } from '@/database/constants';
import { AllPatientParamsDto, PatientByIdParamsDto, PatientParamsDto } from '@/dtos/patient.dto';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

class PatientService {
  public dynamoDB = new DynamoDB();

  public async findAllPatient(params: AllPatientParamsDto): Promise<Patient[]> {
    const result = await this.dynamoDB.scanItem(params);
    const patients: Patient[] = result.map((item: AttributeMap) => {
      const patient: Patient = {
        uniqueId: item.uniqueId as string,
        name: item.name as string,
        address: item.address as string,
        disease: item.disease as string,
        metaData: item.metaData as MetaDta,
      };
      return patient;
    });
    return patients;
  }

  public async findPatientById(patientId: string, params: PatientByIdParamsDto): Promise<Patient> {
    if (isEmpty(patientId)) throw new HttpException(400, 'Incorrect patient id');
    const result = await this.dynamoDB.getItemById(params);
    if (result) {
      const patient: Patient = {
        uniqueId: result.uniqueId,
        name: result.name,
        address: result.address,
        disease: result.disease,
        metaData: result.metaData,
      };
      return patient;
    }
  }

  public async createPatient(params: PatientParamsDto): Promise<PatientCreateOutPutDto> {
    const jwtEncryptionObject: object = {
      id: 'id',
    };
    const token: string = await createToken(jwtEncryptionObject, '24h');
    const result: AttributeMap = await this.dynamoDB.createItem(params);
    const patientData: Patient = {
      uniqueId: result.uniqueId as string,
      name: result.name as string,
      address: result.address as string,
      disease: '',
      metaData: undefined,
    };

    const output: PatientCreateOutPutDto = {
      patient: patientData,
      token,
    };
    return output;
  }

  public async updatePatient(params: PatientParamsDto): Promise<PatientUpdateOutPutDto> {
    if (isEmpty(params.Item)) throw new HttpException(400, 'Incorrect patient id');
    const param = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      Key: {
        uniqueId: `${params.Item.uniqueId}`,
      },
    };
    const findUser = await this.dynamoDB.getItemById(param);
    if (!findUser) throw new HttpException(400, 'Patient not found');
    const result: AttributeMap = await this.dynamoDB.updateItem(params);
    const patientData: Patient = {
      uniqueId: result.uniqueId as string,
      name: result.name as string,
      address: result.address as string,
      disease: '',
      metaData: undefined,
    };

    const output: PatientUpdateOutPutDto = {
      patient: patientData,
    };
    return output;
  }

  public async deletePatientById(patientId: string, params: PatientByIdParamsDto): Promise<object> {
    if (isEmpty(patientId)) throw new HttpException(400, 'Incorrect patient id');
    const result = await this.dynamoDB.deleteItem(params);
    return result;
  }
}

export default PatientService;
