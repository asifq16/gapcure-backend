interface MetaDta {
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
  data: {
    token: string;
    user: Patient;
  };
}
