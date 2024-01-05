import { doc, getDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../../../utils/firebaseConfig';
import { Video } from '../Content/Content';
import { useParams } from 'react-router-dom';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { SelectedVideo } from '../../components/VideoDetails/SelectedVideo';
import { download } from '../../../utils/videoDownload';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { TrimmedVideo } from '../../components/TrimmedVideo/TrimmedVideo';
import { Button } from '../../components/Button/Button';
import { RangeInput } from '../../components/RangeInput/RangeInput';

export interface Thumbnail {
  id: string;
  url: string;
}

export function VideoDetails() {
  const FF = createFFmpeg({
    log: true
  });

  const [inputVideoFile, setInputVideoFile] = useState<Video>();
  const [videoDuration, setVideoDuration] = useState(0);
  const [rStart, setRstart] = useState(0); // 0%
  void setRstart;
  const [rEnd, setRend] = useState(50); // 10%
  void setRend;
  const [trimmedVideoFile, setTrimmedVideoFile] = useState<string | ArrayBuffer | null>(null);
  const [trimIsProcessing, setTrimIsProcessing] = useState(false);
  const [thumbnails, setThumbnails] = useState<(Thumbnail | string | ArrayBuffer | null)[] | undefined>([]);
  const [thumbnailIsProcessing, setThumbnailIsProcessing] = useState(false);

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

  const handleTrim = useCallback(async () => {
    if (!inputVideoFile || !id) return;
    setTrimIsProcessing(true);

    const startTime = Number(((rStart / 100) * videoDuration).toFixed(2));
    const offset = ((rEnd / 100) * videoDuration - startTime).toFixed(2);
    void offset;
    await FF.load();
    try {
      FF.FS('writeFile', 'TrimmedVideo', await fetchFile(inputVideoFile.url));
      await FF.run('-ss', '5', '-i', 'TrimmedVideo', '-t', '10', '-c:v', 'copy', 'ping.mp4');
      const data = FF.FS('readFile', 'ping.mp4');
      const dataURL = await URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      setTrimmedVideoFile(dataURL);
    } catch (error) {
      console.log(error);
    } finally {
      setTrimIsProcessing(false);
    }
  }, [FF, id, inputVideoFile, rEnd, rStart, videoDuration]);

  // const getThumbnails = useCallback(
  //   async ({ duration, inputVideoFile }: { duration: number; inputVideoFile: Video }) => {
  //     if (!inputVideoFile) return;
  //     if (!FF.isLoaded()) await FF.load();
  //     setThumbnailIsProcessing(true);
  //     const MAX_NUMBER_OF_IMAGES = 15;
  //     const NUMBER_OF_IMAGES = 20 < MAX_NUMBER_OF_IMAGES ? 20 : 15;
  //     let offset = 1;

  //     FF.FS('writeFile', 'example', await fetchFile(inputVideoFile.url));
  //     const arrayOfImageURIs = [];
  //     for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
  //       const startTimeInSecs = toTimeString(Math.round(i * offset));
  //       if (Number(startTimeInSecs) + offset > duration && offset > 1) {
  //         offset = 0;
  //       }
  //       try {
  //         await FF.run('-ss', startTimeInSecs, '-i', 'example', '-t', '00:00:1.000', '-vf', `scale=150:-1`, `img${i}.png`);
  //         const data = FF.FS('readFile', `img${i}.png`);
  //         const blob = new Blob([data.buffer], { type: 'image/png' });
  //         const dataURI = await readFileAsBase64(blob);
  //         arrayOfImageURIs.push(dataURI);
  //         FF.FS('unlink', `img${i}.png`);
  //       } catch (error) {
  //         console.log({ message: error });
  //       }
  //     }
  //     setThumbnailIsProcessing(false);
  //     return arrayOfImageURIs;
  //   },
  //   [FF]
  // );

  // const handleLoadedData = useCallback(async () => {
  //   if (!inputVideoFile) return;
  //   const thumbnails = await getThumbnails({ duration: videoDuration, inputVideoFile });
  //   setThumbnails(thumbnails);
  // }, [getThumbnails, inputVideoFile, videoDuration]);

  // useEffect(() => {
  //   if (id === undefined) return;
  //   const video = document.getElementById(id) as HTMLVideoElement;
  //   setVideoDuration(video.duration);
  //   // handleLoadedData();
  // }, [id]);

  const downloadTrimmedVideo = useCallback(() => {
    if (typeof trimmedVideoFile === 'string') {
      download(trimmedVideoFile);
    }
    return;
  }, [trimmedVideoFile]);

  // const handleUpdateRange = (func: FormEventHandler<HTMLInputElement>) => {
  //   return ({ target: { value } }) => {
  //     func(value);
  //   };
  // };

  void setVideoDuration;
  void setThumbnails;
  void setThumbnailIsProcessing;
  return (
    <PageLayout>
      <SelectedVideo selectedVideo={inputVideoFile} id={id} />
      <Button onClick={handleTrim} disabled={trimIsProcessing}>
        {trimIsProcessing ? 'Trimming...' : 'Trim selected'}
      </Button>
      <RangeInput
        thumbnails={thumbnails}
        rEnd={rEnd}
        rStart={rStart}
        // handleUpdaterStart={handleUpdateRange(setRstart)}
        // handleUpdaterEnd={handleUpdateRange(setRend)}
        loading={thumbnailIsProcessing}
        duration={videoDuration}
      />
      <TrimmedVideo handleDownload={downloadTrimmedVideo} videoSrc={trimmedVideoFile} />;
    </PageLayout>
  );
}

VideoDetails.displayName = 'VideoDetails';
