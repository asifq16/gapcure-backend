import { DYNAMODB_TABLE_NAMES } from '../constants';

const Patient = {
  AttributeDefinitions: [
    {
      AttributeName: 'ID',
      AttributeType: 'S',
    },
    {
      AttributeName: 'NAME',
      AttributeType: 'S',
    },
    /* {
      AttributeName: 'ADDRESS',
      AttributeType: 'S',
    }, */
    {
      AttributeName: 'Disease',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'ID',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'NAME',
      KeyType: 'RANGE',
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'Disease-index',
      Projection: {
        ProjectionType: 'ALL',
      },
      ProvisionedThroughput: {
        WriteCapacityUnits: 5,
        ReadCapacityUnits: 5,
      },
      KeySchema: [
        {
          KeyType: 'HASH',
          AttributeName: 'Disease',
        },
        {
          KeyType: 'RANGE',
          AttributeName: 'NAME',
        },
      ],
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
  TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
  StreamSpecification: {
    StreamEnabled: false,
  },
};

export const PatientSchema = Patient;
