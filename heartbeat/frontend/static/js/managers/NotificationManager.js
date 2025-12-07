import GSAPManager from './GSAPManager.js';

const ICON_MAP = {
    success: '<i class="fa-solid fa-circle-check"></i>',
    info: '<i class="fa-solid fa-circle-info"></i>',
    warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
    danger: '<i class="fa-solid fa-circle-exclamation"></i>',
};

const TYPE_CLASS_MAP = {
    success: 'hb-toast--success',
    info: 'hb-toast--info',
    warning: 'hb-toast--warning',
    danger: 'hb-toast--danger',
};

export default class NotificationManager {
    constructor() {
        if (NotificationManager.instance) {
            return NotificationManager.instance;
        }

        this.container = this.ensureContainer();
        this.gsap = new GSAPManager();
        NotificationManager.instance = this;
    }

    ensureContainer() {
        let stack = document.getElementById('hb-toast-stack');
        if (!stack) {
            stack = document.createElement('div');
            stack.id = 'hb-toast-stack';
            document.body.appendChild(stack);
        }
        return stack;
    }

    show({ title = 'Notice', message = '', type = 'info', duration = 4500 }) {
        const toast = document.createElement('div');
        toast.className = `hb-toast ${TYPE_CLASS_MAP[type] || TYPE_CLASS_MAP.info}`;

        toast.innerHTML = `
            <div class="hb-toast__icon">${ICON_MAP[type] || ICON_MAP.info}</div>
            <div class="hb-toast__body">
                <p class="hb-toast__title">${title}</p>
                <p class="hb-toast__message">${message}</p>
            </div>
            <button class="hb-toast__close" aria-label="Dismiss notification">&times;</button>
        `;

        const closeButton = toast.querySelector('.hb-toast__close');
        const removeToast = () => {
            this.gsap.animateToastOut(toast, () => toast.remove());
        };

        closeButton.addEventListener('click', removeToast);
        this.container.appendChild(toast);
        this.gsap.animateToastIn(toast);

        if (duration > 0) {
            setTimeout(removeToast, duration);
        }
    }

    success(title, message) {
        this.show({ title, message, type: 'success' });
    }

    info(title, message) {
        this.show({ title, message, type: 'info' });
    }

    warning(title, message) {
        this.show({ title, message, type: 'warning' });
    }

    danger(title, message) {
        this.show({ title, message, type: 'danger' });
    }
}
