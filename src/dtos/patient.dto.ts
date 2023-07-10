/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsString, IsOptional, Allow } from 'class-validator';

export class PatientDto {
  @IsString()
  public unique_id: string;

  @IsString()
  public name: string;

  @IsString()
  public address: string;

  @Allow()
  @IsOptional()
  public metaData: object;
}
