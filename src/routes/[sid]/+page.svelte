<script lang="ts">
	import type { PageData } from './$types';
	import type { FaceitGame } from '$lib/types/faceitAPI';
	import { csgoLifetimeStats, faceitAPIResponseSchema } from '$lib/types/faceitAPI';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import faceit_logo from '$lib/assets/faceit_logo.svg';
	import SearchForm from '$lib/components/SearchForm.svelte';
	import 'iconify-icon';

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

	onMount(async () => {
		const csgo = await data.streamed.csgo;
		const cs2 = await data.streamed.cs2;
		const hours = await data.streamed.hours;
		if (hours.response.games) {
			const gameHours = hours.response.games.filter((game: any) => {
				return game.appid === 730;
			})[0];
			if (gameHours.playtime_forever > 0) {
				csHours = gameHours.playtime_forever;
			}
		}

		if (cs2 && csgo && !cs2.errors && !csgo.errors) {
			cs2Wins = Number(cs2.lifetime.Wins) - Number(csgo.lifetime.Wins);
			cs2Matches = Number(cs2.lifetime.Matches) - Number(csgo.lifetime.Matches) || 0;
		}
		if (csgo?.errors && cs2) {
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

<h1 class="text-center text-4xl font-bold my-10">
	{parsedPlayer.nickname}
	<iconify-icon
		title={parsedPlayer.country}
		class="align-baseline text-2xl"
		icon={`flag:${parsedPlayer.country}-4x3`}
	></iconify-icon>
</h1>

<a
	target="_blank"
	class="block mx-auto w-8 mb-10"
	href={parsedPlayer.faceit_url.replace('{lang}', parsedPlayer.settings.language)}
>
	<img src={faceit_logo} alt="faceit logo" />
</a>

{#await data.streamed.steamBans then steamBans}
	{#await data.streamed.bans then bans}
		{#if bans.items.length > 0 || steamBans.players[0].CommunityBanned || steamBans.players[0].NumberOfVACBans > 0 || steamBans.players[0].NumberOfGameBans > 0}
			<div class="text-center flex justify-center gap-5">
				{#if steamBans.players[0].CommunityBanned || steamBans.players[0].NumberOfVACBans > 0 || steamBans.players[0].NumberOfGameBans > 0}
					<div>
						<p>Volvo bans:</p>
						{#if steamBans.players[0].CommunityBanned}
							<p class="text-red-900 text-2xl">Community Banned</p>
						{/if}
						{#if steamBans.players[0].NumberOfGameBans === 1}
							<p class="text-red-900 text-2xl">
								{steamBans.players[0].NumberOfGameBans} Game Ban
							</p>
						{:else if steamBans.players[0].NumberOfGameBans > 1}
							<p class="text-red-900 text-2xl">
								{steamBans.players[0].NumberOfGameBans} Game Bans
							</p>
						{/if}
						{#if steamBans.players[0].NumberOfVACBans === 1}
							<p class="text-red-900 text-2xl">
								{steamBans.players[0].NumberOfVACBans} VAC Ban
							</p>
						{:else if steamBans.players[0].NumberOfVACBans > 1}
							<p class="text-red-900 text-2xl">
								{steamBans.players[0].NumberOfVACBans} VAC Bans
							</p>
						{/if}
						{#if steamBans.players[0].DaysSinceLastBan > 0}
							<p class="text-red-900 text-2xl">
								{steamBans.players[0].DaysSinceLastBan} Days since last ban
							</p>
						{/if}
					</div>
				{/if}

				{#if bans.items[0].ends_at && new Date(bans.items[0].ends_at) > new Date()}
					<div>
						<p>Faceit bans:</p>
						<h2 class="text-center text-2xl text-red-900">BANNED for {bans.items[0].reason}</h2>
						<p>Ends at: {new Date(bans.items[0].ends_at).toLocaleDateString()}</p>
					</div>
				{/if}
			</div>
		{/if}
	{/await}
{/await}

<div class="flex justify-center items-center gap-1 mt-10">
	<button
		disabled={cs2Wins < 1}
		title={`${cs2Wins < 1 ? 'No CS2 data' : ''}`}
		class={`${cs2Active ? 'bg-zinc-400 border' : 'bg-zinc-800 border border-black border-opacity-0'} rounded-sm py-2 px-4 text-xl hover:border-opacity-100 hover:border-zinc-200`}
		onclick={() => (cs2Active = true)}
	>
		CS2
	</button>
	<button
		class={`${!cs2Active ? 'bg-zinc-400 border' : 'bg-zinc-800 border border-black border-opacity-0'} rounded-sm py-2 px-4 text-xl hover:border-opacity-100 hover:border-zinc-200`}
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
				{:else}
					<p class="text-xl font-semibold">Hours: Private</p>
				{/if}
			{/await}
		</div>
		{#if cs2Active}
			<div class="text-xl font-semibold">
				<p class="flex items-center justify-center gap-2">
					Elo: {parsedPlayer.games['cs2']?.faceit_elo}
					{#await import(`$lib/assets/faceitLevelIcon/level_${parsedPlayer.games.cs2?.skill_level}.svg`) then { default: src }}
						<img class="aspect-square w-7 inline-flex" {src} alt="faceit skill level icon" />
					{/await}
				</p>
			</div>
		{/if}
		{#await data.streamed.cs2}
			<p>loading ...</p>
		{:then cs2}
			{#if cs2Active && cs2 && !cs2.errors}
				<div class="text-xl font-semibold mb-10">
					<p>Total matches: {cs2Matches}</p>
					<p>Win rate: {Math.round((cs2Wins / cs2Matches) * 100)}%</p>
					<p>Average Headshot: {cs2.lifetime['Average Headshots %']}%</p>
					<p>Lifetime K/D: {cs2KD.toFixed(2)}</p>
				</div>
				{#if cs2.segments}
					<div class="grid sm:grid-cols-2 gap-5 mx-auto w-full max-w-3xl sm:place-content-between">
						{#each cs2.segments
							.filter((map) => map.mode == '5v5')

							.sort((map1, map2) => {
								return Number(map2.stats.Matches) - Number(map1.stats.Matches);
							}) as map}
							<div
								class="relative w-full max-w-sm mx-auto rounded-md py-5 space-y-3 bg-black bg-opacity-50 text-zinc-50"
							>
								<!-- Background Image -->
								<div
									style={`background-image: url('${map.img_regular}')`}
									class={`-z-10 absolute inset-0 bg-no-repeat bg-cover bg-center rounded-md`}
								></div>
								<h5>{map.label}</h5>
								<p>Matches: {map.stats.Matches}</p>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
		{#if !cs2Active}
			<div class="text-xl font-semibold">
				<p class="flex items-center justify-center gap-2">
					Elo: {parsedPlayer.games['csgo']?.faceit_elo}
					{#await import(`$lib/assets/faceitLevelIcon/level_${parsedPlayer.games.csgo?.skill_level}.svg`) then { default: src }}
						<img class="aspect-square w-7 inline-flex" {src} alt="faceit skill level icon" />
					{/await}
				</p>
			</div>
			{#await data.streamed.csgo then csgo}
				{#if csgo && !csgo.errors}
					<div class="text-xl font-semibold mb-10">
						<p>Total matches: {csgo.lifetime.Matches}</p>
						<p>Win rate: {csgo.lifetime['Win Rate %']}%</p>
						<p>Average Headshot: {csgo.lifetime['Average Headshots %']}%</p>
						<p>Lifetime K/D: {csgoKD.toFixed(2)}</p>
					</div>
					<div class="grid sm:grid-cols-2 gap-5 mx-auto w-full max-w-3xl sm:place-content-between">
						{#if csgo.segments}
							{#each csgo.segments
								.filter((map) => map.mode == '5v5')
								.sort((map1, map2) => Number(map2.stats.Matches) - Number(map1.stats.Matches)) as map}
								<div
									class="relative sm:w-full max-w-sm rounded-md py-5 space-y-3 bg-black bg-opacity-50 text-zinc-50"
								>
									<!-- Background Image -->
									<div
										style={`background-image: url('${map.img_regular}')`}
										class={`-z-10 absolute inset-0 bg-no-repeat bg-cover bg-center rounded-md`}
									></div>
									<h5>{map.label}</h5>
									<p>Matches: {map.stats.Matches}</p>
								</div>
							{/each}
						{/if}
					</div>
				{/if}
			{:catch error}
				<p>{error}</p>
			{/await}
		{/if}
		<!-- <a href={`/${parsedPlayer.steam_id_64}/${gameNames[i]}/?player_id=${parsedPlayer.player_id}`}
			>More</a
		> -->
	{/if}
</div>
