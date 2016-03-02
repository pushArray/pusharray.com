const body = document.body;
const classList = body.classList;

class Http {

  private _busy: boolean = false;

  get busy(): boolean {
    return this._busy;
  }

  buildUrl(url: string, ...rest: string[]) {
    return `${url}/${rest.join('/')}`;
  }

  get(url: string, callback: Function): XMLHttpRequest {
    return this.request('GET', url, callback);
  }

  request(method: string, url: string, callback: Function): XMLHttpRequest {
    classList.remove('error');
    this._busy = true;
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        this._busy = false;
        callback.call(null, JSON.parse(xhr.responseText));
        classList.remove('busy');
      }
    };
    xhr.onerror = () => {
      classList.add('error');
    };
    classList.add('busy');
    xhr.send();
    return xhr;
  }
}

export default new Http();
