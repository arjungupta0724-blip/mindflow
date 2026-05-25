/**
 * SoundSynthesizer - Web Audio API Programmatic Nature Sound Generator.
 * Generates 10 natural organic sound waves (100% browser synthesized, no external files):
 * 1. Deep Earth Brown (ADHD Grounding hum)
 * 2. Ocean Waves (Synthesized LFO sweep on pink noise)
 * 3. Forest Rainfall (Pink noise + crackling raindrop pops)
 * 4. Cozy Campfire (Low heat hum + sharp crackling wood snap impulses)
 * 5. Woodland Stream (Pink noise + bubbly bandpass modulations for flowing water)
 * 6. Whispering Wind (Resonant bandpass LFO sweep on white noise)
 * 7. Rolling Train Ride (Rhythmic clack-clack track hums for pacing focus)
 * 8. Singing Bowls (Continuous relaxing Tibetan singing bowl sweeps)
 * 9. Cosmic Zen Drone (Warm multi-oscillator detuned singing hum)
 * 10. Pure Focal White (Focal static shielding)
 */

let audioCtx = null;
let activeTracks = {}; // key: type -> { activeNoiseNode, activeNoiseGain, lfoNode, lfoNode2, filterNode, droneOscillators, bowlsInterval, chimeInterval }
let noiseBuffers = {}; // Buffer cache

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Play soft click tick */
export function playClick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn(e);
  }
}

/** Play success victory ding */
export function playSuccess() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const playNote = (freq, delay, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.12, now + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration);
    };

    playNote(523.25, 0, 0.25); // C5
    playNote(783.99, 0.08, 0.45); // G5
  } catch (e) {
    console.warn(e);
  }
}

/** Play level up fanfare */
export function playLevelUp() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = index * 0.07;
      const duration = 0.5;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.linearRampToValueAtTime(freq + 5, now + delay + 0.15);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + duration);
    });
  } catch (e) {
    console.warn(e);
  }
}

/** Play Zen singing bowl chime */
export function playSingingBowl() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 3.5;
    const frequencies = [130.81, 196.00, 261.63, 392.00];

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      const detune = (Math.random() * 2 - 1) * 0.5;
      osc.frequency.setValueAtTime(freq + detune, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(index === 0 ? 0.16 : 0.06, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  } catch (e) {
    console.warn(e);
  }
}

