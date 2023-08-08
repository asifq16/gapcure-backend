import { HEALTH_GORILLA_AUTH_API, HEALTH_GORILLA_BASE_URL, HEALTH_GORILLA_PATIENT_API, LOOKUP_END_POINT } from '@/utils/constants';
import axios, { AxiosResponse } from 'axios';
import patientMockData from './mockData/patient.json';
import { HttpException } from '@/exceptions/HttpException';
import PatientService from './patient.service';
import { Patient } from '@/interfaces/patient.interface';
import qs from 'qs';
import { ASSERTION, GRANT_TYPE, SCOPE } from '@/config';
import { CLIENT_RENEG_WINDOW } from 'tls';

class HealthGorillaService {
  public patientService = new PatientService();

  /**
   * Function to get access token from Health Gorilla APIs
   */
  private async getToken(): Promise<AxiosResponse> {
    try {
      const data = qs.stringify({
        grant_type: GRANT_TYPE,
        client_id: CLIENT_RENEG_WINDOW,
        assertion: ASSERTION,
        scope: SCOPE,
      });

      const config = {
        method: 'post',
        url: `${HEALTH_GORILLA_BASE_URL}/${HEALTH_GORILLA_AUTH_API}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data,
      };

      return await axios(config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Function to fetch patient info from Health Gorilla
   * @param identifier Patient unique identifier - ssn
   * @returns Patient
   */
  public async getPatientInfo(identifier: string, mock = false): Promise<Patient> {
    let patientData: Patient;

    if (mock) {
      patientData = { ...patientMockData, identifier };
      return patientData;
    }

    const authResponse: AxiosResponse = await this.getToken();
    if (!authResponse?.data) {
      throw new HttpException(500, 'Unable to fetch Health Gorilla access token');
    }

    const token = authResponse?.data?.access_token;
    // HG API Doc: https://developer.healthgorilla.com/docs/fhir-restful-api#patient
    // TODO: Need to handle the API response

    const config = {
      method: 'get',
      url: `${HEALTH_GORILLA_BASE_URL}${HEALTH_GORILLA_PATIENT_API}/${identifier}${LOOKUP_END_POINT}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    patientData = await axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return patientData;
  }
}

export default HealthGorillaService;
