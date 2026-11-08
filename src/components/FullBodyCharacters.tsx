import React from 'react';
import { DialogueLine } from '../data/cellData';

interface FullBodyCharactersProps {
  currentDialogue: DialogueLine;
  isPlaying: boolean;
  sceneId: number;
}

export const FullBodyCharacters: React.FC<FullBodyCharactersProps> = ({
  currentDialogue,
  isPlaying,
  sceneId,
}) => {
  const isKhangSpeaking = currentDialogue.speaker === 'Khang' || currentDialogue.speaker === 'Khang & Trọng';
  const isTrongSpeaking = currentDialogue.speaker === 'Trọng' || currentDialogue.speaker === 'Khang & Trọng';

  const { khangPose, trongPose } = currentDialogue;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-between px-3 sm:px-8 md:px-16 pb-14 z-20 overflow-hidden">
      {/* ==================== BẠN TRỌNG (BÊN TRÁI) ==================== */}
      <div
        className={`relative flex flex-col items-center transition-all duration-700 ease-out origin-bottom ${
          isTrongSpeaking ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.35)]' : 'scale-95 opacity-85'
        }`}
      >
        {/* Full Body SVG Trọng */}
        <svg
          viewBox="0 0 160 300"
          className="w-28 sm:w-36 md:w-44 h-auto max-h-[290px] transition-transform duration-500"
        >
          {/* Shadow on floor */}
          <ellipse cx="80" cy="285" rx="45" ry="10" fill="#000000" opacity="0.4" />

          {/* Shoes / Giày học sinh */}
          <ellipse cx="65" cy="280" rx="14" ry="7" fill="#1e293b" />
          <ellipse cx="95" cy="280" rx="14" ry="7" fill="#1e293b" />
          <rect x="58" y="278" width="14" height="4" rx="2" fill="#e2e8f0" />
          <rect x="88" y="278" width="14" height="4" rx="2" fill="#e2e8f0" />

          {/* Trousers / Quần tây */}
          <path d="M 60,195 L 56,275 L 74,275 L 78,215 L 82,215 L 86,275 L 104,275 L 100,195 Z" fill="#1e293b" />

          {/* Torso / Áo sơ mi trắng */}
          <path d="M 50,115 L 42,195 L 118,195 L 110,115 Z" fill="#f8fafc" />
          {/* Belt */}
          <rect x="42" y="192" width="76" height="7" fill="#0f172a" />
          <rect x="75" y="191" width="10" height="9" fill="#94a3b8" />

          {/* Red Tie / Cà vạt đỏ */}
          <polygon points="76,120 84,120 86,160 80,175 74,160" fill="#dc2626" />
          {/* Collar */}
          <polygon points="62,112 80,126 72,112" fill="#e2e8f0" />
          <polygon points="98,112 80,126 88,112" fill="#e2e8f0" />

          {/* GESTURES / ARMS FOR TRỌNG */}
          {trongPose === 'confused' && (
            <g>
              <path
                d="M 50,118 Q 30,130 35,90 T 58,55"
                stroke="#fed7aa"
                strokeWidth="11"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 50,118 Q 30,130 35,90"
                stroke="#f8fafc"
                strokeWidth="13"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M 110,118 Q 120,150 115,180" stroke="#f8fafc" strokeWidth="12" fill="none" strokeLinecap="round" />
              <circle cx="115" cy="184" r="6" fill="#fed7aa" />
            </g>
          )}

          {trongPose === 'listening' && (
            <g>
              <path d="M 50,118 Q 65,155 75,160" stroke="#f8fafc" strokeWidth="12" fill="none" strokeLinecap="round" />
              <path d="M 110,118 Q 95,155 85,160" stroke="#f8fafc" strokeWidth="12" fill="none" strokeLinecap="round" />
              <circle cx="80" cy="162" r="7" fill="#fed7aa" />
            </g>
          )}

          {(trongPose === 'excited' || trongPose === 'smiling') && (
            <g>
              <path d="M 50,118 Q 35,140 40,155" stroke="#f8fafc" strokeWidth="12" fill="none" strokeLinecap="round" />
              <circle cx="40" cy="158" r="6" fill="#fed7aa" />
              <path d="M 110,118 Q 125,140 120,150" stroke="#f8fafc" strokeWidth="12" fill="none" strokeLinecap="round" />
              <circle cx="120" cy="152" r="6" fill="#fed7aa" />
            </g>
          )}

          {trongPose === 'celebrating' && (
            <g>
              <path d="M 50,118 Q 65,145 76,150" stroke="#f8fafc" strokeWidth="12" fill="none" strokeLinecap="round" />
              <path d="M 110,118 Q 95,145 84,150" stroke="#f8fafc" strokeWidth="12" fill="none" strokeLinecap="round" />
              <ellipse cx="80" cy="150" rx="9" ry="7" fill="#fed7aa" />
            </g>
          )}

          {/* Neck */}
          <rect x="74" y="98" width="12" height="15" fill="#fed7aa" />

          {/* Head */}
          <g>
            <circle cx="80" cy="70" r="26" fill="#0f172a" />
            <ellipse cx="80" cy="74" rx="20" ry="22" fill="#fed7aa" />
            <path d="M 60,65 Q 75,50 82,62 Q 90,52 100,66 Q 92,45 80,45 Q 68,45 60,65 Z" fill="#0f172a" />
            <circle cx="59" cy="74" r="5" fill="#fed7aa" />
            <circle cx="101" cy="74" r="5" fill="#fed7aa" />

            {/* Eyes */}
            {trongPose === 'confused' ? (
              <>
                <circle cx="73" cy="72" r="3.5" fill="#0f172a" />
                <circle cx="87" cy="72" r="3.5" fill="#0f172a" />
                <path d="M 68,66 Q 73,63 78,67" stroke="#0f172a" strokeWidth="1.5" fill="none" />
                <path d="M 82,67 Q 87,63 92,66" stroke="#0f172a" strokeWidth="1.5" fill="none" />
              </>
            ) : (
              <>
                <circle cx="73" cy="72" r="3" fill="#0f172a" />
                <circle cx="87" cy="72" r="3" fill="#0f172a" />
                <circle cx="74" cy="71" r="1" fill="#ffffff" />
                <circle cx="88" cy="71" r="1" fill="#ffffff" />
                <path d="M 68,66 Q 73,64 78,66" stroke="#0f172a" strokeWidth="1.5" fill="none" />
                <path d="M 82,66 Q 87,64 92,66" stroke="#0f172a" strokeWidth="1.5" fill="none" />
              </>
            )}

            {/* Nose */}
            <path d="M 80,73 L 78,79 L 82,79" stroke="#fca5a5" strokeWidth="1.2" fill="none" />

            {/* Mouth */}
            {isTrongSpeaking && isPlaying ? (
              <ellipse cx="80" cy="85" rx="5" ry="4" fill="#e11d48" className="animate-pulse" />
            ) : trongPose === 'confused' ? (
              <ellipse cx="80" cy="84" rx="3" ry="2" fill="#0f172a" />
            ) : (
              <path d="M 74,83 Q 80,89 86,83" stroke="#0f172a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            )}
          </g>
        </svg>

        {/* Name tag */}
        <div className="mt-1 px-3 py-0.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-300 font-bold text-xs shadow-md">
          Trọng
        </div>
      </div>

      {/* ==================== BẠN KHANG (BÊN PHẢI) ==================== */}
      <div
        className={`relative flex flex-col items-center transition-all duration-700 ease-out origin-bottom ${
          isKhangSpeaking ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]' : 'scale-95 opacity-85'
        }`}
      >
        {/* Full Body SVG Khang */}
        <svg
          viewBox="0 0 160 300"
          className="w-28 sm:w-36 md:w-44 h-auto max-h-[290px] transition-transform duration-500"
        >
          {/* Shadow on floor */}
          <ellipse cx="80" cy="285" rx="45" ry="10" fill="#000000" opacity="0.4" />

          {/* Shoes */}
          <ellipse cx="65" cy="280" rx="14" ry="7" fill="#0f172a" />
          <ellipse cx="95" cy="280" rx="14" ry="7" fill="#0f172a" />
          <rect x="58" y="278" width="14" height="4" rx="2" fill="#64748b" />
          <rect x="88" y="278" width="14" height="4" rx="2" fill="#64748b" />

          {/* Trousers */}
          <path d="M 60,195 L 56,275 L 74,275 L 78,215 L 82,215 L 86,275 L 104,275 L 100,195 Z" fill="#0f172a" />

          {/* Torso */}
          <path d="M 50,115 L 42,195 L 118,195 L 110,115 Z" fill="#ffffff" />
          {/* Belt */}
          <rect x="42" y="192" width="76" height="7" fill="#020617" />
          <rect x="75" y="191" width="10" height="9" fill="#e2e8f0" />

          {/* Blue Tie */}
          <polygon points="76,120 84,120 86,160 80,175 74,160" fill="#2563eb" />
          {/* School Badge */}
          <circle cx="62" cy="135" r="4" fill="#0284c7" />

          {/* Collar */}
          <polygon points="62,112 80,126 72,112" fill="#f1f5f9" />
          <polygon points="98,112 80,126 88,112" fill="#f1f5f9" />

          {/* GESTURES / ARMS FOR KHANG */}
          {khangPose === 'pointing' && (
            <g>
              {/* Arm reaching out towards center cell model */}
              <path
                d="M 50,118 Q 15,110 -15,95"
                stroke="#ffffff"
                strokeWidth="13"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="-16" cy="94" r="6" fill="#fde68a" />
              <line x1="-16" y1="94" x2="-28" y2="90" stroke="#fde68a" strokeWidth="4.5" strokeLinecap="round" />
              {/* Laser pointer beam targeting the organelle */}
              <line x1="-28" y1="90" x2="-90" y2="80" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.9" />

              <path d="M 110,118 Q 120,150 115,180" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
              <circle cx="115" cy="184" r="6" fill="#fde68a" />
            </g>
          )}

          {khangPose === 'explaining' && (
            <g>
              <path d="M 50,118 Q 30,135 25,145" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
              <ellipse cx="22" cy="145" rx="6" ry="5" fill="#fde68a" />
              <path d="M 110,118 Q 130,135 135,145" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
              <ellipse cx="138" cy="145" rx="6" ry="5" fill="#fde68a" />
            </g>
          )}

          {khangPose === 'talking_to_camera' && (
            <g>
              <path d="M 50,118 Q 60,150 72,160" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
              <path d="M 110,118 Q 100,150 88,160" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
              <circle cx="80" cy="162" r="7" fill="#fde68a" />
            </g>
          )}

          {khangPose === 'celebrating' && (
            <g>
              <path d="M 50,118 Q 65,145 76,150" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
              <path d="M 110,118 Q 95,145 84,150" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
              <ellipse cx="80" cy="150" rx="9" ry="7" fill="#fde68a" />
            </g>
          )}

          {khangPose === 'idle' && (
            <g>
              <path d="M 50,118 Q 45,150 48,180" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
              <circle cx="48" cy="184" r="6" fill="#fde68a" />
              <path d="M 110,118 Q 115,150 112,180" stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round" />
              <circle cx="112" cy="184" r="6" fill="#fde68a" />
            </g>
          )}

          {/* Neck */}
          <rect x="74" y="98" width="12" height="15" fill="#fde68a" />

          {/* Head Khang (Glasses) */}
          <g>
            <circle cx="80" cy="70" r="26" fill="#020617" />
            <ellipse cx="80" cy="74" rx="20" ry="22" fill="#fde68a" />
            <path d="M 58,62 Q 74,46 86,52 Q 95,48 102,64 Q 92,44 80,44 Q 68,44 58,62 Z" fill="#020617" />
            <circle cx="59" cy="74" r="5" fill="#fde68a" />
            <circle cx="101" cy="74" r="5" fill="#fde68a" />

            {/* Glasses */}
            <rect x="65" y="68" width="12" height="9" rx="2" fill="none" stroke="#0284c7" strokeWidth="2.2" />
            <rect x="83" y="68" width="12" height="9" rx="2" fill="none" stroke="#0284c7" strokeWidth="2.2" />
            <line x1="77" y1="72" x2="83" y2="72" stroke="#0284c7" strokeWidth="2" />
            <line x1="59" y1="71" x2="65" y2="72" stroke="#0284c7" strokeWidth="1.8" />
            <line x1="95" y1="72" x2="101" y2="71" stroke="#0284c7" strokeWidth="1.8" />

            {/* Eyes */}
            <circle cx="71" cy="72" r="2.8" fill="#0f172a" />
            <circle cx="89" cy="72" r="2.8" fill="#0f172a" />
            <circle cx="72" cy="71" r="1" fill="#ffffff" />
            <circle cx="90" cy="71" r="1" fill="#ffffff" />

            {/* Eyebrows */}
            <path d="M 66,65 Q 71,62 76,65" stroke="#0f172a" strokeWidth="1.5" fill="none" />
            <path d="M 84,65 Q 89,62 94,65" stroke="#0f172a" strokeWidth="1.5" fill="none" />

            {/* Nose */}
            <path d="M 80,74 L 78,80 L 82,80" stroke="#fca5a5" strokeWidth="1.2" fill="none" />

            {/* Mouth */}
            {isKhangSpeaking && isPlaying ? (
              <ellipse cx="80" cy="86" rx="6" ry="4" fill="#0284c7" className="animate-pulse" />
            ) : (
              <path d="M 73,84 Q 80,90 87,84" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
          </g>
        </svg>

        {/* Name tag */}
        <div className="mt-1 px-3 py-0.5 rounded-xl bg-slate-900/90 border border-sky-500/40 text-sky-300 font-bold text-xs shadow-md">
          Khang
        </div>
      </div>
    </div>
  );
};
