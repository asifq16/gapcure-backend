/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsString, IsOptional, Allow } from 'class-validator';

export class PatientDto {
  @IsString()
  public uniqueId: string;

  @IsString()
  public name: string;

  @IsString()
  public address: string;

  @Allow()
  @IsOptional()
  public metaData: object;
}

export class PatientParamsDto {
  @IsString()
  public TableName: string;

  @Allow()
  public Item: object;
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
}
