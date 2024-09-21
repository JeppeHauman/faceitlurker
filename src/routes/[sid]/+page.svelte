<script lang="ts">
	import type { PageData } from './$types';
	import type { FaceitGame } from '$lib/types/faceitAPI';
	import { csgoLifetimeStats, faceitAPIResponseSchema } from '$lib/types/faceitAPI';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import faceit_logo from '$lib/assets/faceit_logo.svg';
	import SearchForm from '$lib/components/SearchForm.svelte';
	import 'iconify-icon';
	import SteamBans from '$lib/components/SteamBans.svelte';
	import FaceitBans from '$lib/components/FaceitBans.svelte';
	import GameInfo from '$lib/components/GameInfo.svelte';

	let { data } = $props();

	const parsedPlayer = faceitAPIResponseSchema.parse(data.player);
	const player = data.player;
	let games: FaceitGame[];
	let gameNames: string[];
	if (parsedPlayer.games) {
		games = Object.values(parsedPlayer.games);
		gameNames = Object.keys(parsedPlayer.games);
	}

	const isHomepage = $page.url.pathname === '/';

	let cs2Active = $state(true);
	let cs2Wins = $state(0);
	let cs2Matches = $state(0);
	let csgoStats = $state(true);
	let cs2KD = $state(0);
	let csgoKD = $state(0);
	let csHours = $state(0);
	let csHours2Weeks = $state(0);

	onMount(async () => {
		const csgo = await data.streamed.csgo;
		const cs2 = await data.streamed.cs2;
		const hours = await data.streamed.hours;
		console.log(cs2);

		if (hours && hours.response.games) {
			const gameHours = hours.response.games.filter((game: any) => {
				return game.appid === 730;
			})[0];
			if (gameHours.playtime_forever > 0) {
				csHours = gameHours.playtime_forever;
				if (gameHours.playtime_2weeks && gameHours.playtime_2weeks > 0) {
					csHours2Weeks = gameHours.playtime_2weeks;
				}
			}
		}

		if (cs2 && csgo && !cs2.errors && !csgo.errors) {
			cs2Wins = Number(cs2.lifetime.Wins) - Number(csgo.lifetime.Wins);
			cs2Matches = Number(cs2.lifetime.Matches) - Number(csgo.lifetime.Matches) || 0;
		}
		if (csgo?.errors && !cs2?.errors && cs2) {
			csgoStats = false;
			cs2Wins = Number(cs2.lifetime.Wins);
			cs2Matches = Number(cs2.lifetime.Matches);
		}
		if (cs2 && !cs2.errors) {
			let cs2Kills = 0,
				cs2Deaths = 0;

			cs2.segments.forEach((map) => {
				cs2Kills += Number(map.stats.Kills);
				cs2Deaths += Number(map.stats.Deaths);
			});
			cs2KD = cs2Kills / cs2Deaths;
		}
		if (csgo && !csgo.errors) {
			let csgoKills = 0,
				csgoDeaths = 0;

			csgo.segments.forEach((map) => {
				csgoKills += Number(map.stats.Kills);
				csgoDeaths += Number(map.stats.Deaths);
			});
			csgoKD = csgoKills / csgoDeaths;
		}

		if (cs2Matches < 1) {
			cs2Active = false;
		}
	});
</script>

<svelte:head>
	<title>{player.nickname} | FaceitLurker</title>
</svelte:head>

<div class="mt-20">
	<SearchForm data={data.searchForm} {isHomepage} />
</div>

<h1 class="my-10 text-center text-4xl font-bold">
	{parsedPlayer.nickname}
	<iconify-icon
		title={parsedPlayer.country}
		class="align-baseline text-2xl"
		icon={`flag:${parsedPlayer.country.toLowerCase()}-4x3`}
	></iconify-icon>
</h1>

<a
	target="_blank"
	class="mx-auto mb-10 block w-8"
	href={parsedPlayer.faceit_url.replace('{lang}', 'en')}
>
	<img src={faceit_logo} alt="faceit logo" />
</a>

{#await data.streamed.steamBans then steamBans}
	<SteamBans {steamBans} />
{/await}
{#await data.streamed.bans then bans}
	<FaceitBans {bans} />
{/await}

<div class="mt-10 flex items-center justify-center gap-1">
	<button
		disabled={cs2Matches < 1}
		title={`${cs2Wins < 1 ? 'No CS2 data' : ''}`}
		class={`${cs2Active ? 'border bg-zinc-400' : 'border border-black border-opacity-0 bg-zinc-800'} rounded-sm px-4 py-2 text-xl hover:border-zinc-200 hover:border-opacity-100`}
		onclick={() => (cs2Active = true)}
	>
		CS2
	</button>
	<button
		class={`${!cs2Active ? 'border bg-zinc-400' : 'border border-black border-opacity-0 bg-zinc-800'} rounded-sm px-4 py-2 text-xl hover:border-zinc-200 hover:border-opacity-100`}
		onclick={() => (cs2Active = false)}
		disabled={!csgoStats}
		title={`${!csgoStats ? 'No CSGO data' : ''}`}
	>
		CSGO
	</button>
</div>

<div class="text-center">
	{#if player.errors && player.errors[0].http_status === 404}
		<p>No faceit account found</p>
	{:else}
		<div class="my-4">
			{#await data.streamed.hours then hours}
				{#if csHours > 0}
					<p class="text-xl font-semibold">Hours: {(csHours / 60).toFixed()}</p>
					{#if csHours2Weeks > 0}
						<p class="text-xl font-semibold">Past two weeks: {(csHours2Weeks / 60).toFixed()}</p>
					{/if}
				{:else}
					<p class="text-xl font-semibold">Hours: Private</p>
				{/if}
			{/await}
		</div>
		{#await data.streamed.cs2}
			<p>loading ...</p>
		{:then cs2}
			{#if cs2Active && cs2 && !cs2.errors}
				<GameInfo
					matches={cs2Matches}
					wins={cs2Wins}
					avgHeadshot={Number(cs2.lifetime['Average Headshots %'])}
					game={parsedPlayer.games.cs2!}
					kd={cs2KD}
					segments={cs2.segments}
				/>
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
		{#await data.streamed.csgo then csgo}
			{#if !cs2Active && csgo && !csgo.errors}
				<GameInfo
					matches={Number(csgo.lifetime.Matches)}
					wins={Number(csgo.lifetime.Wins)}
					avgHeadshot={Number(csgo.lifetime['Average Headshots %'])}
					kd={csgoKD}
					game={parsedPlayer.games.csgo!}
					segments={csgo.segments}
				/>
			{/if}
		{:catch error}
			<p>{error}</p>
		{/await}
	{/if}
</div>
