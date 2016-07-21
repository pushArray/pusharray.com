import {expect} from 'chai';
import {
  buildUrl,
  get,
  request
} from 'utils/http';

describe('utils/http.ts', () => {
  it('buildUrl', () => {
    let url = 'http://pusharray.com';
    let params = {
      tweets: 'new',
      count: 15,
      empty: '',
      zero: 0
    };
    let complete = 'http://pusharray.com?tweets=new&count=15&empty=&zero=0';
    expect(buildUrl(url)).to.equal(url);
    expect(buildUrl(url, params)).to.equal(complete);
  });

  describe('::async::', () => {
    let server: Sinon.SinonFakeServer;
    let contentType = {'Content-Type': 'application/json'};
    let responseData = [{}];
    let responseError = '';

    before(() => {
      server = sinon.fakeServer.create();
      server.respondWith('GET', '/tweets', [200, contentType, JSON.stringify(responseData)]);
    });

    after(() => {
      server.restore();
    });

    it('get', (done) => {
      let {xhr, promise} = get('/tweets');
      promise.then((value: any) => {
        expect(value).to.equal('[{}]');
        done();
      });
      server.respond();
    });

    it('request', (done) => {
      let {xhr, promise} = request('GET', '/tweets');
      promise.then((value: any) => {
        expect(value).to.equal('[{}]');
        done();
      });
      server.respond();
    });
  });
});
