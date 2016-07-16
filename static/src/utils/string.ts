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

export function getDateDiff(date: Date): number {
  return ((new Date().getTime() - date.getTime()) / 1000) >> 0;
}

export function getPeriod(diff: number): Period | null {
  for (let i = periods.length - 1; i >= 0; i--) {
    let period = periods[i];
    if (diff <= period.length) {
      return period;
    }
  }
  return null;
}

/**
 * Returns formatted date object as string.
 * Forked from http://stackoverflow.com/a/1229594
 */
export function getShortDate(date: Date): string {
  let ret = '';
  let diff = getDateDiff(date);
  let period = getPeriod(diff);
  if (!period) {
    ret = `${months[date.getMonth()]}`;
    if (date.getFullYear() !== new Date().getFullYear()) {
      ret = `${ret} ${String(date.getFullYear())}`;
    }
  } else {
    let periodLength = period.length;
    let month = periods[0];
    let week = periods[1];
    let day = periods[2];
    if (periodLength <= day.length) {
      return 'Today';
    } else if (periodLength <= week.length) {
      return 'This week';
    } else if (periodLength <= month.length) {
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

/**
 * Returns string truncated to the length specified.
 */
export function limitString(str: string, length: number): string {
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length - 3) + '…';
}

export function extractDomain(url: string): string {
  let domain: string;
  if (url.indexOf('://') > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  domain = domain.split(':')[0];
  return domain;
}
