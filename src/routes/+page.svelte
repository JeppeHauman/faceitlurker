<script lang="ts">
	import SearchForm from '$lib/components/SearchForm.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import 'iconify-icon';

	export let data: PageData;
	const isHomepage = $page.url.pathname === '/';
</script>

<svelte:head>
	<title>FaceitLurker</title>
</svelte:head>
<h1 class="text-center text-4xl font-bold mt-24">Faceit Lurker</h1>

<h2 class="text-center text-3xl font-bold mb-5 mt-32">Insert steam profile url</h2>

<SearchForm data={data.searchForm} {isHomepage} />

<!-- TOP FIVE PLAYERS IN EU -->

<h3 class="my-10 text-center text-3xl">Top 5 EU players based on elo</h3>

{#await data.streamed.topFive then topFive}
	<div class="grid md:grid-cols-2 lg:grid-cols-5 gap-2 px-10 justify-stretch container mx-auto">
		{#each topFive.items as player}
			<a
				target="_blank"
				href={`https://www.faceit.com/en/players/${player.nickname}`}
				class="border rounded-sm text-center max-w-sm md:max-w-none w-full mx-auto space-y-4 py-2 hover:bg-zinc-800"
			>
				<h4 class="text-2xl font-semibold underline">
					{player.position}
				</h4>
				<p class="space-x-2">
					<span class="font-semibold text-xl">{player.nickname}</span>

					<iconify-icon
						title={player.country}
						class="align-baseline"
						icon={`flag:${player.country}-4x3`}
					></iconify-icon>
				</p>
				<p class="font-semibold text-xl">Elo: {player.faceit_elo}</p>
			</a>
		{/each}
	</div>
{/await}
