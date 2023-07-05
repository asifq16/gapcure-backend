interface MetaDta {
  yesCount: number;
  noCount: number;
}

export interface Patient {
  id: string;
  name: string;
  address: string;
  uniqueId: string;
  metaData: MetaDta;
}

export interface CreateUserRequest {
  name: string;
  address: string;
  employeeId: string;
  metaData: MetaDta;
}
