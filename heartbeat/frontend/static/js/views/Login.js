import AbstractView from "./AbstractView.js";
import AuthManager from "../managers/AuthManager.js";
import NotificationManager from "../managers/NotificationManager.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Sign In");
    }

    async getHtml() {
        return `
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <h2 class="page-title" style="text-align: center;"><i class="fa-solid fa-right-to-bracket fa-fw"></i> Sign In</h2>
                        <form id="loginForm" class="auth-form">
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
                                <label class="checkbox-group">
                                    <input type="checkbox" id="rememberMe" name="rememberMe">
                                    <span class="custom-control"></span>
                                    Remember me
                                </label>
                            </div>
                            <button type="submit" class="form-button" style="width: 100%;">Sign In</button>
                            <div class="auth-links">
                                <a href="/forgot-password" data-link>Forgot Password?</a>
                                <a href="/register" data-link>Don't have an account? Sign Up</a>
                            </div>
                            <p id="loginFeedback" class="auth-feedback" role="status"></p>
                        </form>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }

    async after_render() {
        const form = document.getElementById('loginForm');
        const feedback = document.getElementById('loginFeedback');
        const submitBtn = form.querySelector('button[type="submit"]');
        const notifications = new NotificationManager();
        const authManager = new AuthManager();

        const setFeedback = (message, type = 'info') => {
            feedback.textContent = message;
            feedback.dataset.type = type;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = form.email.value.trim().toLowerCase();
            const password = form.password.value;

            if (!email || !password) {
                setFeedback('Email and password are required.', 'error');
                return;
            }

            try {
                submitBtn.disabled = true;
                setFeedback('Signing in…');
                await authManager.login({ identifier: email, password });
                setFeedback('Welcome back!', 'success');
                notifications.success('Signed in', 'Redirecting you to your dashboard.');
                const target = '/profile';
                if (window.navigateTo) {
                    setTimeout(() => window.navigateTo(target), 100);
                } else {
                    window.location.href = target;
                }
            } catch (error) {
                let message = error.payload?.error?.message || error.message || 'Unable to sign in right now.';
                if ((message || '').toLowerCase().includes('invalid identifier')) {
                    message = 'We could not match that email or password. Double-check your details or reset your password.';
                }
                setFeedback(message, 'error');
                notifications.danger('Sign-in failed', message);
            } finally {
                submitBtn.disabled = false;
            }
        });

        document.querySelector('.toggle-password').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });

        await RightSidebar.after_render();
    }
}
