<script lang="ts">

    import DisplayObject from "./DisplayObject.svelte";
    import KeycloakForm from "./KeycloakForm.svelte";
    import type {KeyCloak, Token} from "./model";
    import {onMount} from "svelte";
    import {jwtDecode} from "jwt-decode";
    import * as O from 'fp-ts/Option'

    import {token, user_info} from "./oauth2";

    let model: KeyCloak = $state({
        acr_value: 'L1',
        environment: 'production',
        prompt: "no-prompt",
        workflow: "implicit",
        scopes: "openid",
    });

    let tokenModel: Token | null = $state(null);
    let userInfo: any = $state(null);

    onMount(async () => {
        let item = sessionStorage.getItem('keycloak-page');
        if (item) {
            model = JSON.parse(item);
        }

        if (model.workflow === 'implicit') {
            const urlParams = new URLSearchParams(window.location.hash.slice(1));
            let id_token = urlParams.get("id_token");
            let access_token = urlParams.get("access_token");

            if (id_token && access_token) {
                tokenModel = {
                    id_token: id_token,
                    access_token: access_token
                };
                userInfo = await user_info(model.environment, access_token);
            }
        }

        if (model.workflow === 'authorization_code' || model.workflow === 'authorization_code_with_pkce') {
            const urlParams = new URLSearchParams(window.location.search);
            let code = urlParams.get("code");

            if (code) {
                let tokenOpt = await token(model.workflow, model.environment, code);
                if (O.isSome(tokenOpt)) {
                    tokenModel = tokenOpt.value;
                    userInfo = await user_info(model.environment, tokenModel.access_token);
                }
            }
        }
    });

</script>
<div>
    <KeycloakForm bind:model={model}></KeycloakForm>
    <div style="display: flex;flex-direction: row; flex-wrap: wrap">
        {#if tokenModel}
            <DisplayObject object={jwtDecode(tokenModel.id_token)} title="id token info"></DisplayObject>
            <DisplayObject object={jwtDecode(tokenModel.access_token)} title="access token info"></DisplayObject>
        {/if}

        {#if userInfo}
            <DisplayObject object={userInfo} title="user info"></DisplayObject>
        {/if}
    </div>
</div>
