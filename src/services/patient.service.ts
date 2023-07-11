import { HttpException } from '@exceptions/HttpException';
import { Patient } from '@/interfaces/patient.interface';
import { isEmpty } from '@utils/util';
import { createToken } from '@/utils/jwt';
import DynamoDB from '@/database/dynamoDB';
import { DYNAMODB_TABLE_NAMES } from '@/database/constants';
import { AllPatientParamsDto, PatientByIdParamsDto, PatientParamsDto, PatientQueryParamsDto } from '@/dtos/patient.dto';

class PatientService {
  public dynamoDB = new DynamoDB();

  public async findAllPatient(params: AllPatientParamsDto): Promise<Object[]> {
    const result: Object[] = await this.dynamoDB.scanItem(params);
    return result;
  }

  public async findPatientById(patientId: string, params: PatientByIdParamsDto): Promise<object> {
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

  public async createPatient(params: PatientParamsDto): Promise<object> {
    const jwtEncryptionObject: object = {
      id: 'id',
    };
    const token: string = await createToken(jwtEncryptionObject, '24h');
    const result: object = await this.dynamoDB.createItem(params);
    return { patient: result, token };
  }

  public async updatePatient(params: PatientParamsDto): Promise<object> {
    if (isEmpty(params.Item)) throw new HttpException(400, 'Incorrect patient id');
    const param = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      Key: {
        uniqueId: `${params.Item}`,
      },
    };
    const findUser = await this.dynamoDB.getItemById(param);
    if (!findUser) throw new HttpException(400, 'Patient not found');
    const result: object = this.dynamoDB.updateItem(params);
    return { user: result };
  }

  public async deletePatientById(patientId: string, params: PatientByIdParamsDto): Promise<object> {
    if (isEmpty(patientId)) throw new HttpException(400, 'Incorrect patient id');
    const result = await this.dynamoDB.deleteItem(params);
    return result;
  }

  public async findByQuery(params: PatientQueryParamsDto): Promise<object> {
    const result: object = await this.dynamoDB.queryItem(params);
    return result;
  }
}

export default PatientService;
