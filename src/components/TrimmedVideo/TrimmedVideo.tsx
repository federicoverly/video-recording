export interface TrimmedVideoProps {
  handleDownload: () => void;
  videoSrc: string | ArrayBuffer | null;
}

export const TrimmedVideo = ({ handleDownload, videoSrc }: TrimmedVideoProps) => {
  if (!videoSrc || typeof videoSrc !== 'string') {
    return null;
  }

  return (
    <>
      <div>
        <video src={videoSrc} autoPlay controls muted width="450"></video>
      </div>
      <button onClick={handleDownload} className="btn btn_g">
        {' '}
        download
      </button>
    </>
  );
};
