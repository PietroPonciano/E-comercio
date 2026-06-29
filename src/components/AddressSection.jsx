import "../styles/Address.styles.css";
import { MapPin } from "lucide-react";

export default function AddressSection({ profile }) {
    return (
        <section id="endereco" className="address-section">
            <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <MapPin size={24} strokeWidth={2.5} />
                Endereço
            </h2>

            <div className="address-card">
                <div className="address-field" id="endereco-info">
                    <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <MapPin size={13} /> Endereço
                    </label>
                    <p>{profile?.endereco}</p>
                </div>
            </div>
        </section>
    );
}