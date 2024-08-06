<script lang="ts">
	import type { PageData } from './$types';
	import type { FaceitGame } from '$lib/types/faceitAPI';
	import { faceitAPIResponseSchema } from '$lib/types/faceitAPI';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	export let data: PageData;
	const parsedPlayer = faceitAPIResponseSchema.parse(data.player);
	const player = data.player;
	let cs2Active = true;
	let games: FaceitGame[];
	let gameNames: string[];
	if (parsedPlayer.games) {
		games = Object.values(parsedPlayer.games);
		gameNames = Object.keys(parsedPlayer.games);
	}

	afterNavigate(async () => {
		const csgo = await data.streamed.csgo;
		const cs2 = await data.streamed.cs2;
		console.log(csgo, cs2);
		console.log('loaded');
	});
</script>

<svelte:head>
	<title>{player.nickname} | FaceitLurker</title>
</svelte:head>

<h1 class="text-center text-4xl font-bold mb-5">{parsedPlayer.nickname}</h1>

<div class="text-center my-10 space-y-4">
	{#await data.streamed.bans then bans}
		{#if bans.items.length > 0}
			<h2 class="text-center text-2xl text-red-900">BANNED for {bans.items[0].reason}</h2>
			{#if bans.items[0].ends_at}
				<p>Ends at: {new Date(bans.items[0].ends_at).toLocaleDateString()}</p>
			{/if}
		{/if}
	{/await}
</div>

<div class="grid-cols-2">
	{#await data.streamed.cs2}
		<div class="text-4xl text-center">loading stats</div>
	{:then cs2}
		{#if cs2Active}
			<div>
				{cs2.game_id.toUpperCase()}
			</div>
		{/if}
		<pre>{JSON.stringify(cs2, null, 2)}</pre>
	{/await}
	{#await data.streamed.csgo}
		<div class="text-4xl text-center">loading stats</div>
	{:then csgo}
		<div class="text-xl">
			<pre>{JSON.stringify(csgo, null, 2)}</pre>
		</div>
	{/await}
</div>

<div class="flex flex-wrap gap-5 mx-auto justify-center">
	{#if player.errors && player.errors[0].http_status === 404}
		<p>No faceit account found</p>
	{:else}
		{#each games as game, i}
			<div class="w-full max-w-sm border text-center space-y-2">
				<h2 class="text-xl font-bold">{gameNames[i].toUpperCase()}</h2>
				<p>
					Elo: {#if game.game_player_id === '76561197968663051'}
						{game.faceit_elo + 2000}, bb
					{:else}
						{game.faceit_elo}
					{/if}
				</p>

				{#await data.streamed.cs2}
					<p>loading</p>
				{:then cs2}
					{#if cs2 && gameNames[i] === 'cs2'}
						<p>Total matches: {cs2.lifetime['Total Matches']}</p>
						<p>Win rate: {cs2.lifetime['Win Rate %']}%</p>
						{#each Object.entries(cs2.lifetime) as stat}
							<p>{stat[0]}: {stat[1]}</p>
						{/each}
					{/if}
				{/await}
				<a
					href={`/${parsedPlayer.steam_id_64}/${gameNames[i]}/?player_id=${parsedPlayer.player_id}`}
					>More</a
				>
			</div>
		{/each}
	{/if}
</div>
