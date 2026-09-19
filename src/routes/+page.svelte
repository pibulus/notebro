<script>
	import MainDeckContainer from '$lib/components/MainDeckContainer.svelte';
	import { DEFAULT_SEO, buildSchemaMarkup } from '$lib/config/seo.js';

	const schemaMarkup = buildSchemaMarkup({
		url: DEFAULT_SEO.canonical,
		name: 'NoteBro',
		description: DEFAULT_SEO.description
	});
</script>

<svelte:head>
	<title>{DEFAULT_SEO.title}</title>
	<meta name="description" content={DEFAULT_SEO.description} />
	<link rel="canonical" href={DEFAULT_SEO.canonical} />

	<!-- OpenGraph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="NoteBro" />
	<meta property="og:url" content={DEFAULT_SEO.canonical} />
	<meta property="og:title" content={DEFAULT_SEO.title} />
	<meta property="og:description" content={DEFAULT_SEO.description} />
	<meta property="og:image" content={DEFAULT_SEO.image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={DEFAULT_SEO.canonical} />
	<meta name="twitter:title" content={DEFAULT_SEO.title} />
	<meta name="twitter:description" content={DEFAULT_SEO.description} />
	<meta name="twitter:image" content={DEFAULT_SEO.image} />

	<!-- Schema.org JSON-LD -->
	{@html schemaMarkup}
</svelte:head>

<MainDeckContainer />
