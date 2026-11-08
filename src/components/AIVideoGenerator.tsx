import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Download,
  AlertCircle,
  Loader2,
  Tv,
  Smartphone,
  CheckCircle2,
  Clock,
  Layers,
  Info
} from 'lucide-react';
import { AI_VIDEO_PROMPT_PRESETS } from '../data/cellData';

export const AIVideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(AI_VIDEO_PROMPT_PRESETS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState<'5s' | '10s'>('10s');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [lastInteractionId, setLastInteractionId] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(AI_VIDEO_PROMPT_PRESETS[0].id);

  const handleSelectPreset = (preset: typeof AI_VIDEO_PROMPT_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setPrompt(preset.prompt);
    setAspectRatio(preset.aspect);
    setDuration(preset.duration);
    setError(null);
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      setError('Vui lòng nhập mô tả kịch bản video để tạo.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspect_ratio: aspectRatio,
          duration,
          resolution,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Tạo video không thành công.');
      }

      setGeneratedVideoUrl(data.videoUrl);
      setLastInteractionId(data.interactionId || null);
    } catch (err: any) {
      console.error('Video generation failed:', err);
      setError(
        err?.message ||
        'Không thể kết nối đến API sinh video. Hãy kiểm tra biến môi trường GEMINI_API_KEY trên server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadAIVideo = async () => {
    if (!generatedVideoUrl) return;

    try {
      if (generatedVideoUrl.startsWith('data:video/')) {
        const a = document.createElement('a');
        a.href = generatedVideoUrl;
        a.download = `khang_trong_bai8_tebaonhanthuc_${aspectRatio}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const res = await fetch(generatedVideoUrl);
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('Dữ liệu từ máy chủ trả về là mã nguồn HTML, không phải file video.');
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'video/mp4' }));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `khang_trong_bai8_tebaonhanthuc_${aspectRatio}.mp4`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 2000);
    } catch (e: any) {
      setError(e?.message || 'Lỗi khi tải video AI.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Gemini Omni Flash 1.2
              </span>
              <span className="text-xs text-slate-400 font-mono">Interactions API</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
              <Video className="w-6 h-6 text-indigo-400" />
              Công Cụ Tạo Video AI: Bài 8 Tế Bào Nhân Thực & Chúc Mừng 20/11
            </h2>
            <p className="text-sm text-slate-300">
              Sinh video thực tế bằng mô hình <strong>gemini-omni-1.2-flash</strong> với tỉ lệ khung hình chuẩn <strong>16:9</strong> (Ngang) hoặc <strong>9:16</strong> (Dọc).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2 text-right">
              <div className="text-[11px] text-slate-400">Model AI tương tác:</div>
              <div className="text-xs font-mono font-bold text-indigo-300">gemini-omni-1.2-flash</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CONTROLS & PROMPTS (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Quick Presets */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              Mẫu Kịch Bản Có Sẵn (Bài 8 & 20/11)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AI_VIDEO_PROMPT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  aria-label={`Chọn mẫu kịch bản ${preset.title}`}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    selectedPresetId === preset.id
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-200 line-clamp-2">
                    {preset.title}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {preset.aspect}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {preset.duration}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Aspect Ratio Selector (Mandatory 16:9 or 9:16) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Tỉ Lệ Khung Hình (Aspect Ratio)</span>
              <span className="text-[11px] font-normal text-indigo-300 lowercase">bắt buộc 16:9 hoặc 9:16</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                aria-label="Tỉ lệ khung hình 16:9 Màn ảnh rộng"
                className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 transition ${
                  aspectRatio === '16:9'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Tv className="w-5 h-5 text-indigo-400" />
                <div className="text-left">
                  <div className="text-xs font-semibold">16:9 (Màn ảnh rộng)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Hội trường, Máy tính, Bài giảng</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                aria-label="Tỉ lệ khung hình 9:16 Khung dọc điện thoại"
                className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 transition ${
                  aspectRatio === '9:16'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <div className="text-left">
                  <div className="text-xs font-semibold">9:16 (Khung dọc)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Điện thoại, Shorts, Reels</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Duration & Resolution */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Thời lượng (Duration)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as any)}
                aria-label="Thời lượng video AI"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="5s">5 Giây (Nhanh)</option>
                <option value="10s">10 Giây (Tiêu chuẩn)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Tv className="w-3.5 h-3.5 text-slate-400" /> Độ phân giải
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as any)}
                aria-label="Độ phân giải video"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="720p">720p HD (Tối ưu)</option>
                <option value="1080p">1080p Full HD</option>
              </select>
            </div>
          </div>

          {/* 4. Prompt Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Mô Tả Kịch Bản Video Cho AI (Prompt)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {prompt.length} ký tự
              </span>
            </div>
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Nhập mô tả kịch bản video cho AI"
              placeholder="Nhập mô tả chi tiết hình ảnh, chuyển động, nhân vật Khang và Trọng, mô hình tế bào nhân thực..."
              className="w-full p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition leading-relaxed"
            />
          </div>

          {/* 5. Generate Button */}
          <button
            type="button"
            onClick={handleGenerateVideo}
            disabled={isLoading}
            aria-label="Tạo video bằng Gemini Omni Flash"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Đang kết nối Gemini Omni Flash để dựng video... (Khoảng 30-60s)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-300" />
                <span>Tạo Video Bằng Gemini Omni Flash ({aspectRatio})</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Lỗi tạo video:</p>
                <p className="mt-0.5 text-slate-300">{error}</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Lưu ý: Bạn có thể tiếp tục trải nghiệm Video Tương Tác 3D đã được dàn dựng sẵn ở tab "Video & Tế bào 3D".
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PREVIEW & OUTPUT (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden shadow-2xl">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-indigo-400" /> Kết Quả Video AI
              </span>
              <span className="text-slate-500 font-mono">{aspectRatio}</span>
            </div>

            {/* Video container */}
            <div className="w-full flex-1 flex items-center justify-center py-4">
              {generatedVideoUrl ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <div
                    className={`rounded-xl overflow-hidden border border-indigo-500/50 shadow-2xl bg-black ${
                      aspectRatio === '9:16' ? 'w-[200px] h-[355px]' : 'w-full aspect-video'
                    }`}
                  >
                    <video
                      src={generatedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <button
                    onClick={handleDownloadAIVideo}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải video về máy (.mp4)</span>
                  </button>

                  {lastInteractionId && (
                    <div className="text-[10px] text-slate-500 font-mono text-center">
                      Interaction ID: {lastInteractionId}
                    </div>
                  )}
                </div>
              ) : isLoading ? (
                <div className="text-center p-6 space-y-3">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="text-xs font-semibold text-indigo-300">
                    Đang xử lý tạo frame và render video...
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                    Mô hình <strong>gemini-omni-1.2-flash</strong> đang tái hiện kịch bản Khang & Trọng và mô hình tế bào nhân thực.
                  </p>
                </div>
              ) : (
                <div className="text-center p-6 space-y-3 text-slate-500">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
                    <Video className="w-7 h-7" />
                  </div>
                  <div className="text-xs font-medium text-slate-300">
                    Chưa có video được sinh
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Hãy nhấn nút "Tạo Video Bằng Gemini Omni Flash" bên cạnh để bắt đầu tạo clip theo kịch bản bạn đã chọn.
                  </p>
                </div>
              )}
            </div>

            {/* Educational note footer */}
            <div className="w-full pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Video được tạo theo chuẩn Bài 8 Sinh học 10 Kết nối tri thức.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
