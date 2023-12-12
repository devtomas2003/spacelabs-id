import { MdErrorOutline } from "react-icons/md";
import Login from "./Login";
import { cookies } from "next/headers";
import type { IOAuthApp, IPropsLoginPage } from "../../Types/OAuth";
import ScreenAlreadyAuthBtns from "./ScreenAlreadyAuthBtns";
import { simplifyName } from "@/Utils/Handlers";
import Base from "../Components/Base";
import { Fragment } from "react";

const checkOAuthParams = (props: IPropsLoginPage) => { return (props.searchParams.clientId && props.searchParams.redirectUri && props.searchParams.scopes); }

export default async function Auth(props: IPropsLoginPage){
    const lastLoginCookie = cookies().get("@spacelabs/id");
    const lastLogin = lastLoginCookie ? lastLoginCookie.value : "";

    const authData: IOAuthApp = checkOAuthParams(props)? await (await fetch(`http://localhost:3000/api/oauth-data?clientId=${props.searchParams.clientId}&redirectUri=${props.searchParams.redirectUri}&scopes=${props.searchParams.scopes}`, {
        cache: 'no-store',
        headers: {
            "Authorization": "Bearer " + lastLogin
        }
    })).json()
    : {
        message: "Faltam dados necessários para a autenticação!",
        appName: "Unknown"
    };
    
    return (
        <Base title={checkOAuthParams(props) ? "Inicie sessão com o seu ID" : undefined}>
            { !authData.message ?
            <Fragment>
                <p className={`text-zinc-800 ${authData.userInfo ? "text-center" : null}`}>Está a aceder ao serviço: <label className="font-bold">{authData.appName}</label></p>
                { authData.userInfo ?
                <div className="mt-4 flex flex-col items-center">
                    <img src="/default.png" className="border rounded-full w-28 h-28" title={simplifyName(authData.userInfo.name).firstLast} alt={simplifyName(authData.userInfo.name).firstLast} />
                    <p className="text-zinc-800 mt-4">Bem-vindo(a) de volta, <strong>{simplifyName(authData.userInfo.name).firstLast}</strong></p>
                    <ScreenAlreadyAuthBtns name={authData.userInfo.name} />
                </div> : <Login /> }
            </Fragment>
            :
            <div className="flex flex-col items-center">
                <MdErrorOutline className="w-28 h-28 text-red-500" />
                <p className="mt-4 text-lg text-zinc-800">{authData.message}</p>
                <button className="mt-4 p-2 w-full rounded text-white bg-emerald-500 hover:bg-emerald-600" type="button">Ir para a SpaceLabs</button>
            </div>
            }
        </Base>
    );
}