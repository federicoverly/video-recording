import { Video } from '../../routes/Content/Content';
import styles from './SelectedVideo.module.css';

interface SelectedVideoProps {
  selectedVideo: Video | undefined;
  id: string | undefined;
}

export function SelectedVideo({ selectedVideo, id }: SelectedVideoProps) {
  if (!selectedVideo) return <div>Loading...</div>;

  return (
    <>
      <video src={selectedVideo.url} controls width="320" height="240" id={id} className={styles.video} />
    </>
  );
}

SelectedVideo.displayName = 'SelectedVideo';
