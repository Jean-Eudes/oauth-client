<script lang="ts">
    import {type KeyCloak} from "./model";
    import {authorizationCodeWorkflow, authorizationCodeWorkflowWithPKCE, implicitWorkflow} from "./oauth2";

    export let model: KeyCloak;

    async function authenticate() {
        const data = JSON.stringify(model);
        sessionStorage.setItem('keycloak-page', data);

        if (model.workflow === 'implicit') {
            let url = implicitWorkflow.authorize(model.environment, model.acr_value, model.prompt);
            window.location.replace(url);
        }
        if (model.workflow === 'authorization_code') {
            const url = authorizationCodeWorkflow.authorize(model.environment, model.acr_value, model.prompt);
            window.location.replace(url);
        }
        if (model.workflow === 'authorization_code_with_pkce') {
            const url = await authorizationCodeWorkflowWithPKCE.authorize(model.environment, model.acr_value, model.prompt);
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
        flex-wrap: wrap;
    }

    .container {
        margin-bottom: 30px;
    }

    .field:not(:last-child) {
        margin-right: 30px
    }

    .field-label {
        text-align: left;
        margin-inline-end: 1.5rem;
    }
</style>

<div class="container">
    <div class="form">
        <div id="environment">
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
        <div id="workflow">
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
        <div id="acrValue">
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
        <div id="prompt">
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