<script>
	import { exportAllAsMarkdown } from '$lib/storage.js';

	export let isOpen = false;
	export let cards = [];
	export let onClose = () => {};

	let copied = false;

	function handleKeydown(e) {
		if (e.key === 'Escape' && isOpen) {
			onClose();
		}
	}

	function copyMarkdown() {
		const md = exportAllAsMarkdown(cards);
		navigator.clipboard.writeText(md).then(() => {
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 1800);
		});
	}

	function downloadMarkdown() {
		const md = exportAllAsMarkdown(cards);
		const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', `notebro-export-${new Date().toISOString().slice(0, 10)}.md`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function downloadJsonBackup() {
		const json = JSON.stringify(cards, null, 2);
		const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', `notebro-backup-${new Date().toISOString().slice(0, 10)}.json`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
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
			class="card-frame w-full max-w-md bg-[#fffaf0] p-5 sm:p-6 relative z-10 border-3 border-[#1e1714] shadow-brutal-lg animate-fadeIn"
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

			<h2 class="text-xl font-mono font-black text-[#1e1714] mb-1">
				Export Your Notes 📦
			</h2>
			<p class="text-xs font-mono text-[#625854] mb-4">
				Zero lock-in. Your thoughts belong to you.
			</p>

			<div class="space-y-2.5 mb-5">
				<!-- Copy All Markdown -->
				<button
					type="button"
					on:click={copyMarkdown}
					class="btn-bro w-full py-2.5 px-4 bg-[#fffdf8] hover:bg-[#f5efe3] text-[#1e1714] rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-between"
				>
					<span>📋 Copy All Cards as Markdown</span>
					{#if copied}
						<span class="text-xs text-[#16a34a]">✓ Copied!</span>
					{:else}
						<span class="text-xs text-[#9b8f88]">⌘C</span>
					{/if}
				</button>

				<!-- Download .md -->
				<button
					type="button"
					on:click={downloadMarkdown}
					class="btn-bro w-full py-2.5 px-4 bg-[#bae6fd] hover:bg-[#7dd3fc] text-[#1e1714] rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-between"
				>
					<span>⬇️ Download .md File</span>
					<span class="text-xs text-[#0369a1]">{cards.length} cards</span>
				</button>

				<!-- Download JSON Backup -->
				<button
					type="button"
					on:click={downloadJsonBackup}
					class="btn-bro w-full py-2.5 px-4 bg-[#fef08a] hover:bg-[#fde047] text-[#1e1714] rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-between"
				>
					<span>💾 Download JSON Backup</span>
					<span class="text-xs text-[#854d0e]">Raw Data</span>
				</button>
			</div>

			<div class="p-3 bg-[#fffdf8] rounded-xl border-2 border-[#1e1714]/20 text-[11px] font-mono text-[#625854]">
				💡 <strong>Pro-tip:</strong> You can drop these Markdown files straight into Obsidian, Apple Notes, or keep them as plain text on your hard drive.
			</div>
		</div>
	</div>
{/if}
