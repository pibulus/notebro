<script>
	import { PRICING } from '$lib/config/pricing.js';

	let copied = false;

	function copyEmail() {
		navigator.clipboard.writeText('pibulus@gmail.com').then(() => {
			copied = true;
			setTimeout(() => (copied = false), 2000);
		});
	}
</script>

<svelte:head>
	<title>Support & Help 🛟 — NoteBro</title>
	<meta name="description" content="Support, FAQs, and shortcuts for NoteBro on Mac and Web." />
</svelte:head>

<div class="min-h-screen flex flex-col justify-between py-4 sm:py-8 px-4 sm:px-6 max-w-3xl mx-auto w-full">
	<!-- Top Navigation -->
	<header class="flex items-center justify-between pb-6 mb-6 border-b-2 border-[#1e1714]/10">
		<a href="/" class="flex items-center gap-2 text-[#1e1714] font-mono font-bold text-sm hover:underline">
			<span class="w-7 h-7 rounded-lg bg-[#fef08a] border-2 border-[#1e1714] flex items-center justify-center text-sm shadow-brutal-xs">📝</span>
			<span>← Back to NoteBro</span>
		</a>
		<div class="inline-block px-2.5 py-0.5 rounded-full bg-[#bae6fd] border border-[#1e1714] text-[10px] font-mono font-black uppercase tracking-wider">
			Support Center 🛟
		</div>
	</header>

	<main class="space-y-6">
		<div class="card-frame p-6 sm:p-8 bg-[#fffdf8]">
			<h1 class="text-2xl sm:text-3xl font-mono font-black text-[#1e1714] tracking-tight mb-2">
				NoteBro Support 🛟
			</h1>
			<p class="text-xs sm:text-sm font-mono text-[#625854] leading-relaxed">
				Everything you need to get the most out of your note bro.
			</p>
		</div>

		<!-- Direct Contact Box -->
		<div class="card-frame p-6 bg-[#fef08a] border-2 border-[#1e1714] flex flex-col sm:flex-row items-center justify-between gap-4">
			<div>
				<div class="font-mono font-black text-base text-[#1e1714]">Need help or found a bug?</div>
				<p class="font-mono text-xs text-[#625854] mt-0.5">
					Pablo responds directly to every message. Usually within a few hours.
				</p>
			</div>
			<div class="flex items-center gap-2 shrink-0">
				<a
					href="mailto:pibulus@gmail.com"
					class="btn-bro px-4 py-2 bg-[#fffdf8] text-[#1e1714] rounded-xl font-mono text-xs font-black"
				>
					✉️ Email Pablo
				</a>
				<button
					type="button"
					on:click={copyEmail}
					class="btn-bro px-3 py-2 bg-[#fed7aa] text-[#1e1714] rounded-xl font-mono text-xs font-bold"
					title="Copy email to clipboard"
				>
					{copied ? '✓ Copied!' : '📋 Copy'}
				</button>
			</div>
		</div>

		<!-- Shortcuts Reference -->
		<div class="card-frame p-6 bg-[#fffdf8] space-y-4 font-mono">
			<h2 class="text-base font-black uppercase tracking-wider text-[#1e1714]">
				⌨️ Keyboard Shortcuts Cheat Sheet
			</h2>
			<div class="overflow-x-auto">
				<table class="w-full text-xs text-left">
					<thead>
						<tr class="border-b-2 border-[#1e1714]/20 text-[#625854]">
							<th class="py-2 pr-4">Shortcut</th>
							<th class="py-2 pr-4">Platform</th>
							<th class="py-2">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#1e1714]/10 text-[#1e1714]">
						<tr>
							<td class="py-2 font-bold"><kbd class="bg-[#f5efe3] px-1.5 py-0.5 rounded border border-[#1e1714]/30">⌥Space</kbd></td>
							<td class="py-2 text-[#625854]">Mac Native</td>
							<td class="py-2">Toggle NoteBro popover from anywhere</td>
						</tr>
						<tr>
							<td class="py-2 font-bold"><kbd class="bg-[#f5efe3] px-1.5 py-0.5 rounded border border-[#1e1714]/30">⌥←</kbd> / <kbd class="bg-[#f5efe3] px-1.5 py-0.5 rounded border border-[#1e1714]/30">⌥→</kbd></td>
							<td class="py-2 text-[#625854]">Web & Mac</td>
							<td class="py-2">Flick between index cards</td>
						</tr>
						<tr>
							<td class="py-2 font-bold"><kbd class="bg-[#f5efe3] px-1.5 py-0.5 rounded border border-[#1e1714]/30">⌘N</kbd> or <kbd class="bg-[#f5efe3] px-1.5 py-0.5 rounded border border-[#1e1714]/30">⌘K</kbd></td>
							<td class="py-2 text-[#625854]">Web & Mac</td>
							<td class="py-2">Pull a fresh card from the stack</td>
						</tr>
						<tr>
							<td class="py-2 font-bold"><kbd class="bg-[#f5efe3] px-1.5 py-0.5 rounded border border-[#1e1714]/30">⌘E</kbd></td>
							<td class="py-2 text-[#625854]">Web & Mac</td>
							<td class="py-2">Export all cards to clean Markdown</td>
						</tr>
						<tr>
							<td class="py-2 font-bold"><kbd class="bg-[#f5efe3] px-1.5 py-0.5 rounded border border-[#1e1714]/30">Esc</kbd></td>
							<td class="py-2 text-[#625854]">Mac Native</td>
							<td class="py-2">Close popover & auto-save immediately</td>
						</tr>
						<tr>
							<td class="py-2 font-bold"><kbd class="bg-[#f5efe3] px-1.5 py-0.5 rounded border border-[#1e1714]/30">⌘⌫</kbd></td>
							<td class="py-2 text-[#625854]">Web & Mac</td>
							<td class="py-2">Discard current card (when &gt; 1 card)</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- FAQs -->
		<div class="card-frame p-6 sm:p-8 bg-[#fffdf8] space-y-6 font-mono text-xs sm:text-sm text-[#1e1714] leading-relaxed">
			<h2 class="text-base font-black uppercase tracking-wider text-[#1e1714] mb-4">
				Frequently Asked Questions
			</h2>

			<div>
				<h3 class="font-black text-sm text-[#1e1714] mb-1">
					Q: Where are my notes saved on Mac?
				</h3>
				<p class="text-[#625854]">
					Your cards are stored as a lightweight, clean JSON file at <code class="bg-[#f5efe3] px-1 py-0.5 rounded text-[#1e1714]">~/Library/Application Support/NoteBro/notes.json</code> (or in the sandboxed container for the Mac App Store edition). You can backup, copy, or edit this file anytime.
				</p>
			</div>

			<div class="border-t border-[#1e1714]/10 pt-4">
				<h3 class="font-black text-sm text-[#1e1714] mb-1">
					Q: What is the Digital Cartridge model?
				</h3>
				<p class="text-[#625854]">
					Instead of charging a monthly subscription ($5-$10/month forever), NoteBro is sold as an indie digital cartridge for a single one-time payment of {PRICING.displayPrice} ({PRICING.approxUsdPrice}). Once you purchase it, you own it. It will never nag you for an upgrade or lock your notes behind a paywall.
				</p>
			</div>

			<div class="border-t border-[#1e1714]/10 pt-4">
				<h3 class="font-black text-sm text-[#1e1714] mb-1">
					Q: What is your refund policy?
				</h3>
				<p class="text-[#625854]">
					If NoteBro doesn't fit your workflow or isn't your bro, just email <a href="mailto:pibulus@gmail.com" class="text-[#b45309] underline font-bold">pibulus@gmail.com</a> within 30 days of purchase for a 100% full, cheerful refund.
				</p>
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="mt-8 pt-4 border-t border-[#1e1714]/10 flex items-center justify-between text-xs font-mono text-[#9b8f88]">
		<div>NoteBro © 2026 Pablo Alvarado</div>
		<div class="flex gap-4">
			<a href="/" class="hover:underline text-[#625854]">App</a>
			<a href="/privacy" class="hover:underline text-[#625854]">Privacy</a>
		</div>
	</footer>
</div>
