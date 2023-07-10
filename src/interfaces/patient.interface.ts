interface MetaDta {
  yesCount: number;
  noCount: number;
}

export interface Patient {
  unique_id: string;
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
