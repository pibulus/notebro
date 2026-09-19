// src/lib/config/seo.js
// Centralized SEO, OpenGraph, and Schema.org metadata for NoteBro

export const SITE_URL = 'https://notebro.app';
export const SITE_NAME = 'NoteBro';
export const DEFAULT_OG_IMAGE = 'https://notebro.app/og-image.png';

export const DEFAULT_SEO = {
	title: 'NoteBro 📝 — Your note bro. Always there.',
	description:
		"A notes app that's already taking a note when you open it. Zero friction, zero setup, flickable index cards on cream paper. Native Mac menu bar companion and offline PWA.",
	canonical: SITE_URL,
	image: DEFAULT_OG_IMAGE
};

export const VERTICALS_SEO = {
	adhd: {
		key: 'adhd',
		badge: '⚡ For ADHD & Fast Brains',
		headline: 'No folder paralysis. No setup ritual. Just write.',
		title: 'ADHD Scratchpad & Instant Notes App — Zero Blank Page Paralysis | NoteBro',
		description:
			'A zero-friction notes app designed for ADHD brains and fast thinkers. No folders to organize, no database templates, no blank page anxiety. Just open, type on an index card, and go.',
		canonical: `${SITE_URL}/for/adhd`,
		faqs: [
			{
				q: 'Why is NoteBro helpful for ADHD brains?',
				a: 'Traditional notes apps trigger blank-page paralysis and overwhelm by demanding folder hierarchies, titles, and template configurations before you can write a word. NoteBro immediately drops your cursor into a blinking index card the moment it appears—you jot your chaotic thoughts, flick cards with arrow keys, and close it. Everything is auto-saved locally.'
			},
			{
				q: 'Does NoteBro work offline?',
				a: 'Yes! NoteBro is local-first. Both the browser webapp and the Mac menu bar companion work completely offline with zero internet required. Your private notes never touch third-party cloud servers.'
			},
			{
				q: 'How does the Mac menu bar app work?',
				a: 'Press Option + Space anywhere in macOS to drop down your active NoteBro index card. Jot your thought, press Escape, and get straight back to what you were doing. No window management, no file dialogs.'
			}
		]
	},

	developers: {
		key: 'developers',
		badge: '💻 For Developers & Coders',
		headline: 'The menu bar TextEdit killer for developers.',
		title: 'Developer Scratchpad & Mac Menu Bar Quick Notes | NoteBro',
		description:
			'The lightweight TextEdit killer for coders. Hit ⌥Space from any IDE, paste a token or thought, and close. Zero cloud latency, local-first privacy, one-click Markdown export.',
		canonical: `${SITE_URL}/for/developers`,
		faqs: [
			{
				q: 'How do developers use NoteBro?',
				a: 'NoteBro acts as a zero-latency temporary scratchpad for curl snippets, API tokens, regex riffs, JSON payloads, and daily scratch tasks without cluttering your code editor or spinning up heavy Electron apps.'
			},
			{
				q: 'Can I export my notes as clean Markdown?',
				a: 'Yes. NoteBro includes a built-in zero-lock-in export modal that copies all cards as clean Markdown with one click, downloads a .md bundle, or outputs raw JSON.'
			},
			{
				q: 'Is my sensitive code and data private?',
				a: '100% private. NoteBro has zero analytics, zero telemetries, and no cloud snooping. Your notes live in your browser’s local storage or directly on your Mac filesystem.'
			}
		]
	},

	writers: {
		key: 'writers',
		badge: '✍️ For Writers & Riffers',
		headline: 'Physical index card focus in digital form.',
		title: 'Index Card Scratchpad & Distraction-Free Notes for Writers | NoteBro',
		description:
			'Physical index card mental model in digital form. Pastel highlighters, clean typography, zero formatting ribbons or database bloat. Capture the riff before it evaporates.',
		canonical: `${SITE_URL}/for/writers`,
		faqs: [
			{
				q: 'How does the index card system work for writers?',
				a: 'Instead of an endless scrolling document, NoteBro organizes your ideas into horizontal index cards. Flick left and right with Option + Arrows to browse scenes, character riffs, or punchlines with zero distraction.'
			},
			{
				q: 'How do the pastel highlighters work?',
				a: 'NoteBro features five soothing stationery highlighters (Butter, Mint, Lavender, Peach, Sky). Simply select any text and tap a highlighter to mark it up, or tap a swatch to tint the entire card.'
			},
			{
				q: 'Is NoteBro subscription-free?',
				a: 'Yes. Free in the browser, and you can buy the Digital Cartridge for a flat $19 AUD once to own forever. No monthly SaaS rent, ever.'
			}
		]
	},

	mac: {
		key: 'mac',
		badge: ' NoteBro for Mac',
		headline: '⌥Space anywhere. Blinking cursor on arrival.',
		title: 'NoteBro for Mac — The Native Menu Bar TextEdit Killer',
		description:
			'Instant menu bar notes companion for macOS. Press ⌥Space anywhere, type, close. 2MB featherlight Swift binary, zero battery drain, instant local auto-save.',
		canonical: `${SITE_URL}/for/mac`,
		faqs: [
			{
				q: 'What makes NoteBro for Mac different from Apple Notes?',
				a: 'Apple Notes forces an H1 heading line, pushes you into iCloud silos, and requires opening full application windows. NoteBro lives silently in your menu bar and drops down an instant scratchpad with ⌥Space.'
			},
			{
				q: 'What are the system requirements for NoteBro for Mac?',
				a: 'NoteBro for Mac is a native Swift app with a hardened runtime, notarized by Apple, compiled natively for Apple Silicon (M1/M2/M3/M4) running macOS 13 (Ventura) or newer.'
			},
			{
				q: 'Can I sync my Mac notes with the web app?',
				a: 'Yes! NoteBro includes end-to-end encrypted zero-knowledge vault sync using the Pibulus Vault protocol with instant QR code pairing.'
			}
		]
	}
};

/**
 * Builds safe JSON-LD Schema.org script string for WebApplication and FAQPage.
 */
export function buildSchemaMarkup({
	url = SITE_URL,
	name = SITE_NAME,
	description = DEFAULT_SEO.description,
	faqs = []
} = {}) {
	const graph = [
		{
			'@type': 'WebApplication',
			name,
			alternateName: 'NoteBro.app',
			url,
			image: DEFAULT_OG_IMAGE,
			description,
			applicationCategory: 'UtilitiesApplication',
			applicationSubCategory: 'Quick scratchpad and index card notes',
			operatingSystem: 'Web, macOS, iOS, Android',
			inLanguage: 'en',
			isAccessibleForFree: true,
			offers: [
				{
					'@type': 'Offer',
					price: '0',
					priceCurrency: 'AUD',
					description: 'Free browser-based index card scratchpad'
				},
				{
					'@type': 'Offer',
					price: '19',
					priceCurrency: 'AUD',
					description: 'NoteBro Digital Cartridge lifetime license with native Mac app'
				}
			]
		}
	];

	if (faqs && faqs.length > 0) {
		graph.push({
			'@type': 'FAQPage',
			mainEntity: faqs.map((faq) => ({
				'@type': 'Question',
				name: faq.q,
				acceptedAnswer: {
					'@type': 'Answer',
					text: faq.a
				}
			}))
		});
	}

	const json = JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': graph
	}).replace(/</g, '\\u003c');

	return '<script type="application/ld+json">' + json + '<' + '/script>';
}
