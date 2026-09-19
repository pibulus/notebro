<script>
	import { onMount } from 'svelte';
	import BroHeader from '$lib/components/BroHeader.svelte';
	import Deck from '$lib/components/Deck.svelte';
	import SupportModal from '$lib/components/SupportModal.svelte';
	import ExportModal from '$lib/components/ExportModal.svelte';
	import MacAppModal from '$lib/components/MacAppModal.svelte';
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
	let loaded = false;

	onMount(() => {
		cards = loadCards();
		activeIndex = loadActiveIndex(cards.length - 1);
		loaded = true;
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
	<title>NoteBro 📝 — Your note bro. Always there.</title>
</svelte:head>

<main class="flex-1 flex flex-col justify-between py-2 sm:py-6 px-3 sm:px-6 max-w-4xl mx-auto w-full">
	<!-- Top Bar -->
	<BroHeader
		onNewCard={handleNewCard}
		onOpenExport={() => (isExportOpen = true)}
		onOpenSupport={() => (isSupportOpen = true)}
		onOpenMacModal={() => (isMacModalOpen = true)}
	/>

	<!-- Main Deck Area -->
	<section class="flex-1 flex items-center justify-center my-2 sm:my-4 w-full">
		{#if loaded}
			<Deck
				bind:this={deckComponentRef}
				{cards}
				{activeIndex}
				onCardsUpdate={handleCardsUpdate}
				onIndexUpdate={handleIndexUpdate}
			/>
		{:else}
			<div class="card-frame p-8 text-center font-mono text-xs text-[#625854]">
				Loading NoteBro...
			</div>
		{/if}
	</section>

	<!-- Footer -->
	<footer class="w-full max-w-2xl mx-auto mt-6 pt-4 border-t border-[#1e1714]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#9b8f88]">
		<div class="flex items-center gap-2">
			<span>📝 NoteBro v1.0</span>
			<span>·</span>
			<span class="text-[#625854]">Local-first, weaponized simplicity</span>
		</div>

		<div class="flex items-center gap-3">
			<span class="hidden sm:inline">Shortcuts: <code>⌥←</code> / <code>⌥→</code> flick · <code>⌘K</code> new</span>
			<button
				type="button"
				on:click={() => (isSupportOpen = true)}
				class="text-[#b45309] hover:underline font-bold"
			>
				Cartridge $19 AUD
			</button>
		</div>
	</footer>
</main>

<!-- Modals -->
<SupportModal isOpen={isSupportOpen} onClose={() => (isSupportOpen = false)} />
<ExportModal isOpen={isExportOpen} {cards} onClose={() => (isExportOpen = false)} />
<MacAppModal isOpen={isMacModalOpen} onClose={() => (isMacModalOpen = false)} />
