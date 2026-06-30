import "./ProfileSkeleton.styles.css";

export default function ProfileSkeleton() {
    return (
        <div className="profile-page">

            <aside className="profile-sidebar skeleton-sidebar">
                <div className="skeleton skeleton-title" />

                <div className="skeleton-list">
                    <div className="skeleton skeleton-item" />
                    <div className="skeleton skeleton-item" />
                    <div className="skeleton skeleton-item" />
                    <div className="skeleton skeleton-item" />
                    <div className="skeleton skeleton-item" />
                </div>

                <div className="skeleton skeleton-title second" />

                <div className="skeleton-list">
                    <div className="skeleton skeleton-item" />
                </div>
            </aside>

            <main className="profile-content">

                <section className="profile-section">

                    <div className="skeleton skeleton-heading" />

                    <div className="profile-card">

                        {[...Array(5)].map((_, index) => (
                            <div className="profile-field" key={index}>
                                <div className="skeleton skeleton-label" />
                                <div className="skeleton skeleton-value" />
                            </div>
                        ))}

                    </div>

                </section>

                <section className="address-section">

                    <div className="skeleton skeleton-heading" />

                    <div className="address-card">

                        <div className="address-field">
                            <div className="skeleton skeleton-label" />
                            <div className="skeleton skeleton-address" />
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}