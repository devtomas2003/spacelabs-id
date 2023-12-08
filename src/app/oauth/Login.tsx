"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IResponseLoginForm } from "../../Types/LoginForm";
import { useSearchParams } from "next/navigation";

const submitLoginFormSchema = z.object({
    email: z.string().email('O email é inválido!'),
    password: z.string().min(8, 'A Password têm de ter 8 caracteres!')
});

type SubmitLoginFormData = z.infer<typeof submitLoginFormSchema>;

export default function Login(){
    const searchParams = useSearchParams();
    
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<SubmitLoginFormData>({
        resolver: zodResolver(submitLoginFormSchema),
        mode: 'onChange',
    });

    async function submitLogin(formData: SubmitLoginFormData){
        reset();
        const authData: IResponseLoginForm = await (await fetch("http://localhost:3000/api/login", {
            cache: 'no-store',
            headers: {
                'Authorization': 'Basic ' + btoa(formData.email + ':' + formData.password),
            }
        })).json();
        if(authData.message){
            setError('password', {
                message: authData.message
            });
        }
        if(authData.keyOAuth){
            const redirectUriQP = searchParams.get("redirectUri");
            const redirectUri = redirectUriQP ? redirectUriQP : "";
            const goodUri = redirectUri.endsWith("/") ? redirectUri : redirectUri + "/";
            location.href = goodUri + "?key=" + authData.keyOAuth;
        }
    }

    return (
        <form className="flex flex-col space-y-2 mt-4" onSubmit={handleSubmit(submitLogin)}>
            <div>
                <p className="mb-2 text-zinc-800">O seu e-mail</p>
                <input
                    type="text"
                    placeholder="john@example.com"
                    className="outline-none text-sm rounded-lg focus:ring-primary-600 border focus:border-primary-600 w-full p-2.5 bg-gray-50 border-gray-300 text-gray-900"
                    {...register('email')}    
                />
                { errors.email ? <p className="text-red-600 mt-0.5">{errors.email.message}</p> : null }
            </div>
            <div>
                <p className="mb-2 text-zinc-800">A sua password</p>
                <input
                    type="password"
                    placeholder="••••••••"
                    className="outline-none text-sm rounded-lg focus:ring-primary-600 border focus:border-primary-600 w-full p-2.5 bg-gray-50 border-gray-300 text-gray-900"
                    {...register('password')}
                />
                { errors.password ? <p className="text-red-600 mt-0.5">{errors.password.message}</p> : null }
            </div>
            <div>
                <button className="w-full text-white outline-none rounded-lg px-5 py-2.5 mt-2 bg-red-500 hover:bg-red-600" type="submit">Iniciar Sessão</button>
                <div className="mt-3 flex flex-col space-y-0.5">
                    <p className="text-zinc-800">Esqueceu-se de algo? <a href="#" className="hover:underline text-blue-600">Recuperar Conta</a></p>
                    <p className="text-zinc-800">Novo na SpaceLabs? <a href="#" className="hover:underline text-blue-600">Criar Conta</a></p>
                    <div>
                    <p className="mt-3 text-zinc-800">{new Date().getFullYear()} © SpaceLabs. Todos os direitos reservados!</p>
                    </div>
                </div>
            </div>
        </form>
    );
}