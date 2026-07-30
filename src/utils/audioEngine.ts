/**
 * OWN KARMA — Procedural Web Audio Engine
 *
 * Generates ambient sub-bass drones, wind noise textures, metallic particle chimes,
 * and harmonic choir frequencies using pure Web Audio API (zero external assets required).
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bassOsc: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private isMuted: boolean = true;
  private isInitialized: boolean = false;

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupSubBass();
      this.setupWindAmbience();

      this.isInitialized = true;
    } catch {
      console.warn("Web Audio API not supported on this browser.");
    }
  }

  /** Sub-bass drone (45Hz sine wave with lowpass filter & LFO breathing) */
  private setupSubBass() {
    if (!this.ctx || !this.masterGain) return;

    this.bassOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const bassGain = this.ctx.createGain();

    this.bassOsc.type = "sine";
    this.bassOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);

    bassGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    this.bassOsc.connect(filter);
    filter.connect(bassGain);
    bassGain.connect(this.masterGain);

    this.bassOsc.start();
  }

  /** Procedural Wind Noise Generator (Filtered Pink Noise Buffer) */
  private setupWindAmbience() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.04;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    this.noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    this.noiseNode.start();
  }

  /** Metallic Particle Chime Pulse (High Resonant Shimmer) */
  public triggerParticleChime() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freqs = [1400, 1800, 2400, 3200];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  /** Toggle Audio Mute / Unmute */
  public toggle(): boolean {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.6;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.4);
    }
    return !this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }
}

export const audioEngine = new AudioEngine();
