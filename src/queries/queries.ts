import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Video } from '../routes/Content/Content';
import { db } from '../../utils/firebaseConfig';
import { useQuery } from 'react-query';

const getVideos = async (email: string | undefined | null) => {
  if (email == null) return;
  const q = query(collection(db, 'recordedVideos'), where('users', 'array-contains', email));

  const querySnapshot = getDocs(q);

  const res = await querySnapshot;

  return res.docs.map(video => {
    return {
      id: video.id,
      url: video.data().url,
      users: video.data().users,
      location: video.data().location,
      timestamp: video.data().timestamp
    };
  });
};

export function useVideos(email: string | undefined | null) {
  return useQuery<Video[] | undefined>(['videos', email], () => getVideos(email));
}

const getVideo = async (id: string | undefined | null) => {
  if (id == null) return;
  const docRef = doc(db, 'recordedVideos', id);
  const docSnap = getDoc(docRef);

  const res = await docSnap;

  return {
    id: res.id,
    url: res.data()?.url,
    users: res.data()?.users,
    location: res.data()?.location,
    timestamp: res.data()?.timestamp
  };
};

export function useVideo(id: string | undefined) {
  return useQuery<Video | undefined>(['video', id], () => getVideo(id));
}
