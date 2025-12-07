import AbstractView from "./AbstractView.js";
import ModalManager from "../managers/ModalManager.js";
import ShareManager from "../managers/ShareManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.eventId = params.id;
        this.setTitle("Event Details");
    }

    async getHtml() {
        const event = await this.getEventData(this.eventId);
        if (!event) {
            return `<h2>Event Not Found</h2>`;
        }

        const { prevId, nextId } = await this.getNavData(this.eventId);

        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-GB', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        // Defensively handle cases where there are no images using modern JS
        const mainImage = event.images?.[0] ?? '';
        const hasImages = !!mainImage;
        const thumbnailImages = (event.images?.slice(1) ?? []).map(img =>
            `<div class="thumbnail-image" style="background-image: url('${img}')"></div>`
        ).join('');

        return `
            <div class="event-view-header">
                <h2 class="page-title">${event.title}</h2>
                <div class="event-view-nav">
                    <a href="/events" class="form-button secondary" data-link><i class="fa-solid fa-arrow-left"></i> All Events</a>
                    <button id="share-event-view-btn" class="form-button secondary" data-tooltip="Share this event"><i class="fa-solid fa-share-nodes"></i> Share</button>
                    ${prevId ? `<a href="/events/${prevId}" class="form-button secondary" data-link><i class="fa-solid fa-chevron-left"></i> Prev</a>` : ''}
                    ${nextId ? `<a href="/events/${nextId}" class="form-button secondary" data-link>Next <i class="fa-solid fa-chevron-right"></i></a>` : ''}
                </div>
            </div>

            <div class="event-view-grid">
                <div class="event-view-main">
                    <div class="content-card">
                        <div class="event-view-gallery">
                            <div class="main-image" style="background-image: url('${mainImage}')">
                                ${!hasImages ? '<i class="fa-regular fa-image"></i>' : ''}
                            </div>
                            ${thumbnailImages ? `<div class="thumbnail-grid">${thumbnailImages}</div>` : ''}
                        </div>
                        <h3 class="content-subheader">About this Event</h3>
                        <p>${event.description}</p>
                    </div>
                </div>
                <div class="event-view-sidebar">
                    <div class="content-card">
                        <div class="event-details-list">
                            <div class="event-detail-item">
                                <i class="fa-solid fa-calendar-day fa-fw"></i>
                                <div>
                                    <strong>Date</strong>
                                    <span>${formattedDate}</span>
                                </div>
                            </div>
                            <div class="event-detail-item">
                                <i class="fa-solid fa-location-dot fa-fw"></i>
                                <div>
                                    <strong>Location</strong>
                                    <span>${event.address.street}, ${event.address.city}, ${event.address.postcode}</span>
                                </div>
                            </div>
                            <div class="event-detail-item">
                                <i class="fa-solid fa-user-tie fa-fw"></i>
                                <div>
                                    <strong>Organizer</strong>
                                    <span>${event.organizer}</span>
                                </div>
                            </div>
                        </div>
                        <button id="register-btn" class="form-button" style="width: 100%; text-align: center; margin-top: auto;" data-tooltip="Register your interest for this event">Register Interest</button>
                    </div>
                    <div class="content-card">
                        <div class="map-container" id="event-map"></div>
                    </div>
                </div>
            </div>
        `;
    }

    async after_render() {
        const event = await this.getEventData(this.eventId);
        const modalManager = new ModalManager();
        const shareManager = new ShareManager();

        if (event) {
            if (event.lat && event.lng) {
                const mapFrame = document.createElement('iframe');
                mapFrame.src = `https://maps.google.com/maps?q=${event.lat},${event.lng}&hl=es&z=14&output=embed`;
                mapFrame.allowfullscreen = "";
                mapFrame.loading = "lazy";
                mapFrame.referrerpolicy = "no-referrer-when-downgrade";
                document.getElementById('event-map').appendChild(mapFrame);
            }

            // Image Gallery Logic
            const mainImage = document.querySelector('.main-image');
            document.querySelectorAll('.thumbnail-image').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    mainImage.style.backgroundImage = thumb.style.backgroundImage;
                });
            });

        // Share Button Logic
        document.getElementById('share-event-view-btn').addEventListener('click', () => {
            shareManager.share({
                title: event.title,
                text: `Check out this event from Heatbeat A CIC: ${event.title}`,
                url: window.location.href
            });
        });

            // Register Button Logic
            document.getElementById('register-btn').addEventListener('click', () => {
                modalManager.showFormModal({
                    title: `Register for: ${event.title}`,
                    fields: [
                        { id: 'name', label: 'Your Name', type: 'text' },
                        { id: 'email', label: 'Your Email', type: 'email' },
                    ],
                    onSave: (data) => {
                        console.log(`Registration for event ${event.id} with data:`, data);
                        modalManager.showInfoModal(
                            'Registration Received',
                            `Thank you, ${data.name}! Your interest has been registered. We will contact you with more details shortly.`
                        );
                    }
                });
            });
        }
    }

    async getEventData(id) {
        const response = await fetch('/static/data/events.json');
        const events = await response.json();
        return events.find(event => event.id == id);
    }

    async getNavData(id) {
        const response = await fetch('/static/data/events.json');
        const events = await response.json();
        const currentIndex = events.findIndex(event => event.id == id);
        const prevId = currentIndex > 0 ? events[currentIndex - 1].id : null;
        const nextId = currentIndex < events.length - 1 ? events[currentIndex + 1].id : null;
        return { prevId, nextId };
    }
}
