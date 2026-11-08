import React, { useEffect } from 'react';
import { Heart, X, Volume2, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audioEffects';

interface TeacherDayTributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayGreetingVoice?: () => void;
}

export const TeacherDayTributeModal: React.FC<TeacherDayTributeModalProps> = ({
  isOpen,
  onClose,
  onPlayGreetingVoice,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEffects.startCrowdApplause(6000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-rose-950/80 to-slate-950 border-2 border-rose-500/50 rounded-3xl p-6 md:p-8 shadow-2xl text-white overflow-hidden">
        {/* Floating petals */}
        <div className="absolute top-2 left-6 text-rose-400 opacity-60 text-lg">🌸</div>
        <div className="absolute top-8 right-12 text-amber-400 opacity-70 text-base">✨</div>
        <div className="absolute bottom-6 left-10 text-rose-300 opacity-60 text-xl">🌺</div>
        <div className="absolute bottom-10 right-8 text-yellow-300 opacity-80 text-lg">🌼</div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng bảng chúc mừng 20/11"
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-widest shadow">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            Tri Ân Ngày Nhà Giáo Việt Nam 20/11
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 pt-1">
            KÍNH CHÚC MỪNG QUÝ THẦY CÔ
          </h2>
          <div className="text-sm font-medium text-rose-200/90">
            Hội Giảng Môn Sinh Học 10 • Bộ Sách Kết Nối Tri Thức Với Cuộc Sống
          </div>
        </div>

        {/* Khang & Trọng standing respectfully */}
        <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-4 my-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-amber-300">Bạn Trọng</span>
            </div>
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-sky-300">Bạn Khang</span>
            </div>
          </div>
        </div>

        {/* Polished, Natural Greeting Text */}
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-red-950/60 border border-rose-500/30 text-center space-y-3">
          <p className="text-base md:text-lg font-serif italic text-amber-100 leading-relaxed">
            “Nhân ngày Nhà giáo Việt Nam 20/11, chúng em xin kính chúc tất cả quý thầy cô có mặt trong buổi hội giảng hôm nay luôn dồi dào sức khỏe, ngập tràn niềm vui, luôn hạnh phúc và gặt hái thật nhiều thành công rực rỡ trong sự nghiệp trồng người cao quý!”
          </p>
          <div className="text-xs font-semibold text-rose-300">
            — Hai bạn học sinh: Khang & Trọng (Lớp 10) kính chúc —
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => soundEffects.startCrowdApplause(6000)}
            aria-label="Vỗ tay rộn rã chúc mừng thầy cô"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition active:scale-95 cursor-pointer"
          >
            <span className="text-base">👏</span>
            <span>Vỗ tay chúc mừng</span>
          </button>

          {onPlayGreetingVoice && (
            <button
              onClick={onPlayGreetingVoice}
              aria-label="Nghe Khang và Trọng phát biểu lời chúc"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe Lời Chúc Đồng Thanh</span>
            </button>
          )}

          <button
            onClick={onClose}
            aria-label="Đóng bảng chúc mừng"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs md:text-sm transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
