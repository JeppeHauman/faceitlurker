<script lang="ts">
	export let data;

	const stats = data.data;

	let nMatches: number = 0;
	stats.segments.forEach((segment) => {
		if (segment.mode === '5v5') nMatches += Number(segment.stats.Matches);
	});
</script>

<pre>
	{JSON.stringify(stats, null, 2)}
</pre>
