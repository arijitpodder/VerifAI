/**
 * Zero-dependency Web Audio API Sound Effects Synthesizer
 * Generates futuristic sci-fi UI and verification audio natively in the browser.
 */

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    // Automatically unlock audio on first user gesture
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initContext();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
    }
  }

  private initContext(): AudioContext | null {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
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

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    return this.initContext();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playClick();
    }
    return this.isMuted;
  }

  /**
   * Subtle UI click sound
   */
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Futuristic laser radar scan frequency sweep
   */
  public playScanLaser() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(700, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(3400, ctx.currentTime + 0.4);

      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Voice recognition activation chime
   */
  public playVoiceChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [
        { freq: 659.25, time: 0 },    // E5
        { freq: 880.00, time: 0.09 },  // A5
        { freq: 1318.51, time: 0.18 }  // E6
      ].forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        gain.gain.setValueAtTime(0.25, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + 0.25);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Countdown beep for webcam capture
   */
  public playBeep(isFinal: boolean = false) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isFinal ? 1800 : 950, ctx.currentTime);

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.25 : 0.12));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + (isFinal ? 0.28 : 0.14));
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Mechanical camera shutter snapshot sound
   */
  public playCameraShutter() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Click 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(1000, now);
      osc1.frequency.exponentialRampToValueAtTime(150, now + 0.05);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.05);

      // Click 2 (shutter release)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1500, now + 0.07);
      osc2.frequency.exponentialRampToValueAtTime(250, now + 0.14);
      gain2.gain.setValueAtTime(0.35, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.16);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Triumphant harmonic victory chord for verified identity
   */
  public playSuccessFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Major Chord: C5, E5, G5, C6 with warm synth feel
      const chord = [
        { freq: 523.25, delay: 0 },     // C5
        { freq: 659.25, delay: 0.07 },  // E5
        { freq: 783.99, delay: 0.14 },  // G5
        { freq: 1046.50, delay: 0.21 }  // C6
      ];

      chord.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.delay);

        gain.gain.setValueAtTime(0.28, now + note.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + note.delay);
        osc.stop(now + note.delay + 0.9);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Warning / mismatch tone
   */
  public playMismatchAlert() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.setValueAtTime(200, now + 0.16);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Deep futuristic quantum cyber boot sequence: sub-bass pulse, rising frequency sweep, and crystalline chime
   */
  public playCyberBoot() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Sub-bass pulse (60Hz -> 180Hz)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, now);
      subOsc.frequency.exponentialRampToValueAtTime(140, now + 0.8);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.25);

      // 2. Rising quantum warp filter
      const warpOsc = ctx.createOscillator();
      const warpGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      warpOsc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2800, now + 1.0);
      filter.Q.setValueAtTime(4.0, now);
      warpOsc.frequency.setValueAtTime(110, now);
      warpOsc.frequency.exponentialRampToValueAtTime(880, now + 1.0);
      warpGain.gain.setValueAtTime(0.01, now);
      warpGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
      warpGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      warpOsc.connect(filter);
      filter.connect(warpGain);
      warpGain.connect(ctx.destination);
      warpOsc.start(now);
      warpOsc.stop(now + 1.15);

      // 3. Crystalline futuristic resolution chords
      [
        { freq: 880, delay: 0.75 },   // A5
        { freq: 1108.73, delay: 0.82 }, // C#6
        { freq: 1318.51, delay: 0.90 }, // E6
        { freq: 1760.00, delay: 0.98 }  // A6
      ].forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, now + note.delay);
        gain.gain.setValueAtTime(0.2, now + note.delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.delay + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + note.delay);
        osc.stop(now + note.delay + 0.65);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Crisp micro-mechanical robotic servo actuation whir
   */
  public playRoboticServo() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(680, now + 0.08);
      osc.frequency.linearRampToValueAtTime(260, now + 0.16);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.20);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Military HUD precision lock-on double-pip tone
   */
  public playLockOn() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [0, 0.08].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400, now + offset);
        gain.gain.setValueAtTime(0.22, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.06);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Deep ambient quantum hum with stereo harmonic resonance
   */
  public playQuantumHum() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(108, now);
      osc1.frequency.linearRampToValueAtTime(109.5, now + 0.6);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(216, now);
      osc2.frequency.linearRampToValueAtTime(217.2, now + 0.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.72);
      osc2.stop(now + 0.72);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Bioluminescent nature chime: shimmering harmonic organic resonance
   */
  public playNatureChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [528, 660, 792, 1056]; // 528Hz Solfeggio natural harmonic series
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.15, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.6);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Cyber digital data matrix stream sweep
   */
  public playMatrixSweep() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 1200, now + i * 0.03);

        gain.gain.setValueAtTime(0.08, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.05);
      }
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * 🇮🇳 Triumphant Indian National Flag Bugle & Brass Fanfare
   * Resonant military brass salute motif (G4 -> C5 -> E5 -> G5 -> C6) with rich harmonics
   */
  public playIndiaFlagSalute() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Bugle notes sequence with timings and durations
      const notes = [
        { freq: 392.00, start: 0.0, dur: 0.28 },  // G4
        { freq: 523.25, start: 0.32, dur: 0.30 }, // C5
        { freq: 659.25, start: 0.66, dur: 0.28 }, // E5
        { freq: 783.99, start: 0.98, dur: 0.55 }, // G5
        { freq: 659.25, start: 1.58, dur: 0.25 }, // E5
        { freq: 783.99, start: 1.86, dur: 0.30 }, // G5
        { freq: 1046.50, start: 2.20, dur: 0.85 } // C6 (triumphant hold)
      ];

      notes.forEach(({ freq, start, dur }) => {
        const noteStart = now + start;
        const noteEnd = noteStart + dur;

        // Fundamental brass oscillator (sawtooth for brass brightness)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, noteStart);

        // Sub harmonic for rich acoustic warmth
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 0.5, noteStart);

        // Trumpet brass filter with slight swell
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 1.6, noteStart);
        filter.frequency.linearRampToValueAtTime(freq * 3.2, noteStart + 0.08);
        filter.frequency.linearRampToValueAtTime(freq * 2.0, noteEnd);

        // Envelope: swift brass attack, stable sustain, smooth natural decay
        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.24, noteStart + 0.04);
        gain.gain.setValueAtTime(0.20, noteEnd - 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(noteStart);
        osc2.start(noteStart);
        osc1.stop(noteEnd);
        osc2.stop(noteEnd);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * 🎬 Viral Dhurandhar Action Movie Cinematic Anthem
   * Thundering battle drums, heavy sub-bass impact, dramatic brass stabs & heroic rise
   */
  public playDhurandharMovieTheme() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Heavy cinematic sub-bass impact & taiko drum hit (Dhurandhar signature drop)
      const drumOsc = ctx.createOscillator();
      const drumGain = ctx.createGain();
      drumOsc.type = 'sine';
      drumOsc.frequency.setValueAtTime(140, now);
      drumOsc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

      drumGain.gain.setValueAtTime(0.65, now);
      drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      drumOsc.connect(drumGain);
      drumGain.connect(ctx.destination);
      drumOsc.start(now);
      drumOsc.stop(now + 0.65);

      // 2. Secondary rhythmic battle percussion beats (Taiko roll)
      const drumHits = [0.15, 0.32, 0.48, 0.65, 0.82, 0.98];
      drumHits.forEach((hitTime) => {
        const hOsc = ctx.createOscillator();
        const hGain = ctx.createGain();
        hOsc.type = 'triangle';
        hOsc.frequency.setValueAtTime(95, now + hitTime);
        hOsc.frequency.exponentialRampToValueAtTime(45, now + hitTime + 0.12);

        hGain.gain.setValueAtTime(0.25, now + hitTime);
        hGain.gain.exponentialRampToValueAtTime(0.001, now + hitTime + 0.12);

        hOsc.connect(hGain);
        hGain.connect(ctx.destination);
        hOsc.start(now + hitTime);
        hOsc.stop(now + hitTime + 0.13);
      });

      // 3. Heroic Action Brass Horns - Dhurandhar Signature Hook
      // Dramatic minor-to-major epic progression: D4 -> F4 -> G4 -> A4 -> D5 -> C5 -> D5
      const brassStabs = [
        { freq: 293.66, start: 0.18, dur: 0.22 }, // D4
        { freq: 349.23, start: 0.42, dur: 0.20 }, // F4
        { freq: 392.00, start: 0.64, dur: 0.22 }, // G4
        { freq: 440.00, start: 0.88, dur: 0.32 }, // A4
        { freq: 587.33, start: 1.25, dur: 0.38 }, // D5 (Heroic high stab)
        { freq: 523.25, start: 1.68, dur: 0.22 }, // C5
        { freq: 587.33, start: 1.95, dur: 0.85 }  // D5 (Grand cinematic resolution)
      ];

      brassStabs.forEach(({ freq, start, dur }) => {
        const noteStart = now + start;
        const noteEnd = noteStart + dur;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, noteStart);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(freq * 1.008, noteStart); // slight detune for massive blockbuster thickness

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 2.2, noteStart);
        filter.frequency.linearRampToValueAtTime(freq * 4.5, noteStart + 0.06);
        filter.frequency.exponentialRampToValueAtTime(freq * 1.8, noteEnd);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.28, noteStart + 0.035);
        gain.gain.setValueAtTime(0.22, noteEnd - 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(noteStart);
        osc2.start(noteStart);
        osc1.stop(noteEnd);
        osc2.stop(noteEnd);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * 🇮🇳 Combined Epic: Dhurandhar Blockbuster Drums + Indian Flag National Salute Fanfare
   */
  public playTirangaHeroicTheme() {
    this.playDhurandharMovieTheme();
    setTimeout(() => {
      this.playIndiaFlagSalute();
    }, 450);
  }
}

export const soundEffects = new SoundEffectsEngine();

