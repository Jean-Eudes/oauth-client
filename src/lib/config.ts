import type {Configuration, Environment} from "./model";

let config: Configuration = {
    development: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        client_id: "test-client",
    },
    homologation: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        client_id: "test-client",
    },
    production: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        client_id: "test-client",
    }
}

function authorizeUrl(env: Environment): string {
    return config[env].authorize_url;
}

function tokenUrl(env: Environment): string {
    return config[env].token_url;
}

function clientId(env: Environment): string {
    return config[env].client_id;
}

function redirectUrl(): string {
    return import.meta.env.VITE_REDIRECT_URL;
}

export {authorizeUrl, tokenUrl, clientId, redirectUrl};