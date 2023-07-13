/* eslint-disable prettier/prettier */
import { PYTHO_SCORE__PATIENT_API, PYTHO_SCORE_BASE_URL, PYTHO_SCORE_AUTH_API } from '@/utils/constants';
import axios, { AxiosResponse } from 'axios';
import patientJson from './patient.json';
import {PatientInfOutputDTO} from '@/interfaces/patientNew.interface';
import { HttpException } from '@/exceptions/HttpException';


class PythoScoreService {
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

      return await axios.post(`${PYTHO_SCORE_BASE_URL}/${PYTHO_SCORE_AUTH_API}`, payload, {
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
  public async getPythoScore(identifier: string): Promise<PatientInfOutputDTO> {
    return patientJson;
    const authResponse: AxiosResponse = await this.getToken();
    if (!authResponse?.data) {
      throw new HttpException(500, 'Unable to fetch Health Gorilla access token');
    }

    const token = authResponse?.data?.token;

    // HG API Doc: https://developer.healthgorilla.com/docs/fhir-restful-api#patient
    return await axios.get(`${PYTHO_SCORE_BASE_URL}/${PYTHO_SCORE__PATIENT_API}/${identifier}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default PythoScoreService;
