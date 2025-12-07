import AbstractView from "./AbstractView.js";
import ModalManager from "../managers/ModalManager.js";
import RightSidebar from "./_RightSidebar.js";


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-gear fa-fw"></i> Settings</h2>
            <div class="two-column-grid">
                <div class="main-content">

                    <!-- Profile Settings -->
                    <div class="content-card settings-section">
                        <h2><i class="fa-solid fa-user-pen fa-fw"></i> Profile Settings</h2>
                        <form id="profileForm">
                            <div class="form-group">
                                <label for="fullName">Full Name</label>
                                <input type="text" id="fullName" name="fullName" value="Junior Anderson BEM" data-tooltip="Your full name as it will appear on the site.">
                            </div>
                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" id="username" name="username" value="junior.a" data-tooltip="Your unique username.">
                            </div>
                            <div class="form-group">
                                <label for="bio">Bio</label>
                                <textarea id="bio" name="bio" rows="4" data-tooltip="A short description about yourself.">Founder & Director of Heatbeat A CIC. Retired Police Officer and Martial Arts Coach dedicated to community empowerment.</textarea>
                            </div>
                            <button type="submit" class="form-button" data-tooltip="Save your new profile information.">Save Profile</button>
                        </form>
                    </div>

                    <!-- Account Settings -->
                    <div class="content-card settings-section">
                        <h2><i class="fa-solid fa-user-gear fa-fw"></i> Account Settings</h2>
                        <form id="accountForm">
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email" value="junior.anderson@heartbeatacic.org" data-tooltip="Your login and contact email.">
                            </div>
                            <button type="submit" class="form-button" data-tooltip="Save your new email address.">Update Email</button>
                        </form>
                    </div>

                    <!-- Security & Privacy -->
                    <div class="content-card settings-section">
                        <h2><i class="fa-solid fa-shield-halved fa-fw"></i> Security & Privacy</h2>
                        <div class="setting-item">
                            <div class="setting-item-info">
                                <strong>Change Password</strong>
                                <span>Update your password regularly to keep your account secure.</span>
                            </div>
                            <button id="changePasswordBtn" class="form-button" data-tooltip="Open the password change dialog.">Change</button>
                        </div>
                        <div class="setting-item">
                            <div class="setting-item-info">
                                <strong>Two-Factor Authentication (2FA)</strong>
                                <span>Add an extra layer of security to your account.</span>
                            </div>
                            <label class="toggle-switch" data-tooltip="Enable or disable 2FA.">
                                <input type="checkbox">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-item-info">
                                <strong>Download Your Data</strong>
                                <span>Download a copy of your personal data in a machine-readable format.</span>
                            </div>
                            <button id="downloadDataBtn" class="form-button" data-tooltip="Request a download of your data.">Download Data</button>
                        </div>
                    </div>

                    <!-- Notifications -->
                    <div class="content-card settings-section">
                        <h2><i class="fa-solid fa-bell fa-fw"></i> Notifications</h2>
                        <div class="setting-item">
                            <div class="setting-item-info">
                                <strong>Email Notifications</strong>
                                <span>Receive updates about our activities and your account via email.</span>
                            </div>
                            <label class="toggle-switch" data-tooltip="Toggle email notifications.">
                                <input type="checkbox" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Danger Zone -->
                    <div class="content-card settings-section">
                        <h2><i class="fa-solid fa-triangle-exclamation fa-fw"></i> Danger Zone</h2>
                        <div class="setting-item">
                            <div class="setting-item-info">
                                <strong>Delete Account</strong>
                                <span>Permanently delete your account and all associated data. This action cannot be undone.</span>
                            </div>
                            <button id="deleteAccountBtn" class="form-button danger" data-tooltip="Warning: This action is irreversible!">Delete My Account</button>
                        </div>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }

    async after_render() {
        const modalManager = new ModalManager();

        // Profile Form
        document.getElementById('profileForm').addEventListener('submit', e => {
            e.preventDefault();
            modalManager.showInfoModal('Profile Updated', 'Your profile information has been saved successfully.');
        });

        // Account Form
        document.getElementById('accountForm').addEventListener('submit', e => {
            e.preventDefault();
            modalManager.showInfoModal('Email Updated', 'Your email address has been updated successfully.');
        });

        // Change Password Button
        document.getElementById('changePasswordBtn').addEventListener('click', () => {
            modalManager.showChangePasswordModal(() => {
                modalManager.showInfoModal('Password Changed', 'Your password has been updated successfully.');
            });
        });

        // Download Data Button
        document.getElementById('downloadDataBtn').addEventListener('click', () => {
            modalManager.showInfoModal('Request Received', 'Your data download has been requested. A link will be sent to your email shortly.');
        });

        // Delete Account Button
        document.getElementById('deleteAccountBtn').addEventListener('click', () => {
            modalManager.showHardConfirmModal({
                title: 'Delete Account',
                message: 'This is an irreversible action. You will lose all your data, posts, and settings. Are you absolutely sure you want to proceed?',
                confirmText: 'DELETE',
                onConfirm: () => {
                    console.log('Account deletion confirmed. No backend action yet.');
                    // In a real app, this would redirect to a logged-out state.
                    modalManager.showInfoModal('Account Deleted', 'Your account has been permanently deleted.');
                }
            });
        });

        await RightSidebar.after_render();
    }
}