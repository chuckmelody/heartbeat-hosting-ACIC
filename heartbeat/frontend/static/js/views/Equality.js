import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Equality");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-scale-balanced fa-fw"></i> Equality & Diversity Policy</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <p><strong>Last Updated: 01 October 2025</strong></p>
                        <p>Heatbeat A CIC is fundamentally committed to encouraging equality, diversity, and inclusion among our workforce, volunteers, and beneficiaries, and eliminating unlawful discrimination. The aim is for our organisation to be truly representative of all sections of society and our community, and for each person to feel respected and able to give their best.</p>

                        <h3 class="content-subheader">1. Our Commitment</h3>
                        <p>We are committed against unlawful discrimination of users, customers, volunteers, or the public, and to advancing equality of opportunity between different groups. This policy's purpose is to provide equality, fairness, and respect for all in our employment, whether temporary, part-time or full-time, and in our provision of services.</p>

                        <h3 class="content-subheader">2. Legal Framework</h3>
                        <p>This policy is guided by the principles of the <strong data-tooltip="The primary UK legislation relating to equality, which legally protects people from discrimination in the workplace and in wider society.">Equality Act 2010</strong>. The Act provides a legal framework to protect the rights of individuals and advance equality of opportunity for all. It identifies nine 'protected characteristics' which cannot be used as a basis for unfair treatment. These are:</p>
                        <ul>
                            <li><strong data-tooltip="A person's age or age group.">Age</strong></li>
                            <li><strong data-tooltip="A physical or mental impairment which has a substantial and long-term adverse effect on a person's ability to carry out normal day-to-day activities.">Disability</strong></li>
                            <li><strong data-tooltip="The process of reassigning a person's sex by changing physiological or other attributes of sex.">Gender Reassignment</strong></li>
                            <li><strong data-tooltip="Marriage and civil partnership are protected characteristics for employment purposes.">Marriage and Civil Partnership</strong></li>
                            <li><strong data-tooltip="Pregnancy is the condition of being pregnant or expecting a baby. Maternity refers to the period after the birth.">Pregnancy and Maternity</strong></li>
                            <li><strong data-tooltip="Refers to a group of people defined by their race, colour, and nationality (including citizenship) ethnic or national origins.">Race</strong></li>
                            <li><strong data-tooltip="Religion has the meaning usually given to it and belief includes religious and philosophical beliefs.">Religion or Belief</strong></li>
                            <li><strong data-tooltip="A person's sex (male or female).">Sex</strong></li>
                            <li><strong data-tooltip="Whether a person's sexual attraction is towards their own sex, the opposite sex or both sexes.">Sexual Orientation</strong></li>
                        </ul>

                        <h3 class="content-subheader">3. Our Responsibilities</h3>
                        <p><strong>The Board of Directors</strong> has overall responsibility for the effective operation of this policy and for ensuring compliance with the relevant statutory framework. The board has delegated day-to-day responsibility for operating the policy to [Designated Person/Role, e.g., the Managing Director].</p>
                        <p><strong>All Staff and Volunteers</strong> have a personal responsibility to treat others with dignity and respect, and to adhere to the provisions of this policy. Everyone is expected to contribute to creating a positive environment where diversity is valued.</p>

                        <h3 class="content-subheader">4. Our Commitment in Practice</h3>
                        <p>We will take the following actions to ensure our commitment is put into practice:</p>
                        <ul>
                            <li>Creating an environment in which individual differences and the contributions of all our staff, volunteers, and service users are recognised and valued.</li>
                            <li>Ensuring our services are accessible and sensitive to the needs of our diverse community.</li>
                            <li>Making recruitment and selection decisions for employment or volunteering based on aptitude and ability, ensuring fairness and transparency at every stage.</li>
                            <li>Providing training, development, and progression opportunities that are available to all.</li>
                            <li>Regularly reviewing all our employment practices and procedures to ensure fairness.</li>
                            <li>Taking seriously complaints of bullying, harassment, victimisation, and unlawful discrimination by fellow staff, volunteers, service users, suppliers, the public and any others in the course of the organisation’s work activities.</li>
                        </ul>

                        <h3 class="content-subheader">5. Handling Breaches of this Policy</h3>
                        <p>Any employee or volunteer found to have exhibited any form of unlawful discrimination will be subject to disciplinary action, which may include termination of their employment or volunteering agreement. We will not tolerate any form of intimidation, victimisation, or harassment and will take all allegations seriously.</p>
                        <p>If you believe you have been subject to any form of discrimination, you are encouraged to raise your concerns through our <a href="/complaints" data-link>Complaints Policy</a> procedure.</p>

                        <h3 class="content-subheader">6. Monitoring and Review</h3>
                        <p>This policy will be monitored and reviewed annually to ensure that it continues to meet the needs of our organisation and the community we serve, and that it remains compliant with the law. We will collect and analyse monitoring data to assess the effectiveness of this policy and to identify areas for improvement.</p>

                        <h3 class="content-subheader">7. Contact Information</h3>
                        <p>For any questions or concerns regarding our Equality & Diversity Policy, please contact us at <a href="mailto:info@heartbeatacic.org">info@heartbeatacic.org</a>.</p>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}