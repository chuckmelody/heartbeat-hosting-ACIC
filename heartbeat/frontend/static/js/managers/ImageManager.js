import ModalManager from "./ModalManager.js";

const availableImages = [
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070", // Workshop
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232", // Mentorship
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071", // Seminar
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070", // Gala
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070", // Community Group
    "https://images.unsplash.com/photo-1605710345524-f354f583a334?q=80&w=2070"  // Martial Arts
];

export default class ImageManager {
    constructor() {
        this.modalManager = new ModalManager();
    }

    selectImages(currentImages = []) {
        return new Promise((resolve) => {
            let selected = [...currentImages];

            const imageGridHTML = availableImages.map(img => `
                <div class="image-select-item ${selected.includes(img) ? 'is-selected' : ''}" data-url="${img}">
                    <img src="${img}" alt="Selectable event image">
                    <div class="image-select-overlay"><i class="fa-solid fa-check"></i></div>
                </div>
            `).join('');

            const content = `
                <div class="modal-header">
                    <h3>Select Images (up to 5)</h3>
                    <button class="modal-close-btn" data-tooltip="Close">&times;</button>
                </div>
                <div class="modal-body image-select-grid">
                    ${imageGridHTML}
                </div>
                <div class="modal-footer">
                    <button class="modal-btn secondary cancel-btn">Cancel</button>
                    <button class="modal-btn confirm-btn">Confirm Selection</button>
                </div>
            `;
            this.modalManager.show(content);

            this.modalManager.modal.querySelector('.modal-close-btn').onclick = () => this.modalManager.hide();
            this.modalManager.modal.querySelector('.cancel-btn').onclick = () => this.modalManager.hide();
            this.modalManager.modal.querySelector('.confirm-btn').onclick = () => {
                resolve(selected);
                this.modalManager.hide();
            };

            this.modalManager.modal.querySelectorAll('.image-select-item').forEach(item => {
                item.onclick = () => {
                    const url = item.dataset.url;
                    if (selected.includes(url)) {
                        selected = selected.filter(s => s !== url);
                        item.classList.remove('is-selected');
                    } else if (selected.length < 5) {
                        selected.push(url);
                        item.classList.add('is-selected');
                    } else {
                        alert("You can select a maximum of 5 images.");
                    }
                };
            });
        });
    }
}