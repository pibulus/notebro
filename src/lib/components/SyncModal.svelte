<script>
	import { onMount } from 'svelte';
	import {
		DEFAULT_VAULT_URL,
		normalizePassportCode,
		generatePassportCode,
		buildPairingUrl,
		renderPairingQr,
		syncVaultCards
	} from '$lib/vaultSync.js';

	export let isOpen = false;
	export let cards = [];
	export let onCardsUpdate = (updated) => {};
	export let onClose = () => {};

	let code = '';
	let vaultUrl = DEFAULT_VAULT_URL;
	let qrDataUrl = '';
	let pairingUrl = '';
	let syncing = false;
	let syncStatus = ''; // 'idle', 'success', 'error'
	let statusMessage = '';
	let lastSyncedAt = null;
	let copied = false;

	const STORAGE_CODE_KEY = 'notebro_passport_code';
	const STORAGE_LAST_SYNC_KEY = 'notebro_last_synced';

	onMount(async () => {
		// Load stored passport code or generate one
		const stored = localStorage.getItem(STORAGE_CODE_KEY);
		if (stored) {
			code = stored;
		} else {
			code = generatePassportCode();
			localStorage.setItem(STORAGE_CODE_KEY, code);
		}

		lastSyncedAt = localStorage.getItem(STORAGE_LAST_SYNC_KEY);
		await updateQr();
	});

	$: if (isOpen && code) {
		updateQr();
	}

	async function updateQr() {
		if (!code) return;
		try {
			pairingUrl = buildPairingUrl(code, vaultUrl);
			qrDataUrl = await renderPairingQr(pairingUrl);
		} catch (err) {
			console.error('Failed to render QR', err);
		}
	}

	function handleCodeInput(e) {
		code = normalizePassportCode(e.target.value);
		localStorage.setItem(STORAGE_CODE_KEY, code);
		updateQr();
	}

	function handleGenerateNew() {
		code = generatePassportCode();
		localStorage.setItem(STORAGE_CODE_KEY, code);
		updateQr();
	}

	async function handleSync() {
		if (!code) return;
		syncing = true;
		syncStatus = 'syncing';
		statusMessage = 'Connecting to Pi Vault...';

		try {
			const merged = await syncVaultCards(cards, code, vaultUrl);
			onCardsUpdate(merged);
			lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			localStorage.setItem(STORAGE_LAST_SYNC_KEY, lastSyncedAt);
			syncStatus = 'success';
			statusMessage = `Synced ${merged.length} cards with Vault! ⚡️`;
			setTimeout(() => {
				if (syncStatus === 'success') syncStatus = 'idle';
			}, 3500);
		} catch (err) {
			console.error('Vault sync error:', err);
			syncStatus = 'error';
			statusMessage = err.message || 'Sync failed. Vault might be unreachable.';
		} finally {
			syncing = false;
		}
	}

	async function handleCopyLink() {
		if (!pairingUrl) return;
		try {
			await navigator.clipboard.writeText(pairingUrl);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {}
	}

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
			class="card-frame w-full max-w-md bg-[#fffaf0] p-6 sm:p-7 relative z-10 border-3 border-[#1e1714] shadow-brutal-lg animate-fadeIn text-center"
			role="dialog"
			aria-modal="true"
		>
			<!-- Close Button -->
			<button
				type="button"
				on:click={onClose}
				class="btn-bro absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fffdf8] text-sm font-bold flex items-center justify-center"
				aria-label="Close"
			>
				✕
			</button>

			<!-- Header -->
			<div class="mb-4">
				<div class="inline-block px-2.5 py-0.5 rounded-full bg-[#a7f3d0] border border-[#1e1714] text-[11px] font-mono font-black uppercase tracking-wider mb-2">
					🔒 Zero-Knowledge Vault Sync
				</div>
				<h2 class="text-2xl font-mono font-black text-[#1e1714] tracking-tight">
					Device Handshake
				</h2>
				<p class="text-xs font-mono text-[#625854] mt-1">
					Sync your cards across Mac, phone, or browser without accounts.
				</p>
			</div>

			<!-- QR Code Stamp -->
			<div class="my-4 flex flex-col items-center justify-center">
				{#if qrDataUrl}
					<div class="p-3 bg-[#fffef7] rounded-2xl border-2 border-[#1e1714] shadow-brutal-sm inline-block">
						<img src={qrDataUrl} alt="NoteBro Pairing QR" class="w-48 h-48 sm:w-52 sm:h-52 rounded-lg" />
					</div>
					<p class="text-[11px] font-mono text-[#9b8f88] mt-2">
						Scan with iPhone camera or another screen to pair instantly.
					</p>
				{:else}
					<div class="w-48 h-48 flex items-center justify-center bg-[#fffdf8] rounded-2xl border-2 border-[#1e1714] text-xs font-mono text-[#9b8f88]">
						Generating QR...
					</div>
				{/if}
			</div>

			<!-- Passport Code Box -->
			<div class="bg-[#fffdf8] p-3.5 rounded-xl border-2 border-[#1e1714] shadow-brutal-xs mb-4 text-left">
				<div class="flex items-center justify-between mb-1.5">
					<label for="passport-code-input" class="text-[11px] font-mono font-bold text-[#625854] uppercase tracking-wider">
						Your Passport Key:
					</label>
					<button
						type="button"
						on:click={handleGenerateNew}
						class="text-[11px] font-mono text-[#b45309] hover:underline"
						title="Generate new secret code"
					>
						New Code 🎲
					</button>
				</div>
				<div class="flex items-center gap-2">
					<input
						id="passport-code-input"
						type="text"
						value={code}
						on:input={handleCodeInput}
						placeholder="BRO-XXXX"
						class="w-full font-mono text-base font-black tracking-widest text-[#1e1714] bg-[#f5efe3]/50 px-2.5 py-1.5 rounded-lg border border-[#1e1714]/30 uppercase outline-none focus:border-[#1e1714]"
					/>
					<button
						type="button"
						on:click={handleCopyLink}
						class="btn-bro px-3 py-1.5 text-xs font-mono font-bold bg-[#fef08a] text-[#1e1714] rounded-lg shrink-0"
						title="Copy pairing link"
					>
						{copied ? '✓ Copied' : '🔗 Link'}
					</button>
				</div>
			</div>

			<!-- Sync Action Button -->
			<div class="space-y-2">
				<button
					type="button"
					on:click={handleSync}
					disabled={syncing || !code}
					class="btn-bro w-full py-2.5 px-4 bg-[#a7f3d0] hover:bg-[#6ee7b7] text-[#1e1714] rounded-xl font-mono text-sm font-black flex items-center justify-center gap-2 border-2 border-[#1e1714] shadow-brutal-sm disabled:opacity-50"
				>
					{#if syncing}
						<span class="animate-spin">⏳</span>
						<span>Syncing with Vault...</span>
					{:else}
						<span>⚡️</span>
						<span>Sync Cards Now</span>
					{/if}
				</button>

				{#if statusMessage}
					<div
						class="text-xs font-mono py-1 px-2 rounded-lg {syncStatus === 'success'
							? 'bg-[#a7f3d0]/40 text-[#065f46]'
							: syncStatus === 'error'
							? 'bg-[#fca5a5]/40 text-[#7f1d1d]'
							: 'text-[#625854]'}"
					>
						{statusMessage}
					</div>
				{/if}

				{#if lastSyncedAt}
					<div class="text-[11px] font-mono text-[#9b8f88]">
						Last synced at {lastSyncedAt}
					</div>
				{/if}
			</div>

			<div class="mt-4 pt-3 border-t border-[#1e1714]/10 text-center">
				<p class="text-[11px] font-mono text-[#9b8f88]">
					Pi Vault runs on port 9014 · 100% encrypted with your key before leaving your device.
				</p>
			</div>
		</div>
	</div>
{/if}
