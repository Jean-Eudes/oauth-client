<script lang="ts">
	import '../app.scss';
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	let { children } = $props();

</script>

<div id="app">
	<div class="tabs">
		<ul>
			<li class:is-active={$page.url.pathname === `${base}/sgconnect.html`}><a
				href="{base}/sgconnect.html">sgconnect</a>
			</li>
			<li class:is-active={$page.url.pathname === `${base}/azure.html`}><a href="{base}/azure.html">azure</a></li>
			<li class:is-active={$page.url.pathname === `${base}/token.html`}><a href="{base}/token.html">token</a></li>
		</ul>
	</div>

	{@render children()}
</div>