import Base from "../Components/Base";

export default function CreateAccount(){
    return (
        <Base title="Criar um SpaceLabs ID">
            <div>
                <form>
                    <div>
                        <label>Nome Completo</label>
                        <input type="text" placeholder="O seu nome completo" autoCapitalize="off" autoCorrect="off" autoComplete="name" />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" placeholder="O seu email" autoCapitalize="off" autoCorrect="off" autoComplete="email" />
                    </div>
                    <div>
                        <label>Contato</label>
                        <input type="text" placeholder="O seu contato" autoCapitalize="off" autoCorrect="off" autoComplete="phone" />
                    </div>
                    <div>
                        <label>NIF</label>
                        <input type="text" placeholder="O seu NIF" autoCapitalize="off" autoCorrect="off" autoComplete="off" />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" placeholder="A sua melhor password (Min: 8 caracteres)" />
                    </div>
                    <div>
                        <label>Repita a Password</label>
                        <input type="password" placeholder="Repita a Password" />
                    </div>
                </form>
            </div>
        </Base>
    );
}