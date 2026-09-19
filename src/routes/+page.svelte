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
	let showShowcase = true;

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
	<title>NoteBro 📝 — In a world of Word, be Notepad.</title>
	<meta
		name="description"
		content="NoteBro is a zero-friction notes app that's already taking your note when you open it. No headers, no folders, just a cursor."
	/>
</svelte:head>

<div class="min-h-screen flex flex-col justify-between py-2 sm:py-6 px-3 sm:px-6 max-w-4xl mx-auto w-full">
	<!-- Top Bar -->
	<BroHeader
		onNewCard={handleNewCard}
		onOpenExport={() => (isExportOpen = true)}
		onOpenSupport={() => (isSupportOpen = true)}
		onOpenMacModal={() => (isMacModalOpen = true)}
	/>

	<!-- Main Deck Area (Live Instant Scratchpad) -->
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

	<!-- Website Showcase & Manifesto (The notebro.app Experience) -->
	{#if showShowcase}
		<section class="w-full max-w-2xl mx-auto mt-12 mb-8 space-y-8 animate-fadeIn">
			<!-- Hero Quote / Motto -->
			<div class="card-frame p-6 sm:p-8 bg-white text-center relative overflow-hidden">
				<div class="inline-block px-3 py-1 rounded-full bg-[#fef08a] border-2 border-[#1e1714] text-xs font-mono font-black uppercase tracking-wider mb-3">
					The Anti-Bloat Manifesto
				</div>
				<h2 class="text-2xl sm:text-3xl font-mono font-black text-[#1e1714] tracking-tight leading-tight mb-2">
					"In a world of Word, be Notepad."
				</h2>
				<p class="text-xs sm:text-sm font-mono text-[#625854] max-w-lg mx-auto">
					Every other notes app forces you through a ritual before you can write. NoteBro just starts. You open it, cursor is blinking, and you go.
				</p>
			</div>

			<!-- Comparison Matrix -->
			<div class="card-frame p-5 sm:p-7 bg-[#fffaf0] border-2 border-[#1e1714]">
				<h3 class="text-sm font-mono font-black text-[#1e1714] uppercase tracking-wider mb-4">
					The Cognitive Setup Tax
				</h3>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
					<div class="p-3 bg-white rounded-xl border border-[#1e1714]/20 opacity-70">
						<div class="font-bold text-[#ef4444] mb-1">❌ TextEdit</div>
						<div class="text-[#625854]">Demands a file name and folder path before you write a single word.</div>
					</div>
					<div class="p-3 bg-white rounded-xl border border-[#1e1714]/20 opacity-70">
						<div class="font-bold text-[#ef4444] mb-1">❌ Apple Notes</div>
						<div class="text-[#625854]">Forces an H1 heading line and traps your thoughts in iCloud silos.</div>
					</div>
					<div class="p-3 bg-white rounded-xl border border-[#1e1714]/20 opacity-70">
						<div class="font-bold text-[#ef4444] mb-1">❌ Notion</div>
						<div class="text-[#625854]">Wants templates, relational databases, tags, and cloud loading spinners.</div>
					</div>
					<div class="p-3 bg-[#a7f3d0]/30 rounded-xl border-2 border-[#10b981]">
						<div class="font-bold text-[#065f46] mb-1">✨ NoteBro</div>
						<div class="text-[#1e1714] font-medium">Blinking cursor. Flick cards with arrows. Auto-saved immediately.</div>
					</div>
				</div>
			</div>

			<!-- The Trinity Suite -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
				<!-- Mac App Card -->
				<div class="card-frame p-5 bg-white flex flex-col justify-between">
					<div>
						<div class="text-2xl mb-2"></div>
						<h4 class="font-black text-sm text-[#1e1714] mb-1">NoteBro for Mac</h4>
						<p class="text-[11px] text-[#625854] leading-relaxed mb-4">
							Lives in your menu bar. Hit <code>⌥Space</code> anywhere, type, close. 2.4MB native Swift binary, zero battery drain.
						</p>
					</div>
					<div class="flex flex-col gap-1.5">
						<a
							href="/downloads/NoteBro-1.0.0.dmg"
							download
							class="btn-bro w-full py-1.5 px-3 bg-[#fef08a] text-[#1e1714] rounded-lg text-xs font-black text-center flex items-center justify-center gap-1.5"
						>
							<span>⬇️</span> Download .dmg
						</a>
						<button
							type="button"
							on:click={() => (isMacModalOpen = true)}
							class="w-full py-1 text-[11px] text-[#625854] hover:text-[#1e1714] font-mono underline text-center cursor-pointer"
						>
							View features & shortcuts
						</button>
					</div>
				</div>

				<!-- Web PWA Card -->
				<div class="card-frame p-5 bg-white flex flex-col justify-between">
					<div>
						<div class="text-2xl mb-2">🌐</div>
						<h4 class="font-black text-sm text-[#1e1714] mb-1">Web & PWA</h4>
						<p class="text-[11px] text-[#625854] leading-relaxed mb-4">
							Installable offline app. Swipe cards, use pastel highlighters, and export Markdown anytime.
						</p>
					</div>
					<div class="text-[11px] font-bold text-[#10b981] py-1.5 text-center bg-[#a7f3d0]/30 rounded-lg border border-[#10b981]/30">
						✓ You are here
					</div>
				</div>

				<!-- Extension Card -->
				<div class="card-frame p-5 bg-white flex flex-col justify-between">
					<div>
						<div class="text-2xl mb-2">🧩</div>
						<h4 class="font-black text-sm text-[#1e1714] mb-1">Chrome Extension</h4>
						<p class="text-[11px] text-[#625854] leading-relaxed mb-4">
							Right-click any webpage quote to capture it directly to your card deck with source citations.
						</p>
					</div>
					<a
						href="https://github.com/pibulus/notebro-extension"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-bro w-full py-1.5 px-3 bg-[#fed7aa] text-[#1e1714] rounded-lg text-xs font-bold text-center block"
					>
						Extension Info
					</a>
				</div>
			</div>

			<!-- Digital Cartridge Support Banner -->
			<div class="card-frame p-6 bg-[#fef08a] border-3 border-[#1e1714] flex flex-col sm:flex-row items-center justify-between gap-4">
				<div class="text-left">
					<div class="font-mono font-black text-lg text-[#1e1714]">
						Digital Cartridge — $19 AUD
					</div>
					<div class="font-mono text-xs text-[#625854] mt-0.5">
						Pay once. Keep it forever. No subscriptions. 100% private.
					</div>
				</div>
				<button
					type="button"
					on:click={() => (isSupportOpen = true)}
					class="btn-bro px-5 py-2.5 bg-white text-[#1e1714] rounded-xl font-mono text-xs font-black shrink-0"
				>
					Unlock the Suite 📼
				</button>
			</div>
		</section>
	{/if}

	<!-- Footer -->
	<footer class="w-full max-w-2xl mx-auto mt-6 pt-4 border-t border-[#1e1714]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#9b8f88]">
		<div class="flex items-center gap-2">
			<span>📝 NoteBro</span>
			<span>·</span>
			<span class="text-[#625854]">In a world of Word, be Notepad</span>
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
</div>

<!-- Modals -->
<SupportModal isOpen={isSupportOpen} onClose={() => (isSupportOpen = false)} />
<ExportModal isOpen={isExportOpen} {cards} onClose={() => (isExportOpen = false)} />
<MacAppModal isOpen={isMacModalOpen} onClose={() => (isMacModalOpen = false)} />
