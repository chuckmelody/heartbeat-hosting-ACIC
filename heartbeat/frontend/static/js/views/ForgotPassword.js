import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";
import { requestPasswordReset } from "../services/strapiAuth.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Forgot Password");
    }

    async getHtml() {
        return `
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <h2 class="page-title" style="text-align: center;"><i class="fa-solid fa-key fa-fw"></i> Reset Password</h2>
                        <p style="text-align: center; color: var(--secondary-text-color);">Enter your email address and we will send you a link to reset your password.</p>
                        <form id="forgotPasswordForm" class="auth-form" style="margin-top: 1.5rem;">
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <button type="submit" class="form-button" style="width: 100%;">Send Reset Link</button>
                            <div class="auth-links">
                                <a href="/login" data-link>Back to Sign In</a>
                            </div>
                        </form>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }

    async after_render() {
        const form = document.getElementById('forgotPasswordForm');
        const feedback = document.createElement('p');
        feedback.className = 'auth-feedback';
        feedback.setAttribute('role', 'status');
        form.appendChild(feedback);

        const setFeedback = (message, type = 'info') => {
            feedback.textContent = message;
            feedback.dataset.type = type;
        };

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = form.email.value.trim().toLowerCase();
            if (!email) {
                setFeedback('Please enter the email address you used during registration.', 'error');
                return;
            }

            try {
                setFeedback('Sending reset link…');
                await requestPasswordReset(email);
                setFeedback('If the account exists, a reset email has been sent.', 'success');
            } catch (error) {
                const message = error.payload?.error?.message || 'Unable to start the reset flow right now.';
                setFeedback(message, 'error');
            }
        });

        await RightSidebar.after_render();
    }
}
