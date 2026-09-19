<script>
	import { onMount } from 'svelte';
	import SupportModal from '$lib/components/SupportModal.svelte';
	import { PRICING } from '$lib/config/pricing.js';
	import { MAC_DMG } from '$lib/config/download.js';

	let isSupportOpen = false;
	let demoRef;

	// A live card, not a picture of one — the claim is "it's already writing",
	// so the page proves it instead of describing it. Demo state is deliberately
	// throwaway; the real deck lives at /app.
	let demo = '';

	onMount(() => {
		if (demoRef && window.matchMedia('(min-width: 640px)').matches) demoRef.focus();
	});
</script>

<svelte:head>
	<title>NoteBro — a quick note app for Mac</title>
</svelte:head>

<div class="min-h-screen flex flex-col px-5 sm:px-6">
	<main class="w-full max-w-xl mx-auto flex-1 pt-14 sm:pt-20 pb-10">
		<div class="flex items-center gap-2.5">
			<div
				class="w-9 h-9 rounded-xl bg-[#fef08a] border-2 border-[#4a3f38] shadow-brutal-sm flex items-center justify-center text-lg select-none"
			>
				📝
			</div>
			<span class="font-mono font-black text-lg tracking-tight text-[#1e1714]">NoteBro</span>
		</div>

		<h1
			class="mt-7 font-mono font-black text-[#1e1714] tracking-tight leading-[1.1] text-[34px] sm:text-[44px]"
		>
			Notes, without
			<br class="hidden sm:block" />
			the paperwork.
		</h1>

		<p class="mt-4 font-mono text-[15px] leading-relaxed text-[#625854] max-w-md">
			Open it and the cursor is already blinking. No folder to pick, no title to invent, no
			account. Write the thing and close the lid.
		</p>

		<!-- Try it. This is the pitch; the words above are just a label for it. -->
		<div class="mt-9">
			<div class="card-frame overflow-hidden" style="border-top: 8px solid #fef08a;">
				<textarea
					bind:this={demoRef}
					bind:value={demo}
					placeholder="Type here. Go on."
					class="paper-scroll w-full h-[168px] resize-none outline-none border-none bg-[#fffdf8] font-mono text-[15px] leading-[1.8] text-[#1e1714] placeholder-[#a89c93] p-5 sm:p-6 selection:bg-[#fef08a]"
					spellcheck="false"
				></textarea>
			</div>
			<p class="mt-2.5 font-mono text-[11px] text-[#8a7d76]">
				That one's a sketchpad —
				<a
					href="/app"
					class="underline decoration-[#fbbf24] decoration-2 underline-offset-2 font-bold text-[#1e1714] hover:bg-[#fef08a]"
				>
					open the real deck
				</a>
				to keep what gets written.
			</p>
		</div>

		<div class="mt-10 flex flex-col sm:flex-row gap-3">
			<a
				href={MAC_DMG.href}
				download={MAC_DMG.filename}
				class="btn-bro px-6 py-3.5 bg-[#fef08a] text-[#1e1714] rounded-xl font-mono text-sm font-black text-center"
			>
				Download for Mac
			</a>
			<button
				type="button"
				on:click={() => (isSupportOpen = true)}
				class="btn-bro px-6 py-3.5 bg-[#a7f3d0] text-[#1e1714] rounded-xl font-mono text-sm font-black text-center"
			>
				Buy it — {PRICING.displayPrice}
			</button>
		</div>
		<p class="mt-3 font-mono text-[11px] text-[#8a7d76]">
			Free in the browser. Pay once for the Mac app and it's yours.
		</p>

		<div class="mt-14 space-y-5 font-mono text-[13px] leading-relaxed">
			<div class="flex gap-4">
				<span class="font-black text-[#1e1714] w-32 shrink-0">In the menu bar</span>
				<span class="text-[#625854]">
					⌥Space from any app drops the card down. Escape puts it away.
				</span>
			</div>
			<div class="flex gap-4">
				<span class="font-black text-[#1e1714] w-32 shrink-0">Stays private</span>
				<span class="text-[#625854]">
					Notes sit on the machine. Sync between devices is encrypted before it leaves.
				</span>
			</div>
			<div class="flex gap-4">
				<span class="font-black text-[#1e1714] w-32 shrink-0">Leaves clean</span>
				<span class="text-[#625854]">
					Everything exports as plain Markdown. Nothing is held hostage.
				</span>
			</div>
		</div>
	</main>

	<footer
		class="w-full max-w-xl mx-auto py-7 border-t border-[#4a3f38]/12 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-[#8a7d76]"
	>
		<span>📝 NoteBro — made by Pablo</span>
		<span class="flex items-center gap-3">
			<a href="/app" class="hover:text-[#1e1714]">Open app</a>
			<a href="/privacy" class="hover:text-[#1e1714]">Privacy</a>
			<a href="/support" class="hover:text-[#1e1714]">Support</a>
		</span>
	</footer>
</div>

<SupportModal isOpen={isSupportOpen} onClose={() => (isSupportOpen = false)} />
