import ModalManager from "./ModalManager.js";
import ShareManager from "./ShareManager.js";
import ImageManager from "./ImageManager.js";

export default class EventManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.modalManager = new ModalManager();
        this.shareManager = new ShareManager();
        this.imageManager = new ImageManager();
        this.allEvents = [];
        this.filteredEvents = [];

        this._fetchEvents();
    }

    async _fetchEvents() {
        try {
            const response = await fetch('/static/data/events.json');
            this.allEvents = await response.json();
            this.filteredEvents = [...this.allEvents];
            this.render();
        } catch (error) {
            console.error("Failed to fetch events:", error);
            this.container.innerHTML = "<p>Error loading events.</p>";
        }
    }

    render() {
        if (this.filteredEvents.length === 0) {
            this.container.innerHTML = `<p class="no-events-message">No events match your criteria.</p>`;
            return;
        }
        this.container.innerHTML = this.filteredEvents.map(event => this._createEventHTML(event)).join('');
        this._attachEventListeners();
    }

    _createEventHTML(event) {
        const eventDate = new Date(event.date);
        const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const day = eventDate.getDate();

        return `
            <a href="/events/${event.id}" class="event-card-full" data-id="${event.id}" data-link>
                <div class="event-card-image" style="background-image: url('${event.images[0]}')"></div>
                <div class="event-card-date">
                    <span class="month">${month}</span>
                    <span class="day">${day}</span>
                </div>
                <div class="event-card-content">
                    <h4 class="event-card-title">${event.title}</h4>
                    <p class="event-card-location"><i class="fa-solid fa-location-dot fa-fw"></i> ${event.address.city}</p>
                    <p class="event-card-description">${event.description}</p>
                </div>
                <div class="event-card-actions">
                    <button class="share-event-btn" data-tooltip="Share this event"><i class="fa-solid fa-share-nodes"></i></button>
                    <div class="form-button">View Event</div>
                    <div class="event-options">
                        <button class="event-options-btn" data-tooltip="More options"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    _attachEventListeners() {
        this.container.querySelectorAll('.event-options-btn').forEach(button => {
            button.parentElement.addEventListener('click', e => e.preventDefault()); // Prevent navigation when clicking options
            button.addEventListener('click', e => {
                const eventId = e.target.closest('.event-card-full').dataset.id;
                const event = this.allEvents.find(ev => ev.id == eventId);
                this.modalManager.showConfirmModal('Event Options', 'What would you like to do?', () => this._deleteEvent(eventId));
                // This is a placeholder. We'll replace this with a proper options modal later if needed.
                this._showEditModal(event);
            });
        });

        this.container.querySelectorAll('.share-event-btn').forEach(button => {
            button.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                const eventId = e.target.closest('.event-card-full').dataset.id;
                const event = this.allEvents.find(ev => ev.id == eventId);
                this.shareManager.share({
                    title: event.title,
                    text: `Check out this event from Heatbeat A CIC: ${event.title}`,
                    url: new URL(`/events/${event.id}`, window.location.origin).href
                });
            });
        });
    }

    _showEditModal(event) {
        this.modalManager.showFormModal({
            title: 'Edit Event',
            fields: [
                { id: 'title', label: 'Event Title', value: event.title },
                { id: 'organizer', label: 'Organizer Name', value: event.organizer },
                { id: 'date', label: 'Date', value: event.date, type: 'date' },
                { id: 'street', label: 'Street Address', value: event.address.street },
                { id: 'city', label: 'City', value: event.address.city },
                { id: 'postcode', label: 'Postcode', value: event.address.postcode },
                { id: 'description', label: 'Description (max 500 chars)', value: event.description, type: 'textarea' },
            ],
            onSave: (data) => {
                const index = this.allEvents.findIndex(e => e.id === event.id);
                if (index !== -1) {
                    this.allEvents[index].title = data.title;
                    this.allEvents[index].organizer = data.organizer;
                    this.allEvents[index].date = data.date; // Ensure date is updated
                    // Retrieve images from form.dataset if they were selected
                    const form = this.modalManager.modal.querySelector('#modal-form');
                    this.allEvents[index].images = form.dataset.images ? JSON.parse(form.dataset.images) : this.allEvents[index].images;
                    this.allEvents[index].address = { street: data.street, city: data.city, postcode: data.postcode };
                    this.allEvents[index].description = data.description.substring(0, 500);
                    // Note: Geocoding would happen here in a real app before saving
                    this.filterEvents(); // Re-apply filters and render
                }
            }
        });
        this._addImageSelectionToForm(event.images);
    }

    showCreateModal() {
        this.modalManager.showFormModal({
            title: 'Create New Event',
            fields: [
                { id: 'title', label: 'Event Title' },
                { id: 'organizer', label: 'Organizer Name' },
                { id: 'date', label: 'Date', type: 'date' },
                { id: 'street', label: 'Street Address' },
                { id: 'city', label: 'City' },
                { id: 'postcode', label: 'Postcode' },
                { id: 'description', label: 'Description (max 500 chars)', type: 'textarea' },
            ],
            onSave: (data) => {
                const newEvent = {
                    id: Date.now(),
                    title: data.title,
                    organizer: data.organizer,
                    date: data.date,
                    address: { street: data.street, city: data.city, postcode: data.postcode },
                    // In a real app, you'd get lat/lng from a geocoding service
                    lat: 52.24,
                    lng: -0.89,
                    description: data.description.substring(0, 500), // Ensure description is truncated
                    // Retrieve images from form.dataset if they were selected.
                    // The 'form' element is retrieved from the modal manager.
                    images: this.modalManager.modal.querySelector('#modal-form').dataset.images ? 
                            JSON.parse(this.modalManager.modal.querySelector('#modal-form').dataset.images) : []
                };
                this.allEvents.unshift(newEvent);
                this.filterEvents(); // Re-apply filters and render
            }
        });
        this._addImageSelectionToForm();
    }

    async _addImageSelectionToForm(currentImages = []) {
        const modalBody = this.modalManager.modal.querySelector('.modal-body');

        const imagePreview = document.createElement('div');
        imagePreview.className = 'form-image-preview';
        imagePreview.innerHTML = `
            <label>Event Image</label>
            <div class="image-preview-box" style="background-image: url('${currentImages[0] || ''}')">
                ${currentImages.length === 0 ? '<i class="fa-regular fa-image"></i>' : ''}
            </div>
            <button type="button" class="form-button secondary">Choose Image</button>
        `;
        modalBody.appendChild(imagePreview);

        imagePreview.querySelector('button').onclick = async () => {
            const form = this.modalManager.modal.querySelector('#modal-form');
            const newImageUrls = await this.imageManager.selectImages(currentImages);
            if (newImageUrls) {
                // Store images in a hidden input or directly on the form data
                form.dataset.images = JSON.stringify(newImageUrls);
                const previewBox = imagePreview.querySelector('.image-preview-box');
                previewBox.style.backgroundImage = `url('${newImageUrls[0] || ''}')`;
                previewBox.innerHTML = '';
            }
        };
    }

    _deleteEvent(eventId) {
        this.modalManager.showConfirmModal('Delete Event', 'Are you sure you want to permanently delete this event?', () => {
            this.allEvents = this.allEvents.filter(e => e.id != eventId);
            this.filterEvents();
        });
    }

    filterEvents(searchTerm = '', month = 'all') {
        this.filteredEvents = this.allEvents.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase()) || event.address.city.toLowerCase().includes(searchTerm.toLowerCase());
            const eventDate = new Date(event.date);
            const matchesMonth = month === 'all' || eventDate.getMonth() == month;
            return matchesSearch && matchesMonth;
        });
        this.render();
    }
}