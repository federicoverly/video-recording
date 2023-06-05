import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/useAuth';
import { db, storage } from '../../utils/firebaseConfig';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage';
import { TrimmedVideo } from '../components/TrimmedVideo/TrimmedVideo';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import * as helpers from '../../utils/videoDownload';

export interface Videos {
  id: string;
  url: string;
  users: string[];
}

const FF = createFFmpeg({
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js'
});

(async function () {
  await FF.load();
})();

export function Content() {
  const [videos, setVideos] = useState<Videos[]>([]);
  const [inputVideoFile, setInputVideoFile] = useState(videos[0]);
  void setInputVideoFile;
  const [trimmedVideo, setTrimmedVideo] = useState('');
  void setTrimmedVideo;
  const [rStart, setRstart] = useState(0); // 0%
  void setRstart;
  const [rEnd, setRend] = useState(10); // 10%
  void setRend;
  const [videoMeta, setVideoMeta] = useState<{ duration: string }>();
  void videoMeta;
  void setVideoMeta;
  const [trimmedVideoFile, setTrimmedVideoFile] = useState<unknown | null>(null);
  void trimmedVideoFile;
  const [trimIsProcessing, setTrimIsProcessing] = useState(false);
  void trimIsProcessing;

  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;
    const q = query(collection(db, 'recordedVideos'), where('users', 'array-contains', user?.email));

    const querySnapshot = getDocs(q);
    querySnapshot
      .then(res => {
        const data: Videos[] = res.docs.map(video => {
          return { id: video.id, url: video.data().url, users: video.data().users };
        });

        setVideos(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [user]);

  const logOut = useCallback(() => {
    signOut(auth)
      .then(() => {
        setUser(undefined);
        navigate('/');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        throw Error(errorCode, errorMessage);
      });
  }, [navigate, setUser]);

  const downloadVideo = useCallback(() => {
    //padelapp-5c3a1.appspot.com
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
  }, []);

  const downloadTrimmedVideo = useCallback(() => {
    return;
  }, []);

  const handleTrim = async () => {
    setTrimIsProcessing(true);
    const video = document.getElementById('renderedVideo') as HTMLVideoElement;

    const startTime = Number(((rStart / 100) * video.duration).toFixed(2));
    const offset = ((rEnd / 100) * video.duration - startTime).toFixed(2);
    try {
      FF.FS('writeFile', 'TrimmedVideo', await fetchFile(inputVideoFile.url));
      await FF.run(
        '-ss',
        helpers.toTimeString(startTime),
        '-i',
        'TrimmedVideo',
        '-t',
        helpers.toTimeString(offset),
        '-c:v',
        'copy',
        'ping.mp4'
      );
      const data = FF.FS('readFile', 'ping.mp4');
      const dataURL = await helpers.readFileAsBase64(new Blob([data.buffer], { type: 'video/mp4' }));
      setTrimmedVideoFile(dataURL);
    } catch (error) {
      console.log(error);
    } finally {
      setTrimIsProcessing(false);
    }
  };

  void handleTrim;

  return (
    <>
      <div>
        {videos.map(video => (
          <>
            <video id={video.id} width="320" height="240" controls src={`${video.url}#t=15,20`} />
            <p>{video.id}</p>
          </>
        ))}
      </div>
      {videos.length > 0 && <video id="renderedVideo" width="320" height="240" controls src={videos[0].url} />}
      <button onClick={logOut}>Logout</button>
      <button onClick={downloadVideo}>Click to download</button>
      <a href="" id="mya" download title="video">
        Download after clicking
      </a>
      <TrimmedVideo handleDownload={downloadTrimmedVideo} videoSrc={trimmedVideo} />
    </>
  );
}

Content.displayName = 'Content';

function downloadUrl(url: string, fileName: string) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

void downloadUrl;
