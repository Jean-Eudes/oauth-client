type Environment = "homologation" | "production" | "development";
type AcrValue = "L1" | "L2" | "L3" | "L4";
type Workflow = "implicit" | "authorization_code" | "authorization_code_with_pkce";
type Prompt = "none" | "login" | "no-prompt";

type Token = {
    id_token: Object,
    access_token: Object,
}

type KeyCloak = {
    environment: Environment,
    workflow: Workflow,
    acr_value: AcrValue,
    prompt: Prompt
}

export type {
    Token, Environment, AcrValue, Workflow, Prompt, KeyCloak
}
