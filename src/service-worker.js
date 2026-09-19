/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

/**
 * The site sells NoteBro as an "installable offline app" and the whole pitch is
 * local-first — but there was no service worker at all, so it was neither
 * installable as a PWA nor usable offline. Cards already live in localStorage;
 * this makes the shell that reads them survive a dead connection too.
 */
const CACHE = `notebro-${version}`;

// The app shell: hashed build output plus static assets. Skip the DMGs —
// half a megabyte of Mac binary has no business in a browser cache.
const PRECACHE = [...build, ...files.filter((f) => !f.startsWith('/downloads/'))];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(PRECACHE))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	// Never cache vault traffic — it is encrypted sync, always live.
	if (url.pathname.startsWith('/vault/')) return;

	// Build assets are content-hashed and immutable: cache wins, no revalidation.
	if (build.includes(url.pathname)) {
		event.respondWith(
			caches.match(request).then((hit) => hit || fetch(request))
		);
		return;
	}

	// Everything else: network first so a live visit is always current, falling
	// back to cache (and then to the app shell) when the connection is gone.
	event.respondWith(
		fetch(request)
			.then((response) => {
				if (response.ok && response.type === 'basic') {
					const copy = response.clone();
					caches.open(CACHE).then((cache) => cache.put(request, copy));
				}
				return response;
			})
			.catch(async () => {
				const cached = await caches.match(request);
				if (cached) return cached;
				if (request.mode === 'navigate') {
					const shell = await caches.match('/');
					if (shell) return shell;
				}
				return new Response('Offline', { status: 503, statusText: 'Offline' });
			})
	);
});
