import {
  CLIENT_WEB_NAME,
  CLIENT_WEB_URL,
  HEALTH_GORILLA_AUTH_API,
  HEALTH_GORILLA_BASE_URL,
  HEALTH_GORILLA_PATIENT_API,
  LOOKUP_END_POINT_KEY,
} from '@/utils/constants';
import axios, { AxiosResponse } from 'axios';
import patientMockData from './mockData/patient.json';
import { HttpException } from '@/exceptions/HttpException';
import PatientService from './patient.service';
import { Patient } from '@/interfaces/patient.interface';
import qs from 'qs';
import { CLIENT_ID, CLIENT_SECRET, GRANT_TYPE, SCOPE } from '@/config';
import CryptoJS from 'crypto-js';
import { TokenData } from '@interfaces/TokenData';

/**
 * Declare variable to store token and expiration time
 */
const tokenData: TokenData = {
  token: null,
  expirationTime: null,
};
const logKey = 'HealthGorilla API - ';

class HealthGorillaService {
  public patientService = new PatientService();
  /**
   * Function to get assertion token for Health Gorilla APIs
   */
  private async getAssertionToken(): Promise<any> {
    try {
      const jwtSecret = CLIENT_SECRET;

      // Set headers for JWT
      const header = {
        typ: 'JWT',
        alg: 'HS256',
      };

      // Prepare timestamp in seconds
      const currentTimestamp = Math.floor(Date.now() / 1000);

      const data = {
        aud: `${HEALTH_GORILLA_BASE_URL}/${HEALTH_GORILLA_AUTH_API}`,
        iss: CLIENT_WEB_URL,
        sub: CLIENT_WEB_NAME,
        iat: currentTimestamp,
        exp: currentTimestamp + 86400, // expiry time is 24 hours from time of creation
      };

      function base64url(source) {
        // Encode in classical base64
        let encodedSource = CryptoJS.enc.Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        return encodedSource;
      }

      // Encode header
      const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
      const encodedHeader = base64url(stringifiedHeader);

      // Encode data
      const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
      const encodedData = base64url(stringifiedData);

      // Build token
      const token = `${encodedHeader}.${encodedData}`;

      // Sign token
      let signature = CryptoJS.HmacSHA256(token, jwtSecret);
      signature = base64url(signature);
      const signedToken = `${token}.${signature}`;
      return signedToken;
    } catch (err) {
      console.log('Error getAssertionToken: ', err);
      throw err;
    }
  }

  /**
   * Function to get access token from Health Gorilla APIs
   */
  private async getToken(): Promise<AxiosResponse> {
    try {
      const assertionToken = await this.getAssertionToken();

      const payload = qs.stringify({
        grant_type: GRANT_TYPE,
        client_id: CLIENT_ID,
        assertion: assertionToken,
        scope: SCOPE,
      });

      const config = {
        method: 'post',
        url: `${HEALTH_GORILLA_BASE_URL}/${HEALTH_GORILLA_AUTH_API}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: payload,
      };

      return await axios(config);
    } catch (err) {
      console.log('Error getToken: ', err);
      throw err;
    }
  }

  /**
   * Function to fetch patient info from Health Gorilla
   * @param identifier Patient unique identifier - ssn
   * @returns Patient
   */
  public async getPatientInfo(identifier: string, mock = false): Promise<Patient> {
    try {
      console.log(`${logKey} Fet Patient Info - Mock ${mock}`);
      let patientData: Patient;

      if (mock) {
        patientData = { ...patientMockData, identifier };
        return patientData;
      }

      const currentTimestamp = Math.floor(Date.now() / 1000); // Seconds

      if (!tokenData.token || currentTimestamp > tokenData?.expirationTime) {
        const authResponse: AxiosResponse = await this.getToken();
        if (!authResponse?.data) {
          throw new HttpException(500, 'Unable to fetch Health Gorilla access token');
        }

        tokenData.token = authResponse?.data?.access_token;
        tokenData.expirationTime = currentTimestamp + 43200; // Add 12 hours
      }

      // HG API Doc: https://developer.healthgorilla.com/docs/fhir-restful-api#patient
      // TODO: Need to handle the API response

      const config = {
        method: 'get',
        url: `${HEALTH_GORILLA_BASE_URL}/${HEALTH_GORILLA_PATIENT_API}/${identifier}/${LOOKUP_END_POINT_KEY}`,
        headers: {
          Authorization: `Bearer ${tokenData?.token}`,
        },
      };

      patientData = await axios(config)
        .then(function (response) {
          return response?.data;
        })
        .catch(function (err) {
          throw err;
        });

      return patientData;
    } catch (err) {
      console.log('Error getPatientInfo: ', err);
      if (err?.response?.status === 401) {
        tokenData.token = null;
        tokenData.expirationTime = null;
        // TODO: Need to test condition
        this.getPatientInfo(identifier);
      } else if (err?.response?.status === 404) {
        throw new HttpException(404, 'Patient not found');
      }
      throw err;
    }
  }
}

export default HealthGorillaService;
