import { DYNAMODB_TABLE_NAMES } from '../constants';

const Patient = {
  AttributeDefinitions: [
    {
      AttributeName: 'unique_id',
      AttributeType: 'S',
    },
    {
      AttributeName: 'name',
      AttributeType: 'S',
    },

    {
      AttributeName: 'disease',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'unique_id',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'name',
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
          AttributeName: 'disease',
        },
        {
          KeyType: 'RANGE',
          AttributeName: 'name',
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
