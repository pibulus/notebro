/**
 * The Mac download.
 *
 * `build` is the first 8 chars of the DMG's sha256, and it rides along as a
 * query string. That is load-bearing: Cloudflare caches .dmg at the edge for
 * 4 hours (the origin sends no Cache-Control), and the filename alone does not
 * change when the same version is rebuilt — so a fresh binary sat behind a
 * stale one twice on launch day, once serving an un-notarized build that
 * Gatekeeper refused to open. Changing bytes changes the URL, so the edge
 * cannot serve yesterday's build.
 *
 * Bump `build` whenever a new DMG lands in static/downloads:
 *   shasum -a 256 static/downloads/NoteBro-<version>.dmg | cut -c1-8
 */
export const MAC_DMG = {
	version: '1.1.0',
	build: '7ae34c4c',

	// Shown on the download button; keep it honest when the binary grows.
	size: '2.4MB',

	get filename() {
		return `NoteBro-${this.version}.dmg`;
	},

	get href() {
		return `/downloads/${this.filename}?b=${this.build}`;
	}
};
