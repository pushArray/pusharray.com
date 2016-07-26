import {expect} from 'chai';
import {initialSet} from 'data';
import {
  buildUrl,
  get
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

    before(() => {
      server = sinon.fakeServer.create();
      server.respondWith('GET', '/tweets', [
        200, contentType, JSON.stringify(initialSet)]);
    });

    after(() => {
      server.restore();
    });

    it('get', (done) => {
      get('/tweets').subscribe((data: any) => {
        expect(data.length).to.equal(50);
        done();
      });
      server.respond();
    });
  });
});
