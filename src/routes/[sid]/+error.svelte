<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Not found | FaceitLurker</title>
</svelte:head>

<div class="flex flex-col text-center space-y-20 mt-20">
	<h1 class="text-4xl font-bold text-center">{$page.status}: {$page.error?.message}</h1>

	<a class="border rounded-md py-2 px-4 w-fit mx-auto hover:bg-zinc-900" href="/">Try again</a>

	<div>
		<p>If you are experiencing unexpected issues,</p>
		<p>contact me on <a class="underline" href="https://github.com/JeppeHauman">Github</a></p>
	</div>
</div>
