export interface IPropsLoginPage {
    searchParams: {
        scopes: string;
        clientId: string;
        redirectUri: string;
        state?: string;
        ra?: string;
    };
};

export interface IOAuthApp {
    message?: string;
    appName?: string;
    userInfo?: IUserData;
};

export interface IOAuthLocal {
    userId: string;
}

export interface IUserData {
    name: string;
}