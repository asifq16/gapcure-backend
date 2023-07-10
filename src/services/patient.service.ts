import { HttpException } from '@exceptions/HttpException';
import { Patient } from '@/interfaces/patient.interface';
import { isEmpty } from '@utils/util';
import { createToken } from '@/utils/jwt';
import DynamoDB from '@/database/dynamoDB';
import { DYNAMODB_TABLE_NAMES } from '@/database/constants';

class PatientService {
  public dynamoDB = new DynamoDB();
  public async findAllPatient(params: any): Promise<Patient[]> {
    const result = await this.dynamoDB.scanItem(params);
    const patient: Patient[] = result;
    return patient;
  }

  public async findPatientById(patientId: string, params: any): Promise<any> {
    if (isEmpty(patientId)) throw new HttpException(400, 'Incorrect patient id');
    const result = await this.dynamoDB.getItemById(params);
    if (result) {
      const patient: Patient = {
        unique_id: result.unique_id,
        name: result.name,
        address: result.address,
        disease: result.disease,
        metaData: result.metaData,
      };
      return patient;
    }
  }

  public async createPatient(params: any): Promise<object> {
    const jwtEncryptionObject: object = {
      id: 'id',
    };
    const token: string = await createToken(jwtEncryptionObject, '24h');
    const result: object = this.dynamoDB.createItem(params);
    return { user: result, token };
  }

  public async updatePatient(params: any): Promise<object> {
    if (isEmpty(params.Item.unique_id)) throw new HttpException(400, 'Incorrect patient id');
    const param = {
      TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      Key: {
        unique_id: `${params.Item.unique_id}`,
        name: params.Item.name,
      },
    };
    const findUser = await this.dynamoDB.getItemById(param);
    if (!findUser) throw new HttpException(400, 'user not found');
    const result: object = this.dynamoDB.updateItem(params);
    return { user: result };
  }

  public async deletePatientById(patientId: string, params: any): Promise<any> {
    if (isEmpty(patientId)) throw new HttpException(400, 'Incorrect patient id');
    const result = await this.dynamoDB.deleteItem(params);
    return result;
  }

  public async findByQuery(params: any): Promise<any> {
    const result: object = await this.dynamoDB.queryItem(params);
    return result;
  }
}

export default PatientService;
