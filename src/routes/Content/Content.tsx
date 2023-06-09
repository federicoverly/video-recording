import { useAuth } from '../../contexts/useAuth';
import { VideosContainer } from '../../components/VideosContainer/VideosContainer';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { useVideos } from '../../queries/queries';

export interface Video {
  id: string;
  url: string;
  users: string[];
  location: string;
  timestamp: number;
}

export function Content() {
  const { user } = useAuth();

  const videos = useVideos(user?.email);

  console.log(videos);

  return (
    <PageLayout>
      <VideosContainer videos={videos.data} />
    </PageLayout>
  );
}

Content.displayName = 'Content';
