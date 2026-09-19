<script>
	import BroHeader from '$lib/components/BroHeader.svelte';
</script>

<svelte:head>
	<title>Privacy Policy 🔒 — NoteBro</title>
	<meta name="description" content="NoteBro's privacy manifesto: 100% local-first, zero analytics, zero trackers, zero data harvesting." />
</svelte:head>

<div class="min-h-screen flex flex-col justify-between py-4 sm:py-8 px-4 sm:px-6 max-w-3xl mx-auto w-full">
	<!-- Top Navigation -->
	<header class="flex items-center justify-between pb-6 mb-6 border-b-2 border-[#1e1714]/10">
		<a href="/" class="flex items-center gap-2 text-[#1e1714] font-mono font-bold text-sm hover:underline">
			<span class="w-7 h-7 rounded-lg bg-[#fef08a] border-2 border-[#1e1714] flex items-center justify-center text-sm shadow-brutal-xs">📝</span>
			<span>← Back to NoteBro</span>
		</a>
		<div class="inline-block px-2.5 py-0.5 rounded-full bg-[#a7f3d0] border border-[#1e1714] text-[10px] font-mono font-black uppercase tracking-wider">
			Local-First Privacy
		</div>
	</header>

	<main class="space-y-6">
		<div class="card-frame p-6 sm:p-8 bg-[#fffdf8]">
			<h1 class="text-2xl sm:text-3xl font-mono font-black text-[#1e1714] tracking-tight mb-2">
				NoteBro Privacy Policy 🔒
			</h1>
			<p class="text-xs sm:text-sm font-mono text-[#625854] leading-relaxed">
				Last updated: September 2026 · App Store Compliant & Verified
			</p>
		</div>

		<div class="card-frame p-6 sm:p-8 bg-[#fffdf8] space-y-6 font-mono text-xs sm:text-sm text-[#1e1714] leading-relaxed">
			<section>
				<h2 class="text-base font-black uppercase tracking-wider text-[#1e1714] mb-2 flex items-center gap-2">
					<span class="text-lg">1.</span> The 10-Second Summary
				</h2>
				<p class="text-[#625854]">
					<strong>NoteBro does not collect, sell, monitor, or transmit your notes or personal data.</strong> Your thoughts stay on your own device. There are no tracking pixels, no advertising SDKs, no behavioral analytics, and no third-party cloud silos.
				</p>
			</section>

			<section class="border-t border-[#1e1714]/10 pt-5">
				<h2 class="text-base font-black uppercase tracking-wider text-[#1e1714] mb-2 flex items-center gap-2">
					<span class="text-lg">2.</span> Where Your Notes Live
				</h2>
				<ul class="list-disc pl-5 space-y-2 text-[#625854]">
					<li>
						<strong>Mac App (Sandboxed):</strong> Notes are stored in your private local macOS Application Support container (<code class="text-[#1e1714] bg-[#f5efe3] px-1 py-0.5 rounded">~/Library/Containers/com.pibulus.notebro/Data/Library/Application Support/NoteBro/notes.json</code>).
					</li>
					<li>
						<strong>Web & PWA:</strong> Notes are stored exclusively inside your browser's private <code class="text-[#1e1714] bg-[#f5efe3] px-1 py-0.5 rounded">localStorage</code> on your local disk.
					</li>
				</ul>
			</section>

			<section class="border-t border-[#1e1714]/10 pt-5">
				<h2 class="text-base font-black uppercase tracking-wider text-[#1e1714] mb-2 flex items-center gap-2">
					<span class="text-lg">3.</span> Zero-Knowledge Vault Sync (Optional)
				</h2>
				<p class="text-[#625854]">
					If you choose to sync cards between your Mac and phone via NoteBro Vault, your cards are encrypted <strong>on your device before leaving it</strong> using industry-standard AES-GCM (256-bit) and a PBKDF2-derived key (100,000 rounds) from your secret passport code. The vault server receives only encrypted binary ciphertext; it has no keys and cannot read your notes.
				</p>
			</section>

			<section class="border-t border-[#1e1714]/10 pt-5">
				<h2 class="text-base font-black uppercase tracking-wider text-[#1e1714] mb-2 flex items-center gap-2">
					<span class="text-lg">4.</span> Payments & Analytics
				</h2>
				<p class="text-[#625854]">
					When you purchase the Digital Cartridge via Square or download via the Mac App Store, payment processing is handled securely by Square or Apple. NoteBro never receives or stores your credit card details. We run <strong>zero tracking or marketing scripts</strong> on <code class="text-[#1e1714] bg-[#f5efe3] px-1 py-0.5 rounded">notebro.app</code>.
				</p>
			</section>

			<section class="border-t border-[#1e1714]/10 pt-5">
				<h2 class="text-base font-black uppercase tracking-wider text-[#1e1714] mb-2 flex items-center gap-2">
					<span class="text-lg">5.</span> Contact & Data Requests
				</h2>
				<p class="text-[#625854]">
					Since we do not store your data, deleting your notes is as simple as clearing your cards or trashing the local application container. If you have any privacy questions, email us at <a href="mailto:pibulus@gmail.com" class="text-[#b45309] font-bold hover:underline">pibulus@gmail.com</a>.
				</p>
			</section>
		</div>
	</main>

	<!-- Footer -->
	<footer class="mt-8 pt-4 border-t border-[#1e1714]/10 flex items-center justify-between text-xs font-mono text-[#9b8f88]">
		<div>NoteBro © 2026 Pablo Alvarado</div>
		<div class="flex gap-4">
			<a href="/" class="hover:underline text-[#625854]">App</a>
			<a href="/support" class="hover:underline text-[#625854]">Support</a>
		</div>
	</footer>
</div>
