import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Video } from '../routes/Content/Content';
import { db } from '../../utils/firebaseConfig';
import { useQuery } from 'react-query';

export function useVideos(email: string | undefined | null) {
  let data: Video[] = [];

  if (email) {
    const q = query(collection(db, 'recordedVideos'), where('users', 'array-contains', email));

    const querySnapshot = getDocs(q);
    querySnapshot
      .then(res => {
        const backendData: Video[] = res.docs.map(video => {
          return {
            id: video.id,
            url: video.data().url,
            users: video.data().users,
            location: video.data().location,
            timestamp: video.data().timestamp
          };
        });

        console.log(backendData);
        data = backendData;
      })
      .catch(error => {
        console.log(error);
      });
  }
  console.log(data);

  return useQuery<Video[]>(['videos', email], () => data);
}

export function useVideo(id: string | undefined) {
  const video: Video | undefined = undefined;

  if (id) {
    const docRef = doc(db, 'recordedVideos', id);
    const docSnap = getDoc(docRef);

    docSnap
      .then(res => {
        return {
          id: res.id,
          url: res.data()?.url,
          users: res.data()?.users,
          location: res.data()?.location,
          timestamp: res.data()?.timestamp
        };
      })
      .catch(error => {
        console.log(error);
      });
  }
  return useQuery<Video | undefined>(['video', id], () => video);
}
