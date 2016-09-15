import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscriber} from 'rxjs/Subscriber';
import {start, end} from 'layout/progress';

type UrlParams = {
  [param: string]: string | number | boolean
}

type HttpError = {
  errors: {message: string, code: number}[];
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
    http.subscribe((data: T) => {
      subscriber.next(data);
    }, (error: HttpError) => {
      subscriber.error(error);
      http.dispose();
    }, () => {
      subscriber.complete();
      http.dispose();
    });

    http.send();

    return () => {
      http.dispose();
    };
  });
}

export class Http<T> extends Subject<T> {

  private xhr = new XMLHttpRequest();

  constructor(url: string, method = 'GET') {
    super();

    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);

    this.xhr.addEventListener('load', this.onLoad);
    this.xhr.addEventListener('error', this.onError);
    this.xhr.open(method, url, true);
  }

  send() {
    start();
    this.xhr.send();
  }

  dispose() {
    this.xhr.removeEventListener('load', this.onLoad);
    this.xhr.removeEventListener('error', this.onError);
    this.cancel();
  }

  cancel() {
    end();
    this.xhr.abort();
  }

  private getResponse(response: string): T | HttpError | string {
    try {
      return JSON.parse((response));
    } catch (e) {
      return response;
    }
  }

  private onLoad() {
    if (this.xhr.status >= 200 && this.xhr.status < 300) {
      let response = this.getResponse(this.xhr.responseText);
      this.next(<T>response);
      end();
    }
  }

  private onError() {
    this.error(<HttpError>this.getResponse(this.xhr.responseText));
    end();
  }
}