/** Helper: Generate cached noise looping audio buffers */
function getNoiseBuffer(type, ctx) {
  if (noiseBuffers[type]) return noiseBuffers[type];

  const bufferSize = ctx.sampleRate * 2.5; // 2.5 seconds loop for natural variations
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'pink' || type === 'rain' || type === 'campfire') {
    // Generate pink noise base
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    // Crackle states for rain & campfire
    let crackleDecay = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      
      let pinkSample = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      pinkSample *= 0.11; 
      b6 = white * 0.115926;

      if (type === 'rain') {
        // Rain splatters: random small high-frequency pops
        let pop = 0;
        if (Math.random() > 0.9993 && crackleDecay <= 0) {
          pop = (Math.random() * 2 - 1) * 0.3;
          crackleDecay = 0.8;
        } else if (crackleDecay > 0) {
          crackleDecay *= 0.92;
          pop = crackleDecay * (Math.random() * 2 - 1) * 0.08;
        }
        data[i] = pinkSample * 0.6 + pop * 0.4;
      } 
      else if (type === 'campfire') {
        // Campfire: deep heat rumble + sharp wood crackles & snapping pops
        let snap = 0;
        if (Math.random() > 0.9994 && crackleDecay <= 0) {
          snap = (Math.random() > 0.5 ? 1 : -1) * (0.45 + Math.random() * 0.4); // Intense sharp wood snapping pop
          crackleDecay = 0.95; // Longer, snapping resonance
        } else if (crackleDecay > 0) {
          crackleDecay *= 0.88; // Quick pop decay
          snap = crackleDecay * (Math.random() * 2 - 1) * 0.15;
        }
        
        // Deep thermal rumble (high brown components) + sharp snaps
        data[i] = pinkSample * 0.45 + snap * 0.55;
      }
      else {
        data[i] = pinkSample;
      }
    }
  } else if (type === 'brown') {
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
  } else if (type === 'train') {
    /* E. Rolling Train Ride - Synthesize seamless rhythmic "clack-clack... clack-clack" tracks hum */
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      // 1. Deep cabin rumbling brown base
      const white = Math.random() * 2 - 1;
      let brown = (lastOut + (0.015 * white)) / 1.015;
      lastOut = brown;
      brown *= 3.0;

      // 2. Train track periodic double clicks: clack-clack at 0.9s intervals
      const timeInSec = i / ctx.sampleRate;
      const period = 1.1; // Period of track joins
      const localTime = timeInSec % period;
      
      let clack = 0;
      
      // First click
      if (localTime >= 0 && localTime < 0.015) {
        const decay = 1.0 - (localTime / 0.015);
        clack += Math.sin(localTime * 1500) * decay * 0.25;
      }
      // Second click (clack-clack)
      if (localTime >= 0.15 && localTime < 0.165) {
        const decay = 1.0 - ((localTime - 0.15) / 0.015);
        clack += Math.sin((localTime - 0.15) * 1200) * decay * 0.2;
      }

      data[i] = brown * 0.65 + clack * 0.35;
    }
  } else if (type === 'crickets') {
    /* Summer Night Crickets - Carrier sine trills (4.5kHz) + soft filtered low wind */
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const timeInSec = i / ctx.sampleRate;
      const groupPeriod = 1.5;
      const localTime = timeInSec % groupPeriod;
      
      let chirp = 0;
      for (let j = 0; j < 4; j++) {
        const start = j * 0.12;
        const end = start + 0.08;
        if (localTime >= start && localTime < end) {
          const t = localTime - start;
          const amplitude = Math.sin((t / 0.08) * Math.PI);
          const carrier = Math.sin(2 * Math.PI * 4500 * t);
          const trill = Math.sin(2 * Math.PI * 60 * t) * 0.5 + 0.5;
          chirp += carrier * amplitude * trill * 0.15;
        }
      }
      
      const white = Math.random() * 2 - 1;
      let lowWind = (lastOut + (0.005 * white)) / 1.005;
      lastOut = lowWind;
      
      data[i] = lowWind * 0.15 + chirp * 0.85;
    }
  } else if (type === 'heartbeat') {
    /* Gentle Heartbeat - Rhythmic 60 BPM (1 Hz) physical modeling thuds */
    for (let i = 0; i < bufferSize; i++) {
      const timeInSec = i / ctx.sampleRate;
      const period = 1.0;
      const localTime = timeInSec % period;
      
      let thud = 0;
      
      if (localTime >= 0 && localTime < 0.18) {
        const t = localTime;
        const env = Math.pow(1.0 - (t / 0.18), 3.0);
        thud += Math.sin(2 * Math.PI * 55 * t) * env * 0.7;
      }
      
      if (localTime >= 0.24 && localTime < 0.38) {
        const t = localTime - 0.24;
        const env = Math.pow(1.0 - (t / 0.14), 3.0);
        thud += Math.sin(2 * Math.PI * 62 * t) * env * 0.45;
      }
      
      data[i] = thud * 0.8;
    }
  } else if (type === 'cafe') {
    /* Cozy Cafe Chatter - Low chatter envelope modulated pink noise + coffee cup clinks */
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let clinkDecay = 0;
    let clinkFreq = 1800;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      
      let pinkSample = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      pinkSample *= 0.11; 
      b6 = white * 0.115926;
      
      const timeInSec = i / ctx.sampleRate;
      
      const env1 = (Math.sin(2 * Math.PI * 0.85 * timeInSec) * Math.sin(2 * Math.PI * 2.2 * timeInSec) + 1.0) * 0.5;
      const env2 = (Math.sin(2 * Math.PI * 1.3 * timeInSec) * Math.sin(2 * Math.PI * 3.7 * timeInSec) + 1.0) * 0.5;
      const chatter = pinkSample * (0.25 + env1 * 0.35 + env2 * 0.4);
      
      let clink = 0;
      if (Math.random() > 0.99965 && clinkDecay <= 0) {
        clinkDecay = 0.85;
        clinkFreq = 1700 + Math.random() * 1200;
      } else if (clinkDecay > 0) {
        clinkDecay *= 0.965;
        clink = Math.sin(2 * Math.PI * clinkFreq * (clinkDecay * 0.05)) * clinkDecay * 0.07;
      }
      
      data[i] = chatter * 0.8 + clink * 0.2;
    }
  }

  noiseBuffers[type] = buffer;
  return buffer;
}

