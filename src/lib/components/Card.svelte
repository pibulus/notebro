<script>
	import { onMount, tick } from 'svelte';
	import { PASTEL_COLORS } from '$lib/storage.js';
	import { playTypeKey } from '$lib/sound.js';

	export let card;
	export let onChange = (updated) => {};
	export let onDelete = () => {};
	export let onTogglePin = () => {};
	export let onInsertTodo = () => {};
	export let isOnlyCard = false;

	let textareaRef;
	let copied = false;
	let showDeleteConfirm = false;

	$: activeColorObj = PASTEL_COLORS.find((c) => c.id === card.color) || PASTEL_COLORS[0];
	$: words = card.content ? card.content.trim().split(/\s+/).filter(Boolean).length : 0;
	$: chars = card.content ? card.content.length : 0;

	// Focus the textarea immediately on mount and on card ID change
	onMount(async () => {
		await tick();
		focusEditor();
	});

	export function focusEditor() {
		if (!textareaRef) return;
		textareaRef.focus();
		const len = textareaRef.value.length;
		textareaRef.setSelectionRange(len, len);
		// setSelectionRange scrolls to the caret, which buries the top of an
		// existing note. The first line is the one worth seeing on arrival.
		textareaRef.scrollTop = 0;
	}

	function handleInput(e) {
		onChange({
			...card,
			content: e.target.value,
			updatedAt: new Date().toISOString()
		});
	}

	function handleKeydown(e) {
		if (!e.metaKey && !e.ctrlKey && !e.altKey) {
			playTypeKey(e.key);
		}
	}

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(card.content);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 1800);
		} catch (err) {
			console.error('Failed to copy', err);
		}
	}

	export function highlightSelection(colorId) {
		if (!textareaRef) return;
		const start = textareaRef.selectionStart;
		const end = textareaRef.selectionEnd;
		if (start === end) return; // nothing selected

		const selectedText = card.content.substring(start, end);
		const newContent =
			card.content.substring(0, start) +
			`==${selectedText}==` +
			card.content.substring(end);

		onChange({
			...card,
			content: newContent,
			color: colorId,
			updatedAt: new Date().toISOString()
		});

		tick().then(() => {
			if (textareaRef) {
				textareaRef.focus();
				textareaRef.setSelectionRange(start + 2, end + 2);
			}
		});
	}

	function formattedDate(iso) {
		if (!iso) return '';
		const d = new Date(iso);
		return d.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div
	class="relative w-full max-w-2xl mx-auto flex flex-col card-frame transition-all duration-200"
	style="border-top: 8px solid {activeColorObj.hex};"
>
	<!-- Metadata is ambient, actions are quiet. This bar previously held six
	     chunky chips and out-shouted the note itself. -->
	<div
		class="group flex items-center justify-between gap-3 px-4 sm:px-6 pt-3 pb-2 border-b-2 border-[#4a3f38]/10 bg-[#faf6ef] rounded-t-[1rem]"
	>
		<div class="flex items-center gap-2.5 min-w-0">
			<span
				class="w-2.5 h-2.5 shrink-0 rounded-full border border-[#4a3f38]/30"
				style="background-color: {activeColorObj.hex};"
			></span>
			<span class="text-[11px] font-mono text-[#8a7d76] truncate">
				{formattedDate(card.updatedAt)}
			</span>
			{#if card.pinned}
				<span
					class="shrink-0 text-[10px] font-mono font-black uppercase tracking-wider text-[#1e1714] bg-[#fef08a] border border-[#4a3f38]/40 rounded px-1.5 py-0.5"
				>
					Pinned
				</span>
			{/if}
		</div>

		<div
			class="flex items-center gap-1 opacity-60 group-hover:opacity-100 focus-within:opacity-100 transition-opacity"
		>
			<span class="text-[11px] font-mono text-[#8a7d76] hidden sm:inline mr-1">
				{words}{words === 1 ? ' word' : ' words'}
			</span>

			<button
				type="button"
				on:click={onTogglePin}
				class="px-2 py-1 text-[11px] font-mono font-bold rounded-md text-[#625854] hover:bg-[#fef08a] hover:text-[#1e1714] transition-colors"
				title={card.pinned ? 'Unpin card' : 'Pin to top of stack'}
			>
				{card.pinned ? 'Unpin' : 'Pin'}
			</button>

			<button
				type="button"
				on:click={onInsertTodo}
				class="px-2 py-1 text-[11px] font-mono font-bold rounded-md text-[#625854] hover:bg-[#fef08a] hover:text-[#1e1714] transition-colors hidden sm:block"
				title="Insert a checklist line"
			>
				Todo
			</button>

			<button
				type="button"
				on:click={handleCopy}
				class="px-2 py-1 text-[11px] font-mono font-bold rounded-md text-[#625854] hover:bg-[#fef08a] hover:text-[#1e1714] transition-colors"
				title="Copy card text"
			>
				{copied ? 'Copied' : 'Copy'}
			</button>

			{#if !isOnlyCard}
				{#if showDeleteConfirm}
					<button
						type="button"
						on:click={onDelete}
						class="px-2 py-1 text-[11px] font-mono font-black rounded-md bg-[#fca5a5] text-[#7f1d1d]"
					>
						Discard?
					</button>
					<button
						type="button"
						on:click={() => (showDeleteConfirm = false)}
						class="px-1.5 py-1 text-[11px] font-mono text-[#8a7d76] hover:text-[#1e1714]"
					>
						No
					</button>
				{:else}
					<button
						type="button"
						on:click={() => (showDeleteConfirm = true)}
						class="px-2 py-1 text-[11px] font-mono font-bold rounded-md text-[#8a7d76] hover:bg-[#fca5a5]/40 hover:text-[#7f1d1d] transition-colors"
						title="Discard card"
					>
						Discard
					</button>
				{/if}
			{/if}
		</div>
	</div>

	<!-- Card Body / Blinking Cursor Editor -->
	<div class="relative p-4 sm:p-7 flex-1 min-h-[360px] sm:min-h-[420px] bg-[#fffdf8] rounded-b-[1.25rem] sm:rounded-b-[1.5rem]">
		<textarea
			bind:this={textareaRef}
			value={card.content}
			on:input={handleInput}
			on:keydown={handleKeydown}
			placeholder="Start writing... NoteBro is already holding your note."
			class="paper-scroll w-full h-full min-h-[340px] sm:min-h-[390px] resize-none outline-none border-none bg-transparent font-mono text-[15px] sm:text-[16px] leading-[1.8] text-[#1e1714] placeholder-[#9b8f88]/60 focus:ring-0 selection:bg-[#fef08a]"
			spellcheck="false"
		></textarea>
	</div>
</div>
