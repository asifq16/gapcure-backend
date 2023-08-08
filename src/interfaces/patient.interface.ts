interface Telecom {
  phone: string;
}

interface Entry {
  fullUrl: string;
  resource: Resource;
  search: Search;
}

// Replace 'Resource' with the actual type of the 'resource' property
interface Resource {
  resourceType: string;
  id: string;
  name: Name[];
  telecom: Telecom[];
  gender: string;
  birthDate: string;
  address: Address[];
  link: Link[];
}

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

// Replace 'Search' with the actual type of the 'search' property
interface Search {
  mode: string;
}

interface Address {
  country: string;
  state: string;
  city: string;
  locality: string;
}

interface Photo {
  file_url: string;
}

interface Contact {
  relationship: string;
  name: string;
  telecom: Telecom[];
  address: Address;
  gender: string;
  organization: string;
  period: {
    time: string;
  };
}

interface Communication {
  language: string;
  preferred: boolean;
}

interface GeneralPractitioner {
  name: string;
  contact_number: string;
}

interface ManagingOrganization {
  name: string;
  contact_number: string;
}

interface Link {
  url: string;
}

interface Meta {
  profile: [];
}

export interface Patient {
  resourceType?: string;
  id?: string;
  identifier?: string;
  active?: boolean;
  name?: string;
  telecom?: Telecom[];
  gender?: string;
  birthDate?: string;
  deceasedBoolean?: boolean;
  address?: Address[];
  maritalStatus?: string;
  multipleBirthBoolean?: boolean;
  photo?: Photo[];
  contact?: Contact[];
  communication?: Communication[];
  generalPractitioner?: GeneralPractitioner[];
  managingOrganization?: ManagingOrganization;
  link?: Link[];
  pythoScore?: string;
  entry?: Entry[];
  type?: String;
  meta?: Meta;
  total?: number;
}

export interface PatientParamsInput {
  TableName: string;
  Item: Patient;
}

export interface PatientUpdateInput {
  TableName: string;
  Item: Patient;
}
