import {authorizeUrl, clientId, redirectUrl} from "./config";
import type {AcrValue, Environment, Prompt} from "./model";

function authorizeURLForImplicit(env: Environment, acrValues: AcrValue, prompt: Prompt) {
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

export {authorizeURLForImplicit}

