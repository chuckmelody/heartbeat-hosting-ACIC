import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Cookie Policy");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-cookie-bite fa-fw"></i> Cookie Policy</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <p><strong>Last Updated: 01 October 2025</strong></p>
                        <p>This Cookie Policy explains how Heatbeat A CIC ("we", "us", and "our") uses cookies and similar technologies to recognise you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>

                        <h3 class="content-subheader">1. What Are Cookies?</h3>
                        <p>A cookie is a small text file that is placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information. They allow the website to recognise your device and remember some information about your preferences or past actions.</p>
                        <p>Cookies set by the website owner (in this case, Heatbeat A CIC) are called <strong data-tooltip="Cookies created and stored by the website you are visiting directly.">"first-party cookies"</strong>. Cookies set by parties other than the website owner are called <strong data-tooltip="Cookies created by domains other than the one you are visiting, often used for tracking and advertising.">"third-party cookies"</strong>. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., analytics, advertising, and interactive content).</p>

                        <h3 class="content-subheader">2. Why We Use Cookies</h3>
                        <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our online properties. Third parties serve cookies through our website for analytics and other purposes. This is described in more detail below.</p>

                        <h3 class="content-subheader">3. Types of Cookies We Use</h3>
                        <p>The specific types of first and third-party cookies served through our website and the purposes they perform are described below:</p>
                        <ul>
                            <li>
                                <strong>Strictly Necessary Cookies:</strong> These cookies are essential to provide you with services available through our website and to enable you to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website to you, you cannot refuse them without impacting how our website functions.
                            </li>
                            <li>
                                <strong>Performance and Analytics Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are. We use Google Analytics for this purpose. The information gathered does not identify any individual visitor and is completely anonymous.
                            </li>
                            <li>
                                <strong>Functionality Cookies:</strong> These are used to recognise you when you return to our website. This enables us to personalise our content for you and remember your preferences (for example, your choice of language or region), but are non-essential to the performance of the website.
                            </li>
                        </ul>

                        <h3 class="content-subheader">4. How Can You Control Cookies?</h3>
                        <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by setting or amending your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas may be restricted.</p>
                        <p>As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information. Below are links to the support pages for the most common browsers:</p>
                        <ul>
                            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" data-tooltip="Opens in a new tab">Google Chrome</a></li>
                            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" data-tooltip="Opens in a new tab">Mozilla Firefox</a></li>
                            <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" data-tooltip="Opens in a new tab">Apple Safari</a></li>
                            <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" data-tooltip="Opens in a new tab">Microsoft Edge</a></li>
                        </ul>

                        <h3 class="content-subheader">5. Changes to This Cookie Policy</h3>
                        <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>

                        <h3 class="content-subheader">6. Where Can You Get Further Information?</h3>
                        <p>If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:info@heartbeatacic.org">info@heartbeatacic.org</a>.</p>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}