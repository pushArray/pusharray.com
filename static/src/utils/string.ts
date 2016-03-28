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
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec'
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
 * Returns formatted date object as string.
 * Forked from http://stackoverflow.com/a/1229594
 */
export function getShortDate(date: Date): string {
  const diff = ((new Date().getTime() - date.getTime()) / 1000) >> 0;
  let ret = '';
  if (diff > periods[0].length) {
    ret = `${months[date.getMonth()]}`;
    if (date.getFullYear() !== new Date().getFullYear()) {
      ret = `${ret} ${String(date.getFullYear())}`;
    }
  } else {
    for (let i = 0; i < periods.length; i++) {
      let period = periods[i];
      if (diff >= period.length) {
        ret += (diff / period.length >> 0) + period.short;
        break;
      }
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
