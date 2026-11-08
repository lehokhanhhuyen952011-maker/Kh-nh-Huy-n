import React from 'react';
import { Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { DialogueLine } from '../data/cellData';

interface CharacterAvatarsProps {
  currentDialogue: DialogueLine;
  isPlaying: boolean;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  sceneId: number;
}

export const CharacterAvatars: React.FC<CharacterAvatarsProps> = ({
  currentDialogue,
  isPlaying,
  voiceEnabled,
  onToggleVoice,
  sceneId,
}) => {
  const isKhangSpeaking = currentDialogue.speaker === 'Khang' || currentDialogue.speaker === 'Khang & Trọng';
  const isTrongSpeaking = currentDialogue.speaker === 'Trọng' || currentDialogue.speaker === 'Khang & Trọng';
  const isCelebrationScene = sceneId === 8;

  return (
    <div className="relative w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-3 md:gap-4 p-3 md:p-4 pointer-events-none">
      {/* TRỌNG */}
      <div
        className={`pointer-events-auto flex items-end gap-2 md:gap-3 transition-all duration-500 ${
          isTrongSpeaking ? 'scale-105 opacity-100' : 'scale-95 opacity-75'
        }`}
      >
        {/* Trong Avatar */}
        <div className="relative flex flex-col items-center">
          {/* Speaking indicator wave */}
          {isTrongSpeaking && isPlaying && (
            <div className="absolute -top-6 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] animate-bounce shadow-md">
              Đang nói...
            </div>
          )}

          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl p-1 transition-all duration-300 shadow-xl ${
              isTrongSpeaking
                ? 'ring-4 ring-amber-400 bg-gradient-to-tr from-amber-600 to-yellow-400 shadow-amber-500/30'
                : 'bg-slate-800 ring-2 ring-slate-700'
            }`}
          >
            {/* SVG Character Portrait for Trọng */}
            <svg viewBox="0 0 100 100" className="w-full h-full rounded-xl overflow-hidden bg-slate-900">
              {/* Background gradient */}
              <rect width="100" height="100" fill="#1e293b" />
              {/* Hair */}
              <circle cx="50" cy="40" r="28" fill="#334155" />
              <path d="M 22,40 Q 50,15 78,40 Q 65,22 50,22 Q 35,22 22,40 Z" fill="#0f172a" />
              {/* Face */}
              <ellipse cx="50" cy="50" rx="22" ry="24" fill="#fed7aa" />
              {/* Hair bangs */}
              <path d="M 32,32 Q 45,38 52,30 Q 60,38 68,34 Q 60,24 50,25 Q 38,24 32,32 Z" fill="#0f172a" />
              {/* Eyes */}
              <circle cx="42" cy="48" r="3.5" fill="#0f172a" />
              <circle cx="58" cy="48" r="3.5" fill="#0f172a" />
              <circle cx="43" cy="47" r="1" fill="#ffffff" />
              <circle cx="59" cy="47" r="1" fill="#ffffff" />
              {/* Eyebrows */}
              {sceneId === 1 ? (
                // Confused eyebrows
                <>
                  <path d="M 36,43 Q 42,40 46,44" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M 54,44 Q 58,40 64,43" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
                </>
              ) : (
                // Happy/attentive eyebrows
                <>
                  <path d="M 36,42 Q 42,40 47,42" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M 53,42 Q 58,40 64,42" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
                </>
              )}
              {/* Mouth */}
              {isTrongSpeaking && isPlaying ? (
                <ellipse cx="50" cy="62" rx="5" ry="4" fill="#e11d48" className="animate-pulse" />
              ) : (
                <path d="M 44,61 Q 50,66 56,61" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
              )}
              {/* White School Uniform Shirt */}
              <path d="M 26,82 L 40,70 L 60,70 L 74,82 L 78,100 L 22,100 Z" fill="#f8fafc" />
              <polygon points="40,70 50,80 60,70 50,68" fill="#e2e8f0" />
              {/* Red Tie / Scarf */}
              <polygon points="47,76 53,76 55,95 50,100 45,95" fill="#dc2626" />
            </svg>
          </div>

          <div className="mt-1.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold text-amber-300 shadow">
            <span>Bạn Trọng</span>
            {sceneId === 1 && <span className="text-[10px] text-slate-400">🤔 Băn khoăn</span>}
            {sceneId >= 6 && <span className="text-[10px] text-emerald-400">💡 Đã hiểu</span>}
          </div>
        </div>
      </div>

      {/* DIALOGUE SPEECH BUBBLE (CENTER) */}
      <div className="pointer-events-auto flex-1 max-w-2xl mx-auto my-1">
        <div
          className={`relative p-4 md:p-5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
            isCelebrationScene
              ? 'bg-gradient-to-r from-rose-950/90 via-red-950/90 to-amber-950/90 border-amber-500/40 text-amber-50'
              : currentDialogue.speaker === 'Khang'
              ? 'bg-slate-900/95 border-sky-500/40 text-slate-100'
              : currentDialogue.speaker === 'Trọng'
              ? 'bg-slate-900/95 border-amber-500/40 text-slate-100'
              : 'bg-slate-900/95 border-purple-500/40 text-slate-100'
          }`}
        >
          {/* Header row in bubble */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide uppercase ${
                  currentDialogue.speaker === 'Khang'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : currentDialogue.speaker === 'Trọng'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-gradient-to-r from-rose-500/30 to-amber-500/30 text-amber-200 border border-amber-500/40'
                }`}
              >
                {currentDialogue.speaker}
              </span>

              {isCelebrationScene && (
                <span className="flex items-center gap-1 text-xs font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  Tri ân thầy cô 20/11
                </span>
              )}

              {currentDialogue.camera?.focusName && (
                <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
                  📍 {currentDialogue.camera.focusName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onToggleVoice}
                aria-label={voiceEnabled ? 'Tắt giọng đọc lồng tiếng' : 'Bật giọng đọc lồng tiếng'}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                  voiceEnabled
                    ? 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
                title={voiceEnabled ? 'Giọng đọc AI / WebSpeech đang bật' : 'Bật đọc tự động'}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-sky-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[10px] hidden sm:inline">{voiceEnabled ? 'Lồng tiếng BẬT' : 'TẮT'}</span>
              </button>
            </div>
          </div>

          {/* Subtitle Dialogue Text */}
          <p className="text-sm md:text-base leading-relaxed tracking-normal font-medium text-slate-100 min-h-[48px]">
            {currentDialogue.text}
          </p>

          {/* Educational Note Callout */}
          {currentDialogue.highlightPartId && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-xs text-sky-300/90 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Điểm nhấn kiến thức: Mô hình đang thu phóng và chỉ vào <strong>{currentDialogue.camera.focusName}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* KHANG (BÊN PHẢI) */}
      <div
        className={`pointer-events-auto flex items-end gap-3 transition-all duration-500 ${
          isKhangSpeaking ? 'scale-105 opacity-100' : 'scale-95 opacity-75'
        }`}
      >
        <div className="relative flex flex-col items-center">
          {/* Speaking indicator wave */}
          {isKhangSpeaking && isPlaying && (
            <div className="absolute -top-6 px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 font-bold text-[10px] animate-bounce shadow-md">
              Đang giải thích...
            </div>
          )}

          <div
            className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl p-1 transition-all duration-300 shadow-xl ${
              isKhangSpeaking
                ? 'ring-4 ring-sky-400 bg-gradient-to-tr from-sky-600 to-cyan-400 shadow-sky-500/30'
                : 'bg-slate-800 ring-2 ring-slate-700'
            }`}
          >
            {/* SVG Character Portrait for Khang */}
            <svg viewBox="0 0 100 100" className="w-full h-full rounded-xl overflow-hidden bg-slate-900">
              {/* Background gradient */}
              <rect width="100" height="100" fill="#0f172a" />
              {/* Hair */}
              <circle cx="50" cy="40" r="28" fill="#1e293b" />
              <path d="M 24,38 Q 50,12 76,38 Q 62,20 50,20 Q 38,20 24,38 Z" fill="#020617" />
              {/* Face */}
              <ellipse cx="50" cy="50" rx="22" ry="24" fill="#fde68a" />
              {/* Glasses Frame (Khang đeo kính trí thức) */}
              <rect x="33" y="44" width="14" height="10" rx="3" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <rect x="53" y="44" width="14" height="10" rx="3" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <line x1="47" y1="48" x2="53" y2="48" stroke="#0284c7" strokeWidth="2.5" />
              {/* Eyes */}
              <circle cx="40" cy="49" r="3" fill="#0f172a" />
              <circle cx="60" cy="49" r="3" fill="#0f172a" />
              <circle cx="41" cy="48" r="1" fill="#ffffff" />
              <circle cx="61" cy="48" r="1" fill="#ffffff" />
              {/* Confident Smile */}
              {isKhangSpeaking && isPlaying ? (
                <ellipse cx="50" cy="62" rx="6" ry="4" fill="#0284c7" className="animate-pulse" />
              ) : (
                <path d="M 43,60 Q 50,66 57,60" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
              )}
              {/* White School Uniform Shirt */}
              <path d="M 26,82 L 40,70 L 60,70 L 74,82 L 78,100 L 22,100 Z" fill="#ffffff" />
              <polygon points="40,70 50,80 60,70 50,68" fill="#f1f5f9" />
              {/* Blue collar and school badge */}
              <circle cx="34" cy="85" r="4" fill="#0284c7" />
              <polygon points="48,74 52,74 54,92 50,96 46,92" fill="#2563eb" />
            </svg>
          </div>

          <div className="mt-1.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold text-sky-300 shadow">
            <span>Bạn Khang</span>
            <span className="text-[10px] text-slate-400">✨ Hướng dẫn</span>
          </div>
        </div>
      </div>
    </div>
  );
};
