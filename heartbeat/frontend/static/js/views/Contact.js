import AbstractView from "./AbstractView.js";
import MailManager from "../managers/MailManager.js";
import DropdownManager from "../managers/DropdownManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Contact");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-envelope fa-fw"></i> Get In Touch</h2>
            <div class="contact-grid-single">
                <div class="content-card">
                    <p>Have a question, a proposal, or just want to say hello? We'd love to hear from you. Please use the form below to reach out, and a member of our team will get back to you as soon as possible.</p>
                    <form id="contactForm" style="margin-top: 2rem; text-align: left;">
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Your Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject of Enquiry</label>
                            <div class="custom-dropdown" id="subject-dropdown">
                                <div class="dropdown-selected">
                                    <span>Please select a topic...</span>
                                    <i class="fa-solid fa-chevron-down"></i>
                                </div>
                                <div class="dropdown-options">
                                    <ul>
                                        <li data-value="General Enquiry"><i class="fa-solid fa-circle-info fa-fw"></i><span>General Enquiry</span></li>
                                        <li data-value="Partnership Opportunities"><i class="fa-solid fa-handshake-angle fa-fw"></i><span>Partnership Opportunities</span></li>
                                        <li data-value="Volunteering"><i class="fa-solid fa-hands-helping fa-fw"></i><span>Volunteering</span></li>
                                        <li data-value="Event Information"><i class="fa-solid fa-calendar-days fa-fw"></i><span>Event Information</span></li>
                                        <li data-value="Media & Press Inquiry"><i class="fa-solid fa-bullhorn fa-fw"></i><span>Media & Press Inquiry</span></li>
                                        <li data-value="Annual Reports Inquiry"><i class="fa-solid fa-chart-line fa-fw"></i><span>Annual Reports Inquiry</span></li>
                                        <li data-value="Donation & Fundraising"><i class="fa-solid fa-hand-holding-heart fa-fw"></i><span>Donation & Fundraising</span></li>
                                        <li data-value="Safeguarding Concern"><i class="fa-solid fa-user-shield fa-fw"></i><span>Safeguarding Concern</span></li>
                                        <li data-value="Accessibility Feedback"><i class="fa-solid fa-universal-access fa-fw"></i><span>Accessibility Feedback</span></li>
                                        <li data-value="Legal & Policy Question"><i class="fa-solid fa-gavel fa-fw"></i><span>Legal & Policy Question</span></li>
                                        <li data-value="Report a Problem / Website Feedback"><i class="fa-solid fa-bug fa-fw"></i><span>Report a Problem / Website Feedback</span></li>
                                    </ul>
                                </div>
                                <input type="hidden" id="subject" name="subject" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" rows="6" required></textarea>
                        </div>
                        <div class="form-group checkbox-group" data-tooltip="Receive a copy of your message in your own inbox.">
                            <input type="checkbox" id="sendCopy" name="sendCopy" >
                            <label for="sendCopy">Send me a copy of this message</label>
                        </div>
                        <button type="submit" class="form-button">Send Message</button>
                        <div id="form-message"></div>
                    </form>
                </div>
                <div class="content-card">
                    <h2><i class="fa-solid fa-map-location-dot fa-fw"></i> Our Community Hub</h2>
                    <div class="map-container">
                        <iframe
                            src="https://maps.google.com/maps?q=Northampton&hl=es&z=10&amp;output=embed"
                            allowfullscreen="" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <p style="margin-top: 1rem; text-align: center;">We operate from the Chikara Martial Arts centre, a hub for discipline, respect, and positive engagement.</p>
                </div>
            </div>
        `;
    }

    async after_render() {
        const contactForm = document.getElementById('contactForm');
        const mailManager = new MailManager();
        new DropdownManager('subject-dropdown');

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const button = contactForm.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('form-message');
            
            button.disabled = true;
            button.textContent = 'Sending...';
            messageDiv.textContent = '';

            const formData = Object.fromEntries(new FormData(contactForm)); // Gets all fields
            // Explicitly handle checkbox as FormData omits unchecked ones
            formData.sendCopy = document.getElementById('sendCopy').checked;


            const result = await mailManager.send(formData);

            messageDiv.textContent = result.message;
            messageDiv.style.color = result.success ? "#4CAF50" : "#F44336";

            if (result.success) {
                contactForm.reset();
            }

            button.disabled = false;
            button.textContent = 'Send Message';
        });
    }
}
