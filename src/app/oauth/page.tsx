import { MdErrorOutline } from "react-icons/md";

interface IPropsLoginPage {
    searchParams: {
        dark?: string;
        scopes?: string;
        clientId?: string;
        redirectUri?: string;
        state?: string;
    };
};

interface IOAuthApp {
    message: string;
    appName: string;
}

const checkOAuthParams = (props: IPropsLoginPage) => { return (props.searchParams.clientId && props.searchParams.redirectUri && props.searchParams.scopes); }

export default async function Auth(props: IPropsLoginPage){
    const isDark = props.searchParams.dark === "on" ? true : false;
    let authData: IOAuthApp;

    if(checkOAuthParams(props)){
        const staticData = await fetch("http://127.0.0.1:3000/api/oauth-data?clientId=" + props.searchParams.clientId + "&redirectUri=" + props.searchParams.redirectUri + "&scopes=" + props.searchParams.scopes, { cache: 'no-store' });
        authData = await staticData.json();
    }else{
        authData = {
            message: "Faltam dados necessarios para a autenticação!",
            appName: "Unknown"
        }
    }
    
    return (
        <div className={`flex flex-col w-full h-full absolute justify-center items-center ${isDark ? "bg-zinc-950" : "bg-gray-50"}`}>
            <div className="flex flex-col items-center space-y-2">
                <img src={ isDark ? "/logo-white.svg" : "/logo.svg" } title="SpaceLabs Logo" alt="SpaceLabs Logo" className="w-72" />
                { checkOAuthParams(props) ? <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-zinc-800" }`}>Inicie sessão com o seu ID</h1> : null }
            </div>
            { !authData.message ?
            <form className={`p-6 border shadow-md w-[30rem] mt-4 rounded-lg flex flex-col space-y-2 ${isDark ? "bg-zinc-800 border-zinc-900" : "bg-white" }`}>
                <p className={`${isDark ? "text-white" : "text-zinc-800" }`}>Está a aceder ao serviço: <label className="font-bold">{authData.appName}</label></p>
                <div>
                    <p className={`mb-2 ${isDark ? "text-white" : "text-zinc-800" }`}>O seu e-mail</p>
                    <input type="text" placeholder="john@example.com" className={`outline-none text-sm rounded-lg focus:ring-primary-600 border focus:border-primary-600 w-full p-2.5 ${isDark ? "bg-zinc-950 border-zinc-900 text-white" : "bg-gray-50 border-gray-300 text-gray-900" }`} />
                </div>
                <div>
                    <p className={`mb-2 ${isDark ? "text-white" : "text-zinc-800" }`}>A sua password</p>
                    <input type="password" placeholder="••••••••" className={`outline-none text-sm rounded-lg focus:ring-primary-600 border focus:border-primary-600 w-full p-2.5 ${isDark ? "bg-zinc-950 border-zinc-900 text-white" : "bg-gray-50 border-gray-300 text-gray-900" }`} />
                </div>
                <div>
                    <button className={`w-full text-white outline-none rounded-lg px-5 py-2.5 mt-2 ${isDark ? "text-white bg-zinc-900 hover:bg-zinc-950" : "bg-red-500 hover:bg-red-600" }`} type="submit">Iniciar Sessão</button>
                    <div className="mt-3 flex flex-col space-y-0.5">
                        <p className={`${isDark ? "text-white" : "text-zinc-800" }`}>Esqueceu-se de algo? <a href="#" className={`hover:underline ${isDark ? "text-red-500" : "text-blue-600" }`}>Recuperar Conta</a></p>
                        <p className={`${isDark ? "text-white" : "text-zinc-800" }`}>Novo na SpaceLabs? <a href="#" className={`hover:underline ${isDark ? "text-red-500" : "text-blue-600" }`}>Criar Conta</a></p>
                        <div>
                        <p className={`mt-3 ${isDark ? "text-white" : "text-zinc-800" }`}>{new Date().getFullYear()} © SpaceLabs. Todos os direitos reservados!</p>
                        </div>
                    </div>
                </div>
            </form> :
            <div className={`p-6 border shadow-md w-[30rem] items-center mt-4 rounded-lg flex flex-col ${isDark ? "bg-zinc-800 border-zinc-900" : "bg-white" }`}>
                <MdErrorOutline className="w-28 h-28 text-red-500" />
                <p className="mt-4 text-lg text-zinc-800">{authData.message}</p>
                <button className="mt-4 p-2 w-full rounded text-white bg-emerald-500 hover:bg-emerald-600">Ir para a SpaceLabs</button>
            </div>
            }
        </div>
    );
}