import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/useAuth';
import { db, storage } from '../../utils/firebaseConfig';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getDownloadURL, ref } from 'firebase/storage';

export interface Videos {
  id: string;
  url: string;
  users: string[];
}

export function Content() {
  const [videos, setVideos] = useState<Videos[]>([]);
  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
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
  }, [user?.email]);

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

  const videoRef = ref(storage, 'gpA3a4siIfDeSrU2WGXd');

  const downloadVideo = useCallback(() => {
    getDownloadURL(ref(storage, 'recordings/2c620823-b25d-4f06-9d5f-4500484ae69d.mp4'))
      .then(url => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = event => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        xhr.setRequestHeader(
          'Access-Control-Allow-Headers',
          'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
        );
        xhr.send();
        console.log('all un');

        // Or inserted into an <img> element
        const button = document.getElementById('myButton');
        if (button) {
          button.setAttribute('src', url);
        }
      })
      .catch(error => {
        console.log(error);
        // Handle any errors
      });
  }, []);

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
      <button onClick={logOut}>Logout</button>
      <button onClick={downloadVideo}>Click to download</button>
      <a href="">
        <button id="myButton">Download</button>
      </a>
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
