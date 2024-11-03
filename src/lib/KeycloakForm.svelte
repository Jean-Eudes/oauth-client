<script lang="ts">
    import {type KeyCloak} from "./model";
    import {generateRandomString, pkceChallengeFromVerifier} from "./crypto";
    import {authorizeUrl, clientId, redirectUrl} from "./config";

    export let model: KeyCloak;

    function authorizeURLForImplicit() {
        const params = {
            client_id: clientId(model.environment),
            state: "1234",
            redirect_uri: redirectUrl(),
            response_type: 'token id_token',
            scope: 'openid',
            nonce: '1234',
            acr_values: model.acr_value,
        };

        const searchParams = new URLSearchParams(params);
        if (model.prompt !== 'no-prompt') {
            searchParams.set('prompt', model.prompt);
        }
        return authorizeUrl(model.environment) + '?' + searchParams.toString();
    }

    async function authenticate() {
        const data = JSON.stringify(model);
        sessionStorage.setItem('keycloak-page', data);

        if (model.workflow === 'implicit') {
            let url = authorizeURLForImplicit();
            window.location.replace(url);
        }
        if (model.workflow === 'authorization_code') {

            const params = {
                client_id: clientId(model.environment),
                state: "1234",
                redirect_uri: redirectUrl(),
                response_type: 'code',
                scope: 'openid',
                nonce: '1234',
                acr_values: model.acr_value,
            };

            const searchParams = new URLSearchParams(params);
            if (model.prompt !== 'no-prompt') {
                searchParams.set('prompt', model.prompt);
            }
            const url = authorizeUrl(model.environment) + '?' + searchParams.toString();
            window.location.replace(url);
        }
        if (model.workflow === 'authorization_code_with_pkce') {

            let code_verifier = generateRandomString(60);
            let code_challenge = await pkceChallengeFromVerifier(code_verifier);

            sessionStorage.setItem('oauth2', JSON.stringify({workflow: model.workflow, code_verifier: code_verifier}));
            const params = {
                client_id: clientId(model.environment),
                state: "1234",
                redirect_uri: redirectUrl(),
                response_type: 'code',
                code_challenge: code_challenge,
                scope: 'openid',
                nonce: '1234',
                acr_values: model.acr_value,
                code_challenge_method: 'S256'
            };

            const searchParams = new URLSearchParams(params);
            if (model.prompt !== 'no-prompt') {
                searchParams.set('prompt', model.prompt);
            }
            const url = authorizeUrl(model.environment) + '?' + searchParams.toString();
            window.location.replace(url);
        }
    }

    function logout() {
        sessionStorage.removeItem('keycloak-page')
    }
</script>

<style>

    .form {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: flex-start;
        margin-bottom: 16px;
    }

    .container {
        margin-bottom: 30px;
    }

    .field:not(:last-child) {
        margin-right: 30px
    }

    .field-label {
        text-align: left;
    }
</style>

<div class="container">
    <div class="form">
        <div class="">
            <div class="field-label">
                <span class="label">Environnement</span>
            </div>
            <div class="field-label">
                <label for="production">
                    <input type="radio" id="production" name="environment" value="production"
                           bind:group={model.environment}>
                    production</label>
            </div>
            <div class="field-label">
                <label for="homologation">
                    <input type="radio" id="homologation" name="environment" value="homologation"
                           bind:group={model.environment}>
                    homologation</label>
            </div>
            <div class="field-label">
                <label for="development">
                    <input type="radio" id="development" name="environment" value="development"
                           bind:group={model.environment}>
                    development</label>
            </div>
        </div>
        <div class="">
            <div class="field-label">
                <span class="label">Workflow</span>
            </div>
            <div class="field-label">
                <label for="implicit">
                    <input type="radio" id="implicit" name="workflow" value="implicit" bind:group={model.workflow}>
                    Implicit</label>
            </div>
            <div class="field-label">
                <label for="authorization_code">
                    <input type="radio" id="authorization_code" name="workflow" value="authorization_code"
                           bind:group={model.workflow}>
                    Authorization code</label>
            </div>
            <div class="field-label">
                <label for="authorization_code_with_pkce">
                    <input type="radio" id="authorization_code_with_pkce" name="workflow"
                           value="authorization_code_with_pkce" bind:group={model.workflow}>
                    Authorization code with pkce</label>
            </div>
        </div>
        <div class="">
            <div class="field-label">
                <span class="label">acr value</span>
            </div>
            <div class="field-label">

                <label for="L1">
                    <input type="radio" id="L1" name="acr_value" value="L1" bind:group={model.acr_value}>
                    L1</label>
            </div>
            <div class="field-label">
                <label for="L2">
                    <input type="radio" id="L2" name="acr_value" value="L2" bind:group={model.acr_value}>
                    L2</label>
            </div>
            <div class="field-label">
                <label for="L3">
                    <input type="radio" id="L3" name="acr_value" value="L3" bind:group={model.acr_value}>
                    L3</label>
            </div>
            <div class="field-label">
                <label for="L4">
                    <input type="radio" id="L4" name="acr_value" value="L4" bind:group={model.acr_value}>
                    L4</label>
            </div>
        </div>
        <div class="">
            <div class="field-label">
                <span class="label">prompt</span>
            </div>
            <div>
                <label for="no-prompt">
                    <input type="radio" id="no-prompt" name="prompt" value="no-prompt" bind:group={model.prompt}>
                    no prompt</label>
            </div>
            <div class="field-label">
                <label for="none">
                    <input type="radio" id="none" name="prompt" value="none" bind:group={model.prompt}>
                    none</label>
            </div>
            <div class="field-label">
                <label for="login">
                    <input type="radio" id="login" name="prompt" value="login" bind:group={model.prompt}>
                    login</label>
            </div>
        </div>
    </div>

    <div class="field is-horizontal">
        <div class="field" style="justify-content: flex-start; margin-left: 50px">
            <div class="control">
                <button class="button is-danger" onclick="{logout}">Logout</button>
                <button class="button is-primary" onclick="{authenticate}">Authentification</button>
            </div>
        </div>
    </div>

</div>