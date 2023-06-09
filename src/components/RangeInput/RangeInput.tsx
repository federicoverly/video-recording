import { FormEvent } from 'react';
import { toTimeString } from '../../../utils/videoDownload';
import styles from './RangeInput.module.css';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query';
import { Button } from '../Button/Button';

interface RangeInputProps {
  thumbnails: (string | ArrayBuffer | null)[] | undefined;
  rEnd: number;
  rStart: number;
  handleUpdaterStart: (event: FormEvent<HTMLInputElement>) => void;
  handleUpdaterEnd: (event: FormEvent<HTMLInputElement>) => void;
  loading: boolean;
  duration: number;
  retryThumnbails: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<(string | ArrayBuffer | null)[] | undefined, unknown>>;
}

export function RangeInput({
  thumbnails,
  rEnd,
  rStart,
  handleUpdaterStart,
  handleUpdaterEnd,
  loading,
  duration,
  retryThumnbails
}: RangeInputProps) {
  const RANGE_MAX = 100;
  if (loading) {
    return (
      <center>
        <h2> processing thumbnails.....</h2>
      </center>
    );
  }

  if (!thumbnails) {
    return (
      <center>
        <Button onClick={retryThumnbails}>Retry loading</Button>
      </center>
    );
  }

  if (thumbnails.length === 0 && !loading) {
    return null;
  }

  return (
    <>
      <div className={styles.rangePack}>
        <div className={styles.imageBox}>
          {thumbnails.map((thumbnnail: string | ArrayBuffer | null) =>
            typeof thumbnnail === 'string' ? <img src={thumbnnail} alt={`sample_video_thumbnail_${thumbnnail}`} key={thumbnnail} /> : null
          )}
          <div
            className={styles.clipBox}
            style={{
              width: `calc(${rEnd - rStart}% )`,
              left: `${rStart}%`
            }}
            data-start={toTimeString((rStart / RANGE_MAX) * duration, false)}
            data-end={toTimeString((rEnd / RANGE_MAX) * duration, false)}
          >
            <span className={styles.clipBoxDes}></span>
            <span className={styles.clipBoxDes}></span>
          </div>
          <input className={styles.range} type="range" min={0} max={RANGE_MAX} onInput={handleUpdaterStart} value={rStart} />
          <input className={styles.range} type="range" min={0} max={RANGE_MAX} onInput={handleUpdaterEnd} value={rEnd} />
        </div>
      </div>
    </>
  );
}
