import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Accessibility");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-universal-access fa-fw"></i> Accessibility Statement</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <p><strong>Statement Date: [Date]</strong></p>
                        <p>Heatbeat A CIC is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to achieve this goal. We believe in providing an inclusive and accessible environment for all our users.</p>

                        <h3 class="content-subheader">1. Measures to Support Accessibility</h3>
                        <p>Heatbeat A CIC takes the following measures to ensure accessibility of our website:</p>
                        <ul>
                            <li>Include accessibility as part of our mission statement and internal policies.</li>
                            <li>Assign clear accessibility targets and responsibilities.</li>
                            <li>Employ formal accessibility quality assurance methods.</li>
                            <li>Provide continual accessibility training for our staff.</li>
                        </ul>

                        <h3 class="content-subheader">2. Conformance Status</h3>
                        <p>The <strong data-tooltip="Web Content Accessibility Guidelines: A set of international standards for making web content more accessible to people with disabilities.">Web Content Accessibility Guidelines (WCAG)</strong> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.</p>
                        <p>The Heatbeat A CIC website is partially conformant with <strong data-tooltip="The widely accepted benchmark for web accessibility. Level AA is the target for most public and private sector websites.">WCAG 2.1 level AA</strong>. Partially conformant means that some parts of the content do not fully conform to the accessibility standard. We are actively working to address these areas.</p>

                        <h3 class="content-subheader">3. Technical Specifications</h3>
                        <p>Accessibility of this website relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:</p>
                        <ul>
                            <li>HTML (HyperText Markup Language)</li>
                            <li>CSS (Cascading Style Sheets)</li>
                            <li>JavaScript</li>
                            <li><strong data-tooltip="Accessible Rich Internet Applications: A set of attributes that can be added to HTML elements to improve accessibility.">WAI-ARIA</strong> (Web Accessibility Initiative – Accessible Rich Internet Applications)</li>
                        </ul>
                        <p>These technologies are relied upon for conformance with the accessibility standards used.</p>

                        <h3 class="content-subheader">4. Known Limitations and Alternatives</h3>
                        <p>Despite our best efforts to ensure accessibility of the Heatbeat A CIC website, there may be some limitations. Below is a description of known limitations, and potential solutions. Please contact us if you observe an issue not listed below.</p>
                        <ul>
                            <li><strong>Legacy Documents:</strong> Some older PDF documents may not be fully accessible to screen reader software. We are working to update these or provide accessible alternatives. If you require a specific document in an alternative format, please contact us.</li>
                            <li><strong>Third-Party Content:</strong> Embedded content from third-party websites, such as embedded videos from YouTube, may not fully conform to our accessibility standards. We do not have control over the accessibility of this content but will always choose the most accessible options where available.</li>
                        </ul>

                        <h3 class="content-subheader">5. Feedback and Contact Information</h3>
                        <p>We welcome your feedback on the accessibility of our website. Please let us know if you encounter accessibility barriers:</p>
                        <ul>
                            <li><strong>Email:</strong> <a href="mailto:accessibility@heartbeatacic.org">accessibility@heartbeatacic.org</a></li>
                            <li><strong>Contact Form:</strong> <a href="/contact" data-link>Visit our contact page</a></li>
                        </ul>
                        <p>We aim to respond to accessibility feedback within 5 business days.</p>

                        <h3 class="content-subheader">6. Enforcement Procedure</h3>
                        <p>If you are not satisfied with our response to your complaint, you can contact the <strong data-tooltip="The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.">Equality and Human Rights Commission (EHRC)</strong>. They are responsible for enforcing accessibility regulations for websites of public sector bodies.</p>
                        <p>In Northern Ireland, you can contact the <strong data-tooltip="The Equality Commission for Northern Ireland is responsible for enforcing accessibility regulations in Northern Ireland.">Equality Commission for Northern Ireland (ECNI)</strong>.</p>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}