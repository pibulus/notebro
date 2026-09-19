<script>
	import { onMount } from 'svelte';
	import BroHeader from '$lib/components/BroHeader.svelte';
	import Deck from '$lib/components/Deck.svelte';
	import SupportModal from '$lib/components/SupportModal.svelte';
	import ExportModal from '$lib/components/ExportModal.svelte';
	import MacAppModal from '$lib/components/MacAppModal.svelte';
	import SyncModal from '$lib/components/SyncModal.svelte';
	import { PRICING } from '$lib/config/pricing.js';
	import { MAC_DMG } from '$lib/config/download.js';
	import {
		loadCards,
		saveCards,
		loadActiveIndex,
		saveActiveIndex,
		DEFAULT_CARDS
	} from '$lib/storage.js';

	let cards = DEFAULT_CARDS;
	let activeIndex = 0;
	let deckComponentRef;
	let isSupportOpen = false;
	let isExportOpen = false;
	let isMacModalOpen = false;
	let isSyncOpen = false;
	let loaded = false;
	let showShowcase = true;

	onMount(() => {
		cards = loadCards();
		activeIndex = loadActiveIndex(cards.length - 1);
		loaded = true;

		// Check for #sync=BRO-XXXX or ?sync=BRO-XXXX from QR scan
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
		if (deckComponentRef) {
			deckComponentRef.addCard();
		}
	}
</script>

<svelte:head>
	<title>NoteBro — a quick note app for Mac</title>
	<meta
		name="description"
		content="A quick note app. Open it and the cursor is already blinking — no folders, no title fields, no account. Native Mac menu bar app plus an offline web version."
	/>
</svelte:head>

<div class="min-h-screen flex flex-col justify-between py-2 sm:py-6 px-3 sm:px-6 max-w-4xl mx-auto w-full">
	<!-- Top Bar -->
	<BroHeader
		onNewCard={handleNewCard}
		onOpenSync={() => (isSyncOpen = true)}
		onOpenExport={() => (isExportOpen = true)}
		onOpenSupport={() => (isSupportOpen = true)}
		onOpenMacModal={() => (isMacModalOpen = true)}
	/>

	<!-- Main Deck Area (Live Instant Scratchpad) -->
	<section class="flex-1 flex items-center justify-center my-2 sm:my-4 w-full">
		<Deck
			bind:this={deckComponentRef}
			{cards}
			{activeIndex}
			onCardsUpdate={handleCardsUpdate}
			onIndexUpdate={handleIndexUpdate}
		/>
	</section>

	<!-- Below the card there is exactly one job: get the app. The old showcase
	     ran a competitor comparison grid, a three-way platform matrix and a
	     separate price banner — four sections arguing when someone just wants a
	     download button. -->
	{#if showShowcase}
		<section class="w-full max-w-2xl mx-auto mt-14 mb-6 animate-fadeIn">
			<div class="card-frame overflow-hidden">
				<div class="px-6 sm:px-10 pt-9 pb-8 text-center">
					<h2
						class="text-2xl sm:text-[28px] font-mono font-black text-[#1e1714] tracking-tight leading-tight"
					>
						Keep it in the menu bar.
					</h2>
					<p
						class="mt-2.5 text-[13px] sm:text-sm font-mono text-[#625854] leading-relaxed max-w-md mx-auto"
					>
						{MAC_DMG.size} native Swift app. Hit ⌥Space anywhere, type, close.
						Cards stay on the machine.
					</p>

					<div class="mt-7 flex flex-col sm:flex-row items-stretch justify-center gap-3">
						<a
							href={MAC_DMG.href}
							download={MAC_DMG.filename}
							class="btn-bro px-6 py-3 bg-[#fef08a] text-[#1e1714] rounded-xl font-mono text-sm font-black text-center"
						>
							Download for Mac
						</a>
						<button
							type="button"
							on:click={() => (isSupportOpen = true)}
							class="btn-bro px-6 py-3 bg-[#a7f3d0] text-[#1e1714] rounded-xl font-mono text-sm font-black text-center"
						>
							Get the Cartridge — {PRICING.displayPrice}
						</button>
					</div>

					<p class="mt-4 text-[11px] font-mono text-[#8a7d76]">
						Apple Silicon · macOS 13+ · pay once, keep it
					</p>
				</div>

				<div
					class="grid grid-cols-1 sm:grid-cols-3 border-t-2 border-[#4a3f38]/15 font-mono text-center divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-[#4a3f38]/15"
				>
					<div class="px-5 py-5">
						<div class="text-[13px] font-black text-[#1e1714]">Nothing to set up</div>
						<p class="mt-1 text-[11px] text-[#625854] leading-relaxed">
							No account, no folder, no title field.
						</p>
					</div>
					<div class="px-5 py-5">
						<div class="text-[13px] font-black text-[#1e1714]">Stays private</div>
						<p class="mt-1 text-[11px] text-[#625854] leading-relaxed">
							Cards live on the device. Sync is encrypted end to end.
						</p>
					</div>
					<div class="px-5 py-5">
						<div class="text-[13px] font-black text-[#1e1714]">Leaves clean</div>
						<p class="mt-1 text-[11px] text-[#625854] leading-relaxed">
							Exports plain Markdown whenever.
						</p>
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Footer -->
	<footer class="w-full max-w-2xl mx-auto mt-6 pt-4 border-t border-[#1e1714]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#9b8f88]">
		<div class="flex items-center gap-2">
			<span>📝 NoteBro</span>
			<span>·</span>
			<span class="text-[#625854]">Quick notes, nothing else</span>
		</div>

		<div class="flex items-center gap-3">
			<a href="/privacy" class="hover:underline text-[#625854]">Privacy</a>
			<span>·</span>
			<a href="/support" class="hover:underline text-[#625854]">Support</a>
			<span>·</span>
			<button
				type="button"
				on:click={() => (isSupportOpen = true)}
				class="text-[#b45309] hover:underline font-bold"
			>
				Cartridge {PRICING.displayPrice}
			</button>
		</div>
	</footer>
</div>

<!-- Modals -->
<SupportModal isOpen={isSupportOpen} onClose={() => (isSupportOpen = false)} />
<ExportModal isOpen={isExportOpen} {cards} onClose={() => (isExportOpen = false)} />
<MacAppModal isOpen={isMacModalOpen} onClose={() => (isMacModalOpen = false)} />
<SyncModal isOpen={isSyncOpen} {cards} onCardsUpdate={handleCardsUpdate} onClose={() => (isSyncOpen = false)} />
