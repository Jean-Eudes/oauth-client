import {type EnvironmentName} from "./config";

type AcrValue = "L1" | "L2" | "L3" | "L4";

type Prompt = "none" | "login" | "no-prompt";

type Environment = {
    readonly authorize_url: string,
    readonly token_url: string,
    readonly userInfo_url: string,
    readonly workflow: Workflow,
}

type Workflow = {
    readonly implicit?: PublicClient,
    readonly authorization_code_with_pkce?: PublicClient,
    readonly authorization_code?: ConfidentialClient,
}

type WorkflowName = keyof Workflow;

type ConfidentialClient = {
    readonly client_id: string,
    readonly client_secret: string,
}
type PublicClient = {
    readonly client_id: string,
}

type Configuration = {
    [key in string]: Environment
};

type Token = {
    id_token: string,
    access_token: string,
}

type KeyCloak = {
    environment: EnvironmentName,
    workflow: WorkflowName,
    acr_value: AcrValue,
    prompt: Prompt,
    scopes: string,
}

export type {
    Token,
    AcrValue,
    WorkflowName,
    Prompt,
    KeyCloak,
    Configuration,
    Environment,
    EnvironmentName,
    ConfidentialClient,
    PublicClient,
}
