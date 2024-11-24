import {environmentBy, redirectUrl} from "./config";
import type {AcrValue, ConfidentialClient, EnvironmentName, Prompt, PublicClient, Token, WorkflowName} from "./model";
import {generateRandomString, pkceChallengeFromVerifier} from "./crypto";
import type {Option} from "fp-ts/Option";
import * as O from 'fp-ts/Option'

function authorizePrivate(clientId: string, authorizeUrl: string, acrValues: AcrValue, response_type: string, additional_infos: Map<string, string>, scope: string): string {
    const state = generateRandomString(30);
    const nonce = generateRandomString(30);
    const searchParams = new URLSearchParams();

    searchParams.set('client_id', clientId);
    searchParams.set('state', state);
    searchParams.set('redirect_uri', redirectUrl());
    searchParams.set('response_type', response_type);
    searchParams.set('scope', scope);
    searchParams.set('nonce', nonce);
    searchParams.set('acr_values', acrValues);

    for (let [key, value] of additional_infos) {
        searchParams.set(key, value);
    }

    return authorizeUrl + '?' + searchParams.toString();
}

function createMapWithPrompt(prompt: Prompt) {
    const additional_params = new Map<string, string>();
    if (prompt !== 'no-prompt') {
        additional_params.set('prompt', prompt);
    }
    return additional_params;
}

function authorizeURLForImplicit(environmentName: EnvironmentName, acrValues: AcrValue, prompt: Prompt, scopes: string): Option<string> {
    let additional_params = createMapWithPrompt(prompt);
    let environment = environmentBy(environmentName);
    let client = O.fromNullable(environment.workflow.implicit);
    let response_type = "token";
    if (scopes.includes("openid")) {
        response_type += " id_token";
    }
    return O.map((c: PublicClient) => authorizePrivate(c.client_id, environment.authorize_url, acrValues, response_type, additional_params, scopes))(client);
}

function authorization_code(environmentName: EnvironmentName, acrValues: AcrValue, prompt: Prompt, scopes: string): Option<string> {
    const additional_params = createMapWithPrompt(prompt);
    let environment = environmentBy(environmentName);
    let client = O.fromNullable(environment.workflow.authorization_code);

    return O.map((c: ConfidentialClient) => authorizePrivate(c.client_id, environment.authorize_url, acrValues, "code", additional_params, scopes))(client)
}

async function authorize_code_with_pkce(environmentName: EnvironmentName, acrValues: AcrValue, prompt: Prompt, scopes: string): Promise<Option<string>> {
    const code_verifier = generateRandomString(60);
    const code_challenge = await pkceChallengeFromVerifier(code_verifier);
    sessionStorage.setItem('oauth2', JSON.stringify({code_verifier: code_verifier}));

    let additional_params = createMapWithPrompt(prompt);

    additional_params.set('code_challenge', code_challenge);
    additional_params.set('code_challenge_method', 'S256');
    let environment = environmentBy(environmentName);
    let client = O.fromNullable(environment.workflow.authorization_code_with_pkce);

    return O.map((c: PublicClient) => authorizePrivate(c.client_id, environment.authorize_url, acrValues, "code", additional_params, scopes))(client);
}

async function exchange_code_vs_token(environment: EnvironmentName, code: string): Promise<Option<Token>> {
    const env = environmentBy(environment);

    let workflowElement = env.workflow['authorization_code'];
    if (workflowElement) {
        let clientId = workflowElement.client_id;

        const response = await fetch(env.token_url, {
            method: "POST",
            headers: {
                'Authorization': `Basic ${btoa(workflowElement.client_id + ":" + workflowElement.client_secret)}`,
            },
            body: new URLSearchParams({
                    code: code,
                    client_id: clientId,
                    grant_type: "authorization_code",
                    redirect_uri: redirectUrl(),
                }
            )
        })

        const json = await response.json();

        return O.some({
            id_token: json.id_token,
            access_token: json.access_token
        });
    }
    return O.none;
}

async function exchange_code_vs_token_with_pkce(environment: EnvironmentName, code: string): Promise<Option<Token>> {
    const env = environmentBy(environment);
    let code_verifier = sessionStorage.getItem('oauth2');
    if (code_verifier) {
        let parse = JSON.parse(code_verifier);
        let workflowElement = env.workflow['authorization_code_with_pkce'];
        if (workflowElement) {
            const response = await fetch(env.token_url, {
                method: "POST",
                body: new URLSearchParams({
                        code: code,
                        client_id: workflowElement.client_id,
                        grant_type: "authorization_code",
                        redirect_uri: redirectUrl(),
                        code_verifier: parse.code_verifier,
                    }
                )
            })

            sessionStorage.removeItem("oauth2");
            const json = await response.json();
            return O.some({
                id_token: json.id_token,
                access_token: json.access_token,
            });
        }
    }
    return O.none;
}

async function user_info(environment: EnvironmentName, access_token: string) {
    const client = environmentBy(environment);

    const response = await fetch(client.userInfo_url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    return await response.json();
}

async function authorize(workflow: WorkflowName, env: EnvironmentName, acr_value: AcrValue, prompt: Prompt, scope: string): Promise<Option<string>> {
    const environment = environmentBy(env);

    switch (workflow) {
        case "implicit":
            return Promise.resolve(authorizeURLForImplicit(env, acr_value, prompt, scope));
        case "authorization_code_with_pkce":
            return authorize_code_with_pkce(env, acr_value, prompt, scope);
        case "authorization_code":
            return Promise.resolve(authorization_code(env, acr_value, prompt, scope));
    }
}

async function token(workflow: WorkflowName, env: EnvironmentName, code: string): Promise<Option<Token>> {
    switch (workflow) {
        case "implicit":
            return Promise.resolve(O.none);
        case "authorization_code_with_pkce":
            return exchange_code_vs_token_with_pkce(env, code);
        case "authorization_code":
            return exchange_code_vs_token(env, code);
    }
}

export {token, user_info, authorize}
