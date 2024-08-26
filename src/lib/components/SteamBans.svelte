<script lang="ts">
	import type { SteamBansAPIResponse } from '$lib/types/steamAPI';

	export let steamBans: SteamBansAPIResponse;
</script>

{#if steamBans.players[0] && (steamBans.players[0].CommunityBanned || steamBans.players[0].NumberOfGameBans > 0 || steamBans.players[0].NumberOfVACBans > 0)}
	<div class="text-center flex justify-center gap-5">
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
			{#if steamBans.players[0].DaysSinceLastBan === 1}
				<p class="text-red-900 text-2xl">
					{steamBans.players[0].DaysSinceLastBan} Day since last ban
				</p>
			{:else if steamBans.players[0].DaysSinceLastBan > 1}
				<p class="text-red-900 text-2xl">
					{steamBans.players[0].DaysSinceLastBan} Days since last ban
				</p>
			{/if}
		</div>
	</div>
{/if}
