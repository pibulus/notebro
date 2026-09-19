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

			<!-- Header -->
			<div class="mb-5">
				<div class="inline-block px-2.5 py-0.5 rounded-full bg-[#fed7aa] border border-[#1e1714] text-[11px] font-mono font-black uppercase tracking-wider mb-2">
					Digital Cartridge Edition 📼
				</div>
				<h2 class="text-2xl font-mono font-black text-[#1e1714] tracking-tight">
					NoteBro Suite — $19 AUD
				</h2>
				<p class="text-xs font-mono text-[#625854] mt-1">
					Buy once. Own it forever. No SaaS rent.
				</p>
			</div>

			<!-- Cartridge Philosophy Pitch -->
			<div class="space-y-3 font-mono text-xs sm:text-[13px] text-[#1e1714] bg-white p-4 rounded-xl border-2 border-[#1e1714] shadow-brutal-sm mb-5">
				<div class="flex items-start gap-2.5">
					<span class="text-base"></span>
					<div>
						<strong>NoteBro for Mac:</strong> Native menu bar companion. Hit <code>⌥Space</code>, write, close. Blinking cursor, instant scratchpad.
					</div>
				</div>

				<div class="flex items-start gap-2.5">
					<span class="text-base">🌐</span>
					<div>
						<strong>Web & PWA:</strong> Offline-capable, index-card flicking, zero loading screens, lives at <code>notebro.app</code>.
					</div>
				</div>

				<div class="flex items-start gap-2.5">
					<span class="text-base">🔒</span>
					<div>
						<strong>Local-First Soul:</strong> Your notes live on your machine. No telemetry, no tracking, no corporate cloud snooping.
					</div>
				</div>

				<div class="flex items-start gap-2.5">
					<span class="text-base">📼</span>
					<div>
						<strong>The Cartridge Model:</strong> Remember buying a Game Boy game? You bought it, it was yours, it worked forever. That’s this.
					</div>
				</div>
			</div>

			<!-- Price & Checkout Action -->
			<div class="flex flex-col sm:flex-row items-center justify-between gap-3">
				<div class="text-center sm:text-left">
					<div class="text-xs font-mono text-[#625854]">Attuned One-Time Price:</div>
					<div class="text-xl font-mono font-black text-[#1e1714]">
						$19 AUD <span class="text-xs font-normal text-[#9b8f88]">(~$14 USD)</span>
					</div>
				</div>

				<a
					href="https://square.link/u/notebro"
					target="_blank"
					rel="noopener noreferrer"
					class="btn-bro w-full sm:w-auto px-6 py-2.5 bg-[#a7f3d0] hover:bg-[#6ee7b7] text-[#1e1714] rounded-xl font-mono text-sm font-black text-center"
				>
					Get the Cartridge ✨
				</a>
			</div>

			<div class="mt-4 pt-3 border-t border-[#1e1714]/10 text-center">
				<p class="text-[11px] font-mono text-[#9b8f88]">
					Secured via Square. 30-day "no questions asked" refund if NoteBro isn't your bro.
				</p>
			</div>
		</div>
	</div>
{/if}
