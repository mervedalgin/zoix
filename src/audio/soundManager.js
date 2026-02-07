// Web Audio API based retro synth sound manager — zero dependencies, zero audio files

class SoundManager {
  constructor() {
    this.ctx = null
    this.muted = false
    this.volume = 0.3
  }

  _ensureCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  _gain(vol = 1) {
    const ctx = this._ensureCtx()
    const g = ctx.createGain()
    g.gain.value = this.volume * vol
    g.connect(ctx.destination)
    return g
  }

  _osc(type, freq, gain, start, stop) {
    const ctx = this._ensureCtx()
    const o = ctx.createOscillator()
    o.type = type
    o.frequency.value = freq
    o.connect(gain)
    o.start(start)
    o.stop(stop)
    return o
  }

  toggleMute() {
    this.muted = !this.muted
    return this.muted
  }

  play(name) {
    if (this.muted) return
    try {
      const fn = this[`_${name}`]
      if (fn) fn.call(this)
    } catch { /* silence errors */ }
  }

  // ——— Individual sound effects ———

  _move() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const g = this._gain(0.15)
    g.gain.setValueAtTime(this.volume * 0.15, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
    this._osc('square', 220, g, t, t + 0.05)
  }

  _rotate() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const g = this._gain(0.25)
    g.gain.setValueAtTime(this.volume * 0.25, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
    const o = this._osc('square', 300, g, t, t + 0.08)
    o.frequency.setValueAtTime(300, t)
    o.frequency.exponentialRampToValueAtTime(500, t + 0.04)
    o.frequency.exponentialRampToValueAtTime(350, t + 0.08)
  }

