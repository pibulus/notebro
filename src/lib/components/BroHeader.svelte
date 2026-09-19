<script>
	import { isSoundEnabled, toggleSound, playCardPop } from '$lib/sound.js';

	export let onNewCard = () => {};
	export let onOpenExport = () => {};
	export let onOpenSync = () => {};
	export let onOpenSupport = () => {};
	export let onOpenMacModal = () => {};

	let soundOn = true;

	function handleToggleSound() {
		soundOn = !soundOn;
		toggleSound(soundOn);
		if (soundOn) playCardPop();
	}
</script>

<header class="w-full max-w-2xl mx-auto flex items-center justify-between py-4 px-3 sm:px-0 mb-2">
	<!-- Logo / Title -->
	<div class="flex items-center gap-2.5">
		<div class="w-9 h-9 rounded-xl bg-[#fef08a] border-2 border-[#1e1714] shadow-brutal-sm flex items-center justify-center text-lg select-none">
			📝
		</div>
		<div>
			<h1 class="font-mono font-black text-xl tracking-tight text-[#1e1714] flex items-center gap-1.5 leading-none">
				NoteBro
				<span class="text-[10px] uppercase font-bold tracking-widest bg-[#a7f3d0] text-[#065f46] px-1.5 py-0.5 rounded border border-[#1e1714]/30">
					v1.0
				</span>
			</h1>
			<p class="text-[11px] font-mono text-[#625854] leading-tight">
				Your note bro. Always there.
			</p>
		</div>
	</div>

	<!-- Top Right Action Controls -->
	<div class="flex items-center gap-2">
		<!-- Mac App Badge -->
		<button
			type="button"
			on:click={onOpenMacModal}
			class="btn-bro hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-bold bg-[#bae6fd] text-[#1e1714] rounded-xl"
			title="NoteBro for Mac Menu Bar"
		>
			<span> Mac App</span>
		</button>

		<!-- Sync Button -->
		<button
			type="button"
			on:click={onOpenSync}
			class="btn-bro px-2.5 py-1.5 text-xs font-mono font-bold bg-white text-[#1e1714] rounded-xl flex items-center gap-1"
			title="Sync cards across devices via Pi Vault"
		>
			<span>⚡️</span>
			<span class="hidden sm:inline">Sync</span>
		</button>

		<!-- Sound Toggle Button -->
		<button
			type="button"
			on:click={handleToggleSound}
			class="btn-bro px-2 py-1.5 text-xs font-mono font-bold bg-white text-[#1e1714] rounded-xl flex items-center justify-center"
			title={soundOn ? 'Mute synthesized sound effects' : 'Enable synthesized sound effects'}
			aria-label="Toggle sound"
		>
			<span>{soundOn ? '🔊' : '🔇'}</span>
		</button>

		<!-- Export Button -->
		<button
			type="button"
			on:click={onOpenExport}
			class="btn-bro px-2.5 py-1.5 text-xs font-mono font-bold bg-white text-[#1e1714] rounded-xl flex items-center gap-1"
			title="Export or backup cards"
		>
			<span>📦</span>
			<span class="hidden sm:inline">Export</span>
		</button>

		<!-- Support / Buy Cartridge -->
		<button
			type="button"
			on:click={onOpenSupport}
			class="btn-bro px-3 py-1.5 text-xs font-mono font-black bg-[#fed7aa] text-[#1e1714] rounded-xl hover:bg-[#fdba74]"
			title="Support NoteBro & get the Mac suite"
		>
			$19 AUD
		</button>

		<!-- Big New Card Button -->
		<button
			type="button"
			on:click={onNewCard}
			class="btn-bro px-3.5 py-1.5 text-xs sm:text-sm font-mono font-black bg-[#a7f3d0] text-[#1e1714] rounded-xl hover:bg-[#6ee7b7] flex items-center gap-1"
			title="Pull a fresh card (⌘K)"
		>
			<span>+</span>
			<span>New Card</span>
		</button>
	</div>
</header>
