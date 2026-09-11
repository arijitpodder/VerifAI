/**
 * Dhurandhar: The Revenge — "Jaan Se Guzarte Hai" Viral Audio Engine
 * Features:
 * 1. Full viral song synthesizer:
 *    - Intro vocal formant swell ("Jaan Se Guzarte Hai...")
 *    - Heavy 808 sub-bass drop & rhythmic battle percussion
 *    - Blaring Dhurandhar heroic action brass hook
 *    - Seamless infinite looping
 * 2. HTML5 Audio File Support with auto-fallback to native synthesis
 * 3. Global reactive state for Play/Pause, Volume, and Spectrum Visualizer
 */

class DhurandharMusicEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private volumeNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private loopTimer: any = null;
  private customAudio: HTMLAudioElement | null = null;
  public currentVolume: number = 0.85;

  private listeners: Set<(playing: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Setup HTML5 audio fallback if user places dhurandhar.mp3 in public/audio/
      try {
        const base = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : './';
        const cleanBase = base.endsWith('/') ? base : `${base}/`;
        const audio = new Audio(`${cleanBase}audio/dhurandhar.mp3`);
        audio.loop = true;
        audio.volume = this.currentVolume;
        this.customAudio = audio;
      } catch {
        // audio element fallback
      }
    }
  }

  private initContext(): AudioContext | null {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.volumeNode = this.ctx.createGain();
          this.volumeNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);

          this.analyserNode = this.ctx.createAnalyser();
          this.analyserNode.fftSize = 64;

          this.volumeNode.connect(this.analyserNode);
          this.analyserNode.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public subscribe(listener: (playing: boolean) => void) {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isPlaying));
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyserNode;
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.volumeNode && this.ctx) {
      this.volumeNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.currentVolume;
    }
  }

  public startMusic() {
    if (this.isPlaying) return;

    // 1. Try playing custom audio file (dhurandhar.mp3) if loaded and valid
    if (this.customAudio && this.customAudio.src) {
      const ctx = this.initContext();
      if (ctx && this.volumeNode && !(this.customAudio as any)._connected) {
        try {
          const srcNode = ctx.createMediaElementSource(this.customAudio);
          srcNode.connect(this.volumeNode);
          (this.customAudio as any)._connected = true;
        } catch {
          // media element connection
        }
      }

      this.customAudio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {
          // If mp3 play blocked or errors, fallback to Web Audio API synthesis!
          this.startSynthesizedSong();
        });
      return;
    }

    // 2. Play full viral Dhurandhar: "Jaan Se Guzarte Hai" synthesis
    this.startSynthesizedSong();
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.customAudio) {
      try {
        this.customAudio.pause();
        this.customAudio.currentTime = 0;
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public toggleMusic() {
    if (this.isPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public isMusicPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Loads an external MP3 file provided by user
   */
  public loadCustomMp3(url: string) {
    if (this.customAudio) {
      this.customAudio.pause();
    }
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = this.currentVolume;
    this.customAudio = audio;
    if (this.isPlaying) {
      this.customAudio.play().catch(console.warn);
    }
  }

  /**
   * 🎬 Synthesizes the full viral section of "Jaan Se Guzarte Hai — Dhurandhar: The Revenge"
   * Includes:
   * - Haunting vocal hook: "Jaan Se Guzarte Hai..." (Formant filtered melody)
   * - Dramatic 808 sub-bass drops & battle percussion rolls
   * - Massive heroic brass anthem stabs
   * - Triumphant Indian national bugle cadence
   */
  private startSynthesizedSong() {
    const ctx = this.initContext();
    if (!ctx || !this.volumeNode) return;

    this.isPlaying = true;
    this.notify();

    const playCycle = () => {
      if (!this.isPlaying) return;
      const now = ctx.currentTime;
      const beatLen = 0.28; // ~107 BPM intense heroic tempo

      // ── SECTION 1: "Jaan Se Guzarte Hai..." Haunting Vocal / Synth Melody ──
      // Notes: D4 -> F4 -> E4 -> D4 -> C4 -> D4 -> A3 -> D4 (Emotional, intense minor)
      const vocalMelody = [
        { note: 293.66, time: 0.0, dur: 0.65, lyric: 'Jaan' },     // D4
        { note: 349.23, time: 0.7, dur: 0.55, lyric: 'Se' },       // F4
        { note: 329.63, time: 1.3, dur: 0.45, lyric: 'Gu-' },      // E4
        { note: 293.66, time: 1.8, dur: 0.85, lyric: '-zarte' },   // D4
        { note: 261.63, time: 2.7, dur: 0.40, lyric: 'Hai' },      // C4
        { note: 293.66, time: 3.15, dur: 0.75, lyric: '...' },     // D4
        { note: 220.00, time: 3.95, dur: 0.45, lyric: 'Dil' },     // A3
        { note: 293.66, time: 4.45, dur: 0.95, lyric: 'Ki Aag' }   // D4
      ];

      vocalMelody.forEach(({ note, time, dur }) => {
        const osc = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();
        const formantFilter = ctx.createBiquadFilter();
        const noteGain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note, now + time);

        // Vocal formant overtone
        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(note * 2, now + time);

        // Human vocal "Ah/Oh" formant filter (peaks around 850Hz & 1400Hz)
        formantFilter.type = 'bandpass';
        formantFilter.frequency.setValueAtTime(950, now + time);
        formantFilter.Q.setValueAtTime(4.5, now + time);

        noteGain.gain.setValueAtTime(0.001, now + time);
        noteGain.gain.linearRampToValueAtTime(0.35, now + time + 0.08);
        noteGain.gain.setValueAtTime(0.30, now + time + dur - 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(formantFilter);
        oscHarmonic.connect(formantFilter);
        formantFilter.connect(noteGain);
        noteGain.connect(this.volumeNode!);

        osc.start(now + time);
        oscHarmonic.start(now + time);
        osc.stop(now + time + dur);
        oscHarmonic.stop(now + time + dur);
      });

      // ── SECTION 2: Dhurandhar Viral Action Drop (Taiko Beats & 808 Sub-Bass Drops) ──
      const dropStart = 5.5;

      // Heavy 808 Sub-Bass Drops
      const bassDrops = [0, 1.2, 2.4, 3.6, 4.8, 6.0];
      bassDrops.forEach((bTime) => {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(145, now + dropStart + bTime);
        subOsc.frequency.exponentialRampToValueAtTime(38, now + dropStart + bTime + 0.45);

        subGain.gain.setValueAtTime(0.7, now + dropStart + bTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + dropStart + bTime + 0.6);

        subOsc.connect(subGain);
        subGain.connect(this.volumeNode!);
        subOsc.start(now + dropStart + bTime);
        subOsc.stop(now + dropStart + bTime + 0.65);
      });

      // High-Energy Battle Percussion & Dholak Roll
      for (let p = 0; p < 24; p++) {
        const pTime = dropStart + p * beatLen;
        const pOsc = ctx.createOscillator();
        const pGain = ctx.createGain();

        pOsc.type = p % 2 === 0 ? 'triangle' : 'square';
        pOsc.frequency.setValueAtTime(p % 4 === 0 ? 90 : 180, now + pTime);
        pOsc.frequency.exponentialRampToValueAtTime(45, now + pTime + 0.08);

        pGain.gain.setValueAtTime(p % 4 === 0 ? 0.45 : 0.2, now + pTime);
        pGain.gain.exponentialRampToValueAtTime(0.001, now + pTime + 0.09);

        pOsc.connect(pGain);
        pGain.connect(this.volumeNode!);
        pOsc.start(now + pTime);
        pOsc.stop(now + pTime + 0.1);
      }

      // ── SECTION 3: Heroic Dhurandhar Brass Hook (Massive Cinematic Stabs) ──
      // Notes: D4 -> F4 -> G4 -> A4 -> D5 -> C5 -> D5 -> F5 -> D5
      const brassHook = [
        { freq: 293.66, time: dropStart + 0.2, dur: 0.26 }, // D4
        { freq: 349.23, time: dropStart + 0.5, dur: 0.24 }, // F4
        { freq: 392.00, time: dropStart + 0.8, dur: 0.26 }, // G4
        { freq: 440.00, time: dropStart + 1.1, dur: 0.35 }, // A4
        { freq: 587.33, time: dropStart + 1.6, dur: 0.42 }, // D5 (Heroic high stab)
        { freq: 523.25, time: dropStart + 2.1, dur: 0.25 }, // C5
        { freq: 587.33, time: dropStart + 2.4, dur: 0.85 }, // D5
        { freq: 698.46, time: dropStart + 3.4, dur: 0.45 }, // F5 (Peak excitement)
        { freq: 587.33, time: dropStart + 3.9, dur: 1.10 }  // D5 (Grand resolve)
      ];

      brassHook.forEach(({ freq, time, dur }) => {
        const bOsc1 = ctx.createOscillator();
        const bOsc2 = ctx.createOscillator();
        const bFilter = ctx.createBiquadFilter();
        const bGain = ctx.createGain();

        bOsc1.type = 'sawtooth';
        bOsc1.frequency.setValueAtTime(freq, now + time);

        bOsc2.type = 'sawtooth';
        bOsc2.frequency.setValueAtTime(freq * 1.007, now + time); // cinematic stereo detune

        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(freq * 2.5, now + time);
        bFilter.frequency.linearRampToValueAtTime(freq * 5.0, now + time + 0.08);
        bFilter.frequency.exponentialRampToValueAtTime(freq * 2.0, now + time + dur);

        bGain.gain.setValueAtTime(0.001, now + time);
        bGain.gain.linearRampToValueAtTime(0.42, now + time + 0.04);
        bGain.gain.setValueAtTime(0.35, now + time + dur - 0.08);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        bOsc1.connect(bFilter);
        bOsc2.connect(bFilter);
        bFilter.connect(bGain);
        bGain.connect(this.volumeNode!);

        bOsc1.start(now + time);
        bOsc2.start(now + time);
        bOsc1.stop(now + time + dur);
        bOsc2.stop(now + time + dur);
      });

      // ── SECTION 4: Indian National Flag Salute Fanfare (Triumphant Tiranga Climax) ──
      const anthemStart = dropStart + 5.5;
      const bugleFanfare = [
        { freq: 392.00, time: anthemStart + 0.0, dur: 0.25 }, // G4
        { freq: 523.25, time: anthemStart + 0.3, dur: 0.28 }, // C5
        { freq: 659.25, time: anthemStart + 0.62, dur: 0.26 }, // E5
        { freq: 783.99, time: anthemStart + 0.92, dur: 0.55 }, // G5
        { freq: 659.25, time: anthemStart + 1.52, dur: 0.24 }, // E5
        { freq: 783.99, time: anthemStart + 1.80, dur: 0.28 }, // G5
        { freq: 1046.50, time: anthemStart + 2.12, dur: 0.95 } // C6 (Grand hold)
      ];

      bugleFanfare.forEach(({ freq, time, dur }) => {
        const aOsc = ctx.createOscillator();
        const aGain = ctx.createGain();
        const aFilter = ctx.createBiquadFilter();

        aOsc.type = 'sawtooth';
        aOsc.frequency.setValueAtTime(freq, now + time);

        aFilter.type = 'lowpass';
        aFilter.frequency.setValueAtTime(freq * 3.5, now + time);

        aGain.gain.setValueAtTime(0.001, now + time);
        aGain.gain.linearRampToValueAtTime(0.35, now + time + 0.04);
        aGain.gain.setValueAtTime(0.28, now + time + dur - 0.06);
        aGain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        aOsc.connect(aFilter);
        aFilter.connect(aGain);
        aGain.connect(this.volumeNode!);

        aOsc.start(now + time);
        aOsc.stop(now + time + dur);
      });

      // Total cycle duration is ~14.5 seconds before seamless loop
      const totalCycleMs = 14500;
      this.loopTimer = setTimeout(playCycle, totalCycleMs);
    };

    playCycle();
  }
}

export const dhurandharAudio = new DhurandharMusicEngine();
