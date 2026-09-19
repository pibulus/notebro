<script>
	import { PASTEL_COLORS } from '$lib/storage.js';

	export let activeColor = 'yellow';
	export let onSelectColor = (colorId) => {};
	export let onHighlightSelection = (colorId) => {};
</script>

<!-- Tactile Pastel Highlighter Bar -->
<div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf1e4] border-2 border-[#1e1714]/20 shadow-brutal-xs">
	<span class="text-[11px] font-mono font-black text-[#625854] mr-1 select-none flex items-center gap-1">
		<span class="text-xs">🖍️</span>
		<span class="hidden sm:inline">Marker</span>
	</span>
	{#each PASTEL_COLORS as c}
		<button
			type="button"
			on:click={() => {
				onSelectColor(c.id);
				onHighlightSelection(c.id);
			}}
			class="w-5 h-5 rounded-full border-2 {c.bgClass} transition-all hover:scale-125 active:scale-95 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1e1714] {activeColor === c.id ? 'border-[#1e1714] ring-2 ring-[#1e1714]/30 scale-110 shadow-xs' : 'border-[#4a3f38]/30 opacity-75 hover:opacity-100'}"
			title="{c.label} marker (tint card / highlight selection)"
		>
			<span class="sr-only">{c.label} marker</span>
		</button>
	{/each}
</div>
