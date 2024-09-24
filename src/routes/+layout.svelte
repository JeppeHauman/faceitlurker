<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	import '../app.css';
</script>

<a class="px-2 text-xl font-semibold" href="/">HOME</a>
<slot />
