import { Video } from '../../routes/Content/Content';
import { VideoCard } from '../VideoCard/VideoCard';
import styles from './VideosContainer.module.css';

interface VideosContainerProps {
  videos: Video[] | undefined;
}

export function VideosContainer({ videos }: VideosContainerProps) {
  if (!videos) return null;

  console.log(videos);

  return (
    <div className={styles.container}>
      {videos.map(video => (
        <VideoCard key={video.id} url={video.url} users={video.users} location={video.location} date={video.timestamp} id={video.id} />
      ))}
    </div>
  );
}

VideosContainer.displayName = 'VideosContainer';
