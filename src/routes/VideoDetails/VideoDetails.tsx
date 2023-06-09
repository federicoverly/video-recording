import { doc, getDoc } from 'firebase/firestore';
import { BaseSyntheticEvent, useCallback, useLayoutEffect, useState } from 'react';
import { db } from '../../../utils/firebaseConfig';
import { Video } from '../Content/Content';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SelectedVideo } from '../../components/VideoDetails/SelectedVideo';
import { download, readFileAsBase64, toTimeString } from '../../../utils/videoDownload';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { TrimmedVideo } from '../../components/TrimmedVideo/TrimmedVideo';
import { Button } from '../../components/Button/Button';
import { RangeInput } from '../../components/RangeInput/RangeInput';
import { useQuery } from 'react-query';

export function VideoDetails() {
  const FF = createFFmpeg({});

  const [videoDuration, setVideoDuration] = useState(0);
  const [rStart, setRstart] = useState(0); // 0%
  const [rEnd, setRend] = useState(50); // 10%
  const [trimmedVideoFile, setTrimmedVideoFile] = useState<string | ArrayBuffer | null>(null);
  const [trimIsProcessing, setTrimIsProcessing] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const getVideo = useCallback(async () => {
    if (id === undefined) return;
    const docRef = doc(db, 'recordedVideos', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        url: docSnap.data()?.url,
        users: docSnap.data()?.users,
        location: docSnap.data()?.location,
        timestamp: docSnap.data()?.timestamp
      };
    } else {
      console.log('No such document!');
    }
  }, [id]);

  const video = useQuery<Video | undefined>(['video', id], () => getVideo());

  const getThumbnails = useCallback(
    async ({ duration, inputVideoFile }: { duration: number; inputVideoFile: Video | undefined }) => {
      if (!inputVideoFile || id == null) return;
      if (!FF.isLoaded()) await FF.load();

      const video = document.getElementById(id) as HTMLVideoElement;

      const maxNumberOfImages = 15;
      const numberOfImages = video.duration < maxNumberOfImages ? duration : 15;
      let offset = video.duration === maxNumberOfImages ? 1 : video.duration / numberOfImages;

      FF.FS('writeFile', 'example', await fetchFile(inputVideoFile.url));
      const arrayOfImageURIs = [];
      for (let i = 0; i < numberOfImages; i += 1) {
        const startTimeInSecs = toTimeString(Math.round(i * offset));
        if (Number(startTimeInSecs) + offset > duration && offset > 1) {
          offset = 0;
        }
        try {
          await FF.run('-ss', startTimeInSecs, '-i', 'example', '-t', '00:00:1.000', '-vf', `scale=150:-1`, `img${i}.png`);
          const data = FF.FS('readFile', `img${i}.png`);
          const blob = new Blob([data.buffer], { type: 'image/png' });
          const dataURI = await readFileAsBase64(blob);
          arrayOfImageURIs.push(dataURI);
          FF.FS('unlink', `img${i}.png`);
          continue;
        } catch (error) {
          console.log({ message: error });
        }
      }
      return arrayOfImageURIs;
    },
    [FF, id]
  );

  const thumbnailsFromQuery = useQuery<(string | ArrayBuffer | null)[] | undefined>(['thumbnails', id, video], () =>
    getThumbnails({ duration: videoDuration, inputVideoFile: video.data })
  );

  const handleTrim = useCallback(async () => {
    if (!video.data || !id) return;
    setTrimIsProcessing(true);

    const startTime = Number(((rStart / 100) * videoDuration).toFixed(2));
    const offset = ((rEnd / 100) * videoDuration - startTime).toFixed(2);
    await FF.load();
    try {
      FF.FS('writeFile', 'TrimmedVideo', await fetchFile(video.data.url));
      await FF.run('-ss', toTimeString(startTime), '-i', 'TrimmedVideo', '-t', toTimeString(offset), '-c:v', 'copy', 'ping.mp4');
      const data = FF.FS('readFile', 'ping.mp4');
      const dataURL = await readFileAsBase64(new Blob([data.buffer], { type: 'video/mp4' }));
      setTrimmedVideoFile(dataURL);
    } catch (error) {
      console.log(error);
    } finally {
      setTrimIsProcessing(false);
    }
  }, [FF, id, rEnd, rStart, video.data, videoDuration]);

  const downloadTrimmedVideo = useCallback(() => {
    if (typeof trimmedVideoFile === 'string') {
      download(trimmedVideoFile);
    }
    return;
  }, [trimmedVideoFile]);

  const handleUpdateStart = useCallback((event: BaseSyntheticEvent) => {
    setRstart(event.target.value);
  }, []);

  const handleUpdateEnd = useCallback((event: BaseSyntheticEvent) => {
    setRend(event.target.value);
  }, []);

  useLayoutEffect(() => {
    if (id === undefined) return;
    const video = document.getElementById(id) as HTMLVideoElement;
    if (video == null) return;
    setVideoDuration(video.duration);
  }, [id]);

  return (
    <PageLayout>
      <Button onClick={() => navigate('/content')}>Back to content</Button>
      <SelectedVideo selectedVideo={video.data} id={id} />
      <RangeInput
        thumbnails={thumbnailsFromQuery.data}
        rEnd={rEnd}
        rStart={rStart}
        handleUpdaterStart={handleUpdateStart}
        handleUpdaterEnd={handleUpdateEnd}
        loading={thumbnailsFromQuery.isLoading}
        duration={videoDuration}
        retryThumnbails={thumbnailsFromQuery.refetch}
      />
      <TrimmedVideo handleDownload={downloadTrimmedVideo} videoSrc={trimmedVideoFile} />
      <Button onClick={handleTrim} disabled={trimIsProcessing}>
        {trimIsProcessing ? 'Trimming...' : 'Trim'}
      </Button>
    </PageLayout>
  );
}

VideoDetails.displayName = 'VideoDetails';
