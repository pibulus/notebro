<script>
	import MainDeckContainer from '$lib/components/MainDeckContainer.svelte';
	import { VERTICALS_SEO, buildSchemaMarkup } from '$lib/config/seo.js';

	const config = VERTICALS_SEO.developers;

	const schemaMarkup = buildSchemaMarkup({
		url: config.canonical,
		name: config.title,
		description: config.description,
		faqs: config.faqs
	});
</script>

<svelte:head>
	<title>{config.title}</title>
	<meta name="description" content={config.description} />
	<link rel="canonical" href={config.canonical} />

	<!-- OpenGraph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="NoteBro" />
	<meta property="og:url" content={config.canonical} />
	<meta property="og:title" content={config.title} />
	<meta property="og:description" content={config.description} />
	<meta property="og:image" content="https://notebro.app/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={config.canonical} />
	<meta name="twitter:title" content={config.title} />
	<meta name="twitter:description" content={config.description} />
	<meta name="twitter:image" content="https://notebro.app/og-image.png" />

	<!-- Structured Data (WebApplication + FAQPage) -->
	{@html schemaMarkup}
</svelte:head>

<MainDeckContainer verticalConfig={config} />
