type Period = {
  length: number;
  long: string;
  short: string;
}

const htmlCharRegExp = /&(nbsp|amp|quot|lt|gt);/g;
const htmlCharMap = {
  'nbsp': ' ',
  'amp': '&',
  'quot': '\'',
  'lt': '<',
  'gt': '>'
};
const months: string[] = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const periods: Period[] = [{
    length: 2628000,
    short: 'M',
    long: 'Month'
  }, {
    length: 604800,
    short: 'w',
    long: 'Week'
  }, {
    length: 86400,
    short: 'd',
    long: 'Day'
  }, {
    length: 3600,
    short: 'h',
    long: 'Hour'
  }, {
    length: 60,
    short: 'm',
    long: 'Minute'
  }, {
    length: 1,
    short: 's',
    long: 'Second'
  }];

/**
 * Replaces HTML entities with HTML characters.
 */
export function replaceHtmlEntities(htmlString: string): string {
  return htmlString.replace(htmlCharRegExp, (match: string, entity: any) => {
    return htmlCharMap[entity];
  });
}

export function fromTwitterDateTime(date: string): Date {
  let timestamp = Date.parse(date.replace(/(\+)/, ' UTC$1'));
  return new Date(timestamp);
}

/**
 * Returns difference between dates in seconds.
 * @param {Date} date - End date.
 * @param {?Date} start - Optional start date.
 * @returns {number} - Difference between provided dates in seconds.
 */
export function getDateDiff(date: Date, start = new Date()): number {
  return (Math.abs(date.getTime() - start.getTime()) / 1000) >> 0;
}

/**
 * Returns {@link Period} object based on time length provided in seconds.
 * @param {number} len - Time length in seconds.
 * @returns {Period}
 */
export function getPeriod(len: number): Period {
  let p = periods[0];
  let i = 1;
  while (p) {
    if (len / p.length >= 1) {
      break;
    }
    p = periods[i++];
  }
  return p;
}

/**
 * Returns formatted date object as string.
 */
export function getShortDate(date: Date): string {
  let ret = '';
  let today = new Date();
  let diff = getDateDiff(date, today);
  let period = getPeriod(diff);
  let month = periods[0];
  if (diff > month.length) {
    ret = `${months[date.getMonth()]}`;
    if (date.getFullYear() !== today.getFullYear()) {
      ret = `${ret} ${String(date.getFullYear())}`;
    }
  } else {
    let periodLength = period.length;
    let week = periods[1];
    let day = periods[2];
    if (periodLength < day.length) {
      return 'Today';
    } else if (periodLength < week.length) {
      return 'This week';
    } else if (periodLength < month.length) {
      return 'This month';
    }
  }
  return ret;
}

export function getFullDate(date: Date): string {
  let monthDate = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return `${monthDate} ${month}, ${year} - ${hours}:${minutes}`;
}

export function extractDomain(url: string): string {
  let domain: string;
  if (url.indexOf('://') > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  domain = domain.split(':')[0];
  domain = domain.replace(/^www./gi, '');
  return domain;
}
