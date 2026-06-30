import { useState } from "react";
import EmailStep from "../components/Auth/EmailStep";
import ResetPasswordStep from "../components/Auth/ResetPasswordStep";

import "../components/Auth/Password.styles.css"

export default function Password() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");

    function handleEmailSuccess(emailValue) {
        setEmail(emailValue);
        setStep(2);
    }

    return (
                <>
            <div className="steps">
                <div className={`step ${step >= 1 ? "active" : ""}`}>
                    <div className="step-circle">1</div>
                    <span>Email</span>
                </div>

                <div className={`step-line ${step >= 2 ? "active" : ""}`} />

                <div className={`step ${step >= 2 ? "active" : ""}`}>
                    <div className="step-circle">2</div>
                    <span>Nova Senha</span>
                </div>
            </div>

            {step === 1 && (
                <EmailStep onSuccess={handleEmailSuccess} />
            )}

            {step === 2 && (
                <ResetPasswordStep email={email} />
            )}
        </>
    );
}