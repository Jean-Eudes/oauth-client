import {authorizeUrl, clientId, redirectUrl, tokenUrl} from "./config";
import type {AcrValue, Environment, Prompt, Token} from "./model";
import {jwtDecode} from "jwt-decode";
import {generateRandomString, pkceChallengeFromVerifier} from "./crypto";

function authorize(env: Environment, acrValues: AcrValue, response_type: string, additional_infos: Map<string, string>): string {
    const state = generateRandomString(30);
    const nonce = generateRandomString(30);
    const searchParams = new URLSearchParams();

    searchParams.set('client_id', clientId(env));
    searchParams.set('state', state);
    searchParams.set('redirect_uri', redirectUrl());
    searchParams.set('response_type', response_type);
    searchParams.set('scope', 'openid');
    searchParams.set('nonce', nonce);
    searchParams.set('acr_values', acrValues);

    for (let [key, value] of additional_infos) {
        searchParams.set(key, value);
    }

    return authorizeUrl(env) + '?' + searchParams.toString();
}

function createMapWithPrompt(prompt: Prompt) {
    let additional_params = new Map<string, string>();
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

    const response = await fetch(tokenUrl(environment), {
        method: "POST",
        body: new URLSearchParams({
                code: code,
                client_id: clientId(environment),
                grant_type: "authorization_code",
                redirect_uri: redirectUrl(),
            }
        )
    })

    const json = await response.json();

    return {
        id_token: jwtDecode(json.id_token),
        access_token: jwtDecode(json.access_token)
    };
}

async function exchange_code_vs_token_with_pkce(environment: Environment, code: string): Promise<Token | null> {
    let code_verifier = sessionStorage.getItem('oauth2');
    if (code_verifier) {
        let parse = JSON.parse(code_verifier);
        const response = await fetch(tokenUrl(environment), {
            method: "POST",
            body: new URLSearchParams({
                    code: code,
                    client_id: clientId(environment),
                    grant_type: "authorization_code",
                    redirect_uri: redirectUrl(),
                    code_verifier: parse.code_verifier,
                }
            )
        })
        sessionStorage.removeItem("oauth2");
        const json = await response.json();
        return {
            id_token: jwtDecode(json.id_token),
            access_token: jwtDecode(json.access_token)
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

export {implicitWorkflow, authorizationCodeWorkflow, authorizationCodeWorkflowWithPKCE}
