
// const isResumeSupported = window.Blob && window.Blob.prototype.slice;

function applyRequestHeaders(req, headers) {
  if (typeof headers === 'object') {
    Object.keys(headers).forEach(key => {
      req.setRequestHeader(key, headers[key]);
    });
  }
}

const upload = (url, {file, headers, responseType = 'json', onProgress} = {}) =>
  new Promise((resolve, reject) => {
    const data = new FormData();
    data.append('file', file);
    const req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.responseType = responseType;
    applyRequestHeaders(req, headers);
    req.addEventListener('load', () => {
      if (req.status >= 200 && req.status < 300) {
        resolve(req.response);
      }
    });
    req.upload.addEventListener('progress', (ev) => {
      if (onProgress) {
        onProgress(ev);
      }
    });
    req.addEventListener('error', reject);
    req.addEventListener('abort', reject);
    req.send(data);
  });

const download = (url, {headers, responseType = 'blob', onProgress} = {}) =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = responseType;
    applyRequestHeaders(req, headers);
    req.addEventListener('load', () => {
      if (req.status >= 200 && req.status < 300) {
        resolve(req.response);
      }
    });
    req.addEventListener('progress', ev => {
      if (onProgress) {
        onProgress(ev);
      }
    });
    req.addEventListener('error', reject);
    req.addEventListener('abort', reject);
    req.send();
  });

export default upload;
export {upload, download};