/** Stop specific ambient noise track */
export function stopAmbientNoise(type) {
  try {
    if (activeTracks[type]) {
      const track = activeTracks[type];
      if (track.activeNoiseNode) {
        try { track.activeNoiseNode.stop(); } catch(e) {}
        try { track.activeNoiseNode.disconnect(); } catch(e) {}
      }
      if (track.lfoNode) {
        try { track.lfoNode.stop(); } catch(e) {}
        try { track.lfoNode.disconnect(); } catch(e) {}
      }
      if (track.lfoNode2) {
        try { track.lfoNode2.stop(); } catch(e) {}
        try { track.lfoNode2.disconnect(); } catch(e) {}
      }
      if (track.filterNode) {
        try { track.filterNode.disconnect(); } catch(e) {}
      }
      if (track.droneOscillators && track.droneOscillators.length > 0) {
        track.droneOscillators.forEach((osc) => {
          try { osc.stop(); } catch(e) {}
          try { osc.disconnect(); } catch(e) {}
        });
      }
      if (track.bowlsInterval) {
        clearInterval(track.bowlsInterval);
      }
      if (track.chimeInterval) {
        clearInterval(track.chimeInterval);
      }
      delete activeTracks[type];
    }
  } catch(e) {
    console.warn('Error stopping ambient noise track:', type, e);
  }
}

/** Stop all active noise nodes & filters */
export function stopAllActiveAudio() {
  try {
    Object.keys(activeTracks).forEach((type) => {
      stopAmbientNoise(type);
    });
    activeTracks = {};
  } catch(e) {
    console.warn('Error stopping all active audio:', e);
  }
}

/**
 * Play, adjust or stop one of our 14 programmatic nature soundscapes.
 * Key detail: Supports up to 3 active sound tracks active simultaneously!
 * @param {string} type - 'brown'|'waves'|'rain'|'campfire'|'stream'|'wind'|'train'|'bowls'|'drone'|'white'|'crickets'|'heartbeat'|'aurora'|'cafe'
 * @param {number} volume - Float from 0.0 to 1.0
 */
