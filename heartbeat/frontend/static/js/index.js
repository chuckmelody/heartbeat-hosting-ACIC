import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import PostView from "./views/PostView.js";
import Settings from "./views/Settings.js";
import About from "./views/About.js";
import Projects from "./views/Projects.js";
import Events from "./views/Events.js";
import EventView from "./views/EventView.js";
import News from "./views/News.js";
import NewsView from "./views/NewsView.js";
import Tools from "./views/Tools.js";
import Contact from "./views/Contact.js";
import Team from "./views/Team.js";
import Reports from "./views/Reports.js";
import Partners from "./views/Partners.js";
import Volunteer from "./views/Volunteer.js";
import Donate from "./views/Donate.js";
import PrivacyPolicy from "./views/PrivacyPolicy.js";
import CookiePolicy from "./views/CookiePolicy.js";
import Terms from "./views/Terms.js";
import Accessibility from "./views/Accessibility.js";
import Store from "./views/Store.js";
import ProductView from "./views/ProductView.js";
import Profile from "./views/Profile.js";
import Login from "./views/Login.js";
import Register from "./views/Register.js";
import ForgotPassword from "./views/ForgotPassword.js";
import ResetPassword from "./views/ResetPassword.js";
import Complaints from "./views/Complaints.js";
import Safeguarding from "./views/Safeguarding.js";
import Equality from "./views/Equality.js";
import Exam from "./views/Exam.js";
// Removed: import MetaAssetManager from "./managers/MetaAssetManager.js"; // This import is now handled by MetaImageGenerator.js
import MetaImageGenerator from "./views/MetaImageGenerator.js";
import TooltipManager from "./managers/TooltipManager.js";
import ModalManager from "./managers/ModalManager.js";
import ShareManager from "./managers/ShareManager.js";
import MailManager from "./managers/MailManager.js";
import AuthManager from "./managers/AuthManager.js";
import GSAPManager from "./managers/GSAPManager.js";
import TimeManager from "./managers/TimeManager.js";

import GlobalNavManager from "./managers/GlobalNavManager.js";
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

// expose navigateTo so views can trigger SPA navigation after async auth flows
window.navigateTo = navigateTo;

const loadDynamicCSS = (pathOrPaths) => {
    // Remove any existing dynamic stylesheets
    document.querySelectorAll('link[data-dynamic-style]').forEach(link => link.remove());

    if (!pathOrPaths) return;

    const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];

    paths.forEach(path => {
        // Create and append new CSS link
        const head = document.head;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = path;
        link.setAttribute('data-dynamic-style', 'true'); // Mark it for removal later
        head.appendChild(link);
    });
};

const renderHeaderAuth = (authInstance = new AuthManager()) => {
    const headerAuthContainer = document.getElementById('header-auth-container');
    if (!headerAuthContainer) {
        return;
    }

    if (authInstance.isLoggedIn()) {
        headerAuthContainer.innerHTML = `
            <a href="#" id="logout-btn-header" class="header-cta-button secondary" data-tooltip="Sign out of your account"><i class="fa-solid fa-right-from-bracket fa-fw"></i> Logout</a>
            <a href="/profile" class="header-cta-button" data-link data-tooltip="View your profile"><i class="fa-solid fa-user fa-fw"></i> My Profile</a>
        `;
    } else {
        headerAuthContainer.innerHTML = `
            <a href="/register" class="header-cta-button" data-link data-tooltip="Create a new account"><i class="fa-solid fa-user-plus fa-fw"></i> Sign Up</a>
            <a href="/login" class="header-cta-button secondary" data-link data-tooltip="Sign in to your account"><i class="fa-solid fa-right-to-bracket fa-fw"></i> Sign In</a>
        `;
    }

    const logoutHeaderBtn = document.getElementById('logout-btn-header');
    if (logoutHeaderBtn) {
        logoutHeaderBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            const auth = new AuthManager();
            await auth.logout();
            navigateTo('/login');
        });
    }
};

window.addEventListener('auth-change', () => renderHeaderAuth());

