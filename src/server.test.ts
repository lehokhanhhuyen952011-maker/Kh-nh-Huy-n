import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Server Video Download API & File Verification', () => {
  it('GET /api/video-info returns valid MP4 metadata', async () => {
    const res = await fetch('http://localhost:3000/api/video-info');
    assert.strictEqual(res.status, 200);
    const contentType = res.headers.get('content-type') || '';
    assert.ok(contentType.includes('application/json'));

    const data = await res.json();
    assert.strictEqual(data.exists, true);
    assert.strictEqual(data.filename, 'Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4');
    assert.ok(data.sizeBytes > 1000000, 'Video size must be greater than 1MB');
    assert.strictEqual(data.resolution, '1280x720 (HD 16:9)');
    assert.ok(data.videoCodec.includes('H.264'));
    assert.ok(data.audioCodec.includes('AAC'));
  });

  it('GET /api/download-mp4 returns genuine binary video/mp4 stream, NEVER HTML', async () => {
    const res = await fetch('http://localhost:3000/api/download-mp4');
    assert.strictEqual(res.status, 200);

    const contentType = res.headers.get('content-type') || '';
    assert.strictEqual(contentType, 'video/mp4', 'Content-Type must be video/mp4');
    assert.ok(!contentType.includes('text/html'), 'Must NEVER return text/html');

    const disposition = res.headers.get('content-disposition') || '';
    assert.ok(disposition.includes('Khang_Trong_Bai8_TeBaoNhanThuc_2011.mp4'));

    const contentLength = Number(res.headers.get('content-length'));
    assert.ok(contentLength > 1000000, 'Content-Length must be > 1MB');

    // Inspect first 32 bytes to ensure true MP4 file signature (ftyp)
    const arrayBuffer = await res.arrayBuffer();
    assert.strictEqual(arrayBuffer.byteLength, contentLength);

    const headerBytes = new Uint8Array(arrayBuffer.slice(4, 8));
    const headerStr = String.fromCharCode(...headerBytes);
    assert.strictEqual(headerStr, 'ftyp', 'Must have ftyp MP4 box signature');
  });
});
