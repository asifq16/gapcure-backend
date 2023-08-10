interface Name {
  use: string;
  family: string;
  given: string[];
}

interface Telecom {
  system: string;
  value: string;
  use: string;
}

interface Address {
  use: string;
  line: string[];
  city: string;
  state: string;
  postalCode: string;
  country: string;
  period: {
    start: string;
  };
}

interface Link {
  target: {
    reference: string;
    display: string;
  };
}

export interface Patient {
  id: string;
  identifier: string;
  name: Name[];
  telecom?: Telecom[];
  gender?: string;
  birthDate?: string;
  address?: Address[];
  link?: Link[];
  pythoScore?: string;
}

export interface PatientParamsInput {
  TableName: string;
  Item: {};
}

export interface PatientUpdateInput {
  TableName: string;
  Item: {};
}
