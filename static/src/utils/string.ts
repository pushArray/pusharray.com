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
const pn: number[] = [2628000, 604800, 86400, 3600, 60, 1];
const ps: string[] = ['M', 'w', 'd', 'h', 'm', 's'];

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
  if (diff > pn[0]) {
    ret = `${months[date.getMonth()]} ${date.getDate()}`;
    if (date.getFullYear() !== new Date().getFullYear()) {
      ret += ', ' + String(date.getFullYear());
    }
  } else {
    for (let i = 0; i < pn.length; i++) {
      let val = pn[i];
      if (diff >= val) {
        ret += (diff / val >> 0) + ps[i];
        break;
      }
    }
  }
  return ret;
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
