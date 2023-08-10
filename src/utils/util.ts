import { v4 as uuidv4 } from 'uuid';
import cache from 'memory-cache';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const generateUuid = (): Promise<string> => {
  return uuidv4();
};

export const getCacheToken = async (): Promise<object> => {
  return cache.get('myTokenKey');
};

export const storeToken = async (tokenData): Promise<object> => cache.put('myTokenKey', tokenData, tokenData.expirationTime);
