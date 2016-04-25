
// const isResumeSupported = window.Blob && window.Blob.prototype.slice;

const upload = (url, {file, responseType, onProgress} = {}) =>
  new Promise((resolve, reject) => {
    const data = new FormData();
    data.append('file', file);
    const req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.responseType = responseType || 'json';
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

const download = (url, {responseType, onProgress} = {}) =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = responseType || 'blob';
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