export function setAmbientNoise(type, volume) {
  try {
    const ctx = getAudioContext();

    if (!type) {
      stopAllActiveAudio();
      return;
    }

    if (volume === 0) {
      stopAmbientNoise(type);
      return;
    }

    // If it's already active, just scale its specific volume gain node
    if (activeTracks[type]) {
      const activeNoiseGain = activeTracks[type].activeNoiseGain;
      if (activeNoiseGain) {
        activeNoiseGain.gain.linearRampToValueAtTime(volume * 0.22, ctx.currentTime + 0.15);
      }
      return;
    }

    // Set up a new track
    const track = {
      droneOscillators: []
    };
    activeTracks[type] = track;

    const activeNoiseGain = ctx.createGain();
    activeNoiseGain.gain.setValueAtTime(volume * 0.22, ctx.currentTime); // Soft organic mix
    track.activeNoiseGain = activeNoiseGain;

    if (type === 'drone') {
      const frequencies = [73.42, 110.00, 165.00, 220.00]; 
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), ctx.currentTime);
        
        const detuneLfo = ctx.createOscillator();
        const detuneGain = ctx.createGain();
        detuneLfo.frequency.value = 0.05 + idx * 0.02;
        detuneGain.gain.value = 0.5;
        detuneLfo.connect(detuneGain);
        detuneGain.connect(osc.frequency);
        detuneLfo.start();
        
        oscGain.gain.value = idx === 0 ? 0.4 : 0.2;
        osc.connect(oscGain);
        oscGain.connect(activeNoiseGain);
        
        osc.start();
        track.droneOscillators.push(osc);
        track.droneOscillators.push(detuneLfo);
      });

      activeNoiseGain.connect(ctx.destination);
    } 
    else if (type === 'bowls') {
      /* G. Zen Singing Bowls Swells - Continuous overlapping Tibetan bowl swells */
      const frequencies = [130.81, 196.00, 261.63, 329.63]; // C3, G3, C4, E4
      
      // Loop triggers
      const triggerSwell = () => {
        if (!activeTracks[type]) return; // Stopped
        const now = ctx.currentTime;
        
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const swellGain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq + (Math.random() * 1.5 - 0.75), now);
          
          // Overlapping swell envelope: 2s attack, 5s decay
          swellGain.gain.setValueAtTime(0, now);
          swellGain.gain.linearRampToValueAtTime(idx === 0 ? 0.08 : 0.03, now + 2.0);
          swellGain.gain.exponentialRampToValueAtTime(0.001, now + 7.0);
          
          osc.connect(swellGain);
          swellGain.connect(activeNoiseGain);
          
          osc.start(now);
          osc.stop(now + 7.0);
          track.droneOscillators.push(osc);
          
          setTimeout(() => {
            if (activeTracks[type] && activeTracks[type].droneOscillators) {
              activeTracks[type].droneOscillators = activeTracks[type].droneOscillators.filter(o => o !== osc);
            }
          }, 7200);
        });
      };

      // Rhythmic swell trigger interval
      triggerSwell();
      track.bowlsInterval = setInterval(triggerSwell, 5500);
      
      activeNoiseGain.connect(ctx.destination);
    }
    else if (type === 'aurora') {
      /* Celestial Chimes - Sparkling bells + soft warm pad */
      const baseFreqs = [110.00, 146.83, 165.00]; // A2, D3, E3
      baseFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1 + idx * 0.05;
        lfoGain.gain.value = 0.3;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        
        oscGain.gain.value = idx === 0 ? 0.08 : 0.04;
        osc.connect(oscGain);
        oscGain.connect(activeNoiseGain);
        
        osc.start();
        track.droneOscillators.push(osc);
        track.droneOscillators.push(lfo);
      });

      const chimeFreqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
      
      const triggerChime = () => {
        if (!activeTracks[type]) return;
        const now = ctx.currentTime;
        const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
        
        const osc = ctx.createOscillator();
        const bellGain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        bellGain.gain.setValueAtTime(0, now);
        bellGain.gain.linearRampToValueAtTime(0.04, now + 0.01);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        
        const harmonic = ctx.createOscillator();
        const harmGain = ctx.createGain();
        harmonic.type = 'sine';
        harmonic.frequency.setValueAtTime(freq * 1.5, now);
        harmGain.gain.setValueAtTime(0, now);
        harmGain.gain.linearRampToValueAtTime(0.02, now + 0.01);
        harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        
        osc.connect(bellGain);
        harmonic.connect(harmGain);
        
        bellGain.connect(activeNoiseGain);
        harmGain.connect(activeNoiseGain);
        
        osc.start(now);
        osc.stop(now + 3.1);
        harmonic.start(now);
        harmonic.stop(now + 1.3);

        track.droneOscillators.push(osc);
        track.droneOscillators.push(harmonic);
        
        setTimeout(() => {
          if (activeTracks[type] && activeTracks[type].droneOscillators) {
            activeTracks[type].droneOscillators = activeTracks[type].droneOscillators.filter(o => o !== osc && o !== harmonic);
          }
        }, 3200);
      };
      
      triggerChime();
      track.chimeInterval = setInterval(() => {
        triggerChime();
        if (Math.random() > 0.6) {
          setTimeout(triggerChime, 300 + Math.random() * 500);
        }
      }, 3800);

      activeNoiseGain.connect(ctx.destination);
    }
    else if (type === 'waves') {
      const buffer = getNoiseBuffer('pink', ctx);
      const activeNoiseNode = ctx.createBufferSource();
      activeNoiseNode.buffer = buffer;
      activeNoiseNode.loop = true;
      track.activeNoiseNode = activeNoiseNode;

      const filterNode = ctx.createBiquadFilter();
      filterNode.type = 'bandpass';
      filterNode.Q.value = 1.2;
      filterNode.frequency.setValueAtTime(250, ctx.currentTime);
      track.filterNode = filterNode;

      const lfoNode = ctx.createOscillator();
      lfoNode.type = 'sine';
      lfoNode.frequency.setValueAtTime(0.08, ctx.currentTime); // 12-second wave sweep cycle
      track.lfoNode = lfoNode;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 180;

      lfoNode.connect(lfoGain);
      lfoGain.connect(filterNode.frequency);

      activeNoiseNode.connect(filterNode);
      filterNode.connect(activeNoiseGain);
      activeNoiseGain.connect(ctx.destination);

      lfoNode.start();
      activeNoiseNode.start();
    } 
    else if (type === 'stream') {
      /* Woodland Stream - Bubbly, flowing stream synthesis */
      const buffer = getNoiseBuffer('pink', ctx);
      const activeNoiseNode = ctx.createBufferSource();
      activeNoiseNode.buffer = buffer;
      activeNoiseNode.loop = true;
      track.activeNoiseNode = activeNoiseNode;

      const filterNode = ctx.createBiquadFilter();
      filterNode.type = 'bandpass';
      filterNode.Q.value = 4.2; // Higher resonance for sharp fluid bubbles
      filterNode.frequency.setValueAtTime(900, ctx.currentTime);
      track.filterNode = filterNode;

      // LFO 1: Main flow sweeps (0.15Hz)
      const lfoNode = ctx.createOscillator();
      lfoNode.type = 'sine';
      lfoNode.frequency.setValueAtTime(0.15, ctx.currentTime);
      track.lfoNode = lfoNode;

      const lfoGain1 = ctx.createGain();
      lfoGain1.gain.value = 350; // Sweeps between 550Hz and 1250Hz

      lfoNode.connect(lfoGain1);
      lfoGain1.connect(filterNode.frequency);

      // LFO 2: Fast bubbling variations (2.4Hz)
      const lfoNode2 = ctx.createOscillator();
      lfoNode2.type = 'sine';
      lfoNode2.frequency.setValueAtTime(2.4, ctx.currentTime);
      track.lfoNode2 = lfoNode2;

      const lfoGain2 = ctx.createGain();
      lfoGain2.gain.value = 120; // Fast micro ripples
      
      lfoNode2.connect(lfoGain2);
      lfoGain2.connect(filterNode.frequency);

      activeNoiseNode.connect(filterNode);
      filterNode.connect(activeNoiseGain);
      activeNoiseGain.connect(ctx.destination);

      lfoNode.start();
      lfoNode2.start();
      activeNoiseNode.start();
    }
    else if (type === 'wind') {
      const buffer = getNoiseBuffer('white', ctx);
      const activeNoiseNode = ctx.createBufferSource();
      activeNoiseNode.buffer = buffer;
      activeNoiseNode.loop = true;
      track.activeNoiseNode = activeNoiseNode;

      const filterNode = ctx.createBiquadFilter();
      filterNode.type = 'bandpass';
      filterNode.Q.value = 3.2;
      filterNode.frequency.setValueAtTime(500, ctx.currentTime);
      track.filterNode = filterNode;

      const lfoNode = ctx.createOscillator();
      lfoNode.type = 'sine';
      lfoNode.frequency.setValueAtTime(0.06, ctx.currentTime);
      track.lfoNode = lfoNode;

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 320;

      lfoNode.connect(lfoGain);
      lfoGain.connect(filterNode.frequency);

      activeNoiseNode.connect(filterNode);
      filterNode.connect(activeNoiseGain);
      activeNoiseGain.connect(ctx.destination);

      lfoNode.start();
      activeNoiseNode.start();
    } 
    else {
      /* Standard Static buffers: white, pink, rain, campfire, brown, train, crickets, heartbeat, cafe */
      const buffer = getNoiseBuffer(type, ctx);
      
      const activeNoiseNode = ctx.createBufferSource();
      activeNoiseNode.buffer = buffer;
      activeNoiseNode.loop = true;
      track.activeNoiseNode = activeNoiseNode;

      activeNoiseNode.connect(activeNoiseGain);
      activeNoiseGain.connect(ctx.destination);

      activeNoiseNode.start();
    }
  } catch (e) {
    console.warn('Unable to play ambient noise:', type, e);
  }
}
