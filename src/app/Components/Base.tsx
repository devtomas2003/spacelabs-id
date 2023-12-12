import { ReactElement } from "react";

interface IBaseComponent {
    title?: string;
    children: ReactElement
}

export default function Base(props: IBaseComponent){
    return (
        <div className="flex flex-col w-full h-full absolute justify-center items-center bg-gray-50">
            <div className="flex flex-col items-center space-y-2">
                <img src="/logo.svg" title="SpaceLabs Logo" alt="SpaceLabs Logo" className="w-72" />
                { props.title ? <h1 className="text-xl font-bold text-zinc-800">{props.title}</h1> : null }
            </div>
            <div className="p-6 border shadow-md w-[30rem] mt-4 bg-white rounded-lg">
                {props.children}
            </div>
        </div>
    );
}