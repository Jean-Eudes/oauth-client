<script lang="ts">
    import {type KeyCloak, type WorkflowName} from "$lib/model";
    import { authorize} from "$lib/oauth2";
    import {environments, workflowsBy} from "$lib/config";
    import * as O from 'fp-ts/Option'
    import type {Option} from "fp-ts/Option";

    type Props = {
        model: KeyCloak;
    }

    let {model = $bindable()}: Props = $props();
    let workflows: WorkflowName[] = $derived(workflowsBy(model.environment));

    async function authenticate(event: SubmitEvent) {
        event.preventDefault();
        const data = JSON.stringify(model);
        sessionStorage.setItem('keycloak-page', data);
        let scopes = model.scopes.trim();
        let url: Option<string> = await authorize(model.workflow, model.environment, model.acr_value, model.prompt, scopes);

        if (O.isSome(url)) {
            window.location.replace(url.value);
        }
    }

    function displayWorkflow(workflow: WorkflowName) : string {
        switch (workflow) {
            case 'implicit': return 'Implicit';
            case 'authorization_code': return 'Authorization code';
            case 'authorization_code_with_pkce': return 'Authorization code with pkce';
        }
    }

    function logout() {
        sessionStorage.removeItem('keycloak-page')
    }
</script>

<style lang="scss">

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
    #workflow {
        width: 250px;
    }
</style>

<form class="container" onsubmit={authenticate}>
    <div class="form">
        <div id="environment">
            <div class="field-label">
                <span class="label">Environnement</span>
            </div>

            {#each environments() as env}
                <div class="field-label">
                    <label for="{env}">
                        <input type="radio" id="{env}" name="environment" value="{env}"
                               bind:group={model.environment}>
                        {env}</label>
                </div>
            {/each}
         </div>
        <div id="workflow">
            <div class="field-label">
                <span class="label">Workflow</span>
            </div>
            {#each workflows as workflow}
                <div class="field-label">
                    <label for="{workflow}">
                        <input type="radio" id="{workflow}" name="workflow" value="{workflow}" bind:group={model.workflow}>
                        {displayWorkflow(workflow)}</label>
                </div>
            {/each}
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
            <div class="field-label">
                <label for="no-prompt">
                    <input type="radio" id="no-prompt" name="prompt" value="no-prompt" bind:group={model.prompt} required>
                    no prompt</label>
            </div>
            <div class="field-label">
                <label for="none">
                    <input type="radio" id="none" name="prompt" value="none" bind:group={model.prompt} required>
                    none</label>
            </div>
            <div class="field-label">
                <label for="login">
                    <input type="radio" id="login" name="prompt" value="login" bind:group={model.prompt} required>
                    login</label>
            </div>
        </div>
        <div id="scope">
            <div class="field-label">
                <span class="label">scope</span>
            </div>
            <div class="field-label">
                <textarea aria-label="scope" cols="30" rows="3" id="scopes" name="scopes" class="input" style="height: auto" bind:value={model.scopes}></textarea>
            </div>
        </div>
    </div>

    <div class="field is-horizontal">
        <div class="field" style="justify-content: flex-start; margin-left: 50px">
            <div class="control">
                <button type="button" class="button is-danger" onclick="{logout}">Logout</button>
                <button type="submit" class="button is-primary">Authentification</button>
            </div>
        </div>
    </div>

</form>