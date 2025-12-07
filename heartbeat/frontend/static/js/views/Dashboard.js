import AbstractView from "./AbstractView.js";
import AuthManager from "../managers/AuthManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
    }

    async getHtml() {
        const authManager = new AuthManager();
        const isLoggedIn = authManager.isLoggedIn();

        return `
            <h2 class="page-title"><i class="fa-solid fa-gauge fa-fw"></i> Dashboard</h2>
            <div class="content-card" style="margin-bottom: 2rem;">
                <h2><i class="fa-solid fa-circle-info fa-fw"></i> What is a Community Interest Company (CIC)?</h2>
                <p>A Community Interest Company (CIC) is a special type of limited company which exists to benefit the community rather than private shareholders. To be registered as a CIC, a company must demonstrate to the Regulator of Community Interest Companies that its primary purpose is to serve the community.</p>
                <p>CICs are defined by their 'asset lock'—a legal promise to ensure that assets and profits are used for their stated community purposes. This provides a clear assurance to stakeholders that the company is committed to its social mission, making it a trusted and transparent vehicle for social enterprise in the United Kingdom.</p>
            </div>

            <!-- Our Services Section -->
            <section class="service-ad-section">
                <div class="service-ad-container">
                    <!-- Service Card 1: Project Consulting -->
                    <div class="service-ad-card">
                        <div class="service-ad-image">
                            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070"
                                alt="Team collaborating on a project" loading="lazy" />
                        </div>
                        <div class="service-ad-content">
                            <h4>Community Project Consulting</h4>
                            <p>Leverage our expertise to bring your community initiatives to life. We offer
                                end-to-end guidance, from planning and funding to execution and impact assessment,
                                ensuring your project succeeds.</p>
                            <a href="/contact" data-link class="form-button service-ad-button">
                                <i class="fa-solid fa-rocket fa-fw"></i><span>Launch Your Project</span>
                            </a>
                        </div>
                    </div>
                    <!-- Service Card 2: Youth Mentorship -->
                    <div class="service-ad-card">
                        <div class="service-ad-image">
                            <img src="/static/img/junior1.jpg" alt="Youth mentorship session" loading="lazy" />
                        </div>
                        <div class="service-ad-content">
                            <h4>Youth Mentorship Programs</h4>
                            <p>Our mentorship programs connect young individuals with experienced leaders to foster
                                personal growth, discipline, and confidence. Empower the next generation to achieve
                                their full potential.</p>
                            <a href="/volunteer" data-link class="form-button service-ad-button">
                                <i class="fa-solid fa-user-group fa-fw"></i><span>Become a Mentor</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            
            <section class="cta-section">
                <div class="cta-card">
                    <div class="cta-content">
                        <h3>Join Our Community</h3>
                        <p>Create an account to manage your profile, track contributions, and stay connected with our mission.</p>
                        <div class="cta-buttons">
                            <a href="/login" class="header-cta-button secondary" data-link>
                                <i class="fa-solid fa-right-to-bracket fa-fw"></i><span>Sign In</span>
                            </a>
                            <a href="/register" class="header-cta-button" data-link>
                                <i class="fa-solid fa-user-plus fa-fw"></i><span>Sign Up</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            

            <div class="content-card" style="margin-bottom: 2rem;">
                <h2><i class="fa-solid fa-user-check fa-fw"></i> Our Founder</h2>
                <div class="team-grid" style="margin-top: 2rem;">
                    <article class="team-member-card">
                        <h3>Junior Anderson BEM</h3>
                        <p class="title">The Community Initiative to Reduce Violence Team</p>
                        <ul>
                            <li>Retired Police Officer from the Gangs Unit</li>
                            <li>Martial Arts Coach & International Referee</li>
                            <li>Community Events Organiser</li>
                        </ul>
                        <div class="team-card-actions">
                            <a href="/about" class="card-action-button" data-link><i class="fa-solid fa-arrow-right fa-fw"></i> More</a>
                        </div>
                    </article>
                    <article class="team-member-card">
                        <h3>Martial Arts & Accolades</h3>
                        <p class="title">A Lifetime of Dedication to Karate</p>
                        <ul>
                            <li>Awarded the British Empire Medal (BEM)</li>
                            <li>7th Dan Black Belt in Karate</li>
                            <li>World & European Karate Federation Referee</li>
                            <li>Head Coach at Chikara Martial Arts</li>
                        </ul>
                        <div class="team-card-actions">
                            <a href="/projects" class="card-action-button" data-link><i class="fa-solid fa-arrow-right fa-fw"></i> More</a>
                        </div>
                    </article>
                </div>
            </div>

            <!-- Additional Services Section -->
            <section class="service-ad-section">
                <div class="service-ad-container">
                    <!-- Service Card 3: Discipline Through Sport -->
                    <div class="service-ad-card">
                        <div class="service-ad-image">
                            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2070&q=80"
                                alt="Person training in a gym" loading="lazy" />
                        </div>
                        <div class="service-ad-content">
                            <h4>Discipline Through Sport</h4>
                            <p>Our initiative, led by founder Junior Anderson BEM, uses martial arts to teach
                                discipline, respect, and self-control, providing a positive outlet for young people.</p>
                            <a href="/projects" data-link class="form-button service-ad-button">
                                <i class="fa-solid fa-briefcase fa-fw"></i><span>View Projects</span>
                            </a>
                        </div>
                    </div>
                    <!-- Service Card 4: Community Safety Workshops -->
                    <div class="service-ad-card">
                        <div class="service-ad-image">
                            <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070" alt="Community event or workshop" loading="lazy" />
                        </div>
                        <div class="service-ad-content">
                            <h4>Community Safety Workshops</h4>
                            <p>We collaborate with local authorities to run workshops that bridge the gap between the
                                community and police, focusing on dialogue and proactive violence reduction strategies.</p>
                            <a href="/events" data-link class="form-button service-ad-button">
                                <i class="fa-solid fa-calendar-days fa-fw"></i><span>See Events</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}
