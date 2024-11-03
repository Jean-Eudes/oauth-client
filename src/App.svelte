<script lang="ts">
    import KeycloakPage from "./lib/KeycloakPage.svelte";

    let page: "keycloak" | "azure" = "keycloak";

</script>

<main>

    <div class="tabs">
        <ul>
            <li class:is-active={page === 'keycloak'}><a href="/#keycloak" onclick="{() => page = 'keycloak'}">sgconnect</a>
            </li>
            <li class:is-active={page === 'azure'}><a href="/#azure" onclick="{() => page = 'azure'}">azure</a></li>
        </ul>
    </div>

    {#if page === "keycloak"}
        <KeycloakPage></KeycloakPage>
    {/if}
    {#if page === "azure"}
        <div>
            <div style="display: flex;flex-direction: column;align-items: flex-start;">
                <label for="strong">
                    <input type="radio" id="strong" name="authentication" value="male">
                    authentification L4</label>
                <label for="basic">
                    <input type="radio" id="basic" name="authentication" value="female">
                    authentification L2</label>
            </div>
        </div>

    {/if}

</main>

<style>
    /*.logo {*/
    /*    height: 6em;*/
    /*    padding: 1.5em;*/
    /*    will-change: filter;*/
    /*    transition: filter 300ms;*/
    /*}*/

    /*.logo:hover {*/
    /*    filter: drop-shadow(0 0 2em #646cffaa);*/
    /*}*/

    /*.logo.svelte:hover {*/
    /*    filter: drop-shadow(0 0 2em #ff3e00aa);*/
    /*}*/

    /*.read-the-docs {*/
    /*    color: #888;*/
    /*}*/
</style>
