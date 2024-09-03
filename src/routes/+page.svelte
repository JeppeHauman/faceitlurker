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
<h1 class="mt-24 text-center text-4xl font-bold">Faceit Lurker</h1>

<h2 class="mb-5 mt-32 text-center text-3xl font-bold">Insert steam profile url</h2>

<SearchForm data={data.searchForm} {isHomepage} />

<!-- TOP FIVE PLAYERS IN EU -->

<h3 class="my-10 text-center text-3xl">Top 5 EU players based on elo</h3>

{#await data.streamed.topFive then topFive}
	<div class="container mx-auto grid justify-stretch gap-2 px-10 md:grid-cols-2 lg:grid-cols-5">
		{#each topFive.items as player}
			<form action="?/link" method="post">
				<input class="hidden" name="player_id" value={player.player_id} />
				<button
					class="mx-auto block w-full max-w-sm space-y-4 rounded-sm border py-2 text-center hover:bg-zinc-800 md:max-w-none"
				>
					<h4 class="text-2xl font-semibold underline">
						{player.position}
					</h4>
					<p class="space-x-2">
						<span class="text-xl font-semibold">{player.nickname}</span>

						<iconify-icon
							title={player.country}
							class="align-baseline"
							icon={`flag:${player.country.toLowerCase()}-4x3`}
						></iconify-icon>
					</p>
					<p class="text-xl font-semibold">Elo: {player.faceit_elo}</p>
				</button>
			</form>
		{/each}
	</div>
{/await}
