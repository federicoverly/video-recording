import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface VideoCardProps {
  url: string;
  id: string;
  location: string;
  date: number;
  users: string[];
}

export function VideoCard({ url, location, date, users, id }: VideoCardProps) {
  const dateAsString = new Date(date).toLocaleDateString();

  const navigate = useNavigate();

  const goToDetails = useCallback(() => {
    navigate(`/video/${id}`);
  }, [id, navigate]);

  return (
    <div>
      <div></div>
      <p>Place: {location}</p>
      <p>{dateAsString}</p>
      <p>Played with: {users}</p>
      <video src={url} controls width="320" height="240" id={id} />
      <button onClick={goToDetails}>Go to details</button>
    </div>
  );
}

VideoCard.displayName = 'VideoCard';
