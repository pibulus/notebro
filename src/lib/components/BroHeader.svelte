<script>
	import { isSoundEnabled, toggleSound, playCardPop } from '$lib/sound.js';
	import { PRICING } from '$lib/config/pricing.js';

	export let onNewCard = () => {};
	export let onOpenExport = () => {};
	export let onOpenSync = () => {};
	export let onOpenSupport = () => {};
	export let onOpenMacModal = () => {};

	let soundOn = true;
	let menuOpen = false;

	function handleToggleSound() {
		soundOn = !soundOn;
		toggleSound(soundOn);
		if (soundOn) playCardPop();
	}

	function run(fn) {
		menuOpen = false;
		fn();
	}

	function handleWindowKeydown(e) {
		if (e.key === 'Escape') menuOpen = false;
	}
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<!-- One row. An app whose whole pitch is "no setup ritual" cannot greet people
     with five competing buttons — everything secondary lives behind the menu. -->
<header class="w-full max-w-2xl mx-auto flex items-center justify-between gap-3 py-4 px-3 sm:px-0 mb-1">
	<div class="flex items-center gap-2.5 min-w-0">
		<div
			class="w-9 h-9 shrink-0 rounded-xl bg-[#fef08a] border-2 border-[#4a3f38] shadow-brutal-sm flex items-center justify-center text-lg select-none"
		>
			📝
		</div>
		<div class="min-w-0">
			<h1 class="font-mono font-black text-xl tracking-tight text-[#1e1714] leading-none">
				NoteBro
			</h1>
			<p class="text-[11px] font-mono text-[#625854] leading-tight truncate">
				Quick notes, nothing else.
			</p>
		</div>
	</div>

	<div class="flex items-center gap-2 shrink-0">
		<button
			type="button"
			on:click={onNewCard}
			class="btn-bro px-3.5 py-1.5 text-xs sm:text-sm font-mono font-black bg-[#a7f3d0] text-[#1e1714] rounded-xl hover:bg-[#6ee7b7]"
			title="Pull a fresh card (⌘K)"
		>
			+ New Card
		</button>

		<div class="relative">
			<button
				type="button"
				on:click={() => (menuOpen = !menuOpen)}
				class="btn-bro w-9 h-9 flex items-center justify-center text-base font-mono font-black bg-[#fbf1e4] text-[#1e1714] rounded-xl"
				aria-haspopup="true"
				aria-expanded={menuOpen}
				aria-label="More"
				title="More"
			>
				···
			</button>

			{#if menuOpen}
				<!-- Scrim closes the menu without a document-level click listener. -->
				<button
					type="button"
					class="fixed inset-0 z-40 cursor-default"
					on:click={() => (menuOpen = false)}
					tabindex="-1"
					aria-label="Close menu"
				></button>

				<div
					class="absolute right-0 top-11 z-50 w-52 rounded-xl border-2 border-[#4a3f38] bg-[#fffaf0] shadow-brutal-sm overflow-hidden font-mono text-xs"
					role="menu"
				>
					<button
						type="button"
						role="menuitem"
						on:click={() => run(onOpenSync)}
						class="w-full text-left px-3.5 py-2.5 font-bold text-[#1e1714] hover:bg-[#fef08a] transition-colors"
					>
						Vault Sync
					</button>
					<button
						type="button"
						role="menuitem"
						on:click={() => run(onOpenExport)}
						class="w-full text-left px-3.5 py-2.5 font-bold text-[#1e1714] hover:bg-[#fef08a] transition-colors"
					>
						Export Markdown
					</button>
					<button
						type="button"
						role="menuitem"
						on:click={() => run(onOpenMacModal)}
						class="w-full text-left px-3.5 py-2.5 font-bold text-[#1e1714] hover:bg-[#fef08a] transition-colors"
					>
						NoteBro for Mac
					</button>

					<div class="border-t-2 border-[#4a3f38]/15"></div>

					<button
						type="button"
						role="menuitem"
						on:click={handleToggleSound}
						class="w-full text-left px-3.5 py-2.5 font-bold text-[#625854] hover:bg-[#fef08a] hover:text-[#1e1714] transition-colors flex items-center justify-between"
					>
						<span>Sound</span>
						<span class="text-[10px] uppercase tracking-wider">{soundOn ? 'On' : 'Off'}</span>
					</button>
					<button
						type="button"
						role="menuitem"
						on:click={() => run(onOpenSupport)}
						class="w-full text-left px-3.5 py-2.5 font-black text-[#1e1714] bg-[#fed7aa]/50 hover:bg-[#fed7aa] transition-colors"
					>
						Cartridge — {PRICING.displayPrice}
					</button>
				</div>
			{/if}
		</div>
	</div>
</header>
