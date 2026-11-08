import React from 'react';
import { DialogueLine } from '../data/cellData';

interface SubtitleBarProps {
  currentDialogue: DialogueLine;
  dialogueProgress: number; // 0 to 1
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
  sceneId?: number;
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({
  currentDialogue,
  dialogueProgress,
  voiceEnabled,
  onToggleVoice,
}) => {
  const isBoth = currentDialogue.speaker === 'Khang & Trọng';

  return (
    <div className="relative z-30 w-full max-w-3xl mx-auto px-4 pb-2 pointer-events-auto">
      {/* Sleek, non-intrusive cinematic subtitle box */}
      <div className="p-3 md:p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/60 shadow-xl transition-all">
        {/* Dialogue Line: Speaker Name + Spoken Text */}
        <div className="flex items-start gap-2.5">
          <span
            className={`font-bold text-xs md:text-sm shrink-0 px-2.5 py-0.5 rounded-lg uppercase tracking-wide ${
              currentDialogue.speaker === 'Khang'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : currentDialogue.speaker === 'Trọng'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {currentDialogue.speaker}:
          </span>

          <p className="text-xs md:text-sm leading-relaxed text-slate-100 font-medium flex-1">
            {currentDialogue.text}
          </p>
        </div>

        {/* Subtle synchronized speech progress bar */}
        <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full transition-all duration-100 ${
              currentDialogue.speaker === 'Khang'
                ? 'bg-sky-400'
                : currentDialogue.speaker === 'Trọng'
                ? 'bg-amber-400'
                : 'bg-rose-400'
            }`}
            style={{ width: `${Math.round(dialogueProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
