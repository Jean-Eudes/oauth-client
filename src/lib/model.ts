type Environment = 'development' | 'homologation' | 'production';
type AcrValue = "L1" | "L2" | "L3" | "L4";
type Workflow = "implicit" | "authorization_code" | "authorization_code_with_pkce";
type Prompt = "none" | "login" | "no-prompt";

type Client = {
    client_id: string,
    authorize_url: string,
    token_url: string,
}

type Configuration = {
    [key in Environment]: Client
};

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
    Token, Environment, AcrValue, Workflow, Prompt, KeyCloak, Configuration
}
