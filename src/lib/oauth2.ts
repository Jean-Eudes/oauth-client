import {authorizeUrl, clientId, redirectUrl, tokenUrl} from "./config";
import type {AcrValue, Environment, Prompt, Token} from "./model";
import {jwtDecode} from "jwt-decode";
import {generateRandomString, pkceChallengeFromVerifier} from "./crypto";

function authorize(env: Environment, acrValues: AcrValue, prompt: Prompt, response_type: string): string {
    let state = generateRandomString(30);
    let nonce = generateRandomString(30);

    const params = {
        client_id: clientId(env),
        state: state,
        redirect_uri: redirectUrl(),
        response_type: response_type,
        scope: 'openid',
        nonce: nonce,
        acr_values: acrValues,
    };

    const searchParams = new URLSearchParams(params);
    if (prompt !== 'no-prompt') {
        searchParams.set('prompt', prompt);
    }
    return authorizeUrl(env) + '?' + searchParams.toString();
}

function authorizeURLForImplicit(env: Environment, acrValues: AcrValue, prompt: Prompt): string {
    return authorize(env, acrValues, prompt, "token id_token");
}

function authorization_code(environment: Environment, acrValues: AcrValue, prompt: Prompt): string {
    return authorize(environment, acrValues, prompt, "code");
}

async function authorize_code_with_pkce(environment: Environment, acrValues: AcrValue, prompt: Prompt) {
    let code_verifier = generateRandomString(60);
    let state = generateRandomString(30);
    let nonce = generateRandomString(30);
    let code_challenge = await pkceChallengeFromVerifier(code_verifier);

    sessionStorage.setItem('oauth2', JSON.stringify({code_verifier: code_verifier}));
    const params = {
        client_id: clientId(environment),
        state: state,
        redirect_uri: redirectUrl(),
        response_type: 'code',
        scope: 'openid',
        nonce: nonce,
        acr_values: acrValues,
        code_challenge: code_challenge,
        code_challenge_method: 'S256'
    };

    const searchParams = new URLSearchParams(params);
    if (prompt !== 'no-prompt') {
        searchParams.set('prompt', prompt);
    }
    return authorizeUrl(environment) + '?' + searchParams.toString();
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
    let oautht2 = sessionStorage.getItem('oauth2');
    if (oautht2) {
        let parse = JSON.parse(oautht2);
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
