export interface IPropsLoginPage {
    searchParams: {
        scopes: string;
        clientId: string;
        redirectUri: string;
        state?: string;
    };
};

export interface IOAuthApp {
    message?: string;
    appName?: string;
    userInfo?: UserData;
};

export interface OAuthLocal {
    userId: string;
}

interface UserData {
    name: string;
}