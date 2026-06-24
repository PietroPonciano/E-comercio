import { useState } from "react";
import { UserPlus } from "lucide-react";
import RegistrationStep from "./RegistrationStep";
import VerificationStep from "./VerificationStep";
import "../styles/Register.styles.css";

export default function RegisterForm() {
    // Controla em qual etapa o usuário está
    const [awaitingVerification, setAwaitingVerification] = useState(false);
    
    // Guarda o email para passar para o componente de verificação
    const [registeredEmail, setRegisteredEmail] = useState("");

    // Função que será chamada quando o cadastro for concluído com sucesso
    function handleRegistrationSuccess(email) {
        setRegisteredEmail(email);
        setAwaitingVerification(true);
    }

    return (
        <div className="register-screen-container">
            <div className="register-card-box">
                <div className="card-column-left">
                    {!awaitingVerification ? (
                        <RegistrationStep onSuccess={handleRegistrationSuccess} />
                    ) : (
                        <VerificationStep email={registeredEmail} />
                    )}
                </div>

                <div className="card-column-right">
                    <div className="giant-icon">
                        <UserPlus size={100} strokeWidth={1.5} />
                    </div>
                    
                    <h2>
                        {awaitingVerification
                            ? "Verifique seu email"
                            : "Comece sua jornada."}
                    </h2>

                    <p>
                        {awaitingVerification
                            ? "Digite o código enviado para seu email para ativar sua conta."
                            : "Crie sua conta e acompanhe suas encomendas com facilidade."}
                    </p>
                </div>
            </div>
        </div>
    );
}