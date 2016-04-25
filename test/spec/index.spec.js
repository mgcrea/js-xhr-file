import expect from 'expect';
import sinon from 'sinon';
import jsdom from 'mocha-jsdom';

import {upload, download} from '../../src';
try { require('debug-utils'); } catch (err) {}; // eslint-disable-line

// Configuration
const host = 'http://localhost:3000';

describe('download', () => {
  jsdom();
  let xhr;
  let requests;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    global.XMLHttpRequest = xhr;
    requests = [];
    xhr.onCreate = (xhr) => { // eslint-disable-line no-shadow
      requests.push(xhr);
    };
  });
  afterEach(() => {
    xhr.restore();
  });
  it('should correctly download a file', (done) => {
    const body = {ok: true};
    download(`${host}/files/foo.png`)
      .then(res => {
        expect(res).toEqual(JSON.stringify(body));
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('blob');
    expect(requests[0].requestHeaders).toEqual({});
    expect(requests[0].requestBody).toBe(null);
    expect(requests[0].url).toBe(`${host}/files/foo.png`);
    requests[0].responseType = 'text';
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
});

describe('upload', () => {
  jsdom();
  let xhr;
  let requests;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    global.XMLHttpRequest = xhr;
    requests = [];
    xhr.onCreate = (xhr) => { // eslint-disable-line no-shadow
      requests.push(xhr);
    };
  });
  afterEach(() => {
    xhr.restore();
  });
  it('should correctly upload a file', (done) => {
    const body = {ok: true};
    const blob = new Blob(['foobar']);
    const file = new File([blob], 'rM8RrRE.jpg', {size: blob.size, type: blob.type});
    upload(`${host}/files`, {file})
      .then(res => {
        expect(res).toEqual(body);
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('json');
    expect(requests[0].requestHeaders).toEqual({});
    expect(requests[0].url).toBe(`${host}/files`);
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
});
