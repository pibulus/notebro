import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	future: {
		hoverOnlyWhenSupported: true
	},
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				],
				mono: [
					'JetBrains Mono',
					'SF Mono',
					'Berkeley Mono',
					'ui-monospace',
					'Menlo',
					'monospace'
				]
			},
			colors: {
				paper: '#fffaf0',
				card: '#fbf1e4',
				ink: '#1e1714',
				'ink-soft': '#625854',
				'ink-muted': '#9b8f88',
				// NoteBro signature highlighter pastels
				'hl-yellow': '#fef08a',
				'hl-mint': '#a7f3d0',
				'hl-lavender': '#e9d5ff',
				'hl-peach': '#fed7aa',
				'hl-sky': '#bae6fd'
			},
			boxShadow: {
				brutal: '3px 3px 0px #1e1714',
				'brutal-lg': '5px 5px 0px #1e1714',
				'brutal-sm': '2px 2px 0px #1e1714'
			}
		}
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				notebro: {
					primary: '#a8edbc',
					secondary: '#fed7aa',
					accent: '#bae6fd',
					neutral: '#1e1714',
					'base-100': '#fffaf0'
				}
			}
		]
	}
};
