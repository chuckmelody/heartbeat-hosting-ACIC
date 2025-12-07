import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Safeguarding Policy");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-user-shield fa-fw"></i> Safeguarding and Child Protection Policy</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <p><strong>Last Updated: 01 October 2025</strong></p>
                        <p>Heatbeat A CIC is unequivocally committed to the highest standards of safeguarding and promoting the welfare of all children, young people, and adults at risk who engage with our services, activities, and projects. We believe that everyone, without exception, has the right to be protected from all forms of harm, abuse, neglect, and exploitation. This policy is the cornerstone of our commitment, outlining the robust procedures and principles we have in place to create and maintain a safe, nurturing, and supportive environment for all.</p>

                        <h3 class="content-subheader">1. Our Commitment to Safeguarding</h3>
                        <p>Our organisation acknowledges its moral and legal duty of care to safeguard and promote the welfare of children and adults at risk. We are committed to ensuring our safeguarding practice reflects statutory responsibilities as laid out in legislation such as the <strong data-tooltip="Key legislation concerning the welfare of children.">Children Act 1989 and 2004</strong>, the <strong data-tooltip="Key legislation concerning the care and support for adults.">Care Act 2014</strong>, and government guidance such as 'Working Together to Safeguard Children'. Our practices are designed to comply with best practice and the requirements of all relevant UK legal frameworks.</p>

                        <h3 class="content-subheader">2. Purpose and Scope</h3>
                        <p>The purpose of this policy is to provide a clear, comprehensive, and unambiguous framework for all individuals associated with Heatbeat A CIC to ensure the safety and well-being of our beneficiaries. This policy applies to all individuals working for or on behalf of our organisation, in any capacity. This includes, but is not limited to, senior managers, board members, paid staff, volunteers, sessional workers, agency staff, students on placement, and contractors. The policy applies to all activities organised by us, including those taking place online, at our premises, or at external venues.</p>

                        <h3 class="content-subheader">3. Key Principles and Definitions</h3>
                        <ul>
                            <li><strong>Safeguarding:</strong> Protecting people's health, wellbeing and human rights, and enabling them to live free from harm, abuse and neglect.</li>
                            <li><strong>Child:</strong> Anyone who has not yet reached their 18th birthday.</li>
                            <li><strong>Adult at Risk:</strong> A person aged 18 or over who has needs for care and support, is experiencing, or is at risk of, abuse or neglect, and as a result of those needs is unable to protect themselves against the abuse or neglect or the risk of it.</li>
                            <li><strong>Paramountcy Principle:</strong> The welfare of the child or adult at risk is, and must always be, the paramount consideration in all our actions and decisions.</li>
                        </ul>

                        <h3 class="content-subheader">4. Roles and Responsibilities</h3>
                        <p><strong>The Board of Directors</strong> holds ultimate responsibility for ensuring that Heatbeat A CIC has a robust and effective safeguarding policy and procedure in place, and that it is actively implemented and regularly reviewed.</p>
                        <p><strong>The Designated Safeguarding Lead (DSL)</strong> for Heatbeat A CIC is <strong>Junior Anderson, BEM</strong>. The DSL is the first point of contact for all safeguarding concerns. Their responsibilities include providing advice and support to staff, managing referrals, maintaining secure records of concerns, and liaising with local statutory child and adult protection agencies (such as the MASH or LADO).</p>
                        <p>All staff and volunteers are required to read, understand, and adhere to this policy. It is everyone's responsibility to report any safeguarding concerns they may have without delay.</p>

                        <h3 class="content-subheader">5. Safe Recruitment and Training</h3>
                        <p>Heatbeat A CIC is committed to safe recruitment practices to ensure that all staff and volunteers are suitable to work with children and adults at risk. This includes:</p>
                        <ul>
                            <li>Ensuring all job and role descriptions clearly state the safeguarding responsibilities.</li>
                            <li>Conducting structured interviews that include values-based and safeguarding-specific questions.</li>
                            <li>Taking up and verifying a minimum of two independent references.</li>
                            <li>Requiring an appropriate level of <strong data-tooltip="Disclosure and Barring Service checks are used to help employers make safer recruitment decisions.">DBS check</strong> for all eligible roles, in line with current legislation.</li>
                            <li>Providing mandatory safeguarding induction and regular refresher training for all staff and volunteers.</li>
                        </ul>

                        <h3 class="content-subheader">6. Code of Conduct</h3>
                        <p>All staff and volunteers are expected to adhere to a professional code of conduct to ensure a safe and positive environment. This includes, but is not limited to:</p>
                        <ul>
                            <li>Always acting in the best interests of the child or adult at risk.</li>
                            <li>Maintaining professional boundaries at all times.</li>
                            <li>Avoiding one-to-one situations without clear and accountable arrangements.</li>
                            <li>Never engaging in rough, physical or sexually provocative games.</li>
                            <li>Using professional and appropriate language at all times.</li>
                            <li>Adhering to our policies on communication, including the use of social media and online platforms.</li>
                            <li>Reporting any breaches of this code immediately to the Designated Safeguarding Lead.</li>
                        </ul>

                        <h3 class="content-subheader">7. Reporting Safeguarding Concerns</h3>
                        <p>If you have a concern about the welfare of a child or adult at risk, or about the behaviour of a member of staff or volunteer, you must report it immediately. Do not delay in order to gather more evidence.</p>
                        <ol>
                            <li><strong>Immediate Danger:</strong> If you believe a person is in immediate danger of significant harm, call the police on 999 without delay.</li>
                            <li><strong>Record:</strong> Make an immediate, factual record of your concern. Note the date, time, location, persons involved, and exactly what was said or observed. Do not interpret or investigate.</li>
                            <li><strong>Report Internally:</strong> Report your concern to the Designated Safeguarding Lead (DSL) as soon as possible on the same day. Provide your written record.</li>
                            <li><strong>DSL Action:</strong> The DSL will assess the information and take appropriate action, which may include making a formal referral to local authority children’s or adults’ social care services, and/or the Police.</li>
                        </ol>
                        <p><strong>Important:</strong> Never promise confidentiality to someone raising a concern. Explain that you have a duty to share the information with the appropriate people to ensure safety.</p>

                        <h3 class="content-subheader">8. Policy Review</h3>
                        <p>This Safeguarding Policy will be reviewed annually by October 2026, or in response to changes in legislation, government guidance, or learning from incidents. This ensures our practices remain current and effective.</p>

                        <h3 class="content-subheader">9. Contact for Safeguarding Concerns</h3>
                        <p><strong>Designated Safeguarding Lead (DSL):</strong> Junior Anderson, BEM</p>
                        <p><strong>Email:</strong> <a href="mailto:safeguarding@heartbeatacic.org" data-tooltip="Email our Designated Safeguarding Lead directly">safeguarding@heartbeatacic.org</a></p>
                        <p><strong>Local Authority Multi-Agency Safeguarding Hub (MASH):</strong> 0300 126 7000 (West Northamptonshire)</p>
                        <p><strong>NSPCC Helpline:</strong> For advice and support, you can also contact the NSPCC on 0808 800 5000.</p>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}