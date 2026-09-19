<script>
	import { PASTEL_COLORS } from '$lib/storage.js';

	export let activeColor = 'yellow';
	export let onSelectColor = (colorId) => {};
	export let onHighlightSelection = (colorId) => {};
</script>

<!-- Five swatches, no slab and no "MARKER:" label. Colour dots read as colour
     dots; wrapping them in a bordered container made them compete with the
     primary action for attention. -->
<div class="flex items-center gap-2">
	{#each PASTEL_COLORS as c}
		<button
			type="button"
			on:click={() => {
				onSelectColor(c.id);
				onHighlightSelection(c.id);
			}}
			class="w-5 h-5 rounded-full border-2 {c.bgClass} transition-transform hover:scale-125 active:scale-95 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e1714] {activeColor ===
			c.id
				? 'border-[#1e1714] scale-125'
				: 'border-[#4a3f38]/35'}"
			title="{c.label} marker"
		>
			{#if activeColor === c.id}
				<span class="w-1.5 h-1.5 rounded-full bg-[#1e1714]"></span>
			{/if}
			<span class="sr-only">{c.label} marker</span>
		</button>
	{/each}
</div>
