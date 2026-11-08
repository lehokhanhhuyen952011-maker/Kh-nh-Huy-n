import React, { useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { soundEffects } from '../utils/audioEffects';

interface CelebrationOverlayProps {
  isVisible: boolean;
  onOpenModal: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isVisible,
  onOpenModal,
}) => {
  useEffect(() => {
    if (isVisible) {
      soundEffects.startCrowdApplause(8000);
    } else {
      soundEffects.stopCrowdApplause();
    }
    return () => {
      soundEffects.stopCrowdApplause();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  // Generate fixed array of celebratory floating petals/confetti for visual delight
  const confettiItems = [
    { id: 1, left: '8%', delay: '0s', duration: '3.2s', symbol: '🌸' },
    { id: 2, left: '18%', delay: '0.4s', duration: '3.8s', symbol: '✨' },
    { id: 3, left: '28%', delay: '0.8s', duration: '3.0s', symbol: '🌺' },
    { id: 4, left: '42%', delay: '0.2s', duration: '3.5s', symbol: '💐' },
    { id: 5, left: '55%', delay: '0.6s', duration: '3.1s', symbol: '🌸' },
    { id: 6, left: '68%', delay: '0.3s', duration: '3.7s', symbol: '🎉' },
    { id: 7, left: '78%', delay: '0.9s', duration: '3.3s', symbol: '✨' },
    { id: 8, left: '88%', delay: '0.1s', duration: '3.6s', symbol: '🌺' },
    { id: 9, left: '94%', delay: '0.7s', duration: '3.4s', symbol: '🌸' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden flex flex-col justify-between p-4 animate-fadeIn">
      {/* Falling Flower Petals & Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confettiItems.map((item) => (
          <div
            key={item.id}
            className="absolute -top-6 text-xl md:text-2xl animate-fall select-none"
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
              animationIterationCount: 'infinite',
            }}
          >
            {item.symbol}
          </div>
        ))}
      </div>

      {/* Top Congratulatory Ribbon Banner */}
      <div className="relative mx-auto w-full max-w-xl text-center pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-600/90 via-pink-600/90 to-amber-600/90 border border-rose-300/40 backdrop-blur-md shadow-2xl animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
          <span className="text-xs md:text-sm font-black text-white tracking-wide uppercase">
            Tri Ân Thầy Cô Giáo - 20/11
          </span>
          <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
        </div>
      </div>

      {/* Floating Interactive Clapping Button on Bottom Left */}
      <div className="relative pointer-events-auto flex items-center justify-center gap-2 mb-2">
        <button
          onClick={() => soundEffects.startCrowdApplause(6000)}
          aria-label="Vỗ tay chúc mừng hội giảng"
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-xl shadow-rose-500/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="text-base animate-pulse">👏</span>
          <span>Vỗ tay chúc mừng</span>
          <span className="text-xs opacity-80">(Âm thanh rộn rã)</span>
        </button>

        <button
          onClick={onOpenModal}
          aria-label="Mở thiệp chúc 20/11 toàn cảnh"
          className="px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-rose-500/40 text-rose-200 font-semibold text-xs flex items-center gap-1.5 shadow-xl transition"
        >
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Mở thiệp tri ân</span>
        </button>
      </div>
    </div>
  );
};
