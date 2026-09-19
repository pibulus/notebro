<script>
	import { onMount } from 'svelte';
	import Card from './Card.svelte';
	import HighlighterBar from './HighlighterBar.svelte';
	import { generateCardId, extractHashtags, getAllTags } from '$lib/storage.js';
	import { playCardFlick, playCardPop, playCheckmark, playColorTone } from '$lib/sound.js';

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
			playCardFlick();
			onIndexUpdate(activeIndices[currentFilteredPos - 1]);
		}
	}

	function nextCard() {
		if (currentFilteredPos < activeIndices.length - 1) {
			playCardFlick();
			onIndexUpdate(activeIndices[currentFilteredPos + 1]);
		}
	}

	export function addCard() {
		playCardPop();
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
		playCheckmark();
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
		playCheckmark();
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
		playColorTone(colorId);
		handleCardChange({
			...currentCard,
			color: colorId,
			updatedAt: new Date().toISOString()
		});
	}

	function handleHighlightSelection(colorId) {
		playColorTone(colorId);
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
	<!-- Hashtag Filter Pills (Instant tag chips) -->
	{#if allTags.length > 0}
		<div class="w-full max-w-2xl flex items-center gap-3 mb-2 px-2 sm:px-0 overflow-x-auto no-scrollbar py-0.5">
			<button
				type="button"
				on:click={() => (selectedTag = null)}
				class="shrink-0 font-mono text-[11px] tracking-wide transition-colors {selectedTag === null
					? 'text-[#1e1714] font-black underline underline-offset-4 decoration-2 decoration-[#fbbf24]'
					: 'text-[#8a7d76] hover:text-[#1e1714]'}"
			>
				All {cards.length}
			</button>

			{#each allTags as tag}
				<button
					type="button"
					on:click={() => (selectedTag = selectedTag === tag ? null : tag)}
					class="shrink-0 font-mono text-[11px] tracking-wide transition-colors {selectedTag === tag
						? 'text-[#1e1714] font-black underline underline-offset-4 decoration-2 decoration-[#34d399]'
						: 'text-[#8a7d76] hover:text-[#1e1714]'}"
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

	<!-- Markers + pager: the only chrome below the card. -->
	<div class="w-full max-w-2xl mt-4 px-2 sm:px-0 flex items-center justify-between gap-4">
		<HighlighterBar
			activeColor={currentCard ? currentCard.color : 'yellow'}
			onSelectColor={handleColorSelect}
			onHighlightSelection={handleHighlightSelection}
		/>

		<div class="flex items-center justify-end gap-1.5 flex-wrap">
		{#each activeIndices as originalIdx, i}
			<button
				type="button"
				on:click={() => onIndexUpdate(originalIdx)}
				class="h-2 rounded-full transition-all border border-[#1e1714]/40 {activeIndex === originalIdx ? 'w-6 bg-[#1e1714]' : 'w-2 bg-[#1e1714]/20'}"
				title="Jump to Card {i + 1}"
				aria-label="Jump to card {i + 1}"
			></button>
			{/each}
		</div>
	</div>
</div>
