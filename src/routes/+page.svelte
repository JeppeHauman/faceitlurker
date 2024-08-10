<script lang="ts">
	import SearchForm from '$lib/components/SearchForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-center text-4xl font-bold mt-24">Faceit Lurker</h1>

<h2 class="text-center text-3xl font-bold mb-5 mt-32">Insert steam profile url</h2>

<SearchForm data={data.searchForm} />
