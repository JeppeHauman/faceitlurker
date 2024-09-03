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
	<h3 class="mb-3 text-center font-bold italic text-red-600">{$errors._errors[0]}</h3>
{/if}

<form
	class={`mx-auto w-full ${isHomepage ? 'grid max-w-xl gap-2' : 'grid max-w-xl gap-2 md:flex md:max-w-2xl md:gap-0'}`}
	method="POST"
	action="/?/search"
>
	<input
		class={`rounded-sm border px-2 py-2 text-xl text-zinc-800 ${isHomepage ? '' : 'flex-grow rounded-r-none'}`}
		type="text"
		name="steamUrl"
		bind:value={$form.steamUrl}
		placeholder="E.g. https://steamcommunity.com/profiles/76561198028780484/"
	/>
	<button
		type="submit"
		class={`${isHomepage ? 'mx-auto' : 'mx-auto md:rounded-l-none'} w-fit rounded-sm border px-4 py-2 font-semibold hover:bg-zinc-700`}
		>Search</button
	>
</form>
