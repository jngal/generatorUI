import moment from 'moment';

/** @module utils/convert */

/**
 * Adds offset(time zone) to given date.
 * @function addOffset
 * @param {Date} date date without offset(time zone)
 * @returns {(Date | null)}
 */
export const addOffset = date => {
  if (!date) {
    return null;
  }

  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset);
}

/**
 * Converts string to Date.
 * @function strToDate
 * @param {string} str date as string
 * @returns {(Date | null)}
 */
export const strToDate = str => {
  if (!str) {
    return null;
  }

  return new Date(str);
}

/**
 * Creates instance of date or update date with specified time.
 * @function strToTime
 * @param {Date | null} date date or null
 * @param {string} str time as string
 * @returns {Date}
 */
export const strToTime = (date, str) => {
  if (!date) {
    return new Date();
  }
  const time = str.split(':');
  return new Date(date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time[0],
    time[1]);
}

/**
 * Returns a string with a language sensitive representation of this date.
 * @function dateToStr
 * @param {Date | null} date date or null
 * @param {object | null} format null or object which specifies how given date is going to be formatted
 * @returns {string}
 */
export const dateToStr = (date, format) => {
  if (!date) {
    return '';
  }
  if (format) {
    return date.toLocaleString('sk-SK', format);
  } else {
    return date.toLocaleString('sk-SK');
  }
}

/**
 * Returns a string with a language sensitive representation of this date.
 * @function dataToLocaleStr
 * @param {Date | null} date date or null
 * @param {object | null} format null or object which specifies how given date is going to be formatted
 * @returns {string}
 */
export const dataToLocaleStr = (date, format) => {
  return dateToStr(date, format);
}

/**
 * Returns a string with a language sensitive representation of the date portion of this date. 
 * @function dataToLocaleDateStr
 * @param {Date | null} date date or null
 * @param {object | null} format null or object which specifies how given date is going to be formatted
 * @returns {string}
 */
export const dataToLocaleDateStr = (date, format) => {
  if (!date) {
    return '';
  }
  if (format) {
    return date.toLocaleDateString('sk-SK', format);
  } else {
    return date.toLocaleDateString('sk-SK');
  }
}

/**
 * Returns the time portion of a Date object as a string, using locale conventions.
 * @function dataToLocaleTimeStr
 * @param {Date | null} date date or null
 * @param {object | null} format null or object which specifies how given time is going to be formatted
 * @returns {string}
 */
export const dataToLocaleTimeStr = (date, format) => {
  if (!date) {
    return '';
  }
  if (format) {
    return date.toLocaleTimeString('sk-SK', format);
  } else {
    return date.toLocaleTimeString('sk-SK');
  }
}

