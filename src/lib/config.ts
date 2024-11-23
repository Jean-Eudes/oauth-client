import type {Configuration, Environment, WorkflowName} from "./model";

type EnvironmentName = keyof typeof config;

const config: Configuration = {
    development: {
        authorize_url: "http://localhost:8080/realms/test/protocol/openid-connect/auth",
        token_url: "http://localhost:8080/realms/test/protocol/openid-connect/token",
        userInfo_url: "http://localhost:8080/realms/test/protocol/openid-connect/userinfo",
        workflow : {
            authorization_code: {
                client_id: "test2",
                client_secret: "A9RRp3nBTOGavYf2xB3ubaQypqAdDijG",
            },
            authorization_code_with_pkce: {
                client_id: "test-client",
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
                client_id: "test2",
                client_secret: "A9RRp3nBTOGavYf2xB3ubaQypqAdDijG",
            },
            authorization_code_with_pkce: {
                client_id: "test-client",
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

function workflowsBy(env: EnvironmentName): Array<WorkflowName> {
    let workflow = config[env].workflow;
    return Object.keys(workflow) as Array<WorkflowName>;
}

function redirectUrl(): string {
    return import.meta.env.VITE_REDIRECT_URL;
}

export {environmentBy, workflowsBy, redirectUrl, environments};
export type {EnvironmentName};
