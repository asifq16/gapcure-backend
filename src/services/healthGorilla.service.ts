import { HEALTH_GORILLA_AUTH_API, HEALTH_GORILLA_BASE_URL, HEALTH_GORILLA_PATIENT_API } from '@/utils/constants';
import axios, { AxiosResponse } from 'axios';
import patientJson from './mockData/patient.json';
import { HttpException } from '@/exceptions/HttpException';
import PatientService from './patient.service';
import { PatientInfOutput } from '@/interfaces/patient.interface';

class HealthGorillaService {
  public patientService = new PatientService();
  /**
   * Function to get access token from Health Gorilla APIs
   */
  private async getToken(): Promise<AxiosResponse> {
    try {
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
   * @returns Axios response received from Health Gorilla API
   */
  public async getPatientInfo(params: string, mock = true): Promise<PatientInfOutput> {
    let patientData: PatientInfOutput;

    if (mock) {
      patientData = patientJson;
      return patientData;
    } else {
      const authResponse: AxiosResponse = await this.getToken();
      if (!authResponse?.data) {
        throw new HttpException(500, 'Unable to fetch Health Gorilla access token');
      }

      const token = authResponse?.data?.token;
      // HG API Doc: https://developer.healthgorilla.com/docs/fhir-restful-api#patient
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
}

export default HealthGorillaService;
