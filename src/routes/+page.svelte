<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	export let form;
	console.log(form);
</script>

<h2 class="text-center text-2xl font-bold mb-5">Insert steam profile url</h2>

{#if form?.error}
	<h3 class="text-center font-bold text-red-600 italic mb-3">{form.message}</h3>
{/if}

<form class="max-w-xl w-full grid gap-2 mx-auto" method="POST">
	<input
		class="border rounded-sm py-2 px-2 text-xl text-zinc-800"
		type="text"
		name="profileUrl"
		placeholder="E.g. https://steamcommunity.com/profiles/[profile]/"
	/>
	<button type="submit" class="border rounded-sm w-fit py-2 px-4 mx-auto">Search</button>
</form>
