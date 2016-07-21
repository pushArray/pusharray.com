type XhrPromise = {
  xhr: XMLHttpRequest;
  promise: Promise<string>;
}

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

export function get(url: string): XhrPromise {
  return request('GET', url);
}

export function request(method: string, url: string): XhrPromise {
  let xhr = new XMLHttpRequest();
  let promise = new Promise<string>((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
      }
    };
    xhr.onerror = () => {
      reject(xhr.responseText);
    };
  });
  xhr.open(method, url, true);
  xhr.send();
  return {xhr, promise};
}
