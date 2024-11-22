import {type EnvironmentName} from "./config";

type AcrValue = "L1" | "L2" | "L3" | "L4";
type WorkflowName = "implicit" | "authorization_code" | "authorization_code_with_pkce";
type Prompt = "none" | "login" | "no-prompt";

type Environment = {
    authorize_url: string,
    token_url: string,
    userInfo_url: string,
    workflow: Workflow,
}

type Workflow = {
    [key in WorkflowName]: Client
}

type Client = {
    client_id: string,
    client_secret?: string,
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
    Client
}
