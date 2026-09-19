<script>
	import { onMount } from 'svelte';
	import Card from './Card.svelte';
	import HighlighterBar from './HighlighterBar.svelte';
	import { generateCardId, extractHashtags, getAllTags } from '$lib/storage.js';

	export let cards = [];
	export let activeIndex = 0;
	export let onCardsUpdate = (updatedCards) => {};
	export let onIndexUpdate = (idx) => {};

	let cardComponentRef;
	let selectedTag = null;

	$: allTags = getAllTags(cards);

	// Filter indices according to selected tag
	$: activeIndices = selectedTag
		? cards
				.map((c, i) => (extractHashtags(c.content).includes(selectedTag) ? i : -1))
				.filter((i) => i !== -1)
		: cards.map((_, i) => i);

	$: currentFilteredPos = activeIndices.indexOf(activeIndex);

	// Ensure activeIndex is valid within filtered list
	$: if (selectedTag && currentFilteredPos === -1 && activeIndices.length > 0) {
		onIndexUpdate(activeIndices[0]);
	}

	$: currentCard = cards[activeIndex] || cards[0];

	function prevCard() {
		if (currentFilteredPos > 0) {
			onIndexUpdate(activeIndices[currentFilteredPos - 1]);
		}
	}

	function nextCard() {
		if (currentFilteredPos < activeIndices.length - 1) {
			onIndexUpdate(activeIndices[currentFilteredPos + 1]);
		}
	}

	export function addCard() {
		const newCard = {
			id: generateCardId(),
			content: selectedTag ? `${selectedTag} ` : '',
			color: 'yellow',
			pinned: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		const updated = [...cards, newCard];
		onCardsUpdate(updated);
		onIndexUpdate(updated.length - 1);
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

	function handleTogglePin() {
		if (!currentCard) return;
		const wasPinned = !currentCard.pinned;
		const updatedCard = { ...currentCard, pinned: wasPinned, updatedAt: new Date().toISOString() };
		let updatedCards = [...cards];
		updatedCards[activeIndex] = updatedCard;

		// Sort pinned cards to top
		updatedCards.sort((a, b) => {
			if (Boolean(a.pinned) !== Boolean(b.pinned)) {
				return a.pinned ? -1 : 1;
			}
			return new Date(b.updatedAt) - new Date(a.updatedAt);
		});

		const newIdx = updatedCards.findIndex((c) => c.id === currentCard.id);
		onCardsUpdate(updatedCards);
		onIndexUpdate(newIdx >= 0 ? newIdx : 0);
	}

	function handleInsertTodo() {
		if (!currentCard) return;
		let content = currentCard.content;
		if (!content) {
			content = '- [ ] ';
		} else if (content.endsWith('\n')) {
			content += '- [ ] ';
		} else {
			content += '\n- [ ] ';
		}
		handleCardChange({
			...currentCard,
			content,
			updatedAt: new Date().toISOString()
		});
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
	<div class="w-full max-w-2xl flex items-center justify-between mb-2 px-2 sm:px-0">
		<!-- Left / Prev Button -->
		<div class="flex items-center gap-2">
			<button
				type="button"
				on:click={prevCard}
				disabled={currentFilteredPos <= 0}
				class="btn-bro px-3 py-1.5 bg-white text-[#1e1714] rounded-xl font-mono text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
				title="Previous Card (⌥←)"
			>
				<span>←</span>
				<span class="hidden sm:inline">Prev</span>
			</button>

			<span class="font-mono text-xs sm:text-sm font-bold text-[#1e1714] bg-[#f5efe3] px-3 py-1.5 rounded-xl border-2 border-[#1e1714] shadow-brutal-sm">
				Card {currentFilteredPos >= 0 ? currentFilteredPos + 1 : 1} of {activeIndices.length}
			</span>

			<!-- Right / Next Button -->
			<button
				type="button"
				on:click={nextCard}
				disabled={currentFilteredPos >= activeIndices.length - 1}
				class="btn-bro px-3 py-1.5 bg-white text-[#1e1714] rounded-xl font-mono text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
				title="Next Card (⌥→)"
			>
				<span class="hidden sm:inline">Next</span>
				<span>→</span>
			</button>
		</div>

		<!-- Highlighter Marker Bar -->
		<HighlighterBar
			activeColor={currentCard ? currentCard.color : 'yellow'}
			onSelectColor={handleColorSelect}
			onHighlightSelection={handleHighlightSelection}
		/>
	</div>

	<!-- Hashtag Filter Pills (Instant tag chips) -->
	{#if allTags.length > 0}
		<div class="w-full max-w-2xl flex items-center gap-1.5 mb-3 px-2 sm:px-0 overflow-x-auto py-1">
			<button
				type="button"
				on:click={() => (selectedTag = null)}
				class="btn-bro px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all {selectedTag === null ? 'bg-[#fef08a] text-[#1e1714]' : 'bg-white text-[#625854]'}"
			>
				All ({cards.length})
			</button>

			{#each allTags as tag}
				<button
					type="button"
					on:click={() => (selectedTag = selectedTag === tag ? null : tag)}
					class="btn-bro px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all {selectedTag === tag ? 'bg-[#a7f3d0] text-[#1e1714]' : 'bg-white text-[#625854]'}"
				>
					{tag}
				</button>
			{/each}
		</div>
	{/if}

	<!-- The Active Card -->
	{#if currentCard}
		{#key currentCard.id}
			<Card
				bind:this={cardComponentRef}
				card={currentCard}
				onChange={handleCardChange}
				onDelete={handleDeleteCard}
				onTogglePin={handleTogglePin}
				onInsertTodo={handleInsertTodo}
				isOnlyCard={cards.length <= 1}
			/>
		{/key}
	{/if}

	<!-- Card Stack Pager Dots / Quick Jumper -->
	<div class="flex items-center justify-center gap-1.5 mt-4 flex-wrap max-w-xl px-4">
		{#each activeIndices as originalIdx, i}
			<button
				type="button"
				on:click={() => onIndexUpdate(originalIdx)}
				class="h-2 rounded-full transition-all border border-[#1e1714]/40 {activeIndex === originalIdx ? 'w-6 bg-[#1e1714]' : 'w-2 bg-[#1e1714]/20'}"
				title="Jump to Card {i + 1}"
			></button>
		{/each}
	</div>
</div>
