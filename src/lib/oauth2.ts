import {authorizeUrl, clientId, redirectUrl, tokenUrl} from "./config";
import type {AcrValue, Environment, Prompt, Token} from "./model";
import {jwtDecode} from "jwt-decode";

function authorizeURLForImplicit(env: Environment, acrValues: AcrValue, prompt: Prompt): string {
    const params = {
        client_id: clientId(env),
        state: "1234",
        redirect_uri: redirectUrl(),
        response_type: 'token id_token',
        scope: 'openid',
        nonce: '1234',
        acr_values: acrValues,
    };

    const searchParams = new URLSearchParams(params);
    if (prompt !== 'no-prompt') {
        searchParams.set('prompt', prompt);
    }
    return authorizeUrl(env) + '?' + searchParams.toString();
}

function authorization_code(environment: Environment, acrValues: AcrValue, prompt: Prompt): string {
    const params = {
        client_id: clientId(environment),
        state: "1234",
        redirect_uri: redirectUrl(),
        response_type: 'code',
        scope: 'openid',
        nonce: '1234',
        acr_values: acrValues,
    };

    const searchParams = new URLSearchParams(params);
    if (prompt !== 'no-prompt') {
        searchParams.set('prompt', prompt);
    }
    return authorizeUrl(environment) + '?' + searchParams.toString();
}

async function exchange_code_vs_token(environment: Environment, code: string): Promise<Token | null> {

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


const implicitWorkflow = {
    authorize: authorizeURLForImplicit,
}

const authorizationCodeWorkflow = {
    authorize: authorization_code,
    token: exchange_code_vs_token,
}

export {implicitWorkflow, authorizationCodeWorkflow}
