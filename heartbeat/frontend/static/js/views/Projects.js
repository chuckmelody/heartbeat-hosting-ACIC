import AbstractView from "./AbstractView.js";
import ShareManager from "../managers/ShareManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Our Work");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-briefcase fa-fw"></i> Our Core Projects</h2>
            <div class="content-card" style="margin-bottom: 2rem; text-align: center;">
                <p>Our work is rooted in direct, impactful action within the community. We design and execute projects aimed at providing structured support, fostering discipline, and creating positive pathways for young people. These are the pillars of our mission to build a safer, more cohesive society.</p>
            </div>

            <div class="projects-grid">
                <!-- Project Card: Martial Arts Training (NEW) -->
                <div class="project-card"
                     data-project-title="Martial Arts Training Program"
                     data-project-description="Our core program offering traditional martial arts training to instill discipline, confidence, and respect in a structured and safe environment.">
                    <div class="project-card-image" style="background-image: url('https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=2070&auto=format&fit=crop')"></div>
                    <div class="project-card-content">
                        <h3>Martial Arts Training Program</h3>
                        <p>Our core program offering traditional martial arts training to instill discipline, confidence, and respect in a structured and safe environment. Led by experienced coaches, this program is the foundation of our community work.</p>
                        <div class="project-card-focus">
                            <strong>Key Focus:</strong>
                            <div class="focus-tags-and-share">
                                <div class="focus-tags">
                                    <span>Karate</span>
                                    <span>Self-Defence</span>
                                    <span>Fitness</span>
                                </div>
                                <button class="project-share-btn" data-tooltip="Share this project"><i class="fa-solid fa-share-alt"></i> Share</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Card 2: Discipline through Sport (MOVED TO TOP) -->
                <div class="project-card"
                     data-project-title="Discipline Through Sport Initiative"
                     data-project-description="Leveraging the principles of martial arts, this initiative teaches young people the values of discipline, respect, and self-control.">
                    <div class="project-card-image" style="background-image: url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2070&q=80')"></div>
                    <div class="project-card-content">
                        <h3>Discipline Through Sport Initiative</h3>
                        <p>Leveraging the principles of martial arts, this initiative teaches young people the values of discipline, respect, and self-control. Led by our founder, Junior Anderson BEM, these sessions provide a structured and positive outlet for energy and emotion.</p>
                        <div class="project-card-focus">
                            <strong>Key Focus:</strong>
                            <div class="focus-tags-and-share">
                                <div class="focus-tags">
                                    <span>Discipline</span>
                                    <span>Respect</span>
                                    <span>Self-Control</span>
                                </div>
                                <button class="project-share-btn" data-tooltip="Share this project"><i class="fa-solid fa-share-alt"></i> Share</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Card 1: Mentorship -->
                <div class="project-card" 
                     data-project-title="Youth Mentorship Program" 
                     data-project-description="Pairing experienced community leaders and professionals with at-risk young people to provide guidance, support, and a positive role model.">
                    <div class="project-card-image" style="background-image: url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070')"></div>
                    <div class="project-card-content">
                        <h3>Youth Mentorship Program</h3>
                        <p>Pairing experienced community leaders and professionals with at-risk young people to provide guidance, support, and a positive role model. This program is designed to build confidence, improve life skills, and open doors to new opportunities.</p>
                        <div class="project-card-focus">
                            <strong>Key Focus:</strong>
                            <div class="focus-tags-and-share">
                                <div class="focus-tags">
                                    <span>Guidance</span>
                                    <span>Confidence</span>
                                    <span>Opportunity</span>
                                </div>
                                <button class="project-share-btn" data-tooltip="Share this project"><i class="fa-solid fa-share-alt"></i> Share</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Card 3: Community Safety -->
                <div class="project-card"
                     data-project-title="Community Safety Workshops"
                     data-project-description="In collaboration with local authorities, we run workshops that bridge the gap between the community and police.">
                    <div class="project-card-image" style="background-image: url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070')"></div>
                    <div class="project-card-content">
                        <h3>Community Safety Workshops</h3>
                        <p>In collaboration with local authorities, we run workshops that bridge the gap between the community and police. These sessions focus on de-escalation, mutual understanding, and proactive strategies to reduce violence and build safer neighbourhoods for everyone.</p>
                        <div class="project-card-focus">
                            <strong>Key Focus:</strong>
                            <div class="focus-tags-and-share">
                                <div class="focus-tags">
                                    <span>Prevention</span>
                                    <span>Dialogue</span>
                                    <span>Collaboration</span>
                                </div>
                                <button class="project-share-btn" data-tooltip="Share this project"><i class="fa-solid fa-share-alt"></i> Share</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Card 4: Anti-Bullying -->
                <div class="project-card"
                     data-project-title="Anti-Bullying Self-Defence Program"
                     data-project-description="A proactive program teaching children and teenagers practical self-defence techniques in a safe, controlled environment, focusing on building confidence and de-escalation skills.">
                    <div class="project-card-image" style="background-image: url('https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?q=80&w=2070&auto=format&fit=crop')"></div>
                    <div class="project-card-content">
                        <h3>Anti-Bullying Self-Defence Program</h3>
                        <p>A proactive program teaching children and teenagers practical self-defence techniques in a safe, controlled environment. Our goal is not to promote fighting, but to build the confidence needed to stand up to bullying and the skills to de-escalate conflict.</p>
                        <div class="project-card-focus">
                            <strong>Key Focus:</strong>
                            <div class="focus-tags-and-share">
                                <div class="focus-tags">
                                    <span>Confidence</span>
                                    <span>De-escalation</span>
                                    <span>Awareness</span>
                                </div>
                                <button class="project-share-btn" data-tooltip="Share this project"><i class="fa-solid fa-share-alt"></i> Share</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Card 5: Digital Skills -->
                <div class="project-card"
                     data-project-title="Digital Skills & Employability Hub"
                     data-project-description="Providing young adults with essential digital literacy and coding skills to prepare them for the modern workforce and bridge the technology gap.">
                    <div class="project-card-image" style="background-image: url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070')"></div>
                    <div class="project-card-content">
                        <h3>Digital Skills & Employability Hub</h3>
                        <p>Our hub provides free workshops on coding, graphic design, and digital marketing. We aim to equip young adults with the practical, in-demand skills needed to secure employment and thrive in a technology-driven world.</p>
                        <div class="project-card-focus">
                            <strong>Key Focus:</strong>
                            <div class="focus-tags-and-share">
                                <div class="focus-tags">
                                    <span>Employability</span>
                                    <span>Technology</span>
                                    <span>Skills Training</span>
                                </div>
                                <button class="project-share-btn" data-tooltip="Share this project"><i class="fa-solid fa-share-alt"></i> Share</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Project Card 6: Mental Health -->
                <div class="project-card"
                     data-project-title="Mental Health & Resilience Initiative"
                     data-project-description="A support network offering workshops and one-on-one sessions focused on mental well-being, stress management, and building emotional resilience.">
                    <div class="project-card-image" style="background-image: url('https://images.unsplash.com/photo-1579487785973-74d2ca7abdd5?q=80&w=2070')"></div>
                    <div class="project-card-content">
                        <h3>Mental Health & Resilience Initiative</h3>
                        <p>In partnership with certified counsellors, this initiative provides a safe space for young people to discuss mental health. We focus on building coping mechanisms, emotional resilience, and reducing the stigma around seeking help.</p>
                        <div class="project-card-focus">
                            <strong>Key Focus:</strong>
                            <div class="focus-tags-and-share">
                                <div class="focus-tags">
                                    <span>Well-being</span>
                                    <span>Support</span>
                                    <span>Resilience</span>
                                </div>
                                <button class="project-share-btn" data-tooltip="Share this project"><i class="fa-solid fa-share-alt"></i> Share</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    async after_render() {
        const shareManager = new ShareManager();
        const projectGrid = document.querySelector('.projects-grid');

        projectGrid.addEventListener('click', (e) => {
            const shareButton = e.target.closest('.project-share-btn');
            if (shareButton) {
                const card = shareButton.closest('.project-card');
                const title = card.dataset.projectTitle;
                const description = card.dataset.projectDescription;
                shareManager.share({
                    title: `${title} - A Heartbeat A CIC Project`,
                    text: description,
                    url: window.location.href // Shares the URL of the "Our Work" page
                });
            }
        });
    }
}