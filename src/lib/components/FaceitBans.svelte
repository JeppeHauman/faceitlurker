<script lang="ts">
	import type { FaceitAPIBanReponse } from '$lib/types/faceitAPI';

	export let bans: FaceitAPIBanReponse;
</script>

{#if bans.items.length > 0 && bans.items[0].ends_at && new Date(bans.items[0].ends_at) > new Date()}
	<div class="text-center">
		<p>Faceit bans:</p>
		<h2 class="text-center text-2xl text-red-900">BANNED for {bans.items[0].reason}</h2>
		<p>Ends at: {new Date(bans.items[0].ends_at).toLocaleDateString()}</p>
	</div>
{/if}
