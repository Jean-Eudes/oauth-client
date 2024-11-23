import {type EnvironmentName} from "./config";

type AcrValue = "L1" | "L2" | "L3" | "L4";

type Prompt = "none" | "login" | "no-prompt";

type Environment = {
    authorize_url: string,
    token_url: string,
    userInfo_url: string,
    workflow: Workflow,
}

type Workflow = {
    implicit?: PublicClient,
    authorization_code_with_pkce?: PublicClient,
    authorization_code?: ConfidentialClient,
}

type WorkflowName = keyof Workflow;

type ConfidentialClient = {
    client_id: string,
    client_secret: string,
}
type PublicClient = {
    client_id: string,
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
