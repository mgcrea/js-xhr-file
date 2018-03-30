// const isResumeSupported = window.Blob && window.Blob.prototype.slice;

function applyRequestHeaders(req, headers) {
  if (typeof headers === 'object') {
    Object.keys(headers).forEach((key) => {
      req.setRequestHeader(key, headers[key]);
    });
  }
}

export const upload = (
  url,
  {
    file,
    fieldName = 'file',
    headers,
    responseType = 'json',
    credentials = false,
    withCredentials = false,
    data = new FormData(),
    onProgress
  } = {}
) =>
  new Promise((resolve, reject) => {
    if (!data.has(fieldName)) {
      data.append(fieldName, file);
    }
    const req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.withCredentials = withCredentials || credentials === 'include';
    req.responseType = responseType;
    applyRequestHeaders(req, headers);
    req.addEventListener('load', () => {
      const ok = req.status >= 200 && req.status < 300;
      resolve({body: req.response, status: req.status, ok});
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

export const download = (
  url,
  {headers, responseType = 'blob', credentials = false, withCredentials = false, onProgress} = {}
) =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.withCredentials = withCredentials || credentials === 'include';
    req.responseType = responseType;
    applyRequestHeaders(req, headers);
    req.addEventListener('load', () => {
      const ok = req.status >= 200 && req.status < 300;
      resolve({body: req.response, status: req.status, ok});
    });
    req.addEventListener('progress', (ev) => {
      if (onProgress) {
        onProgress(ev);
      }
    });
    req.addEventListener('error', reject);
    req.addEventListener('abort', reject);
    req.send();
  });

export const uploadObjectURL = (url, objectURL, {filename, lastModified, type, ...otherProps}) =>
  download(objectURL).then((blob) => {
    const file = new File([blob.body], filename, {lastModified, type});
    return upload(url, {file, ...otherProps});
  });

export default upload;
