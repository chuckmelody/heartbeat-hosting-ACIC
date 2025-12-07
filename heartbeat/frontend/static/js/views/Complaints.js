import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Complaints");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-gavel fa-fw"></i> Complaints Policy</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <p><strong>Last Updated: 01 October 2025</strong></p>
                        <p>Heatbeat A CIC is committed to providing a high-quality service to our community, partners, and supporters. We view complaints as an opportunity to learn and improve for the future, as well as a chance to put things right for the person or organisation that has made the complaint. Our policy is to be fair, transparent, and effective in our handling of all complaints.</p>

                        <h3 class="content-subheader">1. Purpose of this Policy</h3>
                        <ul>
                            <li>To provide a fair complaints procedure which is clear and easy to use for anyone wishing to make a complaint.</li>
                            <li>To publicise the existence of our complaints procedure so that people know how to contact us to make a complaint.</li>
                            <li>To make sure all complaints are investigated fairly and in a timely way.</li>
                            <li>To make sure that complaints are, wherever possible, resolved and that relationships are repaired.</li>
                            <li>To gather information which helps us to improve what we do.</li>
                        </ul>

                        <h3 class="content-subheader">2. Definition of a Complaint</h3>
                        <p>A complaint is any expression of dissatisfaction, whether justified or not, about any aspect of Heatbeat A CIC's work, including the standard of service we provide, or the actions or lack of action by our staff, volunteers, or anyone directly involved in the delivery of our work.</p>

                        <h3 class="content-subheader">3. Our Complaints Procedure</h3>
                        <p>Our procedure is designed to be simple and accessible. We have a two-stage process. We aim to resolve most issues at Stage 1, but a formal investigation process is available at Stage 2 if you are not satisfied.</p>
                        
                        <h4>Stage 1: Informal Resolution</h4>
                        <p>In the first instance, we encourage you to raise your concern directly with the person involved or a member of our team. Many issues can be resolved quickly and informally at this stage. If you are not comfortable doing this, or if you are not satisfied with the response, you should proceed to Stage 2.</p>

                        <h4>Stage 2: Formal Written Complaint</h4>
                        <p>To make a formal complaint, please contact us in writing (email is preferred). Your complaint should be sent to our designated complaints handler at the address below. Please include the following information to help us investigate thoroughly:</p>
                        <ul>
                            <li>Your full name and contact details.</li>
                            <li>A full description of your complaint, including what happened, when it happened, and who was involved.</li>
                            <li>What you would like to happen as a result of your complaint (e.g., an apology, a change in policy).</li>
                        </ul>

                        <h3 class="content-subheader">4. What Happens Next?</h3>
                        <p>Once we receive your formal complaint, our process is as follows:</p>
                        <ol>
                            <li><strong>Acknowledgement:</strong> We will send you a written acknowledgement of your complaint within five (5) business days of receiving it.</li>
                            <li><strong>Investigation:</strong> Your complaint will be investigated by an appropriate person who is <strong data-tooltip="Someone not directly involved in the matter of the complaint, ensuring a fair and unbiased review.">impartial</strong> and has the authority to resolve the issue. This will typically be a senior member of our team.</li>
                            <li><strong>Response:</strong> We will send you a full written response to your complaint within twenty (20) business days of our acknowledgement. This response will outline the findings of our investigation and any actions we have taken or will take. If the investigation is complex and requires more time, we will contact you to explain the delay and provide a new timeline.</li>
                        </ol>

                        <h3 class="content-subheader">5. Confidentiality</h3>
                        <p>All complaint information will be handled sensitively, telling only those who need to know and following any relevant data protection requirements. We will ensure that your personal data is processed in line with our <a href="/privacy-policy" data-link>Privacy Policy</a>.</p>

                        <h3 class="content-subheader">6. If You Are Not Satisfied</h3>
                        <p>If you are not satisfied with the outcome of our formal complaints procedure, you have the right to escalate your concern. As a Community Interest Company, serious concerns about our operations or governance can be raised with the <strong data-tooltip="The official body responsible for the registration, regulation, and supervision of Community Interest Companies in the UK.">Regulator of Community Interest Companies</strong>. Details on how to do this can be found on the UK Government website.</p>

                        <h3 class="content-subheader">7. Contact Details for Complaints</h3>
                        <p>Please send your formal written complaint to:</p>
                        <p><strong>Email:</strong> <a href="mailto:complaints@heartbeatacic.org">complaints@heartbeatacic.org</a></p>
                        <p><em>(Please mark the subject line: "Formal Complaint")</em></p>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}