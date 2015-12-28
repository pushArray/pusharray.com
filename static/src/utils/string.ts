const htmlCharRegExp = /&(nbsp|amp|quot|lt|gt);/g;
const htmlCharMap = {
  'nbsp': ' ',
  'amp': '&',
  'quot': '\'',
  'lt': '<',
  'gt': '>'
};

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
export function timeAgo(date: Date): string {
  const diff = ((new Date().getTime() - date.getTime()) / 1000) >> 0;
  const periods = {
    decade: 315360000,
    year: 31536000,
    month: 2628000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let ret = '';
  if (diff > periods.month) {
    ret = months[date.getMonth()] + ' ' + date.getDate();
    if (date.getFullYear() !== new Date().getFullYear()) {
      ret += ', ' + String(date.getFullYear());
    }
  } else {
    for (let prop in periods) {
      if (periods.hasOwnProperty(prop)) {
        let val = periods[prop];
        if (diff >= val) {
          let time = (diff / val) >> 0;
          ret += time + ' ' + (time > 1 ? prop + 's' : prop);
          break;
        }
      }
    }
    ret += ' ago';
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
  return str.substring(0, length - 3) + '...';
}
