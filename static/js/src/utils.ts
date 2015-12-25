const doc = document;
const timeMatchRegExp = /^w+(w+)(d+)([d:]+)+0000(d+)$/;
const htmlCharRegExp = /&(nbsp|amp|quot|lt|gt);/g;
const htmlCharMap = {
  'nbsp': ' ',
  'amp': '&',
  'quot': '\'',
  'lt': '<',
  'gt': '>'
};

export default {
  /**
   * Queries all elements by specified selector.
   */
  queryAll(query: string, element: NodeSelector = doc): NodeList {
    return element.querySelectorAll(query);
  },

  /**
   * Queries DOM elements by id.
   */
  getId(id: string): HTMLElement {
    return doc.getElementById(id);
  },

  /**
   * Creates HTML element.
   */
  createNode(node: string, attrs: {[attribute: string]: string} = null): HTMLElement {
    let nodeEl: HTMLElement = doc.createElement(node);
    for (let attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        nodeEl.setAttribute(attr, attrs[attr]);
      }
    }
    return nodeEl;
  },

  /**
   * Replaces HTML entities with HTML characters.
   */
  replaceHtmlEntities(htmlString: string): string {
    return htmlString.replace(htmlCharRegExp, (match: string, entity: any) => {
      return htmlCharMap[entity];
    });
  },

  fromTwitterDateTime(date: string): Date {
    return new Date(date.replace(timeMatchRegExp, '$1 $2 $4 $3 UTC'));
  },

  /**
   * Returns formatted date object as string.
   * Forked from http://stackoverflow.com/a/1229594
   */
  timeAgo(date: Date): string {
    const diff: number = ((new Date().getTime() - date.getTime()) / 1000) >> 0;
    const periods: any = {
      decade: 315360000,
      year: 31536000,
      month: 2628000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    const months: string[] = [
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
  },

  /**
   * Returns string truncated to the length specified.
   */
  limitString(str: string, length: number): string {
    if (str.length <= length) {
      return str;
    }
    return str.substring(0, length - 3) + '...';
  }
}
