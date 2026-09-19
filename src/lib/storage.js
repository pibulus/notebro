// src/lib/storage.js
// Local-first persistence for NoteBro cards

const STORAGE_KEY = 'notebro_cards_v1';
const ACTIVE_INDEX_KEY = 'notebro_active_idx_v1';

export const PASTEL_COLORS = [
	{ id: 'yellow', label: 'Butter', hex: '#fef08a', bgClass: 'bg-[#fef08a]', borderClass: 'border-[#eab308]' },
	{ id: 'mint', label: 'Mint', hex: '#a7f3d0', bgClass: 'bg-[#a7f3d0]', borderClass: 'border-[#10b981]' },
	{ id: 'lavender', label: 'Lavender', hex: '#e9d5ff', bgClass: 'bg-[#e9d5ff]', borderClass: 'border-[#a855f7]' },
	{ id: 'peach', label: 'Peach', hex: '#fed7aa', bgClass: 'bg-[#fed7aa]', borderClass: 'border-[#f97316]' },
	{ id: 'sky', label: 'Sky', hex: '#bae6fd', bgClass: 'bg-[#bae6fd]', borderClass: 'border-[#0ea5e9]' }
];

export const DEFAULT_CARDS = [
	{
		id: 'welcome-card',
		content: `The cursor is already here. Start typing.

Arrows flick between cards. Tap a marker to colour one.
Everything saves itself.`,
		color: 'yellow',
		pinned: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: 'sample-scratch',
		content: `groceries
- [ ] limes
- [ ] good coffee`,
		color: 'mint',
		pinned: false,
		createdAt: new Date(Date.now() - 3600000).toISOString(),
		updatedAt: new Date(Date.now() - 3600000).toISOString()
	}
];

export function extractHashtags(text) {
	if (!text) return [];
	const matches = text.match(/#([a-zA-Z0-9_-]+)/g);
	if (!matches) return [];
	return Array.from(new Set(matches.map((m) => m.toLowerCase())));
}

export function getAllTags(cards) {
	const tags = new Set();
	for (const card of cards) {
		const cardTags = extractHashtags(card.content);
		for (const t of cardTags) {
			tags.add(t);
		}
	}
	return Array.from(tags).sort();
}


export function loadCards() {
	if (typeof window === 'undefined') return DEFAULT_CARDS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CARDS));
			return DEFAULT_CARDS;
		}
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed) || parsed.length === 0) {
			return DEFAULT_CARDS;
		}
		return parsed;
	} catch (e) {
		console.error('Failed to read cards from localStorage', e);
		return DEFAULT_CARDS;
	}
}

export function saveCards(cards) {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
	} catch (e) {
		console.error('Failed to save cards', e);
	}
}

export function loadActiveIndex(maxIndex) {
	if (typeof window === 'undefined') return 0;
	try {
		const raw = localStorage.getItem(ACTIVE_INDEX_KEY);
		if (raw === null) return 0;
		const idx = parseInt(raw, 10);
		if (isNaN(idx) || idx < 0) return 0;
		return Math.min(idx, maxIndex);
	} catch {
		return 0;
	}
}

export function saveActiveIndex(index) {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(ACTIVE_INDEX_KEY, index.toString());
	} catch {}
}

export function generateCardId() {
	return 'nb_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
}

export function exportAllAsMarkdown(cards) {
	return cards
		.map((c, i) => {
			const date = new Date(c.updatedAt).toLocaleDateString(undefined, {
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
			return `---
Card ${i + 1} of ${cards.length} | Color: ${c.color} | ${date}
---

${c.content}
`;
		})
		.join('\n\n');
}
