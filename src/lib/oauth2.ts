import {clientBy, redirectUrl} from "./config";
import type {AcrValue, Environment, Prompt, Token} from "./model";
import {generateRandomString, pkceChallengeFromVerifier} from "./crypto";

function authorize(environment: Environment, acrValues: AcrValue, response_type: string, additional_infos: Map<string, string>): string {
    const state = generateRandomString(30);
    const nonce = generateRandomString(30);
    const client = clientBy(environment);
    const searchParams = new URLSearchParams();

    searchParams.set('client_id', client.id);
    searchParams.set('state', state);
    searchParams.set('redirect_uri', redirectUrl());
    searchParams.set('response_type', response_type);
    searchParams.set('scope', 'openid');
    searchParams.set('nonce', nonce);
    searchParams.set('acr_values', acrValues);

    for (let [key, value] of additional_infos) {
        searchParams.set(key, value);
    }

    return client.authorize_url + '?' + searchParams.toString();
}

function createMapWithPrompt(prompt: Prompt) {
    const additional_params = new Map<string, string>();
    if (prompt !== 'no-prompt') {
        additional_params.set('prompt', prompt);
    }
    return additional_params;
}

function authorizeURLForImplicit(env: Environment, acrValues: AcrValue, prompt: Prompt): string {
    let additional_params = createMapWithPrompt(prompt);
    return authorize(env, acrValues, "token id_token", additional_params);
}

function authorization_code(environment: Environment, acrValues: AcrValue, prompt: Prompt): string {
    const additional_params = createMapWithPrompt(prompt);
    return authorize(environment, acrValues, "code", additional_params);
}

async function authorize_code_with_pkce(environment: Environment, acrValues: AcrValue, prompt: Prompt) {
    const code_verifier = generateRandomString(60);
    const code_challenge = await pkceChallengeFromVerifier(code_verifier);
    sessionStorage.setItem('oauth2', JSON.stringify({code_verifier: code_verifier}));

    let additional_params = createMapWithPrompt(prompt);

    additional_params.set('code_challenge', code_challenge);
    additional_params.set('code_challenge_method', 'S256');

    return authorize(environment, acrValues, "code", additional_params);
}

async function exchange_code_vs_token(environment: Environment, code: string): Promise<Token> {
    const client = clientBy(environment);

    const response = await fetch(client.token_url, {
        method: "POST",
        body: new URLSearchParams({
                code: code,
                client_id: client.id,
                grant_type: "authorization_code",
                redirect_uri: redirectUrl(),
            }
        )
    })

    const json = await response.json();

    return {
        id_token: json.id_token,
        access_token: json.access_token
    };
}

async function user_info(environment: Environment, access_token: string) {
    const client = clientBy(environment);

    console.log(access_token)

    const response = await fetch(client.userInfo_url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    return await response.json();
}

async function exchange_code_vs_token_with_pkce(environment: Environment, code: string): Promise<Token | null> {
    const client = clientBy(environment);
    let code_verifier = sessionStorage.getItem('oauth2');
    if (code_verifier) {
        let parse = JSON.parse(code_verifier);
        const response = await fetch(client.token_url, {
            method: "POST",
            body: new URLSearchParams({
                    code: code,
                    client_id: client.id,
                    grant_type: "authorization_code",
                    redirect_uri: redirectUrl(),
                    code_verifier: parse.code_verifier,
                }
            )
        })
        sessionStorage.removeItem("oauth2");
        const json = await response.json();
        return {
            id_token: json.id_token,
            access_token: json.access_token,
        };
    }
    return null;
}

const implicitWorkflow = {
    authorize: authorizeURLForImplicit,
}

const authorizationCodeWorkflow = {
    authorize: authorization_code,
    token: exchange_code_vs_token,
}

const authorizationCodeWorkflowWithPKCE = {
    authorize: authorize_code_with_pkce,
    token: exchange_code_vs_token_with_pkce,
}

export {implicitWorkflow, authorizationCodeWorkflow, authorizationCodeWorkflowWithPKCE, user_info}
