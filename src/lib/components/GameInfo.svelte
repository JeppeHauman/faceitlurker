<script lang="ts">
	import type { FaceitCs2StatsAPIResponse, FaceitGame, Segment } from '$lib/types/faceitAPI';

	export let game: FaceitGame;
	export let matches: number, wins: number, kd: number, avgHeadshot: number;
	export let segments: Segment[];
</script>

<div class="text-xl font-semibold">
	<p class="flex items-center justify-center gap-2">
		Elo: {game.faceit_elo}
		{#await import(`$lib/assets/faceitLevelIcon/level_${game.skill_level}.svg`) then { default: src }}
			<img class="aspect-square w-7 inline-flex" {src} alt="faceit skill level icon" />
		{/await}
	</p>
</div>

<div class="text-xl font-semibold mb-10">
	<p>Total matches: {matches}</p>
	<p>Win rate: {Math.round((wins / matches) * 100)}%</p>
	<p>Average Headshot: {avgHeadshot}%</p>
	<p>Lifetime K/D: {kd.toFixed(2)}</p>
</div>
{#if segments}
	<div class="grid sm:grid-cols-2 gap-5 mx-auto w-full max-w-3xl sm:place-content-between">
		{#each segments
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
