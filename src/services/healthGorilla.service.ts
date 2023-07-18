import { HEALTH_GORILLA_AUTH_API, HEALTH_GORILLA_BASE_URL, HEALTH_GORILLA_PATIENT_API } from '@/utils/constants';
import axios, { AxiosResponse } from 'axios';
import patientMockData from './mockData/patient.json';
import { HttpException } from '@/exceptions/HttpException';
import PatientService from './patient.service';
import { Patient } from '@/interfaces/patient.interface';

class HealthGorillaService {
  public patientService = new PatientService();

  /**
   * Function to get access token from Health Gorilla APIs
   */
  private async getToken(): Promise<AxiosResponse> {
    try {
      // TODO: Need to call with correct data
      const payload = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: 'JWT',
        client_id: '',
        scope: 'user/*.*',
      };

      return await axios.post(`${HEALTH_GORILLA_BASE_URL}/${HEALTH_GORILLA_AUTH_API}`, payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log('Error getToken', error);
    }
  }

  /**
   * Function to fetch patient info from Health Gorilla
   * @param identifier Patient unique identifier - ssn
   * @returns Patient
   */
  public async getPatientInfo(identifier: string, mock = true): Promise<Patient> {
    let patientData: Patient;

    if (mock) {
      patientData = { ...patientMockData, identifier };
      return patientData;
    }

    const authResponse: AxiosResponse = await this.getToken();
    if (!authResponse?.data) {
      throw new HttpException(500, 'Unable to fetch Health Gorilla access token');
    }

    const token = authResponse?.data?.token;
    // HG API Doc: https://developer.healthgorilla.com/docs/fhir-restful-api#patient
    // TODO: Need to handle the API response
    await axios.get(`${HEALTH_GORILLA_BASE_URL}/${HEALTH_GORILLA_PATIENT_API}/${params}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return patientData;
  }
}

export default HealthGorillaService;
