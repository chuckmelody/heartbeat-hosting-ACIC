export default class ModalManager {
    constructor() {
        if (ModalManager.instance) {
            return ModalManager.instance;
        }
        this._createModalElements();
        ModalManager.instance = this;
    }

    _createModalElements() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('modal-overlay');

        this.modal = document.createElement('div');
        this.modal.classList.add('modal');

        this.modalContent = document.createElement('div');
        this.modalContent.classList.add('modal-content');

        this.modal.appendChild(this.modalContent);
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.modal);

        this.overlay.addEventListener('click', () => this.hide());
    }

    show(content) {
        this.modalContent.innerHTML = content;
        this.overlay.classList.add('is-visible');
        this.modal.classList.add('is-visible');
    }

    hide() {
        this.overlay.classList.remove('is-visible');
        this.modal.classList.remove('is-visible');
        this.modalContent.innerHTML = '';
    }

    showEditModal(post, onSave) {
        const content = `
            <div class="modal-header">
                <h3>Edit Post</h3>
                <button class="modal-close-btn" data-tooltip="Close">&times;</button>
            </div>
            <div class="modal-body">
                <textarea class="modal-textarea">${post.content}</textarea>
            </div>
            <div class="modal-footer">
                <button class="modal-btn secondary cancel-btn">Cancel</button>
                <button class="modal-btn save-btn">Save Changes</button>
            </div>
        `;
        this.show(content);

        this.modal.querySelector('.modal-close-btn').onclick = () => this.hide();
        this.modal.querySelector('.cancel-btn').onclick = () => this.hide();
        this.modal.querySelector('.save-btn').onclick = () => {
            const newContent = this.modal.querySelector('.modal-textarea').value;
            onSave(post.id, newContent);
            this.hide();
        };
    }

    showConfirmModal(title, message, onConfirm) {
        const content = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close-btn" data-tooltip="Close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn secondary cancel-btn">Cancel</button>
                <button class="modal-btn danger confirm-btn">Confirm</button>
            </div>
        `;
        this.show(content);

        this.modal.querySelector('.modal-close-btn').onclick = () => this.hide();
        this.modal.querySelector('.cancel-btn').onclick = () => this.hide();
        this.modal.querySelector('.confirm-btn').onclick = () => {
            onConfirm();
            this.hide();
        };
    }

    showInfoModal(title, message) {
        const content = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close-btn" data-tooltip="Close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn ok-btn">OK</button>
            </div>
        `;
        this.show(content);

        this.modal.querySelector('.modal-close-btn').onclick = () => this.hide();
        this.modal.querySelector('.ok-btn').onclick = () => this.hide();
    }

    showChangePasswordModal(onSave) {
        const content = `
            <div class="modal-header">
                <h3>Change Password</h3>
                <button class="modal-close-btn" data-tooltip="Close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" name="currentPassword" required>
                </div>
                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn secondary cancel-btn">Cancel</button>
                <button class="modal-btn save-btn">Save Password</button>
            </div>
        `;
        this.show(content);

        this.modal.querySelector('.modal-close-btn').onclick = () => this.hide();
        this.modal.querySelector('.cancel-btn').onclick = () => this.hide();
        this.modal.querySelector('.save-btn').onclick = () => {
            // In a real app, you'd get the values and validate them
            onSave();
            this.hide();
        };
    }

    showHardConfirmModal({ title, message, confirmText, onConfirm }) {
        const content = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close-btn" data-tooltip="Close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
                <div class="form-group" style="margin-top: 1rem;">
                    <label for="confirmInput">To confirm, type "${confirmText}" below:</label>
                    <input type="text" id="confirmInput" name="confirmInput" autocomplete="off">
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn secondary cancel-btn">Cancel</button>
                <button class="modal-btn danger confirm-btn" disabled>Confirm</button>
            </div>
        `;
        this.show(content);

        const confirmInput = this.modal.querySelector('#confirmInput');
        const confirmBtn = this.modal.querySelector('.confirm-btn');

        confirmInput.addEventListener('input', () => {
            confirmBtn.disabled = confirmInput.value !== confirmText;
        });

        this.modal.querySelector('.modal-close-btn').onclick = () => this.hide();
        this.modal.querySelector('.cancel-btn').onclick = () => this.hide();
        confirmBtn.onclick = () => {
            onConfirm();
            this.hide();
        };
    }

    showFormModal({ title, fields, onSave, submitText = 'Save' }) { // Added submitText parameter
        const formFieldsHTML = fields.map(field => `
            <div class="form-group">
                <label for="${field.id}">${field.label}</label>
                ${field.type === 'textarea' ?
                `<textarea id="${field.id}" name="${field.id}" rows="6" required>${field.value || ''}</textarea>` :
                `<input type="${field.type || 'text'}" id="${field.id}" name="${field.id}" value="${field.value || ''}" required>`
                }
            </div>
        `).join('');

        const content = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close-btn" data-tooltip="Close">&times;</button>
            </div>
            <form id="modal-form">
                <div class="modal-body">
                    ${formFieldsHTML}
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-btn secondary cancel-btn">Cancel</button>
                    <button type="submit" class="modal-btn save-btn">${submitText}</button>
                </div>
            </form>
        `;
        this.show(content);

        this.modal.querySelector('.modal-close-btn').onclick = () => this.hide();
        this.modal.querySelector('.cancel-btn').onclick = () => this.hide();
        this.modal.querySelector('#modal-form').onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            onSave(data);
            this.hide();
        };
    }

    showCreatePostModal(onSave) {
        const content = `
            <div class="modal-header">
                <h3>Create Post</h3>
                <button class="modal-close-btn" data-tooltip="Close">&times;</button>
            </div>
            <form id="create-post-form">
                <div class="modal-body">
                    <textarea name="content" class="modal-textarea" placeholder="What's on your mind?"></textarea>
                    <div class="form-group" style="margin-top: 1rem;">
                        <label for="post-image-upload">Add an image (optional)</label>
                        <input type="file" id="post-image-upload" name="image" accept="image/*" style="display: block; margin-top: 0.5rem;">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-btn secondary cancel-btn">Cancel</button>
                    <button type="submit" class="modal-btn post-btn">Post</button>
                </div>
            </form>
        `;
        this.show(content);

        this.modal.querySelector('.modal-close-btn').onclick = () => this.hide();
        this.modal.querySelector('.cancel-btn').onclick = () => this.hide();
        this.modal.querySelector('#create-post-form').onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                content: formData.get('content'),
                // In a real app, you'd handle the file upload properly
                image: formData.get('image').name ? URL.createObjectURL(formData.get('image')) : null
            };
            onSave(data);
            this.hide();
        };
    }
}