<script>
	import { onMount } from 'svelte';
	import Card from './Card.svelte';
	import HighlighterBar from './HighlighterBar.svelte';
	import { generateCardId } from '$lib/storage.js';

	export let cards = [];
	export let activeIndex = 0;
	export let onCardsUpdate = (updatedCards) => {};
	export let onIndexUpdate = (idx) => {};

	let cardComponentRef;

	$: currentCard = cards[activeIndex] || cards[0];

	function prevCard() {
		if (activeIndex > 0) {
			onIndexUpdate(activeIndex - 1);
		}
	}

	function nextCard() {
		if (activeIndex < cards.length - 1) {
			onIndexUpdate(activeIndex + 1);
		}
	}

	export function addCard() {
		const newCard = {
			id: generateCardId(),
			content: '',
			color: 'yellow',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		const updated = [...cards, newCard];
		const nextIdx = updated.length - 1;
		onCardsUpdate(updated);
		onIndexUpdate(nextIdx);
	}

	function handleCardChange(updated) {
		const updatedCards = [...cards];
		updatedCards[activeIndex] = updated;
		onCardsUpdate(updatedCards);
	}

	function handleDeleteCard() {
		if (cards.length <= 1) return;
		const updatedCards = cards.filter((_, idx) => idx !== activeIndex);
		const newIdx = Math.max(0, Math.min(activeIndex, updatedCards.length - 1));
		onCardsUpdate(updatedCards);
		onIndexUpdate(newIdx);
	}

	function handleColorSelect(colorId) {
		if (!currentCard) return;
		handleCardChange({
			...currentCard,
			color: colorId,
			updatedAt: new Date().toISOString()
		});
	}

	function handleHighlightSelection(colorId) {
		if (cardComponentRef) {
			cardComponentRef.highlightSelection(colorId);
		}
	}

	// Keyboard shortcut for card flipping: Option + ArrowLeft / ArrowRight
	function handleKeydown(e) {
		if ((e.altKey || (e.metaKey && e.shiftKey)) && e.key === 'ArrowLeft') {
			e.preventDefault();
			prevCard();
		} else if ((e.altKey || (e.metaKey && e.shiftKey)) && e.key === 'ArrowRight') {
			e.preventDefault();
			nextCard();
		} else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			// Quick shortcut to pull new card
			e.preventDefault();
			addCard();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="w-full flex flex-col items-center">
	<!-- Deck Navigation Bar -->
	<div class="w-full max-w-2xl flex items-center justify-between mb-4 px-2 sm:px-0">
		<!-- Left / Prev Button -->
		<div class="flex items-center gap-2">
			<button
				type="button"
				on:click={prevCard}
				disabled={activeIndex === 0}
				class="btn-bro px-3 py-1.5 bg-white text-[#1e1714] rounded-xl font-mono text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
				title="Previous Card (⌥←)"
			>
				<span>←</span>
				<span class="hidden sm:inline">Prev</span>
			</button>

			<span class="font-mono text-xs sm:text-sm font-bold text-[#1e1714] bg-[#f5efe3] px-3 py-1.5 rounded-xl border-2 border-[#1e1714] shadow-brutal-sm">
				Card {activeIndex + 1} of {cards.length}
			</span>

			<!-- Right / Next Button -->
			<button
				type="button"
				on:click={nextCard}
				disabled={activeIndex === cards.length - 1}
				class="btn-bro px-3 py-1.5 bg-white text-[#1e1714] rounded-xl font-mono text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
				title="Next Card (⌥→)"
			>
				<span class="hidden sm:inline">Next</span>
				<span>→</span>
			</button>
		</div>

		<!-- Highlighter Marker Bar -->
		<HighlighterBar
			activeColor={currentCard.color}
			onSelectColor={handleColorSelect}
			onHighlightSelection={handleHighlightSelection}
		/>
	</div>

	<!-- The Active Card -->
	{#if currentCard}
		{#key currentCard.id}
			<Card
				bind:this={cardComponentRef}
				card={currentCard}
				onChange={handleCardChange}
				onDelete={handleDeleteCard}
				isOnlyCard={cards.length <= 1}
			/>
		{/key}
	{/if}

	<!-- Card Stack Pager Dots / Quick Jumper -->
	<div class="flex items-center justify-center gap-1.5 mt-4 flex-wrap max-w-xl px-4">
		{#each cards as c, i}
			<button
				type="button"
				on:click={() => onIndexUpdate(i)}
				class="h-2 rounded-full transition-all border border-[#1e1714]/40 {activeIndex === i ? 'w-6 bg-[#1e1714]' : 'w-2 bg-[#1e1714]/20'}"
				title="Jump to Card {i + 1}"
			></button>
		{/each}
	</div>
</div>
