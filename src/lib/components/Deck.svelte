<script>
	import { onMount } from 'svelte';
	import Card from './Card.svelte';
	import HighlighterBar from './HighlighterBar.svelte';
	import { generateCardId } from '$lib/storage.js';
	import { playCardFlick, playCardPop, playCheckmark, playColorTone } from '$lib/sound.js';

	export let cards = [];
	export let activeIndex = 0;
	export let onCardsUpdate = (updatedCards) => {};
	export let onIndexUpdate = (idx) => {};

	let cardComponentRef;

	$: currentCard = cards[activeIndex] || cards[0];

	function prevCard() {
		if (activeIndex > 0) {
			playCardFlick();
			onIndexUpdate(activeIndex - 1);
		}
	}

	function nextCard() {
		if (activeIndex < cards.length - 1) {
			playCardFlick();
			onIndexUpdate(activeIndex + 1);
		}
	}

	export function addCard() {
		playCardPop();
		const newCard = {
			id: generateCardId(),
			content: '',
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

	function jumpToCard(idx) {
		if (idx !== activeIndex) {
			playCardFlick();
			onIndexUpdate(idx);
		}
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

	// Touch swipe navigation for mobile
	let touchStartX = 0;
	let touchStartY = 0;

	function handleTouchStart(e) {
		if (!e.touches || e.touches.length === 0) return;
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}

	function handleTouchEnd(e) {
		if (!e.changedTouches || e.changedTouches.length === 0) return;
		const deltaX = e.changedTouches[0].clientX - touchStartX;
		const deltaY = e.changedTouches[0].clientY - touchStartY;

		// Horizontal swipe threshold 45px, more horizontal than vertical
		if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
			if (deltaX < 0) {
				nextCard();
			} else {
				prevCard();
			}
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div
	class="w-full flex flex-col items-center touch-pan-y"
	on:touchstart={handleTouchStart}
	on:touchend={handleTouchEnd}
>
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

	<!-- Dock below the card: Marker tray (left) + Card Pager (right) -->
	<div class="w-full max-w-2xl mt-3 sm:mt-4 px-1 sm:px-0 flex items-center justify-between gap-1.5 sm:gap-3">
		<HighlighterBar
			activeColor={currentCard ? currentCard.color : 'yellow'}
			onSelectColor={handleColorSelect}
			onHighlightSelection={handleHighlightSelection}
		/>

		<!-- Tactile Pager Controls -->
		<div class="flex items-center gap-1 font-mono text-xs select-none shrink-0">
			<button
				type="button"
				on:click={prevCard}
				disabled={activeIndex <= 0}
				class="btn-bro w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-[#fffdf8] text-[#1e1714] disabled:opacity-25 disabled:cursor-not-allowed font-bold text-xs"
				title="Previous Card (⌥← or swipe right)"
				aria-label="Previous Card"
			>
				←
			</button>

			<div class="flex items-center gap-0.5 px-0.5">
				{#each cards as _, i}
					<button
						type="button"
						on:click={() => jumpToCard(i)}
						class="w-5 h-8 flex items-center justify-center"
						title="Card {i + 1} of {cards.length}"
						aria-label="Jump to card {i + 1}"
					>
						<span
							class="h-2 rounded-full transition-all border border-[#1e1714]/40 {activeIndex === i
								? 'w-4 sm:w-5 bg-[#1e1714]'
								: 'w-2 bg-[#1e1714]/20 hover:bg-[#1e1714]/40'}"
						></span>
					</button>
				{/each}
			</div>

			<button
				type="button"
				on:click={nextCard}
				disabled={activeIndex >= cards.length - 1}
				class="btn-bro w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-[#fffdf8] text-[#1e1714] disabled:opacity-25 disabled:cursor-not-allowed font-bold text-xs"
				title="Next Card (⌥→ or swipe left)"
				aria-label="Next Card"
			>
				→
			</button>
		</div>
	</div>
</div>
