<script>
	import { MAC_DMG } from '$lib/config/download.js';
	export let isOpen = false;
	export let onClose = () => {};

	function handleKeydown(e) {
		if (e.key === 'Escape' && isOpen) {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
		<!-- Backdrop button -->
		<button
			type="button"
			class="fixed inset-0 bg-[#1e1714]/60 backdrop-blur-xs w-full h-full cursor-default border-none"
			on:click={onClose}
			aria-label="Close backdrop"
		></button>

		<!-- Modal Box -->
		<div
			class="card-frame w-full max-w-lg bg-[#fffaf0] p-5 sm:p-8 relative z-10 border-3 border-[#1e1714] shadow-brutal-lg animate-fadeIn"
			role="dialog"
			aria-modal="true"
		>
			<!-- Close Button -->
			<button
				type="button"
				on:click={onClose}
				class="btn-bro absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-[#fffdf8] text-sm font-bold flex items-center justify-center"
				aria-label="Close"
			>
				✕
			</button>

			<div class="mb-4">
				<div class="inline-block px-2.5 py-0.5 rounded-full bg-[#bae6fd] border border-[#1e1714] text-[11px] font-mono font-black uppercase tracking-wider mb-2">
					 Native macOS Companion
				</div>
				<h2 class="text-2xl font-mono font-black text-[#1e1714] tracking-tight">
					NoteBro for Mac
				</h2>
				<p class="text-xs font-mono text-[#625854] mt-1">
					The menu bar TextEdit killer.
				</p>
			</div>

			<div class="space-y-3 font-mono text-xs sm:text-[13px] text-[#1e1714] bg-[#fffdf8] p-4 rounded-xl border-2 border-[#1e1714] shadow-brutal-sm mb-5">
				<p>
					Every other Mac notes app forces you through a ritual: launch app, open window, name file, choose folder.
				</p>
				<p class="font-bold text-[#b45309]">
					NoteBro for Mac doesn't waste your time:
				</p>
				<ul class="list-disc pl-5 space-y-1 text-[#625854]">
					<li>Hit <code>⌥Space</code> (or click the menu bar bro) from anywhere</li>
					<li>Popup drops down with the cursor <strong>already blinking</strong></li>
					<li>Jot your thought, hit <code>Esc</code> or click away — it's auto-saved</li>
					<li>Flick left/right between index cards with <code>⌘←</code> / <code>⌘→</code></li>
					<li>Zero battery drain, compiled natively in pure Swift, 2MB size</li>
				</ul>
			</div>

			<div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
				<a
					href={MAC_DMG.href}
					download
					class="btn-bro px-5 py-2.5 bg-[#fef08a] text-[#1e1714] rounded-xl font-mono text-xs font-black flex items-center justify-center gap-2 border-2 border-[#1e1714] shadow-brutal-sm"
				>
					<span>⬇️</span>
					<span>Download {MAC_DMG.filename} (Apple Silicon)</span>
				</a>
				<button
					type="button"
					on:click={onClose}
					class="btn-bro px-4 py-2 bg-[#a7f3d0] text-[#1e1714] rounded-xl font-mono text-xs font-bold text-center"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
