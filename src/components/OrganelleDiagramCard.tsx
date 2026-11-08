import React from 'react';
import { Organelle } from '../data/cellData';

interface OrganelleDiagramCardProps {
  organelle?: Organelle;
}

export const OrganelleDiagramCard: React.FC<OrganelleDiagramCardProps> = ({ organelle }) => {
  if (!organelle) return null;

  return (
    <div className="absolute top-4 left-4 z-30 w-72 md:w-80 rounded-2xl bg-slate-900/90 border-2 border-sky-400/60 p-3.5 shadow-2xl backdrop-blur-md animate-fadeIn text-slate-100 pointer-events-none">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: organelle.color }} />
          <h4 className="text-sm font-bold text-white tracking-wide">
            {organelle.name}
          </h4>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-mono text-sky-300">
          {organelle.membraneType === 'double'
            ? 'Màng kép'
            : organelle.membraneType === 'single'
            ? 'Màng đơn'
            : 'Không màng'}
        </span>
      </div>

      {/* Illustrated Scientific Diagram Graphic */}
      <div className="w-full h-32 rounded-xl bg-slate-950/80 border border-slate-800 p-2 flex items-center justify-center relative overflow-hidden">
        {organelle.id === 'plasma_membrane' && (
          <svg viewBox="0 0 240 100" className="w-full h-full">
            {/* Phospholipid bilayer heads and tails */}
            <g fill="#38bdf8" stroke="#0284c7" strokeWidth="1">
              {[20, 45, 70, 95, 145, 170, 195, 220].map((x) => (
                <g key={x}>
                  <circle cx={x} cy="25" r="7" />
                  <line x1={x - 2} y1="32" x2={x - 2} y2="48" stroke="#38bdf8" strokeWidth="1.8" />
                  <line x1={x + 2} y1="32" x2={x + 2} y2="48" stroke="#38bdf8" strokeWidth="1.8" />

                  <circle cx={x} cy="75" r="7" />
                  <line x1={x - 2} y1="68" x2={x - 2} y2="52" stroke="#38bdf8" strokeWidth="1.8" />
                  <line x1={x + 2} y1="68" x2={x + 2} y2="52" stroke="#38bdf8" strokeWidth="1.8" />
                </g>
              ))}
            </g>
            {/* Transmembrane protein */}
            <rect x="110" y="16" width="24" height="68" rx="8" fill="#e11d48" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="122" y="54" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Protein</text>
            <text x="45" y="12" textAnchor="middle" fill="#93c5fd" fontSize="9">Đầu ưa nước</text>
            <text x="45" y="94" textAnchor="middle" fill="#93c5fd" fontSize="9">Đuôi kị nước</text>
          </svg>
        )}

        {organelle.id === 'cell_wall' && (
          <svg viewBox="0 0 240 100" className="w-full h-full">
            <rect x="20" y="20" width="200" height="60" rx="6" fill="#14532d" stroke="#22c55e" strokeWidth="3" />
            <line x1="20" y1="40" x2="220" y2="40" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="6 3" />
            <line x1="20" y1="60" x2="220" y2="60" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="6 3" />
            <text x="120" y="54" textAnchor="middle" fill="#dcfce7" fontSize="12" fontWeight="bold">Sợi Cellulose liên kết</text>
          </svg>
        )}

        {organelle.id === 'mitochondria' && (
          <svg viewBox="0 0 240 100" className="w-full h-full">
            {/* Outer membrane */}
            <ellipse cx="120" cy="50" rx="90" ry="40" fill="#7c2d12" stroke="#f97316" strokeWidth="2.5" />
            {/* Inner cristae folds */}
            <path
              d="M 45,50 Q 70,25 90,50 T 130,50 T 170,50 T 195,50"
              stroke="#fdba74"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="100" cy="35" r="4" fill="#fde047" />
            <circle cx="140" cy="62" r="3" fill="#fde047" />
            <text x="120" y="20" textAnchor="middle" fill="#fdba74" fontSize="10" fontWeight="bold">Mào cristae & Ma trận</text>
            <text x="120" y="88" textAnchor="middle" fill="#fed7aa" fontSize="9">Tổng hợp ATP (Hô hấp tế bào)</text>
          </svg>
        )}

        {organelle.id === 'chloroplast' && (
          <svg viewBox="0 0 240 100" className="w-full h-full">
            {/* Outer & inner membrane */}
            <ellipse cx="120" cy="50" rx="90" ry="40" fill="#14532d" stroke="#22c55e" strokeWidth="2.5" />
            {/* Thylakoids in Grana stacks */}
            {[65, 115, 165].map((gx) => (
              <g key={gx} fill="#16a34a" stroke="#86efac" strokeWidth="1">
                <rect x={gx - 12} y="32" width="24" height="6" rx="2" />
                <rect x={gx - 12} y="42" width="24" height="6" rx="2" />
                <rect x={gx - 12} y="52" width="24" height="6" rx="2" />
                <rect x={gx - 12} y="62" width="24" height="6" rx="2" />
              </g>
            ))}
            <text x="120" y="22" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="bold">Túi Thylakoid & Hạt Grana</text>
            <text x="120" y="88" textAnchor="middle" fill="#bbf7d0" fontSize="9">Chất nền Stroma quang hợp</text>
          </svg>
        )}

        {organelle.id === 'endoplasmic_reticulum' && (
          <svg viewBox="0 0 240 100" className="w-full h-full">
            <path d="M 30,30 Q 80,15 130,35 T 210,30" stroke="#ec4899" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 35,50 Q 85,35 135,55 T 205,50" stroke="#ec4899" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 40,70 Q 90,55 140,75 T 200,70" stroke="#ec4899" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Ribosome dots */}
            {[50, 75, 100, 125, 160, 185].map((rx) => (
              <circle key={rx} cx={rx} cy="45" r="2.5" fill="#fbcfe8" />
            ))}
            <text x="120" y="20" textAnchor="middle" fill="#f472b6" fontSize="10" fontWeight="bold">Lưới nội chất hạt & trơn</text>
          </svg>
        )}

        {organelle.id === 'golgi_apparatus' && (
          <svg viewBox="0 0 240 100" className="w-full h-full">
            <g stroke="#eab308" strokeWidth="4.5" fill="none" strokeLinecap="round">
              <path d="M 50,30 Q 120,20 190,30" />
              <path d="M 55,45 Q 120,35 185,45" />
              <path d="M 60,60 Q 120,50 180,60" />
              <path d="M 65,75 Q 120,65 175,75" />
            </g>
            <circle cx="205" cy="35" r="6" fill="#fde047" />
            <circle cx="200" cy="55" r="5" fill="#fde047" />
            <text x="120" y="18" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">Túi màng dẹp & Túi tiết</text>
          </svg>
        )}

        {organelle.id === 'ribosome' && (
          <svg viewBox="0 0 240 100" className="w-full h-full">
            {/* Large subunit */}
            <ellipse cx="120" cy="40" rx="35" ry="22" fill="#9333ea" stroke="#c084fc" strokeWidth="2" />
            {/* Small subunit */}
            <ellipse cx="120" cy="65" rx="30" ry="14" fill="#a855f7" stroke="#e9d5ff" strokeWidth="2" />
            {/* mRNA thread passing between */}
            <line x1="30" y1="52" x2="210" y2="52" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 3" />
            <text x="120" y="20" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontWeight="bold">Tiểu phần lớn & Tiểu phần nhỏ</text>
            <text x="120" y="90" textAnchor="middle" fill="#f5d0fe" fontSize="9">Giải mã mRNA tổng hợp polypeptide</text>
          </svg>
        )}

        {organelle.id === 'nucleus' && (
          <svg viewBox="0 0 240 100" className="w-full h-full">
            {/* Outer & inner nuclear membrane with pores */}
            <circle cx="120" cy="50" rx="42" fill="#be123c" stroke="#fb7185" strokeWidth="4" />
            {/* Chromatin threads inside */}
            <path d="M 95,45 Q 110,30 125,50 T 145,45" stroke="#fda4af" strokeWidth="2" fill="none" strokeDasharray="3 2" />
            <path d="M 100,60 Q 120,70 140,55" stroke="#fda4af" strokeWidth="2" fill="none" strokeDasharray="3 2" />
            {/* Nucleolus (nhân con) */}
            <circle cx="125" cy="45" r="14" fill="#4c0519" stroke="#fda4af" strokeWidth="1.5" />
            <text x="120" y="16" textAnchor="middle" fill="#fecdd3" fontSize="10" fontWeight="bold">Màng nhân kép & Lỗ nhân</text>
            <text x="120" y="90" textAnchor="middle" fill="#ffe4e6" fontSize="9">Chất nhiễm sắc (ADN) & Nhân con</text>
          </svg>
        )}

        {organelle.id !== 'plasma_membrane' &&
         organelle.id !== 'cell_wall' &&
         organelle.id !== 'mitochondria' &&
         organelle.id !== 'chloroplast' &&
         organelle.id !== 'endoplasmic_reticulum' &&
         organelle.id !== 'golgi_apparatus' &&
         organelle.id !== 'ribosome' &&
         organelle.id !== 'nucleus' && (
          <div className="text-center text-xs text-sky-200">
            <div className="font-bold">{organelle.name}</div>
            <div className="text-[11px] text-slate-400 mt-1">{organelle.location}</div>
          </div>
        )}
      </div>

      {/* Brief explanation */}
      <div className="mt-2 text-xs text-slate-300 leading-snug">
        <strong className="text-white">Chức năng: </strong>
        {organelle.functionDesc}
      </div>
    </div>
  );
};
