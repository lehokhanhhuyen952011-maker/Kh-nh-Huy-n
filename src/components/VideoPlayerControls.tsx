import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
  Sparkles,
  Download,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Scene } from '../data/cellData';
import { formatTime, calculateProgress } from '../utils/timeline';

interface VideoPlayerControlsProps {
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onRestart: () => void;
  onNextScene: () => void;
  onPrevScene: () => void;
  scenes: Scene[];
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onOpenTeacherDayModal: () => void;
  onOpenExportModal: () => void;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  currentTime,
  totalDuration,
  isPlaying,
  onTogglePlay,
  onSeek,
  onRestart,
  onNextScene,
  onPrevScene,
  scenes,
  currentSceneIndex,
  onSelectScene,
  playbackSpeed,
  onChangeSpeed,
  isFullscreen,
  onToggleFullscreen,
  voiceEnabled,
  onToggleVoice,
  onOpenTeacherDayModal,
  onOpenExportModal,
}) => {
  const progressPercent = calculateProgress(currentTime, totalDuration);

  // Compute accumulated scene starts for chapter ticks
  let accumulated = 0;
  const sceneTicks = scenes.map((scene, idx) => {
    const start = accumulated;
    const duration = scene.dialogues.reduce((s, d) => s + d.duration, 0);
    accumulated += duration;
    return {
      index: idx,
      title: scene.title,
      start,
      percent: (start / totalDuration) * 100,
    };
  });

  return (
    <div className="w-full bg-slate-900/95 border-t border-slate-800 p-3 md:px-6 md:py-3.5 backdrop-blur-xl flex flex-col gap-2.5 select-none shadow-2xl z-30">
      {/* 1. TIMELINE SCRUBBER WITH SCENE TICKS */}
      <div className="relative group w-full flex items-center">
        <input
          type="range"
          min={0}
          max={totalDuration}
          step={0.1}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          aria-label="Thanh trượt tiến trình video"
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 hover:h-2.5 transition-all z-10"
        />

        {/* Scene Chapter Markers along the track */}
        <div className="absolute inset-x-0 h-2 pointer-events-none flex items-center">
          {sceneTicks.map((tick) => (
            <div
              key={tick.index}
              style={{ left: `${tick.percent}%` }}
              className={`absolute w-1 h-3 -top-0.5 rounded-sm transition-colors ${
                currentSceneIndex === tick.index ? 'bg-sky-400 ring-2 ring-sky-300' : 'bg-slate-600'
              }`}
              title={tick.title}
            />
          ))}
        </div>
      </div>

      {/* 2. MAIN CONTROLS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Playback Actions */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          <button
            onClick={onRestart}
            aria-label="Phát lại từ đầu"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            title="Phát lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPrevScene}
            aria-label="Cảnh trước đó"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            title="Cảnh trước"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Tạm dừng video' : 'Phát video cuộc trò chuyện'}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/25 transition active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span className="text-xs md:text-sm">Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span className="text-xs md:text-sm">Phát Video</span>
              </>
            )}
          </button>

          <button
            onClick={onNextScene}
            aria-label="Cảnh tiếp theo"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            title="Cảnh tiếp theo"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Time Display */}
          <div className="text-xs font-mono text-slate-400 pl-2">
            <span className="text-slate-200 font-semibold">{formatTime(currentTime)}</span>
            <span className="mx-1">/</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Center: Topic Name */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
          <span className="text-slate-400">Nội dung:</span>
          <span className="font-semibold text-sky-300 truncate max-w-xs">
            {scenes[currentSceneIndex]?.title}
          </span>
        </div>

        {/* Right: Tools, Export & Settings */}
        <div className="flex items-center gap-2 ml-auto">
          {/* EXPORT MP4 BUTTON (PRIMARY USER ACTION) */}
          <button
            onClick={onOpenExportModal}
            aria-label="Tải file video MP4 HD về máy"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition active:scale-95"
            title="Tải video MP4 HD"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Video MP4 HD</span>
          </button>

          {/* 20/11 Celebration Button */}
          <button
            onClick={onOpenTeacherDayModal}
            aria-label="Mở thiệp chúc mừng 20/11 hội giảng"
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Chúc mừng 20/11</span>
          </button>

          {/* Voice Mute/Unmute Toggle */}
          <button
            onClick={onToggleVoice}
            aria-label={voiceEnabled ? 'Tắt âm thanh giọng đọc' : 'Bật âm thanh giọng đọc'}
            className={`p-2 rounded-xl transition ${
              voiceEnabled
                ? 'text-sky-300 hover:text-sky-200 hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={voiceEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-0.5 border border-slate-700">
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSpeed(speed)}
                aria-label={`Tốc độ phát ${speed}x`}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition ${
                  playbackSpeed === speed
                    ? 'bg-sky-500 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Thu nhỏ màn hình' : 'Mở toàn màn hình'}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3. TOPIC QUICK NAVIGATOR BUTTONS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {scenes.map((scene, idx) => {
          const isActive = currentSceneIndex === idx;
          return (
            <button
              key={scene.id}
              onClick={() => onSelectScene(idx)}
              aria-label={`Chuyển đến phần ${scene.title}`}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-300 border border-transparent'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-sky-400' : 'bg-slate-600'}`} />
              <span>{scene.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
