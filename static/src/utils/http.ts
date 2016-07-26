import {EventEmitter} from 'events';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';

type UrlParams = {
  [param: string]: string|number
}

type HttpError = {
  error: string;
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

export function get<T>(url: string): Observable<T> {
  return request<T>('GET', url);
}

export function request<T>(method: string, url: string): Observable<T> {
  let http = new Http<T>(url,  method);
  return Observable.create((subscriber: Subscriber<T>) => {
    http.complete((data: T) => {
      http.dispose();
      subscriber.next(data);
      subscriber.complete();
    });

    http.error((error: HttpError) => {
      subscriber.error(error);
    });

    http.send();

    return () => {
      http.dispose();
    };
  });
}

const HTTP_COMPLETE = 'httpComplete';
const HTTP_ERROR = 'httpError';

export class Http<T> extends EventEmitter {

  private xhr = new XMLHttpRequest();

  constructor(url: string, method = 'GET') {
    super();

    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);

    this.xhr.addEventListener('load', this.onLoad);
    this.xhr.addEventListener('error', this.onError);
    this.xhr.open(method, url, true);
  }

  complete(callback: (data: T) => void): Http<T> {
    this.once(HTTP_COMPLETE, callback);
    return this;
  }

  error(callback: (error: HttpError) => void): Http<T> {
    this.once(HTTP_ERROR, callback);
    return this;
  }

  send() {
    this.xhr.send();
  }

  dispose() {
    this.cancel();
    this.xhr.removeEventListener('load', this.onLoad);
    this.xhr.removeEventListener('error', this.onError);
  }

  cancel() {
    this.xhr.abort();
  }

  private onLoad() {
    if (this.xhr.status >= 200 && this.xhr.status < 300) {
      let response = this.getResponse(this.xhr.responseText);
      this.emit(HTTP_COMPLETE, response);
    }
  }

  private getResponse(response: string): T | HttpError | string {
    try {
      return JSON.parse((response));
    } catch (e) {
      return response;
    }
  }

  private onError() {
    this.emit(HTTP_ERROR, this.getResponse(this.xhr.responseText));
  }
}
