import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../contexts/useAuth';
import { db, storage } from '../../../utils/firebaseConfig';
import { useCallback, useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { VideosContainer } from '../../components/VideosContainer/VideosContainer';
import { PageLayout } from '../../components/PageLayout/PageLayout';

export interface Video {
  id: string;
  url: string;
  users: string[];
  location: string;
  timestamp: number;
}

export function Content() {
  const [videos, setVideos] = useState<Video[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;
    const q = query(collection(db, 'recordedVideos'), where('users', 'array-contains', user?.email));

    const querySnapshot = getDocs(q);
    querySnapshot
      .then(res => {
        const data: Video[] = res.docs.map(video => {
          return {
            id: video.id,
            url: video.data().url,
            users: video.data().users,
            location: video.data().location,
            timestamp: video.data().timestamp
          };
        });

        setVideos(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [user]);

  const downloadVideo = useCallback(() => {
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

  void downloadVideo;

  return (
    <PageLayout>
      <VideosContainer videos={videos} />
    </PageLayout>
  );
}

Content.displayName = 'Content';
