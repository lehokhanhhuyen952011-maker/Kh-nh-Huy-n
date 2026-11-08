/**
 * Web Audio API synthesizer for celebratory applause (tiếng vỗ tay) and festive fanfare
 * Zero external audio dependencies - 100% reliable in all browsers.
 */

class SoundEffectsController {
  private audioCtx: AudioContext | null = null;
  private isApplauseRunning = false;
  private applauseInterval: any = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx && AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch (e) {
      console.warn('AudioContext not available:', e);
      return null;
    }
  }

  /**
   * Play a single crisp clap sound using filtered white noise and envelope
   */
  public playSingleClap(volume = 0.35, pan = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Buffer of noise
      const bufferSize = ctx.sampleRate * 0.12; // 120ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter centered around 1000Hz - 2200Hz to mimic hand claps
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200 + Math.random() * 800;
      filter.Q.value = 2.0;

      // Gain envelope
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * (0.8 + Math.random() * 0.4), now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09 + Math.random() * 0.04);

      // Stereo panner if supported
      if (ctx.createStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.value = Math.max(-1, Math.min(1, pan));
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
      }

      noise.start(now);
      noise.stop(now + 0.15);
    } catch (e) {
      // Ignore audio glitches
    }
  }

  /**
   * Start crowd applause (tiếng vỗ tay rộn rã chúc mừng thầy cô)
   */
  public startCrowdApplause(durationMs = 8000) {
    if (this.isApplauseRunning) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isApplauseRunning = true;

    // Play initial fanfare chime
    this.playCelebrationChime();

    // Spawn multiple random claps per second to simulate a crowd of students & teachers
    let elapsed = 0;
    const intervalMs = 45; // Rapid bursts
    this.applauseInterval = setInterval(() => {
      elapsed += intervalMs;
      if (elapsed >= durationMs || !this.isApplauseRunning) {
        this.stopCrowdApplause();
        return;
      }

      // 2 to 4 claps in each tick
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        const pan = (Math.random() - 0.5) * 1.6;
        const vol = 0.25 + Math.random() * 0.2;
        this.playSingleClap(vol, pan);
      }
    }, intervalMs);
  }

  public stopCrowdApplause() {
    this.isApplauseRunning = false;
    if (this.applauseInterval) {
      clearInterval(this.applauseInterval);
      this.applauseInterval = null;
    }
  }

  /**
   * Play celebratory melody/chime (Đoạn nhạc chúc mừng tươi vui)
   */
  public playCelebrationChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Chords: C5, E5, G5, C6 (Do, Mi, Sol, Do)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch (e) {
      // Ignore
    }
  }
}

export const soundEffects = new SoundEffectsController();
