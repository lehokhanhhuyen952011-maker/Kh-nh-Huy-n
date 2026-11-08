import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Video,
  Loader2,
  CheckCircle2,
  Sparkles,
  X,
  RefreshCw,
  AlertCircle,
  Film,
  FileCheck,
} from 'lucide-react';
import { SCENES, DialogueLine } from '../data/cellData';

interface VideoExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VideoMetadata {
  exists: boolean;
  filename?: string;
  sizeBytes?: number;
  sizeFormatted?: string;
  format?: string;
  resolution?: string;
  duration?: string;
  videoCodec?: string;
  audioCodec?: string;
}

export const VideoExporterModal: React.FC<VideoExporterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [videoInfo, setVideoInfo] = useState<VideoMetadata | null>(null);
  const [isDownloadingDirect, setIsDownloadingDirect] = useState(false);
  const [isExportingCanvas, setIsExportingCanvas] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Fetch verified video metadata on open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    fetch('/api/video-info')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải thông tin video');
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          throw new Error('Endpoint trả về HTML thay vì dữ liệu JSON.');
        }
        return res.json();
      })
      .then((data: VideoMetadata) => {
        if (isMounted) setVideoInfo(data);
      })
      .catch((err) => {
        console.warn('Lỗi kiểm tra thông tin video:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  /**
   * Phương thức 1: Tải trực tiếp file MP4 chuẩn H.264/AAC đã được kiểm tra trên server
   * Kiểm tra nghiêm ngặt Content-Type và dung lượng để KHÔNG BAO GIỜ tải file HTML!
   */
  const handleDownloadDirectMP4 = async () => {
    setIsDownloadingDirect(true);
    setErrorMessage(null);
    setDownloadSuccess(null);
    setStatusMessage('Đang kết nối và tải file MP4 chất lượng cao từ máy chủ...');

    try {
      const response = await fetch('/api/download-mp4');
      if (!response.ok) {
        throw new Error(`Máy chủ phản hồi lỗi HTTP ${response.status}: ${response.statusText}`);
      }

      // 1. Kiểm tra Content-Type
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('Lỗi: Máy chủ trả về trang HTML thay vì file video MP4.');
      }
      if (!contentType.includes('video/mp4') && !contentType.includes('application/octet-stream')) {
        throw new Error(`Định dạng phản hồi không hợp lệ (${contentType}). Yêu cầu video/mp4.`);
      }

      // 2. Đọc Blob và kiểm tra dung lượng
      const blob = await response.blob();
      if (blob.size < 50000) {
        // Nếu file nhỏ hơn 50KB, kiểm tra nội dung text xem có phải là trang HTML hay không
        const textSample = await blob.slice(0, 500).text();
        if (textSample.includes('<!doctype') || textSample.includes('<html')) {
          throw new Error('Lỗi: Dữ liệu tải về chứa mã nguồn HTML của trang web, không phải video MP4.');
        }
      }

      // 3. Khởi tạo Blob hợp lệ và kích hoạt tải xuống
      const videoBlob = new Blob([blob], { type: 'video/mp4' });
      const downloadUrl = URL.createObjectURL(videoBlob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = 'Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }, 3000);

      setDownloadSuccess(
        `Đã tải file MP4 thành công! Dung lượng: ${(blob.size / (1024 * 1024)).toFixed(2)} MB • Chuẩn H.264 / AAC`
      );
      setStatusMessage('');
    } catch (err: any) {
      console.error('Download error:', err);
      setErrorMessage(err?.message || 'Không thể tải file video MP4.');
    } finally {
      setIsDownloadingDirect(false);
    }
  };

  /**
   * Phương thức 2: Dựng video từng khung hình từ Canvas & đóng gói thành MP4 thật qua ffmpeg
   */
  const handleStartCanvasExport = async () => {
    setIsExportingCanvas(true);
    setProgress(0);
    setErrorMessage(null);
    setDownloadSuccess(null);
    setStatusMessage('Đang khởi tạo khung hình độ phân giải 1280x720 (HD 16:9)...');

    const canvas = canvasRef.current;
    if (!canvas) {
      setErrorMessage('Không thể khởi tạo thẻ Canvas đồ họa.');
      setIsExportingCanvas(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setErrorMessage('Không thể tạo context 2D.');
      setIsExportingCanvas(false);
      return;
    }

    canvas.width = 1280;
    canvas.height = 720;

    chunksRef.current = [];
    const stream = canvas.captureStream(30);

    const mimeTypes = [
      'video/mp4;codecs=avc1',
      'video/mp4',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm'
    ];
    const selectedMime = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || 'video/webm';

    try {
      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 3500000,
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        try {
          const rawBlob = new Blob(chunksRef.current, { type: selectedMime });
          setStatusMessage('Đang chuyển đổi và đóng gói MP4 chuẩn H.264 / AAC...');

          // Nếu trình duyệt hỗ trợ MP4 nguyên bản:
          if (selectedMime.includes('mp4')) {
            const url = URL.createObjectURL(rawBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4';
            a.click();
            setDownloadSuccess(`Đã xuất video MP4 thành công! Dung lượng: ${(rawBlob.size / 1024).toFixed(0)} KB`);
          } else {
            // Chuyển đổi qua endpoint ffmpeg trên server để có file MP4 H.264 thực sự
            const convertRes = await fetch('/api/convert-to-mp4', {
              method: 'POST',
              headers: { 'Content-Type': selectedMime },
              body: rawBlob,
            });

            if (!convertRes.ok) {
              throw new Error('Lỗi chuyển đổi video sang định dạng MP4 trên server.');
            }

            const mp4Blob = await convertRes.blob();
            if (mp4Blob.type.includes('text/html')) {
              throw new Error('Server trả về dữ liệu HTML thay vì định dạng MP4.');
            }

            const url = URL.createObjectURL(new Blob([mp4Blob], { type: 'video/mp4' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 3000);

            setDownloadSuccess(
              `Đã kết xuất và mã hóa MP4 thành công! Dung lượng: ${(mp4Blob.size / (1024 * 1024)).toFixed(2)} MB (H.264 / AAC)`
            );
          }
        } catch (e: any) {
          console.error('Convert error:', e);
          setErrorMessage(e?.message || 'Lỗi khi đóng gói file MP4.');
        } finally {
          setIsExportingCanvas(false);
          setProgress(100);
          setStatusMessage('');
        }
      };

      recorder.start(100);

      // Thu thập toàn bộ lời thoại và hoạt cảnh
      const allDialogues: { sceneId: number; dialogue: DialogueLine }[] = [];
      SCENES.forEach(scene => {
        scene.dialogues.forEach(d => {
          allDialogues.push({ sceneId: scene.id, dialogue: d });
        });
      });

      const totalSteps = allDialogues.length;

      for (let i = 0; i < totalSteps; i++) {
        const item = allDialogues[i];
        setStatusMessage(`Đang vẽ: ${item.dialogue.speaker} - ${item.dialogue.text.slice(0, 45)}...`);
        setProgress(Math.round(((i + 1) / totalSteps) * 90));

        const frameCount = 30;
        for (let f = 0; f < frameCount; f++) {
          renderFrameToCanvas(ctx, canvas.width, canvas.height, item.sceneId, item.dialogue, f, frameCount);
          await new Promise(r => setTimeout(r, 25));
        }
      }

      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    } catch (err: any) {
      console.error('Recording error:', err);
      setErrorMessage(err?.message || 'Lỗi khi dựng video từ Canvas.');
      setIsExportingCanvas(false);
    }
  };

  const renderFrameToCanvas = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    sceneId: number,
    dialogue: DialogueLine,
    frame: number,
    totalFrames: number
  ) => {
    // 1. Background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#020617');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Top Header Banner
    ctx.fillStyle = '#090d16';
    ctx.fillRect(40, 20, w - 80, 45);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 20, w - 80, 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('BÀI 8: TẾ BÀO NHÂN THỰC - SINH HỌC 10 (KẾT NỐI TRI THỨC)', 65, 49);

    // 2. Cell Model (Center Stage)
    const cellCenterX = w / 2;
    const cellCenterY = h / 2 - 25;
    const pulse = Math.sin(frame * 0.2) * 4;

    // Cell wall (Thành tế bào)
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 8;
    ctx.strokeRect(cellCenterX - 180 - pulse, cellCenterY - 130 - pulse, 360 + pulse * 2, 260 + pulse * 2);

    // Plasma membrane (Màng sinh chất)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.strokeRect(cellCenterX - 165, cellCenterY - 115, 330, 230);

    // Cytoplasm
    ctx.fillStyle = 'rgba(30, 27, 75, 0.75)';
    ctx.fillRect(cellCenterX - 165, cellCenterY - 115, 330, 230);

    // Nucleus (Nhân tế bào)
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(cellCenterX, cellCenterY, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Nucleolus (Nhân con)
    ctx.fillStyle = '#881337';
    ctx.beginPath();
    ctx.arc(cellCenterX + 12, cellCenterY - 10, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NHÂN TẾ BÀO', cellCenterX, cellCenterY + 4);

    // Mitochondria (Ti thể)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.ellipse(cellCenterX - 105, cellCenterY + 45, 32, 18, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffedd5';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Ti thể', cellCenterX - 105, cellCenterY + 48);

    // Chloroplast (Lục lạp)
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(cellCenterX + 105, cellCenterY - 45, 34, 19, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dcfce7';
    ctx.fillText('Lục lạp', cellCenterX + 105, cellCenterY - 42);

    // Golgi
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cellCenterX + 85, cellCenterY + 55, 25, 0.2, 2.5);
    ctx.stroke();
    ctx.fillText('Bộ máy Golgi', cellCenterX + 95, cellCenterY + 65);

    // 3. Characters (Trọng on left, Khang on right)
    ctx.textAlign = 'left';

    // Trọng
    const trongX = 140;
    const trongY = 325;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(trongX - 25, trongY - 80, 50, 90);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(trongX - 25, trongY + 10, 22, 120);
    ctx.fillRect(trongX + 3, trongY + 10, 22, 120);
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(trongX, trongY - 110, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(trongX, trongY - 120, 25, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(trongX - 5, trongY - 82);
    ctx.lineTo(trongX + 5, trongY - 82);
    ctx.lineTo(trongX, trongY - 50);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Trọng', trongX - 18, trongY + 155);

    // Khang
    const khangX = w - 140;
    const khangY = 325;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(khangX - 25, khangY - 80, 50, 90);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(khangX - 25, khangY + 10, 22, 120);
    ctx.fillRect(khangX + 3, khangY + 10, 22, 120);
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(khangX, khangY - 110, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.arc(khangX, khangY - 120, 25, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(khangX - 18, khangY - 116, 14, 10);
    ctx.strokeRect(khangX + 4, khangY - 116, 14, 10);
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(khangX - 5, khangY - 82);
    ctx.lineTo(khangX + 5, khangY - 82);
    ctx.lineTo(khangX, khangY - 50);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Khang', khangX - 18, khangY + 155);

    // Laser pointer beam
    if (dialogue.khangPose === 'pointing') {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(khangX - 35, khangY - 60);
      ctx.lineTo(cellCenterX, cellCenterY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Subtitles Box
    ctx.fillStyle = 'rgba(9, 13, 22, 0.95)';
    ctx.fillRect(50, h - 115, w - 100, 90);
    ctx.strokeStyle = dialogue.speaker === 'Khang' ? '#38bdf8' : dialogue.speaker === 'Trọng' ? '#f59e0b' : '#fb7185';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(50, h - 115, w - 100, 90);

    ctx.fillStyle = dialogue.speaker === 'Khang' ? '#38bdf8' : dialogue.speaker === 'Trọng' ? '#f59e0b' : '#fb7185';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${dialogue.speaker}:`, 70, h - 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 15px sans-serif';
    const words = dialogue.text.split(' ');
    let line = '';
    let lineY = h - 60;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > w - 180 && n > 0) {
        ctx.fillText(line, 70, lineY);
        line = words[n] + ' ';
        lineY += 24;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 70, lineY);

    // 5. Celebration Banner (Scene 8)
    if (sceneId === 8) {
      ctx.fillStyle = 'rgba(225, 29, 72, 0.9)';
      ctx.fillRect(w / 2 - 320, 42, 640, 48);
      ctx.strokeStyle = '#fbcfe8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(w / 2 - 320, 42, 640, 48);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 19px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌸 KÍNH CHÚC QUÝ THẦY CÔ NGÀY 20/11 HẠNH PHÚC & THÀNH CÔNG 🌸', w / 2, 73);

      const confettiColors = ['#f43f5e', '#ec4899', '#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#fbbf24'];
      for (let c = 0; c < 32; c++) {
        const cx = (c * 41 + (frame * 5) % w) % w;
        const cy = 35 + ((c * 29 + frame * 4) % (h - 165));
        ctx.fillStyle = confettiColors[c % confettiColors.length];
        ctx.beginPath();
        if (c % 2 === 0) {
          ctx.arc(cx, cy, 4 + (c % 4), 0, Math.PI * 2);
        } else {
          ctx.rect(cx - 3, cy - 3, 7, 7);
        }
        ctx.fill();
      }
      ctx.textAlign = 'left';
    }
  };

  const isBusy = isDownloadingDirect || isExportingCanvas;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl text-white space-y-5">
        <button
          onClick={onClose}
          disabled={isBusy}
          aria-label="Đóng cửa sổ xuất video"
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title & Textbook Reference */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              Xuất Video MP4 Thật (H.264 / AAC)
            </span>
            <span className="text-xs text-slate-400 font-mono">1280x720 HD 16:9</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2.5 text-white">
            <Film className="w-6 h-6 text-emerald-400" />
            Tải Video MP4: Khang & Trọng (Bài 8 Tế Bào Nhân Thực)
          </h3>
          <p className="text-xs md:text-sm text-slate-300">
            Video chuẩn MP4 tương thích 100% với mọi thiết bị (máy tính, điện thoại, máy chiếu, QuickTime, VLC), bao gồm toàn bộ cuộc hội thoại, hoạt cảnh thu phóng tế bào và lời chúc 20/11.
          </p>
        </div>

        {/* Video Technical Specifications Card */}
        {videoInfo && videoInfo.exists && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400">Định dạng file:</span>{' '}
                <span className="font-semibold text-slate-200">{videoInfo.format}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400">Dung lượng:</span>{' '}
                <span className="font-bold text-emerald-400">{videoInfo.sizeFormatted}</span>
              </div>
              <div>
                <span className="text-slate-400">Độ phân giải:</span>{' '}
                <span className="font-mono text-sky-300">{videoInfo.resolution}</span>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Preview Canvas for Canvas Recording */}
        <div className="w-full flex justify-center">
          <canvas
            ref={canvasRef}
            className="w-full max-w-lg aspect-video rounded-xl border border-slate-800 bg-black shadow-lg"
          />
        </div>

        {/* Progress & Status Indicators */}
        {isBusy && (
          <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                {isDownloadingDirect ? 'Đang chuẩn bị và truyền tải file MP4...' : 'Đang kết xuất khung hình video...'}
              </span>
              {isExportingCanvas && <span className="font-mono font-bold text-emerald-400">{progress}%</span>}
            </div>
            {isExportingCanvas && (
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <div className="text-[11px] text-slate-400 truncate font-mono">
              {statusMessage}
            </div>
          </div>
        )}

        {/* Error notification (strictly prevents saving corrupt HTML) */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Download Success Banner */}
        {downloadSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* ACTION BUTTONS: Tải Trực Tiếp Bản Chuẩn MP4 (Primary) & Kết Xuất Canvas */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {/* PRIMARY DOWNLOAD: Direct MP4 Download */}
          <button
            onClick={handleDownloadDirectMP4}
            disabled={isBusy}
            aria-label="Tải Video MP4 chuẩn H.264"
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isDownloadingDirect ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang Tải File MP4...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tải Video MP4 Chuẩn ({videoInfo?.sizeFormatted || '1.06 MB'})</span>
              </>
            )}
          </button>

          {/* SECONDARY OPTION: Render & transcode canvas to MP4 */}
          <button
            onClick={handleStartCanvasExport}
            disabled={isBusy}
            aria-label="Dựng lại video từ Canvas"
            className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            title="Dựng lại video frame-by-frame từ canvas đồ họa"
          >
            {isExportingCanvas ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                <span>Đang Dựng ({progress}%)...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Dựng Lại Từ Canvas</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isBusy}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition disabled:opacity-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
