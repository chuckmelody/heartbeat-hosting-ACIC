import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Terms of Use");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-file-contract fa-fw"></i> Terms of Use</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <p><strong>Last Updated: 01 October 2025</strong></p>
                        <p>Welcome to the Heatbeat A CIC website. These terms and conditions outline the rules and regulations for the use of our website, located at [Your Website URL]. By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Heatbeat A CIC's website if you do not accept all of the terms and conditions stated on this page.</p>

                        <h3 class="content-subheader">1. Introduction</h3>
                        <p>These Terms will be applied fully and affect your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. The following terminology applies to these Terms and Conditions, Privacy Statement and Cookie Policy: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to Heatbeat A CIC.</p>

                        <h3 class="content-subheader">2. Intellectual Property Rights</h3>
                        <p>Other than the content you own, under these Terms, Heatbeat A CIC and/or its licensors own all the <strong data-tooltip="Rights to creations of the mind, such as inventions, literary and artistic works, designs, symbols, names, and images used in commerce.">intellectual property rights</strong> and materials contained in this Website. All such rights are reserved.</p>
                        <p>You are granted a limited license only for purposes of viewing the material contained on this Website. This license is for your personal, non-commercial use only.</p>

                        <h3 class="content-subheader">3. Restrictions on Use</h3>
                        <p>You are specifically restricted from all of the following:</p>
                        <ul>
                            <li>Publishing any Website material in any other media without prior written consent.</li>
                            <li>Selling, sublicensing and/or otherwise commercializing any Website material.</li>
                            <li>Publicly performing and/or showing any Website material.</li>
                            <li>Using this Website in any way that is or may be damaging to this Website or to Heatbeat A CIC.</li>
                            <li>Using this Website in any way that impacts user access to this Website.</li>
                            <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity.</li>
                            <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website.</li>
                            <li>Using this Website to engage in any advertising or marketing without our express written consent.</li>
                        </ul>
                        <p>Certain areas of this Website are restricted from being accessed by you and Heatbeat A CIC may further restrict access by you to any areas of this Website, at any time, in absolute discretion.</p>

                        <h3 class="content-subheader">4. Limitation of Liability</h3>
                        <p>The information on this website is provided free-of-charge, and you acknowledge that it would be unreasonable to hold us liable in respect of this website and the information on this website. Whilst we endeavour to ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we commit to ensuring that the website remains available or that the material on the website is kept up-to-date.</p>
                        <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill). In no event shall Heatbeat A CIC, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Heatbeat A CIC, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
                        <p>Nothing in this disclaimer will: (a) limit or exclude our or your liability for death or personal injury resulting from negligence; (b) limit or exclude our or your liability for fraud or fraudulent misrepresentation; (c) limit any of our or your liabilities in any way that is not permitted under applicable law.</p>

                        <h3 class="content-subheader">5. Indemnification</h3>
                        <p>You hereby agree to <strong data-tooltip="To compensate someone for harm or loss.">indemnify</strong> to the fullest extent Heatbeat A CIC from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>

                        <h3 class="content-subheader">6. Severability</h3>
                        <p>If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein. The failure of us to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>

                        <h3 class="content-subheader">7. Variation of Terms</h3>
                        <p>Heatbeat A CIC is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis to ensure you understand all terms and conditions governing use of this Website. The revised terms will apply to the use of our website from the date of the publication of the revised terms on our website.</p>

                        <h3 class="content-subheader">8. Governing Law & Jurisdiction</h3>
                        <p>These Terms will be governed by and interpreted in accordance with the laws of England and Wales, and you submit to the non-exclusive <strong data-tooltip="The official power to make legal decisions and judgments.">jurisdiction</strong> of the state and federal courts located in England for the resolution of any disputes.</p>

                        <h3 class="content-subheader">9. Contact Information</h3>
                        <p>If you have any queries regarding any of our terms, please contact us at <a href="mailto:info@heartbeatacic.org">info@heartbeatacic.org</a>.</p>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}