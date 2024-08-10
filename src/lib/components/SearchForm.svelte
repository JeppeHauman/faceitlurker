<script lang="ts">
	import type { SearchSchema } from '$lib/types/searchForm';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	export let data: SuperValidated<Infer<SearchSchema>>;

	const { form, errors } = superForm(data);
	if ($errors._errors) {
		$form.steamUrl = '';
	}
</script>

{#if $errors._errors}
	<h3 class="text-center font-bold text-red-600 italic mb-3">{$errors._errors[0]}</h3>
{/if}

<form class="max-w-xl w-full grid gap-2 mx-auto" method="POST" action="/?/search">
	<input
		class="border rounded-sm py-2 px-2 text-xl text-zinc-800"
		type="text"
		name="steamUrl"
		bind:value={$form.steamUrl}
		placeholder="E.g. https://steamcommunity.com/profiles/[profile]/"
	/>
	<button type="submit" class="border rounded-sm w-fit py-2 px-4 mx-auto hover:bg-zinc-400"
		>Search</button
	>
</form>
