import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/useAuth';
import { db } from '../../utils/firebaseConfig';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebaseConfig';
import { signOut } from 'firebase/auth';

export interface Videos {
  id: string;
  url: string;
  users: string[];
}

export const Content = () => {
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
  }, []);

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

  return (
    <>
      <div>
        {videos.map(video => (
          <video width="320" height="240" controls>
            <source src={video.url} type="video/mp4" />
          </video>
        ))}
      </div>
      <button onClick={logOut}>Logout</button>
    </>
  );
};

Content.displayName = 'Content';
