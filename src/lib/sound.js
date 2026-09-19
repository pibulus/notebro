// src/lib/sound.js
// Pure synthesized WebAudio micro-interactions for NoteBro.
// 0 KB audio files, instant response, soft and tactile.

let audioCtx = null;
let soundEnabled = true;

function getContext() {
	if (typeof window === 'undefined') return null;
	if (!audioCtx) {
		const AudioContextClass = window.AudioContext || window.webkitAudioContext;
		if (!AudioContextClass) return null;
		audioCtx = new AudioContextClass();
	}
	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}
	return audioCtx;
}

export function toggleSound(enabled) {
	soundEnabled = enabled;
}

export function isSoundEnabled() {
	return soundEnabled;
}

// 1. Soft paper tick (Card flick / navigate)
export function playCardFlick() {
	if (!soundEnabled) return;
	const ctx = getContext();
	if (!ctx) return;

	try {
		const t = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'triangle';
		osc.frequency.setValueAtTime(650, t);
		osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);

		gain.gain.setValueAtTime(0.045, t);
		gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(t);
		osc.stop(t + 0.05);
	} catch {}
}

// 2. Bubbly Pop (New Card pull)
export function playCardPop() {
	if (!soundEnabled) return;
	const ctx = getContext();
	if (!ctx) return;

	try {
		const t = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'sine';
		osc.frequency.setValueAtTime(420, t);
		osc.frequency.exponentialRampToValueAtTime(980, t + 0.07);

		gain.gain.setValueAtTime(0.06, t);
		gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(t);
		osc.stop(t + 0.085);
	} catch {}
}

// 3. Wooden Tap / Strike (Todo checklist toggle)
export function playCheckmark() {
	if (!soundEnabled) return;
	const ctx = getContext();
	if (!ctx) return;

	try {
		const t = ctx.currentTime;
		// Fast double-click woodblock feel
		const osc1 = ctx.createOscillator();
		const osc2 = ctx.createOscillator();
		const gain = ctx.createGain();

		osc1.type = 'triangle';
		osc1.frequency.setValueAtTime(820, t);
		osc1.frequency.exponentialRampToValueAtTime(1100, t + 0.03);

		osc2.type = 'sine';
		osc2.frequency.setValueAtTime(1240, t + 0.02);
		osc2.frequency.exponentialRampToValueAtTime(1600, t + 0.06);

		gain.gain.setValueAtTime(0.05, t);
		gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

		osc1.connect(gain);
		osc2.connect(gain);
		gain.connect(ctx.destination);

		osc1.start(t);
		osc1.stop(t + 0.04);
		osc2.start(t + 0.02);
		osc2.stop(t + 0.07);
	} catch {}
}

// 4. Pastel marker tone
export function playColorTone(colorId) {
	if (!soundEnabled) return;
	const ctx = getContext();
	if (!ctx) return;

	const freqMap = {
		yellow: 523.25, // C5
		mint: 659.25,   // E5
		lavender: 783.99,// G5
		peach: 880.0,   // A5
		sky: 1046.5     // C6
	};

	try {
		const t = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'sine';
		osc.frequency.setValueAtTime(freqMap[colorId] || 600, t);

		gain.gain.setValueAtTime(0.035, t);
		gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(t);
		osc.stop(t + 0.09);
	} catch {}
}
