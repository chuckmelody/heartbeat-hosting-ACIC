export default class GlobalNavManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`GlobalNavManager: Container with id "${containerId}" not found.`);
            return;
        }
        this.render();
        this.initScroll();
        this.updateActiveLink(); // Set active link on initial load
        window.addEventListener('popstate', () => this.updateActiveLink()); // Update on browser back/forward
    }

    getNavLinks() {
        // Centralized list of all navigation links for the top bar
        return [
            { href: "/", text: "Dashboard", icon: "fa-gauge" },
            { href: "/about", text: "About Us", icon: "fa-circle-info" },
            { href: "/projects", text: "Our Work", icon: "fa-briefcase" },
            { href: "/events", text: "Events", icon: "fa-calendar-days" },
            { href: "/partners", text: "Partners", icon: "fa-handshake-angle" },
            { href: "/news", text: "News", icon: "fa-newspaper" },
            { href: "/posts", text: "Posts", icon: "fa-signs-post" },
            { href: "/store", text: "Store", icon: "fa-store" },
            { href: "/tools", text: "Tools", icon: "fa-toolbox" },
            { href: "/contact", text: "Contact", icon: "fa-envelope" },
            { href: "/volunteer", text: "Volunteer", icon: "fa-hands-helping" },
            { href: "/donate", text: "Donate", icon: "fa-hand-holding-heart" },
        ];
    }

    render() {
        const links = this.getNavLinks();
        const linksHTML = links.map(link => `
            <a href="${link.href}" class="glass-nav-button" data-link>
                <i class="fa-solid ${link.icon} fa-fw"></i>
                <span>${link.text}</span>
            </a>
        `).join('');

        this.container.innerHTML = `<div class="glass-nav-scroller">${linksHTML}</div>`;
    }

    initScroll() {
        const scroller = this.container.querySelector('.glass-nav-scroller');
        if (!scroller) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        scroller.addEventListener('mousedown', (e) => {
            isDown = true;
            scroller.classList.add('is-scrolling');
            startX = e.pageX - scroller.offsetLeft;
            scrollLeft = scroller.scrollLeft;
        });
        scroller.addEventListener('mouseleave', () => { isDown = false; scroller.classList.remove('is-scrolling'); });
        scroller.addEventListener('mouseup', () => { isDown = false; scroller.classList.remove('is-scrolling'); });
        scroller.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scroller.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            scroller.scrollLeft = scrollLeft - walk;
        });
    }

    updateActiveLink() {
        const currentPath = window.location.pathname;
        const navButtons = this.container.querySelectorAll('.glass-nav-button');

        navButtons.forEach(button => {
            if (button.getAttribute('href') === currentPath) {
                button.classList.add('is-active');
            } else {
                button.classList.remove('is-active');
            }
        });
    }
}
