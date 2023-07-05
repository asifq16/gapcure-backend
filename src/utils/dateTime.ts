const moment = require('moment');

const dateFormat = 'YYYY-MM-DD';

export const getCurrentDateTime = (date: string, format: string = dateFormat): string => {
  return moment(date).format(format);
};

export const getMoment = () => moment;

export const newDate = () => {
  const newDate = moment.utc().toDate();
  return newDate;
};

export const getDatesBetweenRange = (start: string, end: string): string[] => {
  const datePayload = {
    startDate: moment(start, 'DD-MM-YYYY'),
    endDate: moment(end, 'DD-MM-YYYY'),
  };
  const dates = [];
  const currentDate = datePayload.startDate;
  while (currentDate.isSameOrBefore(datePayload.endDate)) {
    dates.push(currentDate.format('DD-MM-YYYY'));
    currentDate.add(1, 'days');
  }

  return dates;
};

export const getCurrentUtcTime = (format?: string): string => {
  const newDate = moment.utc();
  if (format) {
    return newDate.format(format);
  }
  return newDate.toISOString();
};

export const addDays = (date: string, day: number): string => {
  return moment(date, dateFormat).add(day, 'days').format(dateFormat);
};

export const addYears = (date: string, year: number, format?: string): string => {
  const newDate = moment(date).add(year, 'years');
  if (format) {
    return newDate.format(format);
  }
  return newDate.toISOString();
};

export const addMinutes = (date: string, minute: number, format?: string): string => {
  const newDate = moment(date).add(minute, 'minutes');
  if (format) {
    return newDate.format(format);
  }
  return newDate.toISOString();
};

export const getPreviousWorkday = () => {
  const workday = moment();
  const day = workday.day();
  let diff = 1;
  if (day == 1) {
    diff = day + 2;
  }
  return workday.subtract(diff, 'days').format('DD-MM-yyyy');
};

export const get2ndLastPreviousWorkday = () => {
  const workday = moment();
  const day = workday.day();
  let diff = 2;
  if (day == 1 || day == 2) {
    diff = 4;
  }
  return workday.subtract(diff, 'days').format('DD-MM-yyyy');
};

export const getCurrentEpoch = () => {
  return moment.utc().valueOf();
};
