import type {Configuration, Environment} from "./model";

type EnvironmentName = keyof typeof config;

const config: Configuration = {
    development: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        userInfo_url: "http://localhost:8080/realms/test/protocol/openid-connect/userinfo",
        workflow : {
            implicit: {
                client_id: "test-client"
            },
            authorization_code: {
                client_id: "test-client",
                client_secret: "",
            },
            authorization_code_with_pkce: {
                client_id: "test-client",
                client_secret: "",
            }
        },
    },
    homologation: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        userInfo_url: "http://localhost:8080/realms/test/protocol/openid-connect/userinfo",
        workflow : {
            implicit: {
                client_id: "test-client"
            },
            authorization_code: {
                client_id: "test-client",
                client_secret: "",
            },
            authorization_code_with_pkce: {
                client_id: "test-client",
                client_secret: "",
            }
        },
    },
    production: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        userInfo_url: "http://localhost:8080/realms/test/protocol/openid-connect/userinfo",
        workflow : {
            implicit: {
                client_id: "test-client"
            },
            authorization_code: {
                client_id: "test-client",
                client_secret: "",
            },
            authorization_code_with_pkce: {
                client_id: "test-client",
                client_secret: "",
            }
        },
    },
} as const;

function environmentBy(env: EnvironmentName): Environment {
    return config[env];
}

function environments(): Array<EnvironmentName> {
    return Object.keys(config);
}

function redirectUrl(): string {
    return import.meta.env.VITE_REDIRECT_URL;
}

export {environmentBy, redirectUrl, environments};
export type {EnvironmentName};