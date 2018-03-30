import expect from 'expect';
import sinon from 'sinon';

import {upload, download} from '../../src';

// Configuration
const host = 'http://localhost:3000';
const expectedRequestHeaders = {'Content-Type': 'text/plain;charset=utf-8'};

describe('download', () => {
  let xhr;
  let requests;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    global.XMLHttpRequest = xhr;
    requests = [];
    xhr.onCreate = (xhr) => {
      // eslint-disable-line no-shadow
      requests.push(xhr);
    };
  });
  afterEach(() => {
    xhr.restore();
  });
  it('should correctly download a file', (done) => {
    const body = {ok: true};
    download(`${host}/files/foo.png`)
      .then((res) => {
        expect(res).toEqual({body: JSON.stringify(body), ok: true, status: 200});
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('blob');
    expect(requests[0].withCredentials).toBe(false);
    expect(requests[0].requestHeaders).toEqual(expectedRequestHeaders);
    expect(requests[0].requestBody).toBe(undefined);
    expect(requests[0].url).toBe(`${host}/files/foo.png`);
    requests[0].responseType = 'text';
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
  it('should correctly monitor progress', (done) => {
    const body = {ok: true};
    const onProgress = jest.fn();
    download(`${host}/files/foo.png`, {onProgress})
      .then((res) => {
        expect(res).toEqual({body: JSON.stringify(body), ok: true, status: 200});
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('blob');
    expect(requests[0].withCredentials).toBe(false);
    expect(requests[0].requestHeaders).toEqual(expectedRequestHeaders);
    expect(requests[0].requestBody).toBe(undefined);
    // expect(onProgress).toHaveBeenCalled(); // @TODO report issue to jsdom
    expect(requests[0].url).toBe(`${host}/files/foo.png`);
    requests[0].responseType = 'text';
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
  it('should correctly support custom headers', (done) => {
    const body = {ok: true};
    download(`${host}/files/foo.png`, {headers: {'X-Foo': 'bar'}})
      .then((res) => {
        expect(res).toEqual({body: JSON.stringify(body), ok: true, status: 200});
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('blob');
    expect(requests[0].withCredentials).toBe(false);
    expect(requests[0].requestBody).toBe(undefined);
    expect(requests[0].requestHeaders).toEqual({...expectedRequestHeaders, 'X-Foo': 'bar'});
    expect(requests[0].url).toBe(`${host}/files/foo.png`);
    requests[0].responseType = 'text';
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
  it('should correctly support `withCredentials` option', (done) => {
    const body = {ok: true};
    download(`${host}/files/foo.png`, {withCredentials: true})
      .then((res) => {
        expect(res).toEqual({body: JSON.stringify(body), ok: true, status: 200});
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('blob');
    expect(requests[0].withCredentials).toBe(true);
    expect(requests[0].requestBody).toBe(undefined);
    expect(requests[0].url).toBe(`${host}/files/foo.png`);
    requests[0].responseType = 'text';
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
  it('should correctly support `credentials` option', (done) => {
    const body = {ok: true};
    download(`${host}/files/foo.png`, {credentials: 'include'})
      .then((res) => {
        expect(res).toEqual({body: JSON.stringify(body), ok: true, status: 200});
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('blob');
    expect(requests[0].withCredentials).toBe(true);
    expect(requests[0].requestBody).toBe(undefined);
    expect(requests[0].url).toBe(`${host}/files/foo.png`);
    requests[0].responseType = 'text';
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
});

describe('upload', () => {
  let xhr;
  let requests;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    global.XMLHttpRequest = xhr;
    requests = [];
    xhr.onCreate = (xhr) => {
      // eslint-disable-line no-shadow
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
      .then((res) => {
        expect(res).toEqual({body, ok: true, status: 200});
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('json');
    expect(requests[0].withCredentials).toBe(false);
    expect(requests[0].requestHeaders).toEqual({});
    expect(requests[0].url).toBe(`${host}/files`);
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
  it('should correctly monitor progress', (done) => {
    const body = {ok: true};
    const blob = new Blob(['foobar']);
    const file = new File([blob], 'rM8RrRE.jpg', {size: blob.size, type: blob.type});
    const onProgress = jest.fn();
    upload(`${host}/files`, {file, onProgress})
      .then((res) => {
        expect(res).toEqual({body, ok: true, status: 200});
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('json');
    expect(requests[0].withCredentials).toBe(false);
    expect(requests[0].requestHeaders).toEqual({});
    // expect(onProgress).toHaveBeenCalled(); // @TODO report issue to jsdom
    expect(requests[0].url).toBe(`${host}/files`);
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
  it('should correctly support custom headers', (done) => {
    const body = {ok: true};
    const blob = new Blob(['foobar']);
    const file = new File([blob], 'rM8RrRE.jpg', {size: blob.size, type: blob.type});
    upload(`${host}/files`, {file, headers: {'X-Foo': 'bar'}})
      .then((res) => {
        expect(res).toEqual({body, ok: true, status: 200});
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('json');
    expect(requests[0].withCredentials).toBe(false);
    expect(requests[0].requestHeaders).toEqual({'X-Foo': 'bar'});
    expect(requests[0].url).toBe(`${host}/files`);
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
  it('should correctly support custom headers', (done) => {
    const body = {ok: true};
    const blob = new Blob(['foobar']);
    const file = new File([blob], 'rM8RrRE.jpg', {size: blob.size, type: blob.type});
    upload(`${host}/files`, {file, withCredentials: true})
      .then((res) => {
        expect(res).toEqual({body, ok: true, status: 200});
        done();
      })
      .catch(done);
    expect(requests[0].responseType).toBe('json');
    expect(requests[0].withCredentials).toBe(true);
    expect(requests[0].url).toBe(`${host}/files`);
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
  });
});

// @TODO Stuck on https://github.com/jsdom/jsdom/issues/1721
// describe('uploadObjectURL', () => {
//   let xhr;
//   let requests;
//   beforeEach(() => {
//     xhr = sinon.useFakeXMLHttpRequest();
//     global.XMLHttpRequest = xhr;
//     requests = [];
//     xhr.onCreate = (xhr) => {
//       // eslint-disable-line no-shadow
//       requests.push(xhr);
//     };
//   });
//   afterEach(() => {
//     xhr.restore();
//   });
//   it('should correctly upload an ObjectURL', (done) => {
//     const body = {ok: true};
//     const blob = new Blob(['foobar']);
//     const file = new File([blob], 'rM8RrRE.jpg', {size: blob.size, type: blob.type});
//     const objectURL = URL.createObjectURL(file);
//     uploadObjectURL(`${host}/files`, {objectURL, type: blob.type})
//       .then((res) => {
//         expect(res).toEqual(body);
//         done();
//       })
//       .catch(done);
//     expect(requests[0].responseType).toBe('json');
//     expect(requests[0].withCredentials).toBe(false);
//     expect(requests[0].requestHeaders).toEqual({});
//     expect(requests[0].url).toBe(`${host}/files`);
//     requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(body));
//   });
// });