  _softDrop() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const g = this._gain(0.1)
    g.gain.setValueAtTime(this.volume * 0.1, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03)
    this._osc('triangle', 160, g, t, t + 0.03)
  }

  _hardDrop() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime

    // Whoosh — noise-like sweep down
    const g1 = this._gain(0.3)
    g1.gain.setValueAtTime(this.volume * 0.3, t)
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
    const o1 = this._osc('sawtooth', 400, g1, t, t + 0.15)
    o1.frequency.exponentialRampToValueAtTime(60, t + 0.12)

    // Thud impact
    const g2 = this._gain(0.5)
    g2.gain.setValueAtTime(this.volume * 0.5, t + 0.08)
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
    const o2 = this._osc('sine', 80, g2, t + 0.08, t + 0.25)
    o2.frequency.exponentialRampToValueAtTime(30, t + 0.25)
  }

  _lock() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const g = this._gain(0.2)
    g.gain.setValueAtTime(this.volume * 0.2, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
    const o = this._osc('sine', 120, g, t, t + 0.1)
    o.frequency.exponentialRampToValueAtTime(50, t + 0.1)
  }

  _lineClear1() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const g = this._gain(0.4)
    g.gain.setValueAtTime(this.volume * 0.4, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    const o = this._osc('square', 523, g, t, t + 0.2) // C5
    o.frequency.setValueAtTime(523, t)
    o.frequency.setValueAtTime(659, t + 0.1) // E5
  }

  _lineClear2() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const notes = [523, 659, 784] // C5, E5, G5
    notes.forEach((freq, i) => {
      const g = this._gain(0.35)
      g.gain.setValueAtTime(this.volume * 0.35, t + i * 0.08)
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.12)
      this._osc('square', freq, g, t + i * 0.08, t + i * 0.08 + 0.12)
    })
  }

  _lineClear3() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const g = this._gain(0.35)
      g.gain.setValueAtTime(this.volume * 0.35, t + i * 0.07)
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.12)
      this._osc('square', freq, g, t + i * 0.07, t + i * 0.07 + 0.12)
    })
  }

  _lineClear4() {
    // Tetris! — epic arpeggio
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const notes = [523, 659, 784, 1047, 1319, 1568] // C5 to G6
    notes.forEach((freq, i) => {
      const g = this._gain(0.4)
      g.gain.setValueAtTime(this.volume * 0.4, t + i * 0.06)
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.2)
      this._osc('square', freq, g, t + i * 0.06, t + i * 0.06 + 0.2)
    })
    // Bass chord underneath
    const gb = this._gain(0.3)
    gb.gain.setValueAtTime(this.volume * 0.3, t)
    gb.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
    this._osc('sawtooth', 131, gb, t, t + 0.6) // C3
  }

  _levelUp() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const notes = [392, 523, 659, 784, 1047] // G4 C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const g = this._gain(0.3)
      g.gain.setValueAtTime(this.volume * 0.3, t + i * 0.1)
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.2)
      this._osc('triangle', freq, g, t + i * 0.1, t + i * 0.1 + 0.2)
    })
    // Shimmer
    const gs = this._gain(0.15)
    gs.gain.setValueAtTime(this.volume * 0.15, t + 0.2)
    gs.gain.exponentialRampToValueAtTime(0.001, t + 0.8)
    this._osc('sine', 2093, gs, t + 0.2, t + 0.8) // C7 shimmer
  }

  _powerUp() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    // Magic sparkle — rising sweep
    const g1 = this._gain(0.35)
    g1.gain.setValueAtTime(this.volume * 0.35, t)
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    const o1 = this._osc('sine', 400, g1, t, t + 0.4)
    o1.frequency.exponentialRampToValueAtTime(1600, t + 0.3)

    // Sparkle pings
    const sparkles = [800, 1200, 1600]
    sparkles.forEach((freq, i) => {
      const g = this._gain(0.2)
      g.gain.setValueAtTime(this.volume * 0.2, t + 0.1 + i * 0.08)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.1 + i * 0.08 + 0.1)
      this._osc('square', freq, g, t + 0.1 + i * 0.08, t + 0.1 + i * 0.08 + 0.1)
    })
  }

  _shieldBreak() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    // Glass shatter — noise burst with descending pitch
    const g = this._gain(0.5)
    g.gain.setValueAtTime(this.volume * 0.5, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    const o = this._osc('sawtooth', 2000, g, t, t + 0.3)
    o.frequency.exponentialRampToValueAtTime(100, t + 0.25)

    // Crackle
    const g2 = this._gain(0.3)
    g2.gain.setValueAtTime(this.volume * 0.3, t + 0.05)
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
    this._osc('square', 1500, g2, t + 0.05, t + 0.2)
  }

  _lifeLost() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    // Descending sad tones
    const notes = [440, 370, 311, 261] // A4, F#4, D#4, C4
    notes.forEach((freq, i) => {
      const g = this._gain(0.35)
      g.gain.setValueAtTime(this.volume * 0.35, t + i * 0.12)
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.15)
      this._osc('triangle', freq, g, t + i * 0.12, t + i * 0.12 + 0.15)
    })
  }

  _gameOver() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    // Dramatic descending
    const notes = [523, 466, 415, 349, 311, 261, 220, 165]
    notes.forEach((freq, i) => {
      const g = this._gain(0.3)
      g.gain.setValueAtTime(this.volume * 0.3, t + i * 0.15)
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.2)
      this._osc('sawtooth', freq, g, t + i * 0.15, t + i * 0.15 + 0.2)
    })
    // Low rumble
    const gr = this._gain(0.25)
    gr.gain.setValueAtTime(this.volume * 0.25, t + 0.5)
    gr.gain.exponentialRampToValueAtTime(0.001, t + 1.8)
    this._osc('sine', 55, gr, t + 0.5, t + 1.8)
  }

  _gameStart() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    // Ascending power-on jingle
    const notes = [262, 330, 392, 523, 659, 784] // C4 E4 G4 C5 E5 G5
    notes.forEach((freq, i) => {
      const g = this._gain(0.25)
      g.gain.setValueAtTime(this.volume * 0.25, t + i * 0.08)
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15)
      this._osc('square', freq, g, t + i * 0.08, t + i * 0.08 + 0.15)
    })
    // Final chord
    const gc = this._gain(0.2)
    gc.gain.setValueAtTime(this.volume * 0.2, t + 0.5)
    gc.gain.exponentialRampToValueAtTime(0.001, t + 1.0)
    this._osc('triangle', 523, gc, t + 0.5, t + 1.0)
  }

  _pause() {
    const ctx = this._ensureCtx()
    const t = ctx.currentTime
    const g = this._gain(0.2)
    g.gain.setValueAtTime(this.volume * 0.2, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
    const o = this._osc('triangle', 440, g, t, t + 0.15)
    o.frequency.exponentialRampToValueAtTime(220, t + 0.15)
  }
}

const soundManager = new SoundManager()
export default soundManager
