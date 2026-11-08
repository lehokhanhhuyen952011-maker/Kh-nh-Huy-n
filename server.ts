import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));

  // API endpoint for Gemini Omni Flash Video Generation
  app.post('/api/generate-video', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY chưa được thiết lập trên server. Vui lòng kiểm tra cài đặt Secrets.'
        });
      }

      const { prompt, aspect_ratio = '16:9', duration = '10s', resolution = '720p' } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Nội dung prompt tạo video là bắt buộc.' });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Aspect ratio must be '16:9' or '9:16'
      const validAspect = (aspect_ratio === '9:16') ? '9:16' : '16:9';
      const validDuration = ['3s', '5s', '10s', '15s'].includes(duration) ? duration : '10s';

      console.log(`[OmniFlash Video] Starting generation: "${prompt.slice(0, 80)}..." (Ratio: ${validAspect}, Duration: ${validDuration})`);

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: prompt,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: validAspect,
          duration: validDuration,
          resolution: resolution || '720p',
        }
      }, { timeout: 300000 });

      const videoPart = interaction.output_video;
      if (!videoPart) {
        return res.status(500).json({
          error: 'Không nhận được kết quả video từ mô hình gemini-omni-1.2-flash.'
        });
      }

      let videoUrl = '';
      if (videoPart.data) {
        const mime = videoPart.mime_type || 'video/mp4';
        videoUrl = `data:${mime};base64,${videoPart.data}`;
      } else if (videoPart.uri) {
        videoUrl = videoPart.uri;
      }

      return res.json({
        success: true,
        videoUrl,
        aspect_ratio: validAspect,
        duration: validDuration,
        interactionId: interaction.id
      });
    } catch (err: any) {
      console.error('[OmniFlash Video Error]:', err);
      return res.status(500).json({
        error: err?.message || 'Lỗi khi tạo video bằng gemini-omni-1.2-flash.'
      });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Serve static files from public directory (including pre-rendered videos)
  app.use(express.static(path.resolve(__dirname, 'public')));

  // GET metadata info about the real MP4 video
  app.get('/api/video-info', (_req, res) => {
    const videoPath = path.resolve(__dirname, 'public', 'videos', 'Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4');
    if (!fs.existsSync(videoPath)) {
      return res.json({ exists: false });
    }
    const stat = fs.statSync(videoPath);
    return res.json({
      exists: true,
      filename: 'Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4',
      sizeBytes: stat.size,
      sizeFormatted: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
      format: 'MP4 (ISO Base Media / H.264 / AAC)',
      resolution: '1280x720 (HD 16:9)',
      duration: '50s',
      videoCodec: 'H.264 (High Profile, avc1)',
      audioCodec: 'AAC (44.1kHz stereo)',
    });
  });

  // GET Direct Download for real pre-rendered HD MP4 video
  app.get('/api/download-mp4', (_req, res) => {
    const videoPath = path.resolve(__dirname, 'public', 'videos', 'Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4');

    if (!fs.existsSync(videoPath)) {
      try {
        console.log('[Download MP4] File not found, building video on demand...');
        execSync('npx tsx scripts/build-video.ts', { stdio: 'inherit' });
      } catch (e: any) {
        console.error('[Download MP4 Error] Failed to generate video:', e);
        return res.status(500).json({
          error: 'Chưa thể tạo file MP4. Vui lòng thử lại sau.'
        });
      }
    }

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Video file không tồn tại.' });
    }

    const stat = fs.statSync(videoPath);

    // CRITICAL: Explicitly set binary video headers so browser NEVER saves HTML as MP4!
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', 'attachment; filename="Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4"');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const stream = fs.createReadStream(videoPath);
    stream.pipe(res);
  });

  // POST Convert recorded WebM canvas blob into true H.264 / AAC MP4
  app.post(
    '/api/convert-to-mp4',
    express.raw({ type: ['video/webm', 'application/octet-stream', 'video/*'], limit: '100mb' }),
    async (req, res) => {
      const inputBuffer = req.body;
      if (!inputBuffer || !Buffer.isBuffer(inputBuffer) || inputBuffer.length < 1000) {
        return res.status(400).json({ error: 'Dữ liệu video nguồn không hợp lệ hoặc quá nhỏ.' });
      }

      const tempId = Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const tempWebm = path.join('/tmp', `recording_${tempId}.webm`);
      const tempMp4 = path.join('/tmp', `converted_${tempId}.mp4`);

      try {
        fs.writeFileSync(tempWebm, inputBuffer);

        // Transcode WebM to pristine H.264 / AAC MP4 with faststart
        const cmd = `ffmpeg -i "${tempWebm}" -c:v libx264 -pix_fmt yuv420p -profile:v high -preset fast -crf 22 -c:a aac -b:a 128k -movflags +faststart -y "${tempMp4}"`;
        execSync(cmd, { stdio: 'pipe' });

        if (!fs.existsSync(tempMp4)) {
          throw new Error('Chuyển đổi ffmpeg không tạo được file output.');
        }

        const stat = fs.statSync(tempMp4);
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Disposition', 'attachment; filename="Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4"');

        const readStream = fs.createReadStream(tempMp4);
        readStream.pipe(res);

        readStream.on('close', () => {
          try {
            if (fs.existsSync(tempWebm)) fs.unlinkSync(tempWebm);
            if (fs.existsSync(tempMp4)) fs.unlinkSync(tempMp4);
          } catch (_) {}
        });
      } catch (err: any) {
        console.error('[Convert MP4 Error]:', err);
        try {
          if (fs.existsSync(tempWebm)) fs.unlinkSync(tempWebm);
          if (fs.existsSync(tempMp4)) fs.unlinkSync(tempMp4);
        } catch (_) {}
        return res.status(500).json({ error: 'Lỗi khi chuyển đổi định dạng MP4 bằng ffmpeg.' });
      }
    }
  );

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
