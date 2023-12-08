"use client";

import { Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { simplifyName } from "@/Utils/Handlers";
import type { IUserData } from "@/Types/OAuth";
import type { IResponseLoginForm } from "@/Types/LoginForm";

export default function ScreenAlreadyAuthBtns(props: IUserData){
    const searchParams = useSearchParams();
    
    function getCookie(n: string) {
        let a = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
        return a ? a[1] : '';
    }

    const router = useRouter();

    function deleteSession(){
        document.cookie = '@spacelabs/id=; Max-Age=0';
        router.refresh();
    }

    async function reauthSession(){
        const authData: IResponseLoginForm = await (await fetch("http://localhost:3000/api/reauth", {
            cache: 'no-store',
            headers: {
                "Authorization": "Bearer " + getCookie("@spacelabs/id")
            }
        })).json();

        if(authData.keyOAuth){
            const redirectUriQP = searchParams.get("redirectUri");
            const redirectUri = redirectUriQP ? redirectUriQP : "";
            const goodUri = redirectUri.endsWith("/") ? redirectUri : redirectUri + "/";
            location.href = goodUri + "?key=" + authData.keyOAuth;
        }

        if(authData.message){
            deleteSession();
        }
    }

    return (
        <Fragment>
            <button className="w-full text-white outline-none rounded-lg px-5 py-2.5 mt-2 bg-red-500 hover:bg-red-600" type="button" onClick={() => { reauthSession(); }}>Continuar como {simplifyName(props.name).firstName}</button>
            <button className="w-full text-zinc-800 outline-none rounded-lg px-5 py-2.5 mt-2 border border-red-500 hover:border-zinc-800 hover:bg-zinc-800 hover:text-white" type="button" onClick={() => { deleteSession(); }}>Iniciar Sessão com outra conta</button>
        </Fragment>
    );
}