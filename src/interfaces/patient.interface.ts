import { PatientDto } from '@/dtos/patient.dto';

export interface PatientUpdateOutPut {
  patient: PatientInput;
}

interface Telecom {
  phone: string;
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

export interface PatientInput {
  resourceType: string;
  identifier: string;
  active: boolean;
  name: string;
  telecom: Telecom[];
  gender: string;
  birthDate: string;
  deceasedBoolean: boolean;
  address: Address[];
  maritalStatus: string;
  multipleBirthBoolean: boolean;
  photo: Photo[];
  contact: Contact[];
  communication: Communication[];
  generalPractitioner: GeneralPractitioner[];
  managingOrganization: ManagingOrganization;
  link: Link[];
}

export interface PatientInputParams {
  resourceType: string;
  identifier: string;
  active: boolean;
  name: string;
  telecom: Telecom[];
  gender: string;
  birthDate: string;
  deceasedBoolean: boolean;
  address: Address[];
  maritalStatus: string;
  multipleBirthBoolean: boolean;
  photo: Photo[];
  contact: Contact[];
  communication: Communication[];
  generalPractitioner: GeneralPractitioner[];
  managingOrganization: ManagingOrganization;
  link: Link[];
  id?: string;
}

export interface PatientInfOutput {
  resourceType: string;
  identifier: string;
  active: boolean;
  name: string;
  telecom: Telecom[];
  gender: string;
  birthDate: string;
  deceasedBoolean: boolean;
  address: Address[];
  maritalStatus: string;
  multipleBirthBoolean: boolean;
  photo: Photo[];
  contact: Contact[];
  communication: Communication[];
  generalPractitioner: GeneralPractitioner[];
  managingOrganization: ManagingOrganization;
  link: Link[];
  id?: string;
}

export interface patientParamsInput {
  TableName: string;
  Item: Item;
}

export interface Item {
  id?: string;
  name?: string;
  identifier?: string;
  patientData: PatientInputParams;
  pythoScore: string;
}

export interface patientUpdateInput {
  TableName: string;
  Item: PatientDto;
}

export interface patientCreateOutput {
  patientData: PatientInfOutput;
  id: string;
}
