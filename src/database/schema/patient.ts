import { DYNAMODB_TABLE_NAMES } from '../constants';

const Patient = {
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S',
    },
    /* {
      AttributeName: 'name',
      AttributeType: 'S',
    }, */
    {
      AttributeName: 'identifier',
      AttributeType: 'S',
    },
    {
      AttributeName: 'pythoScore',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH',
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'Identifier-index',
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
          AttributeName: 'identifier',
        },
        /* {
          KeyType: 'RANGE',
          AttributeName: 'name',
        }, */
      ],
    },
    {
      IndexName: 'PythoScore-index',
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
          AttributeName: 'pythoScore',
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
    StreamEnabled: true,
    StreamViewType: 'NEW_AND_OLD_IMAGES',
  },
};

export const PatientSchema = Patient;
