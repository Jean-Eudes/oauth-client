<script lang="ts">

	import DisplayObject from "$lib/components/DisplayObject.svelte";
	import {jwtDecode} from "jwt-decode";

	const initialToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
	let model: string = $state(initialToken);
	let jwtHeader = $derived(jwtDecode(model, {header: true}));
	let jwtBody = $derived(jwtDecode(model));

</script>
<style lang="scss" >
    .field-label {
        text-align: left;
        margin-inline-end: 1.5rem;
    }
    textarea {
        font-size: 18px;
        padding: 20px;
        height: auto;
    }

    .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>

<svelte:head>
	<title>Inspection d'un token</title>
</svelte:head>

<div class="container">
	<div class="field-label">
		<textarea aria-label="token jwt" id="myTextarea" rows="25" cols="60" bind:value={model}></textarea>
	</div>
	<div class="field-label">
		{#if jwtHeader}
			<DisplayObject object={jwtHeader} title="header"></DisplayObject>
		{/if}

		{#if jwtBody}
			<DisplayObject object={jwtBody} title="body"></DisplayObject>
		{/if}
	</div>
</div>
