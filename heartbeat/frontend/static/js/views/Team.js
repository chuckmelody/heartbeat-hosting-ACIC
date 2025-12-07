import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Our Team");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-users fa-fw"></i> Our Team</h2>
            <div class="two-column-grid">
                <div class="main-content">
                    <div class="content-card">
                        <p>Meet the dedicated individuals who drive our mission forward.</p>
                        <div class="team-grid">
                            <article class="team-member-card">
                                <h3>Junior Anderson BEM</h3>
                                <p class="title">Founder & Director</p>
                                <ul>
                                    <li>Retired Police Officer from the Gangs Unit</li>
                                    <li>Martial Arts Coach & International Referee</li>
                                    <li>Community Events Organiser</li>
                                </ul>
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
                            </article>
                        </div>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }
}