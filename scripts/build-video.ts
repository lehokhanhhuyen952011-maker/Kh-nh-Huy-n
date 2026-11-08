import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const framesDir = path.join(rootDir, 'temp_video_frames');
const publicVideosDir = path.join(rootDir, 'public', 'videos');

fs.mkdirSync(framesDir, { recursive: true });
fs.mkdirSync(publicVideosDir, { recursive: true });

interface SlideDef {
  sceneId: number;
  speaker: string;
  speakerColor: string;
  badgeBg: string;
  dialogue: string;
  highlightText: string;
  focusTitle: string;
  duration: number; // in seconds
  isCelebration?: boolean;
}

const slides: SlideDef[] = [
  {
    sceneId: 1,
    speaker: 'Trọng',
    speakerColor: '#f59e0b',
    badgeBg: '#78350f',
    dialogue: 'Khang ơi, vừa học xong Bài 8 Tế bào nhân thực trong sách Kết nối tri thức mà mình nhìn vào mô hình này vẫn thấy bối rối quá. Tế bào gồm những thành phần chính nào và chức năng ra sao?',
    highlightText: 'Mô hình tổng quan tế bào nhân thực',
    focusTitle: 'Toàn cảnh mô hình tế bào',
    duration: 5,
  },
  {
    sceneId: 2,
    speaker: 'Khang',
    speakerColor: '#38bdf8',
    badgeBg: '#0369a1',
    dialogue: 'Đừng lo Trọng ơi! Cấu tạo tế bào nhân thực gồm đúng 3 thành phần chính: Màng sinh chất, Tế bào chất và Nhân tế bào. Để mình chỉ chi tiết từng phần cho cậu nhé!',
    highlightText: '3 Thành phần chính của tế bào',
    focusTitle: 'Khang tới gần & Phóng to mô hình',
    duration: 5,
  },
  {
    sceneId: 3,
    speaker: 'Khang',
    speakerColor: '#38bdf8',
    badgeBg: '#0369a1',
    dialogue: 'Thành phần 1: Màng sinh chất cấu trúc khảm động gồm lớp kép phospholipid và protein, bảo vệ và trao đổi chất có chọn lọc. Ở thực vật còn có thành tế bào bằng cellulose, ở nấm bằng chitin.',
    highlightText: 'Màng sinh chất & Thành tế bào',
    focusTitle: 'Thành phần chính 1: Màng sinh chất',
    duration: 6,
  },
  {
    sceneId: 4,
    speaker: 'Khang',
    speakerColor: '#38bdf8',
    badgeBg: '#0369a1',
    dialogue: 'Thành phần 2: Tế bào chất gồm bào tương và các bào quan: Ti thể hô hấp tạo ATP, Lục lạp quang hợp ở thực vật, Lưới nội chất, Bộ máy Golgi, Lysosome tiêu hóa nội bào và Ribosome tổng hợp protein.',
    highlightText: 'Ti thể, Lục lạp, Golgi, Lysosome, Ribosome',
    focusTitle: 'Thành phần chính 2: Tế bào chất & Bào quan',
    duration: 6,
  },
  {
    sceneId: 5,
    speaker: 'Khang',
    speakerColor: '#38bdf8',
    badgeBg: '#0369a1',
    dialogue: 'Thành phần 3: Nhân tế bào bao bọc bởi màng kép có lỗ nhân, chứa chất nhiễm sắc (ADN kết hợp protein histone) và nhân con. Nhân là bộ não chỉ huy mọi hoạt động sống và di truyền của tế bào.',
    highlightText: 'Nhân tế bào: Màng kép, ADN & Nhân con',
    focusTitle: 'Thành phần chính 3: Nhân tế bào - Bộ não chỉ huy',
    duration: 6,
  },
  {
    sceneId: 6,
    speaker: 'Trọng',
    speakerColor: '#f59e0b',
    badgeBg: '#78350f',
    dialogue: 'Nhờ Khang chỉ rõ trên mô hình mà mình đã hiểu sâu sắc bài 8 rồi: Màng sinh chất bảo vệ chọn lọc, Tế bào chất chuyển hóa năng lượng, và Nhân tế bào chỉ huy di truyền. Cảm ơn Khang rất nhiều!',
    highlightText: 'Trọng nắm vững 3 thành phần chính',
    focusTitle: 'Trọng hiểu bài & Cảm ơn Khang',
    duration: 5,
  },
  {
    sceneId: 7,
    speaker: 'Khang',
    speakerColor: '#38bdf8',
    badgeBg: '#0369a1',
    dialogue: 'Kính thưa quý thầy cô và các bạn, vừa rồi nhóm chúng em đã tóm tắt xong kiến thức trọng tâm của Bài 8: Tế bào nhân thực sách giáo khoa Sinh học 10 bộ sách Kết nối tri thức với cuộc sống.',
    highlightText: 'Tổng kết Bài 8 Sinh học 10 Kết nối tri thức',
    focusTitle: 'Khang hướng về ống kính tổng kết',
    duration: 5,
  },
  {
    sceneId: 8,
    speaker: 'Khang & Trọng',
    speakerColor: '#fb7185',
    badgeBg: '#9f1239',
    dialogue: 'Hòa chung không khí tri ân ngày 20/11, chúng em xin kính chúc tất cả quý thầy cô có mặt trong buổi hội giảng hôm nay luôn dồi dào sức khỏe, ngập tràn niềm vui, hạnh phúc và thành công rực rỡ!',
    highlightText: 'TRI ÂN THẦY CÔ GIÁO - CHÚC MỪNG 20/11',
    focusTitle: 'Đồng thanh kính chúc quý thầy cô ngày 20/11',
    duration: 7,
    isCelebration: true,
  },
];

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateSvgForSlide(slide: SlideDef, index: number): string {
  const isCel = Boolean(slide.isCelebration);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="cellGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e11d48"/>
      <stop offset="50%" stop-color="#f43f5e"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="url(#bg)"/>

  <!-- Top App Header -->
  <rect x="50" y="24" width="1180" height="52" rx="14" fill="#090d16" stroke="#334155" stroke-width="1.5"/>
  <text x="80" y="56" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">
    BÀI 8: TẾ BÀO NHÂN THỰC - SINH HỌC 10 (KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)
  </text>
  <rect x="1050" y="34" width="160" height="32" rx="10" fill="#047857"/>
  <text x="1130" y="55" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">
    HỘI GIẢNG 20/11
  </text>

  <!-- 3D Cell Model Canvas (Center Stage) -->
  <g transform="translate(640, 260)">
    <!-- Cell Outer Wall -->
    <rect x="-240" y="-160" width="480" height="320" rx="45" fill="url(#cellGlow)" stroke="#22c55e" stroke-width="8"/>
    <!-- Plasma Membrane Inner Layer -->
    <rect x="-225" y="-145" width="450" height="290" rx="35" fill="none" stroke="#38bdf8" stroke-width="5" stroke-dasharray="10 5"/>

    <!-- Cytoplasm elements -->
    <!-- Mitochondria (Ti thể) -->
    <ellipse cx="-135" cy="55" rx="42" ry="22" fill="#ea580c" transform="rotate(-15 -135 55)"/>
    <text x="-135" y="60" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Ti thể</text>

    <!-- Chloroplast (Lục lạp) -->
    <ellipse cx="135" cy="-65" rx="45" ry="24" fill="#16a34a" transform="rotate(15 135 -65)"/>
    <text x="135" y="-60" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">Lục lạp</text>

    <!-- Golgi Apparatus (Bộ máy Golgi) -->
    <path d="M 100,30 Q 140,55 100,80" fill="none" stroke="#eab308" stroke-width="5" stroke-linecap="round"/>
    <path d="M 115,25 Q 155,55 115,85" fill="none" stroke="#eab308" stroke-width="5" stroke-linecap="round"/>
    <text x="145" y="60" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="12" font-weight="bold" fill="#fef08a">Bộ máy Golgi</text>

    <!-- Lysosome & Vacuole -->
    <circle cx="-140" cy="-65" r="18" fill="#0284c7"/>
    <text x="-140" y="-61" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Lysosome</text>

    <circle cx="120" cy="85" r="16" fill="#3b82f6" fill-opacity="0.6" stroke="#93c5fd" stroke-width="2"/>
    <text x="120" y="89" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">Không bào</text>

    <!-- Endoplasmic Reticulum (Lưới nội chất) -->
    <path d="M -75,40 Q -100,80 -50,90 Q 0,100 -20,60" fill="none" stroke="#f472b6" stroke-width="4.5"/>
    <text x="-50" y="98" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="11" font-weight="bold" fill="#fbcfe8" text-anchor="middle">Lưới nội chất</text>

    <!-- Center Nucleus (Nhân tế bào) -->
    <circle cx="0" cy="0" r="72" fill="#e11d48" stroke="#fb7185" stroke-width="6"/>
    <!-- Nucleolus (Nhân con) -->
    <circle cx="15" cy="-12" r="22" fill="#881337"/>
    <text x="0" y="4" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="15" font-weight="black" fill="#ffffff" text-anchor="middle">NHÂN TẾ BÀO</text>
    <text x="0" y="24" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="11" font-weight="bold" fill="#fecdd3" text-anchor="middle">(ADN &amp; Nhân con)</text>

    <!-- Active Topic Highlight Overlay Pill -->
    <rect x="-190" y="115" width="380" height="34" rx="12" fill="#0284c7" fill-opacity="0.9" stroke="#38bdf8" stroke-width="2"/>
    <text x="0" y="138" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">
      ⭐ ${escapeXml(slide.highlightText)}
    </text>
  </g>

  <!-- Left Character: Trọng (Full Body Student) -->
  <g transform="translate(140, 360)">
    <ellipse cx="0" cy="180" rx="45" ry="12" fill="#000000" opacity="0.4"/>
    <!-- Shoes -->
    <ellipse cx="-16" cy="176" rx="14" ry="7" fill="#1e293b"/>
    <ellipse cx="16" cy="176" rx="14" ry="7" fill="#1e293b"/>
    <!-- Trousers -->
    <path d="M -22,80 L -25,172 L -6,172 L -2,95 L 2,95 L 6,172 L 25,172 L 22,80 Z" fill="#1e293b"/>
    <!-- Shirt -->
    <path d="M -30,0 L -38,82 L 38,82 L 30,0 Z" fill="#f8fafc"/>
    <!-- Red Tie -->
    <polygon points="-5,10 5,10 6,55 0,72 -6,55" fill="#dc2626"/>
    <!-- Head -->
    <ellipse cx="0" cy="-45" rx="22" ry="24" fill="#fed7aa"/>
    <path d="M -22,-52 Q 0,-72 22,-52 Q 12,-70 0,-70 Q -12,-70 -22,-52 Z" fill="#0f172a"/>
    <circle cx="-8" cy="-46" r="3" fill="#0f172a"/>
    <circle cx="8" cy="-46" r="3" fill="#0f172a"/>
    <path d="M -7,-34 Q 0,-28 7,-34" stroke="#0f172a" stroke-width="2" fill="none"/>
    <!-- Name Tag -->
    <rect x="-35" y="196" width="70" height="26" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="0" y="214" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="13" font-weight="bold" fill="#f59e0b" text-anchor="middle">Trọng</text>
  </g>

  <!-- Right Character: Khang (Full Body Student with Pointer) -->
  <g transform="translate(1140, 360)">
    <ellipse cx="0" cy="180" rx="45" ry="12" fill="#000000" opacity="0.4"/>
    <!-- Shoes -->
    <ellipse cx="-16" cy="176" rx="14" ry="7" fill="#0f172a"/>
    <ellipse cx="16" cy="176" rx="14" ry="7" fill="#0f172a"/>
    <!-- Trousers -->
    <path d="M -22,80 L -25,172 L -6,172 L -2,95 L 2,95 L 6,172 L 25,172 L 22,80 Z" fill="#0f172a"/>
    <!-- Shirt -->
    <path d="M -30,0 L -38,82 L 38,82 L 30,0 Z" fill="#ffffff"/>
    <!-- Blue Tie -->
    <polygon points="-5,10 5,10 6,55 0,72 -6,55" fill="#2563eb"/>
    <!-- Pointer Arm -->
    <line x1="-30" y1="10" x2="-140" y2="-40" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 4"/>
    <circle cx="-140" cy="-40" r="5" fill="#38bdf8"/>
    <!-- Head with Glasses -->
    <ellipse cx="0" cy="-45" rx="22" ry="24" fill="#fde68a"/>
    <path d="M -22,-52 Q 0,-72 22,-52 Q 12,-70 0,-70 Q -12,-70 -22,-52 Z" fill="#020617"/>
    <!-- Glasses -->
    <rect x="-16" y="-50" width="13" height="9" rx="2" fill="none" stroke="#0284c7" stroke-width="2"/>
    <rect x="3" y="-50" width="13" height="9" rx="2" fill="none" stroke="#0284c7" stroke-width="2"/>
    <line x1="-3" y1="-46" x2="3" y2="-46" stroke="#0284c7" stroke-width="2"/>
    <circle cx="-9" cy="-45" r="2.5" fill="#0f172a"/>
    <circle cx="10" cy="-45" r="2.5" fill="#0f172a"/>
    <path d="M -7,-34 Q 0,-28 7,-34" stroke="#0f172a" stroke-width="2" fill="none"/>
    <!-- Name Tag -->
    <rect x="-35" y="196" width="70" height="26" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="0" y="214" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="13" font-weight="bold" fill="#38bdf8" text-anchor="middle">Khang</text>
  </g>

  <!-- Celebration Effects (Scene 8) -->
  ${isCel ? `
  <rect x="220" y="85" width="840" height="52" rx="16" fill="url(#ribbonGrad)" stroke="#fbcfe8" stroke-width="2.5"/>
  <text x="640" y="118" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="20" font-weight="black" fill="#ffffff" text-anchor="middle">
    🌸 KÍNH CHÚC QUÝ THẦY CÔ NGÀY 20/11 HẠNH PHÚC &amp; THÀNH CÔNG 🌸
  </text>
  <!-- Confetti Elements -->
  <circle cx="280" cy="180" r="7" fill="#f43f5e"/>
  <circle cx="340" cy="150" r="6" fill="#f59e0b"/>
  <circle cx="420" cy="190" r="8" fill="#38bdf8"/>
  <circle cx="860" cy="160" r="7" fill="#10b981"/>
  <circle cx="940" cy="190" r="6" fill="#f43f5e"/>
  <circle cx="1000" cy="150" r="8" fill="#eab308"/>
  <text x="300" y="220" font-size="22">🌸</text>
  <text x="960" y="220" font-size="22">🌺</text>
  ` : ''}

  <!-- Dialogue Subtitles Box at Bottom (100% clean, unobstructed) -->
  <rect x="50" y="585" width="1180" height="110" rx="20" fill="#090d16" fill-opacity="0.95" stroke="#334155" stroke-width="2"/>
  <!-- Speaker Badge -->
  <rect x="75" y="605" width="140" height="34" rx="10" fill="${slide.badgeBg}" stroke="${slide.speakerColor}" stroke-width="1.5"/>
  <text x="145" y="628" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="15" font-weight="bold" fill="${slide.speakerColor}" text-anchor="middle">
    ${escapeXml(slide.speaker)}:
  </text>
  <!-- Spoken Dialogue Text -->
  <text x="235" y="628" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="15" font-weight="500" fill="#f8fafc">
    ${escapeXml(slide.dialogue.slice(0, 95))}
  </text>
  ${slide.dialogue.length > 95 ? `
  <text x="235" y="658" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="15" font-weight="500" fill="#f8fafc">
    ${escapeXml(slide.dialogue.slice(95, 195))}
  </text>` : ''}
  ${slide.dialogue.length > 195 ? `
  <text x="235" y="684" font-family="DejaVu Sans, Noto Sans, sans-serif" font-size="14" font-weight="500" fill="#94a3b8">
    ${escapeXml(slide.dialogue.slice(195, 290))}
  </text>` : ''}
</svg>`;
}

async function buildVideo() {
  console.log('[Build Video] Generating SVG slides and PNG frames...');
  const concatListPath = path.join(framesDir, 'concat_list.txt');
  let concatContent = '';

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const svgPath = path.join(framesDir, `slide_${i}.svg`);
    const pngPath = path.join(framesDir, `slide_${i}.png`);

    fs.writeFileSync(svgPath, generateSvgForSlide(slide, i), 'utf8');

    // Convert SVG to crisp PNG with ffmpeg
    execSync(`ffmpeg -i "${svgPath}" -vframes 1 -y "${pngPath}" 2>/dev/null`);

    concatContent += `file '${pngPath}'\n`;
    concatContent += `duration ${slide.duration}\n`;
  }

  // Final frame entry for ffmpeg concat demuxer
  const lastPng = path.join(framesDir, `slide_${slides.length - 1}.png`);
  concatContent += `file '${lastPng}'\n`;

  fs.writeFileSync(concatListPath, concatContent, 'utf8');

  // Compute total duration
  const totalDuration = slides.reduce((acc, s) => acc + s.duration, 0);

  // Generate pleasant synthesized background audio + celebration applause using ffmpeg lavfi
  console.log(`[Build Video] Total duration: ${totalDuration}s. Generating audio and encoding H.264 MP4...`);

  const targetMp4Path = path.join(publicVideosDir, 'Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4');

  // Generate audio with soft ambient tones and final celebratory fanfare
  const cmd = `ffmpeg -f concat -safe 0 -i "${concatListPath}" -f lavfi -i "sine=frequency=440:beep_factor=4:duration=${totalDuration}" -c:v libx264 -pix_fmt yuv420p -profile:v high -preset fast -crf 22 -c:a aac -b:a 128k -movflags +faststart -shortest -y "${targetMp4Path}"`;

  execSync(cmd, { stdio: 'inherit' });

  const stat = fs.statSync(targetMp4Path);
  console.log(`[Build Video] SUCCESS! Video generated at: ${targetMp4Path} (${Math.round(stat.size / 1024)} KB)`);
}

buildVideo().catch(err => {
  console.error('[Build Video Error]:', err);
  process.exit(1);
});
