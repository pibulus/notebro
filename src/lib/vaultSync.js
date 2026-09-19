// src/lib/vaultSync.js
// Zero-Knowledge Encrypted Vault Sync for NoteBro
// Communicates with Pibulus Vault (port 9014 / vault.talktype.app)
// 100% private, client-side AES-GCM encryption, zero accounts.

import QRCode from 'qrcode';

export const DEFAULT_VAULT_URL = 'https://vault.talktype.app';
const APP_NAME = 'notebro';
const ALGO = 'AES-GCM';
const KEY_ITERATIONS = 100000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

export function normalizePassportCode(code) {
	if (!code || typeof code !== 'string') return '';
	return code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

export function generatePassportCode() {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let part1 = '';
	let part2 = '';
	for (let i = 0; i < 3; i++) {
		part1 += chars[Math.floor(Math.random() * chars.length)];
		part2 += chars[Math.floor(Math.random() * chars.length)];
	}
	return `BRO-${part1}${part2}`;
}

export async function getVaultHash(code) {
	const norm = normalizePassportCode(code);
	if (!norm) throw new Error('Passport code required');
	const encoder = new TextEncoder();
	const data = encoder.encode(`notebro-vault-id:${norm}`);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function deriveKey(code, salt) {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		enc.encode(normalizePassportCode(code)),
		{ name: 'PBKDF2' },
		false,
		['deriveKey']
	);

	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			iterations: KEY_ITERATIONS,
			hash: 'SHA-256'
		},
		keyMaterial,
		{ name: ALGO, length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

function bytesToBase64(bytes) {
	let binary = '';
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary);
}

function base64ToBytes(base64) {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

export async function encryptCards(cards, code) {
	const jsonStr = JSON.stringify({
		version: 1,
		app: APP_NAME,
		updatedAt: new Date().toISOString(),
		cards
	});

	const enc = new TextEncoder();
	const plaintext = enc.encode(jsonStr);

	const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
	const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
	const key = await deriveKey(code, salt);

	const ciphertext = await crypto.subtle.encrypt({ name: ALGO, iv }, key, plaintext);

	// Pack salt (16) + iv (12) + ciphertext into one binary buffer
	const packed = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
	packed.set(salt, 0);
	packed.set(iv, salt.length);
	packed.set(new Uint8Array(ciphertext), salt.length + iv.length);

	return bytesToBase64(packed);
}

export async function decryptCards(base64Data, code) {
	const packed = base64ToBytes(base64Data);
	if (packed.length < SALT_BYTES + IV_BYTES) {
		throw new Error('Corrupt vault payload');
	}

	const salt = packed.subarray(0, SALT_BYTES);
	const iv = packed.subarray(SALT_BYTES, SALT_BYTES + IV_BYTES);
	const ciphertext = packed.subarray(SALT_BYTES + IV_BYTES);

	const key = await deriveKey(code, salt);
	const decrypted = await crypto.subtle.decrypt({ name: ALGO, iv }, key, ciphertext);

	const dec = new TextDecoder();
	const parsed = JSON.parse(dec.decode(decrypted));
	return Array.isArray(parsed?.cards) ? parsed.cards : [];
}

/**
 * Card-Level Last-Write-Wins (LWW) Merge
 * Deterministic, no data loss: if a card exists in either set, keep the newer version.
 */
export function mergeCards(localCards, remoteCards) {
	const cardMap = new Map();

	for (const card of localCards || []) {
		if (card?.id) cardMap.set(card.id, card);
	}

	for (const remote of remoteCards || []) {
		if (!remote?.id) continue;
		const existing = cardMap.get(remote.id);
		if (!existing) {
			cardMap.set(remote.id, remote);
		} else {
			const localTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
			const remoteTime = new Date(remote.updatedAt || remote.createdAt || 0).getTime();
			if (remoteTime > localTime) {
				cardMap.set(remote.id, remote);
			}
		}
	}

	const merged = Array.from(cardMap.values());
	// Keep pinned cards on top, then sorted by updatedAt desc
	merged.sort((a, b) => {
		if (Boolean(a.pinned) !== Boolean(b.pinned)) {
			return a.pinned ? -1 : 1;
		}
		return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
	});

	return merged;
}

export async function pullFromVault(code, vaultUrl = DEFAULT_VAULT_URL) {
	const hash = await getVaultHash(code);
	const url = `${vaultUrl.replace(/\/+$/, '')}/vault/${APP_NAME}/${hash}`;

	const res = await fetch(url);
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`Vault fetch failed: ${res.status}`);

	const { data } = await res.json();
	if (!data) return null;
	return await decryptCards(data, code);
}

export async function pushToVault(cards, code, vaultUrl = DEFAULT_VAULT_URL) {
	const hash = await getVaultHash(code);
	const encrypted = await encryptCards(cards, code);
	const url = `${vaultUrl.replace(/\/+$/, '')}/vault/${APP_NAME}/${hash}`;

	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ data: encrypted })
	});

	if (!res.ok) throw new Error(`Vault save failed: ${res.status}`);
	return true;
}

/**
 * Full two-way sync: Pull remote, merge with local, push back if merged is newer.
 */
export async function syncVaultCards(localCards, code, vaultUrl = DEFAULT_VAULT_URL) {
	const remoteCards = await pullFromVault(code, vaultUrl);
	if (!remoteCards || remoteCards.length === 0) {
		// Nothing in vault yet; push our local cards up
		await pushToVault(localCards, code, vaultUrl);
		return localCards;
	}

	const merged = mergeCards(localCards, remoteCards);
	// Always push the merged state back so both ends are synchronized
	await pushToVault(merged, code, vaultUrl);
	return merged;
}

/**
 * Generate pairing URL & QR code with warm house ink palette
 */
export function buildPairingUrl(code, vaultUrl = DEFAULT_VAULT_URL, appUrl = 'https://notebro.app') {
	const norm = normalizePassportCode(code);
	const url = new URL('/', appUrl);
	url.hash = `sync=${norm}&vault=${encodeURIComponent(vaultUrl)}`;
	return url.toString();
}

export async function renderPairingQr(pairingUrl) {
	return await QRCode.toDataURL(pairingUrl, {
		width: 280,
		margin: 1,
		errorCorrectionLevel: 'M',
		color: {
			dark: '#1e1714',
			light: '#fffef7'
		}
	});
}
