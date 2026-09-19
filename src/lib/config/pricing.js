import { env } from '$env/dynamic/public';

/**
 * NoteBro Digital Cartridge pricing.
 *
 * Keep this boring on purpose: one flat once-off price, no fake anchor, no
 * "launch special" that silently jumps later. Buy it, own it.
 *
 * THE ONE DIAL: change currentPrice and every price string in the app follows.
 * User-facing copy must derive from displayPrice — never hardcode a number.
 */
export const PRICING = {
	currentPrice: 19,
	currency: 'AUD',
	approxUsd: 14,
	productName: 'NoteBro Digital Cartridge',

	get displayPrice() {
		return `$${this.currentPrice} ${this.currency}`;
	},

	get approxUsdPrice() {
		return `~$${this.approxUsd} USD`;
	}
};

/**
 * The Square hosted payment link.
 *
 * Set PUBLIC_SQUARE_CHECKOUT_URL in the environment — it is read at RUNTIME
 * (adapter-node + $env/dynamic/public), so going live is one line in
 * /etc/notebro.env plus a service restart. No rebuild, no redeploy.
 *
 * Until it is set, every buy path falls back to the email flow rather than
 * throwing people at a dead link — square.link/u/notebro was hardcoded here
 * and 404'd for every visitor.
 */
const PLACEHOLDER_URLS = ['https://square.link/u/notebro'];

export const checkoutUrl = (() => {
	const url = (env.PUBLIC_SQUARE_CHECKOUT_URL || '').trim();
	if (!url || PLACEHOLDER_URLS.includes(url)) return null;
	return url;
})();

export const checkoutReady = checkoutUrl !== null;

/** Where the buy button sends someone when checkout isn't wired up yet. */
export const checkoutFallbackHref = `mailto:pibulus@gmail.com?subject=${encodeURIComponent(
	'NoteBro Cartridge — take my money'
)}&body=${encodeURIComponent("Send me the cartridge when checkout's open.")}`;