/**
 * Returns date as formatted string, 
 * e.g., 2.6.2015(date) -> 02.06.2015 
 * @function dateToDateStr
 * @param {Date | null} date date or null
 * @returns {string}
 */export const dateToDateStr = date => {
  if (!date) {
    return '';
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  return `${day}.${month}.${year}`;
}

/**
 * Returns date as formatted string, 
 * e.g., 2.6.2015(date) -> 02062015 
 * @function dateToDbStr
 * @param {Date | null} date date or null
 * @returns {string}
 */
export const dateToDbStr = date => {
  if (!date) {
    return '';
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  return `${year}${month}${day}`;
}

/**
 * Returns date as formatted string, 
 * e.g., 2.6.2015(date) -> 02.06.2015 
 * @function dateToValidation
 * @param {Date | null} date date or null
 * @returns {string}
 */
export const dateToValidation = date => {
  if (!date) {
    return '';
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  return `${day}.${month}.${year}`;
}

/**
 * Returns date time as formatted string, 
 * e.g., 8:33:5(date) -> 08:33:05 
 * @function dateToValidation
 * @param {Date | null} date date or null
 * @returns {string}
 */
export const dateToTimeStr = date => {
  if (!date) {
    return '';
  }
  const hours = `${date.getHours()}`.padStart(2, 0);
  const minutes = `${date.getMinutes()}`.padStart(2, 0);
  const seconds = `${date.getSeconds()}`.padStart(2, 0);
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Returns date as formatted string, 
 * e.g., 2017-05-21T00:00:00 -> 21.05.2017 
 * @function convertDate
 * @param {string | null} timestamp date as string or null
 * @returns {string}
 */
export const convertDate = (timestamp) => {
  if (!timestamp) {
    return '';
  }

  const datetime = timestamp.split('T');
  const date = datetime[0].split('-');

  return date[2] + '.' + date[1] + '.' + date[0];
}

/**
 * Returns date as formatted string, 
 * e.g., 2017-05-21T08:33:05 -> 21.05.2017 8:33
 * @function convertDateTime
 * @param {string | null} timestamp date as string or null
 * @returns {string}
 */
export const convertDateTime = (timestamp) => {
  if (!timestamp) {
    return '';
  }

  const datetime = timestamp.split('T');
  const date = datetime[0].split('-');
  const time = datetime[1].split(':');

  return date[2] + '.' + date[1] + '.' + date[0] + ' ' + time[0] + ':' + time[1];
}

/**
 * Returns number as formatted string
 * e.g., 5 -> 05
 * @function checkZero
 * @param {number} input number
 * @returns {string}
 */
const checkZero = (input) => {
  return input < 10 ? '0' + input : input;
}

/**
 * Returns timestamp from date and time.
 * @function dateTimeToTimestamp
 * @param {Date} date date
 * @param {Date} time time
 * @returns {string}
 */
export const dateTimeToTimestamp = (date, time) => {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T'
    + checkZero(time.getHours()) + ':' + checkZero(time.getMinutes());
}

/**
 * Returns timestamp from date.
 * @function dateToTimestamp
 * @param {Date | null} date date or null
 * @returns {string}
 */
export const dateToTimestamp = (date) => {
  if (!date) {
    return '';
  }

  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T'
    + checkZero(date.getHours()) + ':' + checkZero(date.getMinutes()) + ':' + checkZero(date.getSeconds());
}


/**
 * Returns a new string without character ".
 * @function escape
 * @param {string} input input string
 * @returns {string}
 */
export const escape = (input) => {
  return input.replace(/"/g, '');
}

/**
 * Returns a timestamp from string.
 * @function strToTimestamp
 * @param {string} str date as string
 * @returns {string}
 */
export const strToTimestamp = (str) => {
  if (!str) {
    return '';
  }

  const date = moment(str, 'D.M.YYYY', true);
  return dateToTimestamp(date.toDate());
}

/**
 * Returns a datestamp from date.
 * @function dateToDatestamp
 * @param {Date} date date
 * @returns {string}
 */
export const dateToDatestamp = (date) => {
  if (!date) {
    return '';
  }

  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}


/**
 * Returns a word with capitalized first letter.
 * @function toUpperCaseFirst
 * @param {string} word string input
 * @returns {string}
 */
export const toUpperCaseFirst = (word) => {
  let Txt = word ? word : '';
  Txt = Txt.substr(0, 1).toUpperCase() + Txt.substr(1);
  return Txt;
}

/**
 * Returns date with time set to zero.
 * e.g., 2017-05-21T08:33:05 -> Sun May 21 2017 00:00:00 GMT+0200 (Central European Summer Time)
 * @function dateTimeToDate
 * @param {Date} date date
 * @returns {Date}
 */
export const dateTimeToDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns date from specified string input.
 * e.g., 170521 -> Sun May 21 2017 00:00:00 GMT+0200 (Central European Summer Time)
 * @function rcToDnar
 * @param {string} rc string input
 * @returns {Date}
 */
export const rcToDnar = (rc) => {
  if (!rc)
    return '';

  let year = rc.substr(0, 2);
  var d = new Date();
  let yearAkt = d.getFullYear();

  if (year > yearAkt - 2000)
    year = `19${year}`;
  else
    year = `20${year}`;

  let month = rc.substr(2, 2) - 1;
  if (month >= 50)
    month = month - 50;

  if (month >= 20)
    month = month - 20;

  let day = rc.substr(4, 2);
  var dNar = new Date(year, month, day);

  return dNar;
}

/**
 * Returns numeric size in bytes
 * @function stringToBytes
 * @param {string} string string input
 * @returns {number}
 */
export const stringToBytes = (string) => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  for (let i = 0; i < sizes.length; i++) {
    let cur = sizes[i];
    if (string.indexOf(cur) > -1) {
      const size = Number(string.split(sizes[i])[0]);
      return size * Math.pow(1024, i);
    }
  }
  return 0;
}

/**
 * Returns string size of numeric size
 * @function bytesToSize
 * @param {number} bytes number input
 * @returns {string}
 */
export const bytesToSize = (bytes) => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}


/**
 * Returns File for url/base64 data
 * @function base64ToFile
 * @param {string} dataURL string input
 * * @param {string} filename string input
 * @returns {File}
 */
export const base64ToFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}