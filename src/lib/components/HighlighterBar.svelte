<script>
	import { PASTEL_COLORS } from '$lib/storage.js';

	export let activeColor = 'yellow';
	export let onSelectColor = (colorId) => {};
	export let onHighlightSelection = (colorId) => {};
</script>

<div class="flex items-center gap-2 px-3 py-1.5 bg-[#f5efe3] rounded-full border-2 border-[#1e1714] shadow-brutal-sm">
	<span class="text-xs font-mono font-bold uppercase tracking-wider text-[#625854] mr-1 hidden sm:inline">
		Marker:
	</span>

	{#each PASTEL_COLORS as c}
		<button
			type="button"
			on:click={() => {
				onSelectColor(c.id);
				onHighlightSelection(c.id);
			}}
			class="group relative w-6 h-6 rounded-full border-2 border-[#1e1714] {c.bgClass} transition-transform hover:scale-110 active:scale-95 flex items-center justify-center focus:outline-none"
			class:ring-2={activeColor === c.id}
			class:ring-[#1e1714]={activeColor === c.id}
			class:scale-110={activeColor === c.id}
			title="{c.label} Marker"
		>
			{#if activeColor === c.id}
				<span class="w-2 h-2 rounded-full bg-[#1e1714]"></span>
			{/if}
			<span class="sr-only">{c.label}</span>
		</button>
	{/each}
</div>
