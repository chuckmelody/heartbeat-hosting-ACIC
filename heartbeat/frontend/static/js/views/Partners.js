import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Partners");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-handshake-angle fa-fw"></i> Our Valued Partners</h2>
            <div class="content-card" style="margin-bottom: 2rem;">
                <p>We believe that meaningful change is achieved through collaboration. Our partners are essential to our success, providing the resources, expertise, and network necessary to expand our reach and deepen our impact. We are proud to work alongside local authorities, businesses, and other community organizations who share our vision.</p>
            </div>
            <div class="partner-grid">
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-building-shield"></i></div>
                    <div class="partner-info">
                        <h4>Northamptonshire Police</h4>
                        <a href="https://www.northants.police.uk/" target="_blank" rel="noopener noreferrer" class="partner-website-link">northants.police.uk</a>
                    </div>
                    <a href="https://www.northants.police.uk/" target="_blank" rel="noopener noreferrer" class="partner-button">Visit Site</a>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-school"></i></div>
                    <div class="partner-info">
                        <h4>Local Schools & Colleges</h4>
                        <a href="https://www.westnorthants.gov.uk/schools-and-education" target="_blank" rel="noopener noreferrer" class="partner-website-link">westnorthants.gov.uk</a>
                    </div>
                    <a href="https://www.westnorthants.gov.uk/schools-and-education" target="_blank" rel="noopener noreferrer" class="partner-button">Learn More</a>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-hands-holding-child"></i></div>
                    <div class="partner-info">
                        <h4>Youth Offending Service</h4>
                        <a href="https://www.westnorthants.gov.uk/children-families-and-education/youth-offending-service" target="_blank" rel="noopener noreferrer" class="partner-website-link">westnorthants.gov.uk</a>
                    </div>
                    <a href="https://www.westnorthants.gov.uk/children-families-and-education/youth-offending-service" target="_blank" rel="noopener noreferrer" class="partner-button">Visit Site</a>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-landmark-flag"></i></div>
                    <div class="partner-info">
                        <h4>Local Government & Councils</h4>
                        <a href="https://www.westnorthants.gov.uk/" target="_blank" rel="noopener noreferrer" class="partner-website-link">westnorthants.gov.uk</a>
                    </div>
                    <a href="https://www.westnorthants.gov.uk/" target="_blank" rel="noopener noreferrer" class="partner-button">Visit Site</a>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-khanda"></i></div>
                    <div class="partner-info">
                        <h4>Chikara Martial Arts</h4>
                        <a href="http://chikara-karate-club.co.uk/" target="_blank" rel="noopener noreferrer" class="partner-website-link">chikara-karate-club.co.uk</a>
                    </div>
                    <a href="http://chikara-karate-club.co.uk/" target="_blank" rel="noopener noreferrer" class="partner-button">Visit Site</a>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-globe"></i></div>
                    <div class="partner-info">
                        <h4>World & European Karate Federation</h4>
                        <a href="https://www.wkf.net/" target="_blank" rel="noopener noreferrer" class="partner-website-link">wkf.net</a>
                    </div>
                    <a href="https://www.wkf.net/" target="_blank" rel="noopener noreferrer" class="partner-button">Visit WKF</a>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-building-columns"></i></div>
                    <div class="partner-info">
                        <h4>Community Foundations</h4>
                        <a href="https://www.ncf.uk.com/" target="_blank" rel="noopener noreferrer" class="partner-website-link">ncf.uk.com</a>
                    </div>
                    <a href="https://www.ncf.uk.com/" target="_blank" rel="noopener noreferrer" class="partner-button">Visit NCF</a>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-child-reaching"></i></div>
                    <div class="partner-info">
                        <h4>NSPCC</h4>
                        <a href="https://www.nspcc.org.uk/" target="_blank" rel="noopener noreferrer" class="partner-website-link">nspcc.org.uk</a>
                    </div>
                    <a href="https://www.nspcc.org.uk/" target="_blank" rel="noopener noreferrer" class="partner-button">Visit Site</a>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-briefcase"></i></div>
                    <div class="partner-info">
                        <h4>Corporate Sponsors</h4>
                    </div>
                    <span class="partner-button is-disabled">To Be Announced</span>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-people-group"></i></div>
                    <div class="partner-info">
                        <h4>Other CICs & Charities</h4>
                    </div>
                    <span class="partner-button is-disabled">To Be Announced</span>
                </div>
                <div class="partner-card">
                    <div class="partner-logo-placeholder"><i class="fa-solid fa-certificate"></i></div>
                    <div class="partner-info">
                        <h4>Regulator of CICs</h4>
                        <a href="https://www.gov.uk/government/organisations/office-of-the-regulator-of-community-interest-companies" target="_blank" rel="noopener noreferrer" class="partner-website-link">gov.uk</a>
                    </div>
                    <a href="https://www.gov.uk/government/organisations/office-of-the-regulator-of-community-interest-companies" target="_blank" rel="noopener noreferrer" class="partner-button">View Register</a>
                </div>
            </div>
        `;
    }
}