<script>
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
			class="card-frame w-full max-w-lg bg-[#fffaf0] p-6 sm:p-8 relative z-10 border-3 border-[#1e1714] shadow-brutal-lg animate-fadeIn"
			role="dialog"
			aria-modal="true"
		>
			<!-- Close Button -->
			<button
				type="button"
				on:click={onClose}
				class="btn-bro absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-sm font-bold flex items-center justify-center"
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

			<div class="space-y-3 font-mono text-xs sm:text-[13px] text-[#1e1714] bg-white p-4 rounded-xl border-2 border-[#1e1714] shadow-brutal-sm mb-5">
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

			<div class="flex items-center justify-between gap-3">
				<div class="text-xs font-mono text-[#625854]">
					Built in <code>active/mac/notebro-mac</code>
				</div>
				<button
					type="button"
					on:click={onClose}
					class="btn-bro px-5 py-2 bg-[#a7f3d0] text-[#1e1714] rounded-xl font-mono text-xs font-bold"
				>
					Got it! 🤘
				</button>
			</div>
		</div>
	</div>
{/if}
