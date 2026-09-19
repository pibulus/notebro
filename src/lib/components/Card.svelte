<script>
	import { onMount, tick } from 'svelte';
	import { PASTEL_COLORS } from '$lib/storage.js';

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
		if (textareaRef) {
			textareaRef.focus();
			// Put cursor at end or preserve
			const len = textareaRef.value.length;
			textareaRef.setSelectionRange(len, len);
		}
	}

	function handleInput(e) {
		onChange({
			...card,
			content: e.target.value,
			updatedAt: new Date().toISOString()
		});
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
	<!-- Card Top Bar / Metadata -->
	<div class="flex items-center justify-between px-4 sm:px-6 pt-3 pb-2 border-b-2 border-[#1e1714]/10 bg-[#faf8f5] rounded-t-[1rem]">
		<div class="flex items-center gap-2">
			<span
				class="w-3 h-3 rounded-full border border-[#1e1714]/30"
				style="background-color: {activeColorObj.hex};"
				title="{activeColorObj.label} Card"
			></span>
			<span class="text-xs font-mono font-medium text-[#625854]">
				{formattedDate(card.updatedAt)}
			</span>

			<!-- Pin Toggle -->
			<button
				type="button"
				on:click={onTogglePin}
				class="btn-bro px-2 py-0.5 text-[11px] font-mono font-bold rounded-md flex items-center gap-1 transition-all {card.pinned ? 'bg-[#fef08a] text-[#1e1714]' : 'bg-white text-[#9b8f88]'}"
				title={card.pinned ? "Unpin card" : "Pin to top of stack"}
			>
				<span>📌</span>
				<span class="hidden sm:inline">{card.pinned ? "Pinned" : "Pin"}</span>
			</button>

			<!-- Todo Checklist Insert -->
			<button
				type="button"
				on:click={onInsertTodo}
				class="btn-bro px-2 py-0.5 text-[11px] font-mono font-bold bg-white hover:bg-[#f5efe3] text-[#1e1714] rounded-md hidden sm:flex items-center gap-1"
				title="Insert checklist checkbox"
			>
				<span>☑︎ Todo</span>
			</button>
		</div>

		<div class="flex items-center gap-2 sm:gap-3">
			<span class="text-xs font-mono text-[#9b8f88] hidden sm:inline">
				{words} {words === 1 ? 'word' : 'words'}
			</span>

			<!-- Copy Button -->
			<button
				type="button"
				on:click={handleCopy}
				class="btn-bro px-2.5 py-1 text-xs font-mono font-bold bg-white text-[#1e1714] rounded-lg flex items-center gap-1"
				title="Copy card text"
			>
				{#if copied}
					<span>✓ Copied!</span>
				{:else}
					<span>📋 Copy</span>
				{/if}
			</button>

			<!-- Delete Button -->
			{#if !isOnlyCard}
				{#if showDeleteConfirm}
					<div class="flex items-center gap-1">
						<button
							type="button"
							on:click={onDelete}
							class="btn-bro px-2 py-1 text-xs font-bold bg-[#fca5a5] text-[#7f1d1d] rounded-lg"
						>
							Discard?
						</button>
						<button
							type="button"
							on:click={() => (showDeleteConfirm = false)}
							class="text-xs text-[#625854] px-1 hover:underline"
						>
							No
						</button>
					</div>
				{:else}
					<button
						type="button"
						on:click={() => (showDeleteConfirm = true)}
						class="text-xs text-[#9b8f88] hover:text-[#ef4444] p-1 transition-colors"
						title="Discard card"
					>
						🗑️
					</button>
				{/if}
			{/if}
		</div>
	</div>

	<!-- Card Body / Blinking Cursor Editor -->
	<div class="relative p-4 sm:p-7 flex-1 min-h-[360px] sm:min-h-[420px] bg-white rounded-b-[1.25rem] sm:rounded-b-[1.5rem]">
		<textarea
			bind:this={textareaRef}
			value={card.content}
			on:input={handleInput}
			placeholder="Start writing... NoteBro is already holding your note."
			class="w-full h-full min-h-[340px] sm:min-h-[390px] resize-none outline-none border-none bg-transparent font-mono text-[15px] sm:text-[16px] leading-[1.8] text-[#1e1714] placeholder-[#9b8f88]/60 focus:ring-0 selection:bg-[#fef08a]"
			spellcheck="false"
		></textarea>
	</div>
</div>
