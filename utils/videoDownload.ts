import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from './firebaseConfig';

export const toTimeString = (sec: string | number, showMilliSeconds = true) => {
  const secAsNumb: number = typeof sec === 'number' ? sec : parseFloat(sec);
  let hours: string | number = Math.floor(secAsNumb / 3600);
  let minutes: string | number = Math.floor((secAsNumb - hours * 3600) / 60);
  let seconds: string | number = secAsNumb - hours * 3600 - minutes * 60;
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  const maltissaRegex = /\..*$/; // matches the decimal point and the digits after it e.g if the number is 4.567 it matches .567
  const millisec = String(seconds).match(maltissaRegex);
  return (
    hours + ':' + minutes + ':' + String(seconds).replace(maltissaRegex, '') + (showMilliSeconds ? (millisec ? millisec[0] : '.000') : '')
  );
};

export const readFileAsBase64 = async (file: Blob) => {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const download = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '');
  link.click();
};

export const downloadVideo = () => {
  getDownloadURL(ref(storage, '/recordings/2c620823-b25d-4f06-9d5f-4500484ae69d.mp4'))
    .then(url => {
      // This can be downloaded directly:
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      // xhr.onload = event => {
      //   const blob = xhr.response;
      // };
      xhr.onload = event => {
        void event;
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = 'someFileName';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click(); //Simulates a click event
        const blob = xhr.response;
        void blob;
      };
      xhr.addEventListener('load', blob => console.log(blob));

      xhr.open('GET', url);
      // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.send();

      // const a = document.getElementById('mya');
      // a && a.setAttribute('href', url);
    })
    .catch(error => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          console.log('file doesnt exist');
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          console.log('unauthorized');

          break;
        case 'storage/canceled':
          // User canceled the upload
          console.log('canceled');

          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
};
