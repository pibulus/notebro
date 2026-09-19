<script>
	import { onMount } from 'svelte';
	import BroHeader from '$lib/components/BroHeader.svelte';
	import Deck from '$lib/components/Deck.svelte';
	import SupportModal from '$lib/components/SupportModal.svelte';
	import ExportModal from '$lib/components/ExportModal.svelte';
	import MacAppModal from '$lib/components/MacAppModal.svelte';
	import SyncModal from '$lib/components/SyncModal.svelte';
	import { loadCards, saveCards, loadActiveIndex, saveActiveIndex, DEFAULT_CARDS } from '$lib/storage.js';
	import { PRICING } from '$lib/config/pricing.js';
	import { MAC_DMG } from '$lib/config/download.js';

	let cards = DEFAULT_CARDS;
	let activeIndex = 0;
	let deckComponentRef;
	let isSupportOpen = false;
	let isExportOpen = false;
	let isMacModalOpen = false;
	let isSyncOpen = false;

	onMount(() => {
		cards = loadCards();
		activeIndex = loadActiveIndex(cards.length - 1);

		const hash = window.location.hash || '';
		if (hash.includes('sync=')) {
			const params = new URLSearchParams(hash.replace(/^#/, ''));
			const syncCode = params.get('sync');
			if (syncCode) {
				localStorage.setItem('notebro_passport_code', syncCode.toUpperCase());
				isSyncOpen = true;
			}
		}
	});

	function handleCardsUpdate(updated) {
		cards = updated;
		saveCards(cards);
	}

	function handleIndexUpdate(idx) {
		activeIndex = idx;
		saveActiveIndex(activeIndex);
	}

	function handleNewCard() {
		if (deckComponentRef) deckComponentRef.addCard();
	}
</script>

<svelte:head>
	<title>NoteBro 📝 — Your note bro. Always there.</title>
	<meta
		name="description"
		content="A notes app that's already taking a note when you open it. Zero friction, zero setup, flickable index cards on cream paper."
	/>
</svelte:head>

<div class="min-h-screen flex flex-col justify-between py-2 sm:py-6 px-3 sm:px-6 max-w-4xl mx-auto w-full">
	<!-- Top Bar: One clean row -->
	<BroHeader
		onNewCard={handleNewCard}
		onOpenSync={() => (isSyncOpen = true)}
		onOpenExport={() => (isExportOpen = true)}
		onOpenSupport={() => (isSupportOpen = true)}
		onOpenMacModal={() => (isMacModalOpen = true)}
	/>

	<!-- Main Deck Area: The App IS the Front Page -->
	<main class="flex-1 flex flex-col items-center justify-start my-2 sm:my-4 w-full">
		<Deck
			bind:this={deckComponentRef}
			{cards}
			{activeIndex}
			onCardsUpdate={handleCardsUpdate}
			onIndexUpdate={handleIndexUpdate}
		/>

		<!-- Value Proposition & Ecosystem: Tactile Soft Neo Toybrut cards -->
		<section class="w-full max-w-2xl mt-12 mb-6 space-y-4">
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<!-- Mac App Card -->
				<div class="card-frame p-5 bg-[#fffdf8] flex flex-col justify-between">
					<div>
						<div class="flex items-center justify-between mb-2.5">
							<span class="text-2xl"></span>
							<span class="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#bae6fd] text-[#0369a1] px-2 py-0.5 rounded-full border border-[#0369a1]/30">
								Menu Bar App
							</span>
						</div>
						<h3 class="font-mono font-black text-base text-[#1e1714]">
							NoteBro for Mac
						</h3>
						<p class="font-mono text-xs text-[#625854] mt-1.5 leading-relaxed">
							Lives in your menu bar. Press <code class="px-1.5 py-0.5 bg-[#fbf1e4] rounded border border-[#1e1714]/20 font-bold text-[#1e1714]">⌥Space</code> anywhere, jot the thought, close. Never hunt for a file or folder again.
						</p>
					</div>
					<div class="mt-4 pt-3 border-t border-[#1e1714]/10 flex items-center justify-between gap-2">
						<a
							href={MAC_DMG.href}
							download={MAC_DMG.filename}
							class="btn-bro px-3.5 py-2 bg-[#fef08a] text-[#1e1714] rounded-xl font-mono text-xs font-black text-center flex items-center gap-1.5"
						>
							<span>⬇️</span> Download Mac DMG
						</a>
						<button
							type="button"
							on:click={() => (isMacModalOpen = true)}
							class="font-mono text-[11px] text-[#625854] hover:text-[#1e1714] underline underline-offset-2"
						>
							Shortcuts & info
						</button>
					</div>
				</div>

				<!-- Digital Cartridge Card -->
				<div class="card-frame p-5 bg-[#fffdf8] flex flex-col justify-between">
					<div>
						<div class="flex items-center justify-between mb-2.5">
							<span class="text-2xl">📼</span>
							<span class="text-[10px] font-mono font-black uppercase tracking-wider bg-[#fed7aa] text-[#b45309] px-2 py-0.5 rounded-full border border-[#b45309]/30">
								{PRICING.displayPrice}
							</span>
						</div>
						<h3 class="font-mono font-black text-base text-[#1e1714]">
							Digital Cartridge
						</h3>
						<p class="font-mono text-xs text-[#625854] mt-1.5 leading-relaxed">
							Pay once. Keep it forever. No subscriptions, no cloud spying, no locked notes. 100% private, local to your machine, and yours for good.
						</p>
					</div>
					<div class="mt-4 pt-3 border-t border-[#1e1714]/10 flex items-center justify-between gap-2">
						<button
							type="button"
							on:click={() => (isSupportOpen = true)}
							class="btn-bro px-3.5 py-2 bg-[#a7f3d0] hover:bg-[#6ee7b7] text-[#1e1714] rounded-xl font-mono text-xs font-black text-center flex items-center gap-1.5"
						>
							<span>✨</span> Unlock Suite — {PRICING.displayPrice}
						</button>
						<span class="font-mono text-[11px] text-[#8a7d76]">
							{PRICING.approxUsdPrice}
						</span>
					</div>
				</div>
			</div>
		</section>
	</main>

	<!-- Footer: The Grounded Soft Neo Toybrut Anchor -->
	<footer
		class="w-full max-w-4xl mx-auto mt-12 pt-6 pb-12 border-t border-[#1e1714]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#8a7d76]"
	>
		<div class="flex items-center gap-2 select-none">
			<div class="w-5 h-5 rounded-md bg-[#fef08a] border border-[#1e1714] flex items-center justify-center text-[10px]">
				📝
			</div>
			<span class="font-black text-[#1e1714]">NoteBro</span>
			<span class="text-[#1e1714]/30">·</span>
			<span class="text-[#625854]">In a world of Word, be Notepad</span>
		</div>

		<div class="flex items-center gap-3 select-none flex-wrap justify-center sm:justify-end">
			<button
				type="button"
				on:click={() => (isMacModalOpen = true)}
				class="hover:text-[#1e1714] transition-colors"
			>
				 Mac App
			</button>
			<span class="text-[#1e1714]/20">·</span>
			<button
				type="button"
				on:click={() => (isSupportOpen = true)}
				class="btn-bro font-black text-[#1e1714] bg-[#fed7aa] px-2.5 py-1 rounded-lg text-xs"
			>
				Cartridge {PRICING.displayPrice}
			</button>
			<span class="text-[#1e1714]/20">·</span>
			<a href="/privacy" class="hover:text-[#1e1714] transition-colors">Privacy</a>
			<span class="text-[#1e1714]/20">·</span>
			<a href="/support" class="hover:text-[#1e1714] transition-colors">Support</a>
		</div>
	</footer>
</div>

<!-- Modals -->
<SupportModal isOpen={isSupportOpen} onClose={() => (isSupportOpen = false)} />
<ExportModal isOpen={isExportOpen} {cards} onClose={() => (isExportOpen = false)} />
<MacAppModal isOpen={isMacModalOpen} onClose={() => (isMacModalOpen = false)} />
<SyncModal isOpen={isSyncOpen} {cards} onCardsUpdate={handleCardsUpdate} onClose={() => (isSyncOpen = false)} />
