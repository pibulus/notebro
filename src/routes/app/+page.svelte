<script>
	import { onMount } from 'svelte';
	import BroHeader from '$lib/components/BroHeader.svelte';
	import Deck from '$lib/components/Deck.svelte';
	import SupportModal from '$lib/components/SupportModal.svelte';
	import ExportModal from '$lib/components/ExportModal.svelte';
	import MacAppModal from '$lib/components/MacAppModal.svelte';
	import SyncModal from '$lib/components/SyncModal.svelte';
	import { loadCards, saveCards, loadActiveIndex, saveActiveIndex, DEFAULT_CARDS } from '$lib/storage.js';

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
	<title>NoteBro</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen flex flex-col py-2 sm:py-6 px-3 sm:px-6 max-w-4xl mx-auto w-full">
	<BroHeader
		onNewCard={handleNewCard}
		onOpenSync={() => (isSyncOpen = true)}
		onOpenExport={() => (isExportOpen = true)}
		onOpenSupport={() => (isSupportOpen = true)}
		onOpenMacModal={() => (isMacModalOpen = true)}
	/>

	<section class="flex-1 flex items-start justify-center w-full">
		<Deck
			bind:this={deckComponentRef}
			{cards}
			{activeIndex}
			onCardsUpdate={handleCardsUpdate}
			onIndexUpdate={handleIndexUpdate}
		/>
	</section>
</div>

<SupportModal isOpen={isSupportOpen} onClose={() => (isSupportOpen = false)} />
<ExportModal isOpen={isExportOpen} {cards} onClose={() => (isExportOpen = false)} />
<MacAppModal isOpen={isMacModalOpen} onClose={() => (isMacModalOpen = false)} />
<SyncModal isOpen={isSyncOpen} {cards} onCardsUpdate={handleCardsUpdate} onClose={() => (isSyncOpen = false)} />
