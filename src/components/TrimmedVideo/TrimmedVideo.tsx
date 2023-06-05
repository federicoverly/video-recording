export interface TrimmedVideoProps {
  handleDownload: () => void;
  videoSrc: string;
}

export const TrimmedVideo = ({ handleDownload, videoSrc }: TrimmedVideoProps) => {
  return (
    <>
      {' '}
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
