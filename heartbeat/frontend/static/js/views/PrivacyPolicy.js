import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Privacy Policy");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-shield-halved fa-fw"></i> Privacy Policy</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <p><strong>Effective Date: 01 October 2025</strong></p>
                        <p>Heatbeat A CIC ("we", "us", "our") is deeply committed to transparency and to protecting the privacy and security of your personal information. This Privacy Policy provides a detailed explanation of how we collect, use, store, and protect your data when you interact with us, whether through our website, as a supporter, a volunteer, or a beneficiary of our services. We are dedicated to processing your information in accordance with the <strong data-tooltip="The UK General Data Protection Regulation, which governs data protection law in the UK.">UK GDPR</strong> and the Data Protection Act 2018.</p>

                        <h3 class="content-subheader">1. About Heatbeat A CIC</h3>
                        <p>Heatbeat A CIC is a Community Interest Company (CIC) registered in England and Wales. As a social enterprise, our primary purpose is to benefit the community. For the purpose of data protection legislation, we are the <strong data-tooltip="The entity that determines the purposes and means of processing personal data.">Data Controller</strong> of the personal data referred to in this policy.</p>

                        <h3 class="content-subheader">2. The Data We Collect About You</h3>
                        <p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                        <ul>
                            <li><strong>Identity Data:</strong> Includes first name, last name, username or similar identifier, title, and date of birth.</li>
                            <li><strong>Contact Data:</strong> Includes billing address, delivery address, email address, and telephone numbers.</li>
                            <li><strong>Financial Data:</strong> Includes bank account and payment card details collected by our third-party payment processors when you make a donation. We do not store full card details ourselves.</li>
                            <li><strong>Transaction Data:</strong> Includes details about donations you have made, payments to and from you, and other details of services you have engaged with.</li>
                            <li><strong>Technical Data:</strong> Includes your <strong data-tooltip="Internet Protocol address: A unique number assigned to your device when you connect to the internet.">IP address</strong>, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                            <li><strong>Usage Data:</strong> Includes information about how you use our website, products, and services.</li>
                            <li><strong>Marketing and Communications Data:</strong> Includes your preferences in receiving marketing from us and your communication preferences.</li>
                        </ul>
                        <p>We may also collect <strong data-tooltip="Sensitive data such as race, ethnic origin, political opinions, religious beliefs, health data, etc. We only collect this with your explicit consent and for specific purposes.">Special Category Data</strong> (e.g., health information for event participation) where necessary, but we will only do so with your explicit consent and for a specified purpose.</p>

                        <h3 class="content-subheader">3. How Your Personal Data Is Collected</h3>
                        <p>We use different methods to collect data from and about you, including through:</p>
                        <ul>
                            <li><strong>Direct Interactions:</strong> You may give us your Identity, Contact, and Financial Data by filling in forms or by corresponding with us by post, phone, email, or otherwise. This includes personal data you provide when you make a donation, apply to volunteer, or subscribe to our newsletter.</li>
                            <li><strong>Automated Technologies or Interactions:</strong> As you interact with our website, we will automatically collect Technical Data about your equipment and browsing actions. We collect this personal data by using cookies and other similar technologies. Please see our <a href="/cookie-policy" data-link>Cookie Policy</a> for further details.</li>
                            <li><strong>Third Parties:</strong> We may receive personal data about you from various third parties, such as analytics providers like Google, and payment services like Stripe or PayPal.</li>
                        </ul>

                        <h3 class="content-subheader">4. How We Use Your Personal Data</h3>
                        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                        <ul>
                            <li>Where it is necessary for our <strong data-tooltip="Our valid interests in conducting and managing our CIC to enable us to give you the best service and the best and most secure experience.">legitimate interests</strong> (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal obligation.</li>
                            <li>Where you have given us explicit <strong data-tooltip="Any freely given, specific, informed, and unambiguous indication of your wishes.">consent</strong> to do so.</li>
                        </ul>
                        <p>Specifically, we use your data to process donations, manage our relationship with you, administer our website, and keep you informed about our work where you have agreed to be contacted.</p>

                        <h3 class="content-subheader">5. Disclosures of Your Personal Data</h3>
                        <p>We may share your personal data with trusted third-party service providers, agents, or subcontractors for the purposes of completing tasks and providing services to you on our behalf (e.g., to process donations and send you mailings). However, we disclose only the personal information that is necessary to deliver the service, and we have a contract in place that requires them to keep your information secure and not to use it for their own direct marketing purposes.</p>

                        <h3 class="content-subheader">6. Data Security</h3>
                        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions, and they are subject to a duty of confidentiality.</p>

                        <h3 class="content-subheader">7. Data Retention</h3>
                        <p>We will only retain your personal data for as long as is reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. For example, we are required by UK tax law to keep basic information about our donors (including Contact, Identity, Financial and Transaction Data) for six years after they cease being donors for tax purposes.</p>

                        <h3 class="content-subheader">8. Your Legal Rights</h3>
                        <p>Under data protection law, you have a number of rights in relation to your personal data. These include the right to:</p>
                        <ul>
                            <li>Request access to your personal data.</li>
                            <li>Request correction of your personal data.</li>
                            <li>Request erasure of your personal data.</li>
                            <li>Object to processing of your personal data.</li>
                            <li>Request restriction of processing your personal data.</li>
                            <li>Request transfer of your personal data.</li>
                            <li>Right to withdraw consent.</li>
                        </ul>
                        <p>If you wish to exercise any of the rights set out above, please contact us. You will not have to pay a fee to access your personal data, but we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive.</p>

                        <h3 class="content-subheader">9. Contact Details and Complaints</h3>
                        <p>For any questions regarding this policy or our privacy practices, please contact our Data Protection Lead:</p>
                        <p>Email: <a href="mailto:info@heartbeatacic.org">info@heartbeatacic.org</a></p>
                        <p>You have the right to make a complaint at any time to the <strong data-tooltip="The Information Commissioner's Office, the UK's independent authority for data protection and privacy.">Information Commissioner's Office (ICO)</strong>, the UK regulator for data protection issues (www.ico.org.uk). We would, however, appreciate the chance to deal with your concerns before you approach the ICO, so please contact us in the first instance.</p>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}