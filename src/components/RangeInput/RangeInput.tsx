import { toTimeString } from '../../../utils/videoDownload';
import { Thumbnail } from '../../routes/VideoDetails/VideoDetails';

interface RangeInputProps {
  thumbnails: (Thumbnail | string | ArrayBuffer | null)[] | undefined;
  rEnd: number;
  rStart: number;
  handleUpdaterStart?: ({ target: { value } }: { target: { value: number } }) => void;
  handleUpdaterEnd?: ({ target: { value } }: { target: { value: number } }) => void;
  loading: boolean;
  duration: number;
}

export function RangeInput({ thumbnails, rEnd, rStart, loading, duration }: RangeInputProps) {
  const RANGE_MAX = 100;
  if (loading || !thumbnails) {
    return (
      <center>
        <h2> processing thumbnails.....</h2>
      </center>
    );
  }

  if (thumbnails.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      <div className="range_pack">
        <div className="image_box">
          {thumbnails.map((thumbnnail: string | Thumbnail | ArrayBuffer | null) =>
            typeof thumbnnail === 'string' || thumbnnail === null ? null : 'url' in thumbnnail && 'id' in thumbnnail ? (
              'url' in thumbnnail && 'id' in thumbnnail ? (
                <img src={thumbnnail.url} alt={`sample_video_thumbnail_${thumbnnail.id}`} key={thumbnnail.id} />
              ) : null
            ) : null
          )}
          <div
            className="clip_box"
            style={{
              width: `calc(${rEnd - rStart}% )`,
              left: `${rStart}%`
            }}
            data-start={toTimeString((rStart / RANGE_MAX) * duration, false)}
            data-end={toTimeString((rEnd / RANGE_MAX) * duration, false)}
          >
            <span className="clip_box_des"></span>
            <span className="clip_box_des"></span>
          </div>
          {/* <input className="range" type="range" min={0} max={RANGE_MAX} onInput={handleUpdaterStart} value={rStart} />
          <input className="range" type="range" min={0} max={RANGE_MAX} onInput={handleUpdaterEnd} value={rEnd} /> */}
        </div>
      </div>
    </>
  );
}
