import { HttpException } from '@/exceptions/HttpException';
import { HEALTH_GORILLA_AUTH_API, HEALTH_GORILLA_BASE_URL, HEALTH_GORILLA_PATIENT_API } from '@/utils/constants';
import axios, { AxiosResponse } from 'axios';

class HealthGorillaService {
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
  public async getPatientInfo(identifier: string): Promise<AxiosResponse> {
    const authResponse: AxiosResponse = await this.getToken();
    if (!authResponse?.data) {
      throw new HttpException(500, 'Unable to fetch Health Gorilla access token');
    }

    const token = authResponse?.data?.token;

    // HG API Doc: https://developer.healthgorilla.com/docs/fhir-restful-api#patient
    return await axios.get(`${HEALTH_GORILLA_BASE_URL}/${HEALTH_GORILLA_PATIENT_API}/${identifier}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default HealthGorillaService;
