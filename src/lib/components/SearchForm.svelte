<script lang="ts">
	import type { SearchSchema } from '$lib/types/searchForm';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	export let data: SuperValidated<Infer<SearchSchema>>;

	export let isHomepage: boolean;
	const { form, errors } = superForm(data);
	if ($errors._errors) {
		$form.steamUrl = '';
	}
</script>

{#if $errors._errors}
	<h3 class="text-center font-bold text-red-600 italic mb-3">{$errors._errors[0]}</h3>
{/if}

<form
	class={`max-w-xl w-full mx-auto ${isHomepage ? 'grid gap-2' : 'flex gap-0 max-w-2xl'}`}
	method="POST"
	action="/?/search"
>
	<input
		class={`border rounded-sm py-2 px-2 text-xl text-zinc-800 ${isHomepage ? '' : 'flex-grow rounded-r-none'}`}
		type="text"
		name="steamUrl"
		bind:value={$form.steamUrl}
		placeholder="E.g. https://steamcommunity.com/profiles/76561198028780484/"
	/>
	<button
		type="submit"
		class={`${isHomepage ? 'mx-auto' : 'rounded-l-none'} border rounded-sm w-fit py-2 px-4 hover:bg-zinc-400`}
		>Search</button
	>
</form>
