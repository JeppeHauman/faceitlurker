<script lang="ts">
	import type { FaceitAPIBanReponse } from '$lib/types/faceitAPI';

	export let bans: FaceitAPIBanReponse;

	const oldBans = bans.items.filter((ban) => {
		if (ban.ends_at) {
			return new Date(ban.ends_at) < new Date();
		}
	});
</script>

{#if bans.items.length > 0 && bans.items[0].ends_at && new Date(bans.items[0].ends_at) > new Date()}
	<div class="text-center">
		<p>Faceit ban:</p>
		<h2 class="text-center text-2xl text-red-900">BANNED for {bans.items[0].reason}</h2>
		<p>Ends at: {new Date(bans.items[0].ends_at).toLocaleDateString()}</p>
	</div>
{/if}

{#if oldBans.length > 0}
	<div class="text-center">
		<p>Old faceit bans:</p>
		{#each oldBans as ban}
			<p class="text-center text-2xl text-red-900">BANNED for {ban.reason}</p>
			{#if ban.ends_at}
				<p>Ended: {ban.ends_at}</p>
			{/if}
		{/each}
	</div>
{/if}