const router = async () => {
    const routes = [
        { path: "/", view: Dashboard, css: ["/static/css/shared-card.css", "/static/css/auth.css"] },
        { path: "/posts", view: Posts, css: ["/static/css/layouts.css", "/static/css/posts.css"] },
        { path: "/store", view: Store, css: ["/static/css/layouts.css", "/static/css/store.css", "/static/css/shared-card.css"] },
        { path: "/store/:id", view: ProductView, css: ["/static/css/layouts.css", "/static/css/store.css", "/static/css/shared-card.css"] },
        { path: "/profile", view: Profile, css: ["/static/css/layouts.css", "/static/css/profile.css", "/static/css/posts.css"], protected: true },
        { path: "/posts/:id", view: PostView, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/settings", view: Settings, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/about", view: About, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/projects", view: Projects, css: ["/static/css/layouts.css", "/static/css/projects.css"] },
        { path: "/events", view: Events, css: ["/static/css/layouts.css", "/static/css/events.css"] },
        { path: "/events/:id", view: EventView, css: ["/static/css/layouts.css", "/static/css/events.css"] },
        { path: "/news", view: News, css: ["/static/css/layouts.css", "/static/css/news.css"] },
        { path: "/news/:id", view: NewsView, css: ["/static/css/layouts.css", "/static/css/news.css"] },
        { path: "/contact", view: Contact, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/team", view: Team, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/reports", view: Reports, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/tools", view: Tools, css: ["/static/css/layouts.css", "/static/css/tools.css"] },
        { path: "/partners", view: Partners, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/volunteer", view: Volunteer, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/donate", view: Donate, css: ["/static/css/layouts.css", "/static/css/donate.css"] },
        { path: "/privacy-policy", view: PrivacyPolicy, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/cookie-policy", view: CookiePolicy, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/terms", view: Terms, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/accessibility", view: Accessibility, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/login", view: Login, css: ["/static/css/shared-card.css", "/static/css/layouts.css", "/static/css/auth.css"] },
        { path: "/register", view: Register, css: ["/static/css/shared-card.css", "/static/css/layouts.css", "/static/css/auth.css"] },
        { path: "/forgot-password", view: ForgotPassword, css: ["/static/css/shared-card.css", "/static/css/layouts.css", "/static/css/auth.css"] },
        { path: "/reset-password/:token", view: ResetPassword, css: ["/static/css/shared-card.css", "/static/css/layouts.css", "/static/css/auth.css"] },
        { path: "/complaints", view: Complaints, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/safeguarding", view: Safeguarding, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/equality", view: Equality, css: ["/static/css/shared-card.css", "/static/css/layouts.css"] },
        { path: "/exam/:examId", view: Exam, css: ["/static/css/layouts.css", "/static/css/exam.css"] },
        { path: "/tools/meta-image-generator", view: MetaImageGenerator, css: ["/static/css/layouts.css", "/static/css/meta-image-generator.css"] }
    ];

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    // Protect routes
    const authManager = new AuthManager();
    if (match.route.protected && !authManager.isLoggedIn()) {
        // Redirect to login
        navigateTo("/login");
        return;
    }

    const view = new match.route.view(getParams(match));

    const routerView = document.querySelector("#router-view");
    const gsapManager = new GSAPManager();

    // 1. Fade out the old content
    await gsapManager.fadeOutPage(routerView);
    // 2. Scroll to top
    gsapManager.scrollTo(0);
    // 3. Load new view's HTML
    routerView.innerHTML = await view.getHtml();
    // 4. Run the view's after_render logic (if any)
    if (typeof view.after_render === 'function') {
        await view.after_render();
    }
    // 5. Fade in the new content
    gsapManager.fadeInPage(routerView);

    // Update header auth buttons based on login state
    renderHeaderAuth(authManager);


    // Update the active state in the global navigation bar
    const globalNavManager = new GlobalNavManager('glass-nav-bar');
    if (globalNavManager && typeof globalNavManager.updateActiveLink === 'function') {
        globalNavManager.updateActiveLink();
    }

    // Load the CSS for the matched view
    loadDynamicCSS(match.route.css);
};
const handleLinkClick = (e) => {
    const link = e.target.closest("[data-link]");
    if (link) {
        e.preventDefault();
        navigateTo(link.href);
        // Close side menu on navigation if it's open
        const sideMenu = document.getElementById('side-menu');
        if (sideMenu && sideMenu.classList.contains('is-open')) {
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const menuOverlay = document.getElementById('menu-overlay');
            sideMenu.classList.remove('is-open');
            menuOverlay.classList.remove('is-active');
            hamburgerBtn.classList.remove('is-active');
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // --- Menu Toggle Logic ---
    // Initialize Tooltips
    const tooltipManager = new TooltipManager();
    tooltipManager.init();
    // Initialize Modals
    new ModalManager();
    // Initialize Share Manager
    new ShareManager();
    // Initialize Mail Manager
    new MailManager();
    // Initialize Auth Manager
    const authManager = new AuthManager();

    // Initialize the Glass Navigation Bar at the top
    new GlobalNavManager('glass-nav-bar');

    // --- SPA Navigation Logic ---
    document.body.addEventListener("click", handleLinkClick);
    window.addEventListener("popstate", router);

    // Listen for auth changes to re-render the view
    window.addEventListener('auth-change', () => {
        router();
    });

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    const toggleMenu = () => {
        const isOpen = sideMenu.classList.toggle('is-open');
        menuOverlay.classList.toggle('is-active', isOpen);
        hamburgerBtn.classList.toggle('is-active', isOpen);
    };

    hamburgerBtn.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', toggleMenu);

    // --- Accordion Logic ---
    const accordionItems = sideMenu.querySelectorAll('details');
    accordionItems.forEach(item => {
        item.addEventListener('toggle', (event) => {
            if (event.target.open) {
                // When an item is opened, close all other items.
                accordionItems.forEach(otherItem => {
                    if (otherItem !== event.target && otherItem.open) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });

    router();

    // Initialize Time Manager after the first route is rendered
    const timeManager = new TimeManager('live-clock-container');
    timeManager.start();

    // --- PWA Service Worker Registration ---
    const isDevHost = window.location.hostname === 'dev.heartbeat.local';

    if ('serviceWorker' in navigator && window.isSecureContext && !isDevHost) {
        const registerServiceWorker = () => {
            if (!navigator.onLine) {
                console.warn('Skipping service worker registration while offline.');
                return;
            }

            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        };

        window.addEventListener('load', registerServiceWorker);
    }
});
