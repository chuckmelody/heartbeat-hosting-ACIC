import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Annual Reports");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-chart-line fa-fw"></i> Annual Reports</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <h3 class="content-subheader">A Foundation of Trust and Accountability</h3>
                        <p>Heatbeat A CIC is built on a foundation of trust, accountability, and an unwavering commitment to the community we serve. As a regulated Community Interest Company, we believe in complete transparency regarding our operations, finances, and social impact. This page serves as our public archive, providing clear and direct access to our official filings and demonstrating how our resources are used to create positive change.</p>
                        <p>Below, you will find links to our annual CIC reports as filed with the Regulator of Community Interest Companies and Companies House. These documents detail our activities, community benefits, and financial statements for each operational year.</p>

                        <h3 class="content-subheader">Available Reports</h3>
                        <div class="report-grid">
                            <!-- Past Report Card -->
                            <div class="report-card">
                                <div class="report-icon">
                                    <i class="fa-solid fa-file-contract"></i>
                                </div>
                                <div class="report-info">
                                    <h4>CIC Report & Accounts (Filed 2023)</h4>
                                    <p>Our most recent filing, detailing the social impact, activities, and financial accounts for the preceding financial year.</p>
                                </div>
                                <a href="https://find-and-update.company-information.service.gov.uk/company/14772840/filing-history" class="form-button" target="_blank" rel="noopener noreferrer" data-tooltip="View all official filings on Companies House.">View Filing</a>
                            </div>

                            <!-- Forthcoming Report Card -->
                            <div class="report-card">
                                <div class="report-icon">
                                    <i class="fa-solid fa-file-invoice"></i>
                                </div>
                                <div class="report-info">
                                    <h4>Next Annual Report (Forthcoming)</h4>
                                    <p>Our next report, covering the current financial year, will be compiled and filed in accordance with regulatory deadlines. It will be available here upon submission.</p>
                                </div>
                                <button class="form-button" disabled data-tooltip="This report will be available after the end of the financial year.">Coming Soon</button>
                            </div>
                        </div>

                        <h3 class="content-subheader">Official Company Information</h3>
                        <p>As a registered Community Interest Company (No. 14772840), all our official filings are a matter of public record. For a complete history, including confirmation statements and director information, you can view our company details directly on the official UK Government register.</p>
                        <a href="https://find-and-update.company-information.service.gov.uk/company/14772840" class="form-button" target="_blank" rel="noopener noreferrer" data-tooltip="Opens our official Companies House profile in a new tab.">View on Companies House</a>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}