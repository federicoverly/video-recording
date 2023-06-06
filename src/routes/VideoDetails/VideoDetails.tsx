import { doc, getDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../../../utils/firebaseConfig';
import { Video } from '../Content/Content';
import { useParams } from 'react-router-dom';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { download, toTimeString, readFileAsBase64 } from '../../../utils/videoDownload';
import { TrimmedVideo } from '../../components/TrimmedVideo/TrimmedVideo';
import { PageLayout } from '../../components/PageLayout/PageLayout';

export function VideoDetails() {
  const FF = createFFmpeg({
    log: true
  });

  const [inputVideoFile, setInputVideoFile] = useState<Video>();
  const [rStart, setRstart] = useState(0); // 0%
  void setRstart;
  const [rEnd, setRend] = useState(50); // 10%
  void setRend;
  const [trimmedVideoFile, setTrimmedVideoFile] = useState<string | ArrayBuffer | null>(null);
  const [trimIsProcessing, setTrimIsProcessing] = useState(false);

  const { id } = useParams();

  const getVideo = useCallback(async () => {
    if (id === undefined) return;
    const docRef = doc(db, 'recordedVideos', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      setInputVideoFile({
        id: docSnap.id,
        url: docSnap.data()?.url,
        users: docSnap.data()?.users,
        location: docSnap.data()?.location,
        timestamp: docSnap.data()?.timestamp
      });
    } else {
      console.log('No such document!');
    }
  }, [id]);

  useEffect(() => {
    getVideo();
  }, [getVideo]);

  const downloadTrimmedVideo = useCallback(() => {
    if (typeof trimmedVideoFile === 'string') {
      download(trimmedVideoFile);
    }
    return;
  }, [trimmedVideoFile]);

  const handleTrim = useCallback(async () => {
    if (!inputVideoFile || !id) return;
    setTrimIsProcessing(true);
    const video = document.getElementById(id) as HTMLVideoElement;

    const startTime = Number(((rStart / 100) * video.duration).toFixed(2));
    const offset = ((rEnd / 100) * video.duration - startTime).toFixed(2);
    await FF.load();
    try {
      FF.FS('writeFile', 'TrimmedVideo', await fetchFile(inputVideoFile?.url));
      await FF.run('-ss', toTimeString(startTime), '-i', 'TrimmedVideo', '-t', toTimeString(offset), '-c:v', 'copy', 'ping.mp4');
      const data = FF.FS('readFile', 'ping.mp4');
      const dataURL = await readFileAsBase64(new Blob([data.buffer], { type: 'video/mp4' }));
      setTrimmedVideoFile(dataURL);
    } catch (error) {
      console.log(error);
    } finally {
      setTrimIsProcessing(false);
    }
  }, [FF, id, inputVideoFile, rEnd, rStart]);

  if (!inputVideoFile) return <div>Loading...</div>;

  return (
    <PageLayout>
      <video src={inputVideoFile.url} controls width="320" height="240" id={id} />
      <button onClick={handleTrim} disabled={trimIsProcessing}>
        {trimIsProcessing ? 'trimming...' : 'trim selected'}
      </button>
      <TrimmedVideo handleDownload={downloadTrimmedVideo} videoSrc={trimmedVideoFile} />
    </PageLayout>
  );
}

VideoDetails.displayName = 'VideoDetails';
