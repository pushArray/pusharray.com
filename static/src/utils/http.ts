import {EventEmitter} from 'events';

type UrlParams = {
  [param: string]: string|number
}

export function buildUrl(url: string, params: UrlParams = {}): string {
  if (params) {
    let urlParams = '';
    for (let param in params) {
      if (params.hasOwnProperty(param) && typeof params[param] !== 'undefined') {
        urlParams += `${param}=${params[param]}&`;
      }
    }
    if (urlParams) {
      url = `${url}?${encodeURI(urlParams)}`;
      url = url.substr(0, url.length - 1);
    }
  }
  return url;
}

export function get(url: string): Http {
  return request('GET', url);
}

export function request(method: string, url: string): Http {
  let http = new Http();
  http.send(url, method);
  return http;
}

const HTTP_COMPLETE = 'httpComplete';
const HTTP_ERROR = 'httpError';

export class Http extends EventEmitter {

  private xhr = new XMLHttpRequest();

  constructor() {
    super();

    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);

    this.xhr.addEventListener('load', this.onLoad);
    this.xhr.addEventListener('error', this.onError);
  }

  private onLoad() {
    if (this.xhr.status >= 200 && this.xhr.status < 300) {
      let response = this.getResponse(this.xhr.responseText);
      this.emit(HTTP_COMPLETE, response);
    }
  }

  private getResponse(response: string): any {
    try {
      return JSON.parse((response));
    } catch (e) {
      return response;
    }
  }

  private onError() {
    this.emit(HTTP_ERROR, this.getResponse(this.xhr.responseText));
  }

  complete(callback: (data: any) => void): Http {
    this.once(HTTP_COMPLETE, callback);
    return this;
  }

  error(callback: (error: Object) => void): Http {
    this.once(HTTP_ERROR, callback);
    return this;
  }

  send(url: string, method = 'GET') {
    this.xhr.open(method, url, true);
    this.xhr.send();
  }

  dispose() {
    this.xhr.removeEventListener('load', this.onLoad);
    this.xhr.removeEventListener('error', this.onError);
  }

  cancel() {
    this.xhr.abort();
  }
}
