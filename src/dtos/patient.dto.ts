/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsString, IsOptional, Allow } from 'class-validator';

export class AllPatientParamsDto {
  @IsString()
  public TableName: string;

  @Allow()
  public Item: object;
}

class Item {
  @IsString()
  public id?: string;
}

export class PatientParamsDto {
  @IsString()
  public TableName: string;

  @Allow()
  public Item: Item;
}

export class PythoScoreDto {
  @IsString()
  public id: string;

  @IsString()
  public identifier: string;
}

export class PatientByIdParamsDto {
  @IsString()
  public TableName: string;

  @Allow()
  public Key: object;
}

export class PatientQueryParamsDto {
  @IsString()
  public TableName: string;

  @IsOptional()
  public Key: object;

  @IsOptional()
  public KeyConditionExpression: string;

  @IsOptional()
  public ExpressionAttributeValues: {
    [key: string]: any;
  };

  @IsOptional()
  public FilterExpression: string;
}

export class PatientDto {
  @IsString()
  public id?: string;

  @IsString()
  public name?: string;

  @IsString()
  public identifier?: string;

  @IsString()
  public pythoScore: string;

  @Allow()
  @IsOptional()
  public patientData: object;
}

export class PatientByQueryDto {
  @IsString()
  public TableName: string;

  @Allow()
  public IndexName: string;

  @Allow()
  public KeyConditionExpression: string;

  @Allow()
  public ExpressionAttributeValues: { [key: string]: any };
}

export class GetAllPatientByQueryDto {
  @IsString()
  public TableName: string;

  @Allow()
  public IndexName: string;

  @Allow()
  public KeyConditionExpression: string;

  @Allow()
  public ExpressionAttributeValues: { [key: string]: any };

  @Allow()
  public FilterExpression: string;

  @Allow()
  public Limit: number;

  @Allow()
  public ScanIndexForward: boolean;
}
