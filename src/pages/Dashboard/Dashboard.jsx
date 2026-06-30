import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserSection from "../../components/User/UserSection";
import ProductSection from "../../components/Products/ProductSection";
import CategorySection from "../../components/Categories/CategorySection";
import "./Dashboard.styles.css";
import "./Dashboard.styles.css";

export default function Dashboard() {
    const [section, setSection] = useState("user");

    return (
        <div className="dashboard-page">
            <Sidebar section={section} setSection={setSection} />

            <main className="dashboard-main">
                {section === "user" && <UserSection />}
                {section === "products" && <ProductSection />}
                {section === "categories" && <CategorySection />}
            </main>
        </div>
    );
}
