import AWS from 'aws-sdk';
import { ACCESS_KEY, SECRET_KEY, REGION, DB_SYNC } from '@config';
import { DYNAMODB_TABLE_NAMES } from './constants';
import { PatientSchema } from './schema/patient';
import { AllPatientParamsDto, PatientByIdParamsDto, PatientParamsDto } from '@/dtos/patient.dto';

export default class DynamoDB {
  constructor() {
    // Configure AWS SDK with credentials and desired region
    AWS.config.update({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
      region: REGION,
    });
  }

  getDynamodbInstance() {
    return new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  }

  getDynamoClientInstance() {
    return new AWS.DynamoDB.DocumentClient();
  }

  connectDatabase() {
    // Create a new DynamoDB instance
    const dynamodb = this.getDynamodbInstance();

    // Check if the DynamoDB instance is successfully initialized
    dynamodb.listTables({}, (err, data) => {
      if (err) {
        console.error('Failed to connect to DynamoDB:', err);
      } else {
        console.log('Successfully connected to DynamoDB');
        console.log('Available tables:', data.TableNames);

        if (DB_SYNC === 'true') {
          // this.createTable();
          // this.deleteTable();
        }
      }
    });
  }

  createTable() {
    const dynamodb = this.getDynamodbInstance();

    dynamodb.createTable(PatientSchema, function (err, data) {
      if (err) {
        console.log('Error - createTable', err);
      } else {
        console.log('Table Created', data);
      }
    });
  }

  deleteTable() {
    const dynamodb = this.getDynamodbInstance();

    dynamodb.deleteTable(
      {
        TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
      },
      function (err, data) {
        if (err) {
          console.log('Error - deleteTable', err);
        } else {
          console.log('Table Deleted', data);
        }
      },
    );
  }

  createItem = async (params: PatientParamsDto) => {
    const dynamodb = this.getDynamoClientInstance();

    try {
      await dynamodb.put(params).promise();
      const getParams = {
        TableName: params.TableName,
        Key: {
          uniqueId: params.Item.uniqueId,
        },
      };
      const getResult = await this.getItemById(getParams);
      const createdItem = getResult; // The newly created or updated item
      return createdItem;
    } catch (error) {
      throw error;
    }
  };

  getItemById = async (params: PatientByIdParamsDto) => {
    const dynamodb = this.getDynamoClientInstance();

    try {
      const result = await dynamodb.get(params).promise();
      const item = result.Item;
      return item;
    } catch (error) {
      throw error;
    }
  };

  scanItem = async (params: AllPatientParamsDto) => {
    const dynamodb = this.getDynamoClientInstance();

    try {
      const result = await dynamodb.scan(params).promise();
      return result.Items;
    } catch (error) {
      throw error;
    }
  };

  queryItem = async (params: PatientByIdParamsDto) => {
    const dynamodb = this.getDynamoClientInstance();

    try {
      const result = await dynamodb.query(params).promise();
      const data = result.Items;
      return data;
    } catch (error) {
      throw error;
    }
  };

  deleteItem = async (params: PatientByIdParamsDto) => {
    const dynamodb = this.getDynamoClientInstance();

    try {
      return await dynamodb.delete(params).promise();
    } catch (error) {
      throw error;
    }
  };

  updateItem = async (params: PatientParamsDto) => {
    const dynamodb = this.getDynamoClientInstance();

    try {
      await dynamodb.put(params).promise();
      const getParams = {
        TableName: params.TableName,
        Key: {
          uniqueId: params.Item.uniqueId,
        },
      };
      const getResult = await this.getItemById(getParams);
      const updatedItem = getResult; // The newly created or updated item
      return updatedItem;
    } catch (error) {
      throw error;
    }
  };
}
