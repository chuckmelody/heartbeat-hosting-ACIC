const getSidebarLinks = () => {
    // Define all site links here to be used in the link tree
    const links = [
        { href: "/tools", text: "Tools", icon: "fa-toolbox" },
        { href: "/privacy-policy", text: "Privacy Policy", icon: "fa-shield-halved" },
        { href: "/accessibility", text: "Accessibility", icon: "fa-universal-access" },
        { href: "/cookie-policy", text: "Cookie Policy", icon: "fa-cookie-bite" },
        { href: "/contact", text: "Contact", icon: "fa-envelope" },
        { href: "/about", text: "About Us", icon: "fa-circle-info" },
        { href: "/team", text: "Our Team", icon: "fa-users" },
    ];

    // Sort links by text length, longest first
    links.sort((a, b) => b.text.length - a.text.length);

    return links.map(link => `<a href="${link.href}" data-link data-tooltip="Go to ${link.text}"><i class="fa-solid ${link.icon} fa-fw"></i><span>${link.text}</span></a>`).join('');
};

const RightSidebar = {
    async render() {
        // This is a bit of a hack for frontend-only. In a real app, this state would be managed globally.
        // We dynamically import here to avoid circular dependency issues if AuthManager ever needed a view.
        const AuthManager = (await import('../managers/AuthManager.js')).default;
        const authManager = new AuthManager();
        const isLoggedIn = authManager.isLoggedIn();

        const authButton = isLoggedIn
            ? `<a href="#" id="logout-btn" class="ad-button" style="background-color: #3a3a3a;" data-tooltip="Sign out of your account">Logout</a>`
            : `<a href="/donate" class="ad-button" data-link data-tooltip="Support our cause">Donate</a>`;

        return `
            <aside class="right-sidebar">
                <!-- Ad Card -->
                <div class="ad-card">
                    <div class="ad-card-content">
                        <i class="fa-solid fa-hand-holding-heart"></i>
                        <h3>Support Our Mission</h3>
                        <p>${isLoggedIn ? 'Manage your profile and contributions.' : 'Your contribution helps us continue our vital work.'}</p>
                        ${isLoggedIn ? `<a href="/profile" class="ad-button" data-link data-tooltip="View your profile">View Profile</a>` : ''}
                        ${authButton}
                    </div>
                </div>

                <!-- Link Tree Card -->
                <div class="content-card link-tree-card">
                    <h4>Quick Links</h4>
                    <div class="link-tree-links">
                        <a href="/store" class="link-tree-links-item" data-link data-tooltip="Browse our affiliate store"><i class="fa-solid fa-store fa-fw"></i><span>Affiliate Store</span></a>
                        ${getSidebarLinks()}
                    </div>
                </div>

                <!-- You can add more sidebar cards here -->

            </aside>
        `;
    },

    async after_render() {
        const authManager = new (await import('../managers/AuthManager.js')).default();
        const logoutBtn = document.getElementById('logout-btn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authManager.logout();
            });
        }
    }
};

export default RightSidebar;
