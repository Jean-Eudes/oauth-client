<script lang="ts">

    import DisplayObject from "./DisplayObject.svelte";
    import KeycloakForm from "./KeycloakForm.svelte";
    import type {KeyCloak, Token} from "./model";
    import {onMount} from "svelte";
    import {jwtDecode} from "jwt-decode";
    import {authorizationCodeWorkflow, authorizationCodeWorkflowWithPKCE} from "./oauth2";

    let model: KeyCloak = {
        acr_value: 'L1',
        environment: 'production',
        prompt: "no-prompt",
        workflow: "implicit"
    }
    let token: Token | null = null;

    onMount(async () => {
        let item = sessionStorage.getItem('keycloak-page');
        if (item) {
            model = JSON.parse(item);
        }

        if (model.workflow === 'implicit') {
            const urlParams = new URLSearchParams(window.location.hash);
            let id_token = urlParams.get("id_token");
            let access_token = urlParams.get("access_token");

            if (id_token && access_token) {
                token = {
                    id_token: jwtDecode(id_token),
                    access_token: jwtDecode(access_token)
                };
            }
        }

        if (model.workflow === 'authorization_code') {
            const urlParams = new URLSearchParams(window.location.search);
            let code = urlParams.get("code");

            if (code) {
                token = await authorizationCodeWorkflow.token(model.environment, code);
            }
        }
        if (model.workflow === 'authorization_code_with_pkce') {
            const urlParams = new URLSearchParams(window.location.search);
            let code = urlParams.get("code");
            if (code) {
                token = await authorizationCodeWorkflowWithPKCE.token(model.environment, code);
            }
        }
    });

</script>
<div>
    <KeycloakForm model="{model}"></KeycloakForm>
    {#if token}
        <div style="display: flex;flex-direction: row; flex-wrap: wrap">
            <DisplayObject object="{token.id_token}" title="id token info"></DisplayObject>
            <DisplayObject object="{token.access_token}" title="access token info"></DisplayObject>
        </div>
    {/if}
</div>
