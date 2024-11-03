<script lang="ts">

    import DisplayObject from "./DisplayObject.svelte";
    import KeycloakForm from "./KeycloakForm.svelte";
    import type {KeyCloak, Token} from "./model";
    import {onMount} from "svelte";
    import {jwtDecode} from "jwt-decode";
    import {clientId, redirectUrl, tokenUrl} from "./config";

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
                const response = await fetch(tokenUrl(model.environment), {
                    method: "POST",
                    body: new URLSearchParams({
                            code: code,
                            client_id: clientId(model.environment),
                            grant_type: "authorization_code",
                            redirect_uri: redirectUrl(),
                        }
                    )
                })

                const json = await response.json();

                token = {
                    id_token: jwtDecode(json.id_token),
                    access_token: jwtDecode(json.access_token)
                };
            }
        }
        if (model.workflow === 'authorization_code_with_pkce') {
            const urlParams = new URLSearchParams(window.location.search);
            let code = urlParams.get("code");

            let oautht2 = sessionStorage.getItem('oauth2');
            if (oautht2 && code) {
                let parse = JSON.parse(oautht2);
                const response = await fetch(tokenUrl(model.environment), {
                    method: "POST",
                    body: new URLSearchParams({
                            code: code,
                            client_id: clientId(model.environment),
                            grant_type: "authorization_code",
                            redirect_uri: redirectUrl(),
                            code_verifier: parse.code_verifier,
                        }
                    )
                })
                sessionStorage.removeItem("oauth2");
                const json = await response.json();
                token = {
                    id_token: jwtDecode(json.id_token),
                    access_token: jwtDecode(json.access_token)
                };
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
