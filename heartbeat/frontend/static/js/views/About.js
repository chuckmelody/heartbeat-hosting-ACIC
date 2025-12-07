import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("About Us");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-circle-info fa-fw"></i> About Us</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <h3 class="content-subheader">Our Mission: A Commitment to Community</h3>
                        <p>Established in 2020, Heatbeat A CIC is a non-profit Community Interest Company dedicated to fostering positive change and reducing violence within our communities. We exist to benefit the community, not private shareholders. Governed by a legal 'asset lock', we guarantee that all our resources, profits, and efforts are reinvested directly into our social objectives. Our core mission is to provide support, mentorship, and structured opportunities for young people and at-risk individuals, offering them a constructive alternative to crime and a clear pathway to a better future.</p>

                        <h3 class="content-subheader">Our Founder: Junior Anderson, BEM</h3>
                        <p>The driving force behind Heatbeat A CIC is our founder and director, Junior Anderson, a distinguished figure whose life has been dedicated to public service. As a retired Police Officer formerly with the Gangs Unit, Junior witnessed firsthand the complex challenges facing young people and the critical need for early intervention. His career was defined by a commitment to building trust and creating dialogue, working not just to enforce the law, but to understand and address the root causes of violence and disenfranchisement.</p>
                        <p>This experience on the front lines of community safety is complemented by a lifetime of dedication to martial arts. As a 7th Dan Black Belt in Karate, a World and European Karate Federation International Referee, and the Head Coach at Chikara Martial Arts, Junior has spent decades instilling the core values of discipline, respect, and self-control in his students. He has seen how the structured environment of martial arts can transform lives, build confidence, and provide a powerful sense of purpose.</p>
                        <p>In recognition of his profound and lasting impact, Junior was awarded the prestigious **British Empire Medal (BEM)** in the **2021 Queen's Birthday Honours** for his "services to the community in Northamptonshire." This award is a testament to his unwavering dedication to helping others.</p>

                        <h3 class="content-subheader">Our Philosophy: The Heatbeat Approach</h3>
                        <p>Heatbeat A CIC was born from the fusion of these two worlds: the strategic insight of a seasoned police officer and the formative discipline of a master martial artist. We believe that every individual has the potential for greatness, but that potential must be nurtured in a supportive and structured environment. Our approach is built on several key pillars:</p>
                        <ul>
                            <li><strong>Prevention over Cure:</strong> We focus on proactive, early intervention strategies to guide young people away from negative influences before they take root.</li>
                            <li><strong>Discipline and Respect:</strong> Through martial arts and structured mentorship, we teach the fundamental principles of self-respect and respect for others, which are essential for personal growth and community cohesion.</li>
                            <li><strong>Building Bridges:</strong> We work to bridge the gap between community members and authorities, fostering mutual understanding and collaboration to create safer neighbourhoods for everyone.</li>
                            <li><strong>Empowerment Through Opportunity:</strong> By organizing community events, workshops, and projects, we provide tangible opportunities for individuals to learn new skills, build networks, and become active, positive contributors to society.</li>
                        </ul>

                        <h3 class="content-subheader">A Social Enterprise with a Clear Purpose</h3>
                        <p>As a Community Interest Company, our structure is our promise. Every donation, every partnership, and every hour of volunteer work directly fuels our mission. We are transparent, accountable, and wholly committed to the well-being of the communities we serve. From our base of operations at the Chikara Martial Arts centre in Northampton, we are creating a legacy of positive impact, one life at a time. Our slogan is our commitment: "Help us to help another."</p>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}