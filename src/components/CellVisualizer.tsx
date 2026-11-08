import React from 'react';
import { ORGANELLES, Organelle } from '../data/cellData';
import { CameraState } from '../utils/timeline';

interface CellVisualizerProps {
  camera: CameraState;
  activeHighlightId?: string;
  onSelectOrganelle?: (organelle: Organelle) => void;
  cellType?: 'plant' | 'animal' | 'general';
}

export const CellVisualizer: React.FC<CellVisualizerProps> = ({
  camera,
  activeHighlightId,
  onSelectOrganelle,
}) => {
  // Transform origin based on camera target
  const transformStyle: React.CSSProperties = {
    transform: `scale(${camera.scale}) translate(${50 - camera.x}%, ${50 - camera.y}%)`,
    transformOrigin: `${camera.x}% ${camera.y}%`,
    transition: 'transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  const isHighlighted = (id: string) => activeHighlightId === id;
  const activeOrganelle = ORGANELLES.find(o => o.id === activeHighlightId);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/70 select-none flex items-center justify-center">
      {/* Subtle Background Starfield / Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      {/* ZOOMED-IN DETAIL INSET CARD (Đưa hình ảnh & cấu tạo chi tiết ra cho người xem) */}
      {activeOrganelle && (
        <div className="absolute top-14 left-4 z-30 max-w-xs sm:max-w-sm p-3.5 rounded-2xl bg-slate-900/90 border border-sky-500/40 backdrop-blur-md shadow-2xl animate-fadeIn text-slate-100 pointer-events-auto">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-3 h-3 rounded-full animate-ping shrink-0"
              style={{ backgroundColor: activeOrganelle.color }}
            />
            <h4 className="text-sm font-bold text-sky-300">
              {activeOrganelle.calloutTitle || activeOrganelle.name}
            </h4>
          </div>

          <ul className="space-y-1 text-xs text-slate-200">
            {activeOrganelle.calloutDetails?.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-1.5 leading-snug">
                <span className="text-sky-400 font-bold shrink-0">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive 3D Vector Cell Canvas */}
      <div
        className="w-[740px] h-[520px] max-w-full max-h-full flex items-center justify-center relative transition-transform duration-800 ease-out"
        style={transformStyle}
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full filter drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="cytoplasmGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0f172a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
            </radialGradient>

            <linearGradient id="cellWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            <linearGradient id="membraneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <radialGradient id="nucleusGrad" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#e11d48" />
              <stop offset="90%" stopColor="#881337" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>

            <radialGradient id="nucleolusGrad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#4c0519" />
            </radialGradient>

            <linearGradient id="mitoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>

            <linearGradient id="chloroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>

            <filter id="glowEffect" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. THÀNH TẾ BÀO (CELL WALL Ở THỰC VẬT & NẤM) */}
          <g
            id="part-cell-wall"
            className={`cursor-pointer transition-all duration-300 ${
              isHighlighted('cell_wall') ? 'filter url(#glowEffect) stroke-emerald-300' : 'opacity-85'
            }`}
            onClick={() => onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'cell_wall')!)}
          >
            <path
              d="M 120,70 L 680,70 Q 750,70 760,140 L 760,460 Q 750,530 680,530 L 120,530 Q 50,530 40,460 L 40,140 Q 50,70 120,70 Z"
              fill="none"
              stroke="url(#cellWallGrad)"
              strokeWidth={isHighlighted('cell_wall') ? '16' : '10'}
              strokeDasharray="18 4"
            />
            {/* Cellulose microfibril strands */}
            <path
              d="M 130,80 L 670,80 Q 740,80 750,150 L 750,450 Q 740,520 670,520 L 130,520 Q 60,520 50,450 L 50,150 Q 60,80 130,80 Z"
              fill="none"
              stroke="#15803d"
              strokeWidth="3"
              opacity="0.6"
            />
            <text x="400" y="62" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="bold">
              Thành tế bào (Cellulose / Chitin)
            </text>
          </g>

          {/* 2. MÀNG SINH CHẤT (PLASMA MEMBRANE) */}
          <g
            id="part-plasma-membrane"
            className={`cursor-pointer transition-all duration-300 ${
              isHighlighted('plasma_membrane') ? 'filter url(#glowEffect)' : ''
            }`}
            onClick={() => onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'plasma_membrane')!)}
          >
            {/* Outer lipid layer */}
            <path
              d="M 140,95 L 660,95 Q 730,95 738,160 L 738,440 Q 730,505 660,505 L 140,505 Q 70,505 62,440 L 62,160 Q 70,95 140,95 Z"
              fill="url(#cytoplasmGrad)"
              stroke="url(#membraneGrad)"
              strokeWidth={isHighlighted('plasma_membrane') ? '9' : '5'}
            />
            {/* Inner lipid leaflet */}
            <path
              d="M 144,101 L 656,101 Q 724,101 732,164 L 732,436 Q 724,499 656,499 L 144,499 Q 76,499 68,436 L 68,164 Q 76,101 144,101 Z"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 3"
              opacity="0.8"
            />
            {/* Transmembrane protein channels */}
            <circle cx="280" cy="95" r="7" fill="#f43f5e" />
            <circle cx="520" cy="95" r="8" fill="#eab308" />
            <circle cx="738" cy="280" r="7" fill="#a855f7" />
            <circle cx="400" cy="505" r="8" fill="#ec4899" />
            <circle cx="62" cy="300" r="7" fill="#38bdf8" />
            <text x="210" y="112" fill="#7dd3fc" fontSize="11" fontWeight="bold">
              Màng sinh chất (Lớp kép phospholipid)
            </text>
          </g>

          {/* 3. KHUNG XƯƠNG TẾ BÀO (CYTOSKELETON) */}
          <g
            id="part-cytoskeleton"
            opacity={isHighlighted('cytoskeleton') ? '0.9' : '0.25'}
            className="pointer-events-none"
          >
            <path d="M 100,150 Q 250,220 400,180 T 700,200" stroke="#14b8a6" strokeWidth="2" fill="none" strokeDasharray="3 3" />
            <path d="M 150,450 Q 300,380 480,420 T 710,380" stroke="#14b8a6" strokeWidth="2" fill="none" strokeDasharray="3 3" />
            <path d="M 200,120 Q 220,300 240,480" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
            <path d="M 620,120 Q 580,300 600,480" stroke="#06b6d4" strokeWidth="1.5" fill="none" />
          </g>

          {/* 4. LỤC LẠP (CHLOROPLAST) */}
          <g
            id="part-chloroplast"
            className={`cursor-pointer transition-all duration-300 ${
              isHighlighted('chloroplast') ? 'filter url(#glowEffect)' : 'hover:opacity-95'
            }`}
            onClick={() => onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'chloroplast')!)}
          >
            <g transform="translate(560, 150) rotate(-15)">
              <ellipse cx="40" cy="25" rx="50" ry="30" fill="url(#chloroGrad)" stroke="#22c55e" strokeWidth={isHighlighted('chloroplast') ? '5' : '2'} />
              {/* Thylakoid Grana Stacks */}
              <g fill="#15803d" stroke="#86efac" strokeWidth="1">
                <rect x="15" y="14" width="10" height="22" rx="3" />
                <rect x="35" y="10" width="10" height="30" rx="3" />
                <rect x="55" y="14" width="10" height="22" rx="3" />
              </g>
              <text x="40" y="-10" textAnchor="middle" fill="#86efac" fontSize="12" fontWeight="bold">Lục lạp</text>
            </g>
          </g>

          {/* 5. TI THỂ (MITOCHONDRIA) */}
          <g
            id="part-mitochondria"
            className={`cursor-pointer transition-all duration-300 ${
              isHighlighted('mitochondria') ? 'filter url(#glowEffect)' : 'hover:opacity-95'
            }`}
            onClick={() => onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'mitochondria')!)}
          >
            {/* Mitochondrion Left Bottom */}
            <g transform="translate(160, 360) rotate(25)">
              <ellipse cx="45" cy="25" rx="50" ry="28" fill="url(#mitoGrad)" stroke="#f97316" strokeWidth={isHighlighted('mitochondria') ? '5' : '2'} />
              {/* Cristae folds */}
              <path
                d="M 15,25 Q 25,12 35,25 T 55,25 T 75,25"
                stroke="#fed7aa"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 20,18 L 30,32 M 40,16 L 50,34 M 60,18 L 70,32"
                stroke="#ffedd5"
                strokeWidth="2.5"
              />
              <text x="45" y="-8" textAnchor="middle" fill="#fdba74" fontSize="12" fontWeight="bold">Ti thể</text>
            </g>

            {/* Mitochondrion Top Left */}
            <g transform="translate(180, 160) rotate(-20)">
              <ellipse cx="35" cy="20" rx="40" ry="22" fill="url(#mitoGrad)" stroke="#ea580c" strokeWidth="1.5" />
              <path d="M 12,20 Q 22,10 32,20 T 52,20" stroke="#fed7aa" strokeWidth="3" fill="none" />
            </g>
          </g>

          {/* 6. LƯỚI NỘI CHẤT (ENDOPLASMIC RETICULUM) */}
          <g
            id="part-er"
            className={`cursor-pointer transition-all duration-300 ${
              isHighlighted('endoplasmic_reticulum') ? 'filter url(#glowEffect)' : 'hover:opacity-95'
            }`}
            onClick={() => onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'endoplasmic_reticulum')!)}
          >
            {/* Rough ER (Rough ER with ribosomes) */}
            <g stroke="#ec4899" strokeWidth={isHighlighted('endoplasmic_reticulum') ? '6' : '4'} fill="none" strokeLinecap="round">
              <path d="M 280,220 Q 260,260 280,320 T 290,380" />
              <path d="M 260,210 Q 235,260 255,330 T 270,400" />
              <path d="M 240,220 Q 215,270 230,340 T 250,390" />
            </g>
            {/* Attached ribosomes */}
            <g fill="#f472b6">
              <circle cx="260" cy="235" r="3" />
              <circle cx="250" cy="265" r="3" />
              <circle cx="265" cy="300" r="3" />
              <circle cx="240" cy="280" r="3" />
              <circle cx="255" cy="350" r="3" />
              <circle cx="270" cy="370" r="3" />
            </g>
            <text x="210" y="420" fill="#f472b6" fontSize="11" fontWeight="bold">Lưới nội chất</text>

            {/* Smooth ER (Smooth tubular) */}
            <g stroke="#f43f5e" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85">
              <path d="M 450,170 Q 480,140 510,160 T 540,145" />
              <path d="M 460,185 Q 490,155 520,175" />
            </g>
          </g>

          {/* 7. BỘ MÁY GOLGI */}
          <g
            id="part-golgi"
            className={`cursor-pointer transition-all duration-300 ${
              isHighlighted('golgi_apparatus') ? 'filter url(#glowEffect)' : 'hover:opacity-95'
            }`}
            onClick={() => onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'golgi_apparatus')!)}
          >
            <g transform="translate(520, 360) rotate(-10)">
              <g stroke="#eab308" strokeWidth={isHighlighted('golgi_apparatus') ? '6' : '4.5'} fill="none" strokeLinecap="round">
                <path d="M 10,10 Q 50,0 90,15" />
                <path d="M 12,24 Q 50,12 88,27" />
                <path d="M 15,38 Q 50,26 85,40" />
                <path d="M 20,52 Q 50,40 80,54" />
              </g>
              {/* Transport Vesicles */}
              <circle cx="102" cy="18" r="6" fill="#fde047" />
              <circle cx="98" cy="34" r="5" fill="#fde047" />
              <circle cx="95" cy="56" r="6" fill="#fde047" />
              <circle cx="4" cy="24" r="5" fill="#fde047" />
              <text x="50" y="-8" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="bold">Bộ máy Golgi</text>
            </g>
          </g>

          {/* 8. LYSOSOME & KHÔNG BÀO */}
          <g
            id="part-lysosome"
            className={`cursor-pointer transition-all duration-300 ${
              isHighlighted('lysosome') ? 'filter url(#glowEffect)' : 'hover:opacity-95'
            }`}
            onClick={() => onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'lysosome')!)}
          >
            {/* Lysosome vesicle */}
            <circle cx="210" cy="260" r="18" fill="#06b6d4" stroke="#22d3ee" strokeWidth={isHighlighted('lysosome') ? '4' : '2'} />
            <circle cx="206" cy="256" r="4" fill="#a5f3fc" />
            <circle cx="216" cy="264" r="3" fill="#0891b2" />
            <text x="210" y="292" textAnchor="middle" fill="#67e8f9" fontSize="11" fontWeight="bold">Lysosome</text>
            
            {/* Vacuole / Không bào */}
            <ellipse cx="600" cy="270" rx="35" ry="45" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
            <text x="600" y="275" textAnchor="middle" fill="#bae6fd" fontSize="11" fontWeight="bold">Không bào</text>
          </g>

          {/* 9. RIBOSOME */}
          <g
            id="part-ribosome"
            className={`cursor-pointer transition-all duration-300 ${
              isHighlighted('ribosome') ? 'filter url(#glowEffect)' : ''
            }`}
            onClick={() => onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'ribosome')!)}
          >
            <g fill="#c084fc">
              <circle cx="340" cy="170" r="4.5" />
              <circle cx="370" cy="150" r="4" />
              <circle cx="430" cy="130" r="4.5" />
              <circle cx="320" cy="380" r="4" />
              <circle cx="480" cy="420" r="4.5" />
              <circle cx="460" cy="450" r="4" />
              <circle cx="280" cy="440" r="4.5" />
              <circle cx="640" cy="180" r="4" />
              <circle cx="670" cy="340" r="4.5" />
            </g>
            <text x="340" y="145" fill="#d8b4fe" fontSize="11" fontWeight="bold">Ribosome</text>
          </g>

          {/* 10. NHÂN TẾ BÀO (NUCLEUS) */}
          <g
            id="part-nucleus"
            className={`cursor-pointer transition-all duration-300 ${
              isHighlighted('nucleus') ? 'filter url(#glowEffect)' : 'hover:opacity-95'
            }`}
            onClick={() => onSelectOrganelle?.(ORGANELLES.find(o => o.id === 'nucleus')!)}
          >
            {/* Outer Nuclear Double Membrane */}
            <ellipse
              cx="400"
              cy="295"
              rx="95"
              ry="85"
              fill="url(#nucleusGrad)"
              stroke="#fb7185"
              strokeWidth={isHighlighted('nucleus') ? '9' : '5'}
            />
            {/* Nuclear pores on membrane */}
            <g fill="#ffe4e6">
              <circle cx="310" cy="275" r="3.5" />
              <circle cx="330" cy="225" r="3.5" />
              <circle cx="390" cy="212" r="3.5" />
              <circle cx="450" cy="222" r="3.5" />
              <circle cx="490" cy="270" r="3.5" />
              <circle cx="480" cy="340" r="3.5" />
              <circle cx="420" cy="378" r="3.5" />
              <circle cx="345" cy="355" r="3.5" />
            </g>

            {/* Chromatin strands (Chất nhiễm sắc chứa ADN) */}
            <path
              d="M 345,280 Q 370,250 400,280 T 450,290 T 430,340"
              stroke="#f43f5e"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="4 2"
              opacity="0.8"
            />
            <path
              d="M 360,320 Q 385,340 420,320 T 450,260"
              stroke="#fda4af"
              strokeWidth="2"
              fill="none"
              strokeDasharray="3 2"
              opacity="0.8"
            />

            {/* Nucleolus / Nhân con */}
            <circle
              cx="415"
              cy="285"
              r="26"
              fill="url(#nucleolusGrad)"
              stroke="#fda4af"
              strokeWidth="2"
            />
            <circle cx="410" cy="280" r="8" fill="#ffe4e6" opacity="0.3" />

            {/* Nucleus Title */}
            <text x="400" y="298" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold" className="drop-shadow">
              NHÂN TẾ BÀO
            </text>
            <text x="400" y="315" textAnchor="middle" fill="#ffe4e6" fontSize="10">
              (Chất nhiễm sắc & Nhân con)
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
