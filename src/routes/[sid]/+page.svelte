<script lang="ts">
	import type { PageData } from './$types';
	import type { FaceitGame } from '$lib/types/faceitAPI';
	import { faceitAPIResponseSchema } from '$lib/types/faceitAPI';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	let { data } = $props();

	const parsedPlayer = faceitAPIResponseSchema.parse(data.player);
	const player = data.player;
	let cs2Active = $state(true);
	let games: FaceitGame[];
	let gameNames: string[];
	if (parsedPlayer.games) {
		games = Object.values(parsedPlayer.games);
		gameNames = Object.keys(parsedPlayer.games);
	}

	let cs2Wins = $state(0);
	let cs2Matches = $state(0);

	onMount(async () => {
		const csgo = await data.streamed.csgo;
		const cs2 = await data.streamed.cs2;
		console.log(csgo);
		console.log(cs2);
		if (cs2 !== undefined && csgo) {
			cs2Wins = Number(cs2.lifetime.Wins) - Number(csgo.lifetime.Wins);
			cs2Matches = Number(cs2.lifetime.Matches) - Number(csgo.lifetime.Matches);
		}
		if (!csgo && cs2) {
			cs2Wins = Number(cs2.lifetime.Wins);
			cs2Matches = Number(cs2.lifetime.Matches);
		}

		if (cs2Wins < 1) {
			cs2Active = false;
		}
	});
</script>

<svelte:head>
	<title>{player.nickname} | FaceitLurker</title>
</svelte:head>

<h1 class="text-center text-4xl font-bold my-10">{parsedPlayer.nickname}</h1>

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

<div class="flex justify-center items-center gap-1">
	<button
		disabled={cs2Wins < 1}
		title={`${cs2Wins < 1 ? 'No CS2 data' : ''}`}
		class={`${cs2Active ? 'bg-zinc-400 border' : 'bg-zinc-800 border border-black border-opacity-0'} rounded-md py-2 px-4 text-xl`}
		onclick={() => (cs2Active = true)}
	>
		CS2
	</button>
	<button
		class={`${!cs2Active ? 'bg-zinc-400 border' : 'bg-zinc-800 border border-black border-opacity-0'} rounded-md py-2 px-4 text-xl`}
		onclick={() => (cs2Active = false)}
	>
		CSGO
	</button>
</div>

<div class="text-center">
	{#if player.errors && player.errors[0].http_status === 404}
		<p>No faceit account found</p>
	{:else}
		{#if cs2Active}
			<div class="text-xl font-semibold mt-10">
				<p>Elo: {parsedPlayer.games['cs2']?.faceit_elo}</p>
			</div>
		{/if}
		{#await data.streamed.cs2}
			<p>loading</p>
		{:then cs2}
			{#if cs2Active && cs2}
				<div class="text-xl font-semibold mb-10">
					<p>Total matches: {cs2Matches}</p>
					<p>Win rate: {Math.round((cs2Wins / cs2Matches) * 100)}%</p>
					<p>Average Headshot: {cs2.lifetime['Average Headshots %']}%</p>
				</div>
				{#if cs2.segments}
					<div class="grid sm:grid-cols-2 gap-5 mx-auto w-full max-w-3xl sm:place-content-between">
						{#each cs2.segments
							.filter((map) => map.mode == '5v5')

							.sort((map1, map2) => {
								return Number(map2.stats.Matches) - Number(map1.stats.Matches);
								// if (b.stats['Matches']) {
								// 	if (a.stats['Matches']) return Number(b.stats.Matches) - Number(a.stats.Matches);
								// 	else return Number(b.stats.Matches) - Number(a.stats.Matches);
								// } else {
								// 	if (a.stats['Matches']) return b.stats['Total Matches'] - a.stats['Matches'];
								// 	else return b.stats['Total Matches'] - a.stats['Total Matches'];
								// }
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
			<div class="text-xl font-semibold mt-10">
				<p>Elo: {parsedPlayer.games['csgo']?.faceit_elo}</p>
			</div>
			{#await data.streamed.csgo then csgo}
				{#if csgo}
					<div class="text-xl font-semibold mb-10">
						<p>Total matches: {csgo.lifetime.Matches}</p>
						<p>Win rate: {csgo.lifetime['Win Rate %']}%</p>
						<p>Average Headshot: {csgo.lifetime['Average Headshots %']}%</p>
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
