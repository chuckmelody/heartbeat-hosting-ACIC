import AbstractView from "./AbstractView.js";
import AuthManager from "../managers/AuthManager.js";
import NotificationManager from "../managers/NotificationManager.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Sign Up");
    }

    async getHtml() {
        return `
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <h2 class="page-title" style="text-align: center;"><i class="fa-solid fa-user-plus fa-fw"></i> Create Account</h2>
                        <form id="registerForm" class="auth-form">
                            <div class="two-column">
                                <div class="form-group">
                                    <label for="firstName">First Name</label>
                                    <input type="text" id="firstName" name="firstName" required>
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <div class="password-wrapper">
                                    <input type="password" id="password" name="password" required>
                                    <i class="fa-solid fa-eye toggle-password" data-tooltip="Show/Hide Password"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="passwordConfirm">Confirm Password</label>
                                <div class="password-wrapper">
                                    <input type="password" id="passwordConfirm" name="passwordConfirm" required>
                                    <i class="fa-solid fa-eye toggle-password" data-tooltip="Show/Hide Password"></i>
                                </div>
                            </div>
                            <button type="submit" class="form-button" style="width: 100%;">Sign Up</button>
                            <div class="auth-links">
                                <a href="/login" data-link>Already have an account? Sign In</a>
                            </div>
                            <p id="registerFeedback" class="auth-feedback" role="status"></p>
                        </form>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }

    async after_render() {
        const form = document.getElementById('registerForm');
        const feedback = document.getElementById('registerFeedback');
        const authManager = new AuthManager();
        const submitBtn = form.querySelector('button[type="submit"]');
        const notifications = new NotificationManager();

        const toggleIcons = form.querySelectorAll('.toggle-password');
        toggleIcons.forEach((icon) => {
            icon.addEventListener('click', function () {
                const input = this.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        });

        const setFeedback = (message, type = 'info') => {
            feedback.textContent = message;
            feedback.dataset.type = type;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = form.firstName.value.trim();
            const lastName = form.lastName.value.trim();
            const email = form.email.value.trim().toLowerCase();
            const password = form.password.value;
            const confirm = form.passwordConfirm.value;

            if (!firstName || !lastName) {
                setFeedback('Please provide your first and last name.', 'error');
                return;
            }

            if (password !== confirm) {
                setFeedback('Passwords do not match.', 'error');
                return;
            }

            try {
                submitBtn.disabled = true;
                setFeedback('Creating your account…');
                await authManager.register({ firstName, lastName, email, password });
                setFeedback('Account created! Redirecting…', 'success');
                notifications.success('Welcome aboard', 'Your profile is ready.');
                const target = '/profile';
                if (window.navigateTo) {
                    setTimeout(() => window.navigateTo(target), 100);
                } else {
                    window.location.href = target;
                }
            } catch (error) {
                const message = error.payload?.error?.message || error.message || 'Unable to register right now.';
                setFeedback(message, 'error');
                notifications.danger('Registration failed', message);
            } finally {
                submitBtn.disabled = false;
            }
        });

        await RightSidebar.after_render();
    }
}
