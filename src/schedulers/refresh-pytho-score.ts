import patientService from '@/services/patient.service';
import { DYNAMODB_TABLE_NAMES } from '@/database/constants';
import HealthGorillaService from '@/services/healthGorilla.service';
import PythoScoreService from '@/services/pythoScore.service';
import { PatientUpdateInput } from '@/interfaces/patient.interface';
import cron from 'node-schedule';
import moment from 'moment';

class RefreshPythoScore {
  public patientService = new patientService();
  public healthGorillaService = new HealthGorillaService();
  public pythoScoreService = new PythoScoreService();

  public startCron = async () => {
    cron.scheduleJob('0 */12 * * *', async () => {
      // 0 */12 * * *
      // */10 * * * * *

      try {
        const twoDaysAgoTimestamp = moment().subtract(2, 'days').unix();
        const getAllPatientParams = {
          TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
          FilterExpression: '#updatedAt >:twoDaysAgoTimestamp', // Use >= to get items updated within the last 2 hours
          ExpressionAttributeNames: {
            '#updatedAt': 'updatedAt',
          },
          ExpressionAttributeValues: {
            ':twoDaysAgoTimestamp': twoDaysAgoTimestamp,
          },
          Item: {},
        };

        // Step 1: Read all the Patients in the database
        const patients = await this.patientService.getAllPatientData(getAllPatientParams);

        // Step 2: Fetch updated Pytho Score using Pytho Score API for each patient
        for (const patient of patients) {
          const pythoScore = await this.pythoScoreService.getPythoScore(patient.identifier, true);

          // Update the user data into the DB
          const updatePatientParams: PatientUpdateInput = {
            TableName: DYNAMODB_TABLE_NAMES.PATIENT_TABLE,
            Item: {
              ...patient,
              pythoScore: pythoScore ?? '0',
            },
          };

          // Update Pytho Score and user in database
          await this.patientService.updatePatient(updatePatientParams);
        }

        console.log('12-hour cron job executed successfully.');
      } catch (error) {
        console.error('An error occurred in the 12-hour cron job:', error);
      }
    });
  };
}

export default RefreshPythoScore;
