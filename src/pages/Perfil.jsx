import "../components/Profile/Profile.styles.css";
import { useState, useEffect } from "react";
import { useProfile } from "../hooks/useProfile";

import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileSection from "../components/Profile/ProfileSection";
import AddressSection from "../components/Profile/AddressSection";
import ProfileSkeleton from "../components/Profile/ProfileSkeleton";

export default function Perfil() {
    const { data, isLoading } = useProfile();
    const profile = data?.data;

    const [activeSection, setActiveSection] = useState("perfil");

    useEffect(() => {
        
        if (isLoading) return;

        const handleScroll = () => {
            
            const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
            
            if (isAtBottom) {
                
                setActiveSection("endereco-info");
                return;
            }

           
            const targets = document.querySelectorAll("section, .profile-field, .address-field");
            let currentActive = "perfil";
            
            
            const triggerLine = 200; 

            targets.forEach((target) => {
                const rect = target.getBoundingClientRect();
                
                
                if (rect.top <= triggerLine && target.id) {
                    currentActive = target.id;
                }
            });

            setActiveSection(currentActive);
        };

        
        window.addEventListener("scroll", handleScroll);
        
        
        const timeoutId = setTimeout(handleScroll, 100);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timeoutId);
        };
    }, [isLoading]); 

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="profile-page">
            <ProfileSidebar activeSection={activeSection} />

            <main className="profile-content">
                <ProfileSection profile={profile} />
                <AddressSection profile={profile} />
            </main>
        </div>
    );
}