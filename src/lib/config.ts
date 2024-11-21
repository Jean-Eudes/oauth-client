import type {Client, Configuration} from "./model";

type Environment = keyof typeof config;

const config: Configuration = {
    development: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        id: "test-client",
        userInfo_url: "http://localhost:8080/realms/test/protocol/openid-connect/userinfo"
    },
    homologation: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        id: "test-client",
        userInfo_url: "http://localhost:8080/realms/test/protocol/openid-connect/userinfo",
    },
    production: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        id: "test-client",
        userInfo_url: "http://localhost:8080/realms/test/protocol/openid-connect/userinfo",
    }
} as const;

function clientBy(env: Environment): Client {
    return config[env];
}

function environments(): Array<Environment> {
    return Object.keys(config);
}

function redirectUrl(): string {
    return import.meta.env.VITE_REDIRECT_URL;
}

export {clientBy, redirectUrl, environments};
export type {Environment};