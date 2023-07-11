export interface MetaDta {
  yesCount: number;
  noCount: number;
}

export interface Patient {
  uniqueId: string;
  name: string;
  address: string;
  disease: string;
  metaData: MetaDta;
}

export interface CreateUserRequest {
  name: string;
  address: string;
  employeeId: string;
  metaData: MetaDta;
}
export interface PatientCreateOutPutDto {
  patient: Patient;
  token: string;
}

export interface PatientUpdateOutPutDto {
  patient: Patient;
}

export interface PatientOutput {
  data: {
    token: string;
    patient: Patient;
  };
}

export interface PatientOutputs {
  Items: Patient[];
}
