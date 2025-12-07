import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";
import MailManager from "../managers/MailManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Volunteer");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-hands-helping fa-fw"></i> Volunteer With Us</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <h3 class="content-subheader">Become a Part of Our Mission</h3>
                        <p>Our volunteers are the lifeblood of our organization. By contributing your time, skills, and passion, you can play a direct role in creating positive change. While our roots are in Northampton, our reach and impact are UK-wide, and we welcome applications from dedicated individuals everywhere.</p>
                        <p>If you are interested in joining a dedicated team and making a tangible impact, please fill out the form below to express your interest. We would be delighted to hear from you.</p>
                        
                        <form id="volunteerForm" style="margin-top: 2rem; text-align: left;">
                            <div class="contact-grid">
                                <div class="form-group">
                                    <label for="firstName">First Name</label>
                                    <input type="text" id="firstName" name="firstName" required>
                                </div>
                                <div class="form-group">
                                    <label for="surname">Surname</label>
                                    <input type="text" id="surname" name="surname" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number (Optional)</label>
                                <input type="tel" id="phone" name="phone">
                            </div>
                            <div class="form-group">
                                <label>Do you have a current, valid DBS (Disclosure and Barring Service) check?</label>
                                <div class="radio-group">
                                    <label class="radio-group"><input type="radio" name="dbs" value="Yes" required><span class="custom-control"></span> Yes</label>
                                    <label class="radio-group"><input type="radio" name="dbs" value="No"><span class="custom-control"></span> No</label>
                                    <label class="radio-group"><input type="radio" name="dbs" value="Unsure"><span class="custom-control"></span> I'm not sure</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>What is your general availability?</label>
                                <div class="radio-group" style="flex-wrap: wrap;">
                                    <label class="checkbox-group">
                                        <input type="checkbox" name="availability" value="Weekdays">
                                        <span class="custom-control"></span> Weekdays
                                    </label>
                                    <label class="checkbox-group">
                                        <input type="checkbox" name="availability" value="Weekends">
                                        <span class="custom-control"></span> Weekends
                                    </label>
                                    <label class="checkbox-group">
                                        <input type="checkbox" name="availability" value="Evenings">
                                        <span class="custom-control"></span> Evenings
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="reason">Why would you like to volunteer with Heatbeat A CIC?</label>
                                <textarea id="reason" name="reason" rows="6" required placeholder="Tell us about your skills, interests, and what motivates you to join us..."></textarea>
                            </div>
                            <div class="form-group">
                                <label for="conditions">Is there any other relevant information you'd like to share? (e.g., medical conditions, access needs)</label>
                                <textarea id="conditions" name="conditions" rows="4" placeholder="This information will be kept confidential and is used to ensure we can support you appropriately."></textarea>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-group" data-tooltip="Receive a copy of your application in your own inbox.">
                                    <input type="checkbox" id="sendCopy" name="sendCopy">
                                    <span class="custom-control"></span>
                                    Send me a copy of this application
                                </label>
                            </div>
                            <button type="submit" class="form-button">Submit Application</button>
                            <div id="form-message"></div>
                        </form>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }

    async after_render() {
        const volunteerForm = document.getElementById('volunteerForm');
        const mailManager = new MailManager();

        volunteerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const button = volunteerForm.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('form-message');
            
            button.disabled = true;
            button.textContent = 'Submitting...';
            messageDiv.textContent = '';

            const formData = new FormData(volunteerForm);
            const data = Object.fromEntries(formData.entries());
            data.subject = 'Volunteering'; // Set subject for the server

            const result = await mailManager.send(data);

            messageDiv.textContent = result.success ? "Thank you for your application! We have received your details and will be in touch shortly." : result.message;
            messageDiv.style.color = result.success ? "#4CAF50" : "#F44336";

            if (result.success) {
                volunteerForm.reset();
            }

            button.disabled = false;
            button.textContent = 'Submit Application';
        });

        await RightSidebar.after_render();
    }
}