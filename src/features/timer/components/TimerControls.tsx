import playOn from "@/assets/play-on.png";
import playOff from "@/assets/play-off.png";
import pauseOn from "@/assets/pause-on.png";
import pauseOff from "@/assets/pause-off.png";
import stopOn from "@/assets/stop-on.png";
import stopOff from "@/assets/stop-off.png";
import type { TimerRunState } from "../model/timerStore";

type Props = {
  timerState: TimerRunState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
};
export default function TimerControls({
  timerState,
  onPlay,
  onPause,
  onStop,
}: Props) {
  const isPlayActive = timerState !== "running";
  const isPauseActive = timerState === "running";
  const isStopActive = timerState !== "idle";
  return (
    <div className="mt-20 ml-[270px] flex items-center gap-20">
      <button
        type="button"
        aria-label="재생"
        className="transition-opacity hover:opacity-90"
        onClick={onPlay}
      >
        <img
          src={isPlayActive ? playOn : playOff}
          alt="playicon"
          className="w-[100px] h-[100px]"
        />
      </button>

      <button
        type="button"
        aria-label="일시정지"
        className="transition-opacity hover:opacity-90"
        onClick={onPause}
      >
        <img
          src={isPauseActive ? pauseOn : pauseOff}
          alt="pauseicon"
          className="w-[100px] h-[100px]"
        />
      </button>

      <button
        type="button"
        aria-label="정지"
        className="transition-opacity hover:opacity-90"
        onClick={onStop}
      >
        <img
          src={isStopActive ? stopOn : stopOff}
          alt="stopicon"
          className="w-[100px] h-[100px]"
        />
      </button>
    </div>
  );
}
