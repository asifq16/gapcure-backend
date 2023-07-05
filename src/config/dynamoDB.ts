import AWS from 'aws-sdk';
import { ACCESS_KEY, SECRET_KEY, REGION } from '@config';

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
    return new AWS.DynamoDB();
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
      }
    });
  }
}
