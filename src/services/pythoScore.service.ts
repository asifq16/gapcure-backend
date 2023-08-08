import { PYTHO_SCORE__PATIENT_API, PYTHO_SCORE_API_BASE_URL, PYTHO_SCORE_AUTH_API } from '@/utils/constants';
import axios, { AxiosResponse } from 'axios';
import { HttpException } from '@/exceptions/HttpException';

class PythoScoreService {
  /**
   * Function to get access token from  Pytho Score APIs
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

      return await axios.post(`${PYTHO_SCORE_API_BASE_URL}/${PYTHO_SCORE_AUTH_API}`, payload, {
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
   * Function to fetch patient info from Pytho score API
   * @param identifier Patient unique identifier - ssn
   * @returns string
   */
  public async getPythoScore(identifier: string, mock = true): Promise<string> {
    if (mock) {
      return '25';
    }

    const authResponse: AxiosResponse = await this.getToken();
    if (!authResponse?.data) {
      throw new HttpException(500, 'Unable to fetch  Pytho score access token');
    }

    const token = authResponse?.data?.token;

    // TODO: Need to correct the request
    const response = await axios.get(`${PYTHO_SCORE_API_BASE_URL}/${PYTHO_SCORE__PATIENT_API}/${identifier}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data?.score || '0';
  }
}

export default PythoScoreService;
