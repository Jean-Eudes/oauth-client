<script lang="ts">
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	// ...Your other imports

	if (browser) { // to prevent error window is not defined, because it's SSR
		window.location.href = `${base}/sgconnect.html`;
	}
	</script>