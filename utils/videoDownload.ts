const toTimeString = (sec: string | number, showMilliSeconds = true) => {
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

const readFileAsBase64 = async (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const download = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '');
  link.click();
};

export { toTimeString, readFileAsBase64, download };
