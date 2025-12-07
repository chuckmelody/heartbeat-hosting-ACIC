import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";
import { submitPasswordReset } from "../services/strapiAuth.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Set New Password");
    }

    async getHtml() {
        return `
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <h2 class="page-title" style="text-align: center;"><i class="fa-solid fa-lock fa-fw"></i> Set New Password</h2>
                        <form id="resetPasswordForm" class="auth-form">
                            <div class="form-group">
                                <label for="password">New Password</label>
                                <div class="password-wrapper">
                                    <input type="password" id="password" name="password" required>
                                    <i class="fa-solid fa-eye toggle-password" data-tooltip="Show/Hide Password"></i>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm New Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required>
                            </div>
                            <button type="submit" class="form-button" style="width: 100%;">Save New Password</button>
                        </form>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }

    async after_render() {
        const token = this.params?.token;
        const form = document.getElementById('resetPasswordForm');
        const feedback = document.createElement('p');
        feedback.className = 'auth-feedback';
        feedback.setAttribute('role', 'status');
        form.appendChild(feedback);

        if (!token) {
            form.querySelector('button[type="submit"]').disabled = true;
            feedback.dataset.type = 'error';
            feedback.textContent = 'Invalid or missing reset token.';
        }

        document.querySelector('.toggle-password').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });

        const setFeedback = (message, type = 'info') => {
            feedback.textContent = message;
            feedback.dataset.type = type;
        };

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!token) {
                setFeedback('Missing reset token.', 'error');
                return;
            }

            const password = form.password.value;
            const confirmPassword = form.confirmPassword.value;

            if (!password || password !== confirmPassword) {
                setFeedback('Passwords must match.', 'error');
                return;
            }

            try {
                setFeedback('Saving new password…');
                await submitPasswordReset({
                    code: token,
                    password,
                    passwordConfirmation: confirmPassword,
                });
                setFeedback('Password updated. You can now sign in.', 'success');
            } catch (error) {
                const message = error.payload?.error?.message || 'Unable to reset your password right now.';
                setFeedback(message, 'error');
            }
        });

        await RightSidebar.after_render();
    }
}
