import AbstractView from "./AbstractView.js";
import DonateManager from "../managers/DonateManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Donate");
    }

    async getHtml() {
        return `
            <h2 class="page-title"><i class="fa-solid fa-hand-holding-heart fa-fw"></i> Support Our Mission</h2>
            <div class="donate-container">
                <div class="content-card donation-form">
                    <h3 class="content-subheader">Make a One-Time Donation</h3>
                    <p>Your contribution, no matter the size, provides essential funding for our workshops, mentorship programs, and community outreach efforts. Help us to help another.</p>
                    
                    <div class="amount-selector">
                        <label>Choose an amount</label>
                        <div class="amount-buttons">
                            <button class="amount-btn" data-amount="5">£5</button>
                            <button class="amount-btn" data-amount="10">£10</button>
                            <button class="amount-btn is-selected" data-amount="25">£25</button>
                            <button class="amount-btn" data-amount="50">£50</button>
                        </div>
                        <div class="custom-amount-input">
                            <span>£</span>
                            <input type="number" id="custom-amount" placeholder="Or enter a custom amount">
                        </div>
                    </div>

                    <div class="donation-summary">
                        <div class="summary-row">
                            <span>Your Donation</span>
                            <span id="summary-donation">£25.00</span>
                        </div>
                        <div class="summary-row">
                            <span>WaffleMedia Portal Fee</span>
                            <span id="summary-fee">£2.00</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total</span>
                            <span id="summary-total">£27.00</span>
                        </div>
                    </div>
                    <p class="fee-info">Heatbeat A CIC uses the WaffleMedia payment portal, backed by Stripe, which includes a £2 transaction fee to cover processing costs.</p>
                    <button id="donate-btn" class="form-button" style="width: 100%; margin-top: 1.5rem;" data-tooltip="Proceed to secure payment">Donate Now</button>
                </div>
                <div class="content-card live-counter-card">
                    <i class="fa-solid fa-hand-holding-heart"></i>
                    <h3>Total Donations Received</h3>
                    <div id="donation-count" class="donation-count">0</div>
                    <p class="donation-count-label">Thank you for your incredible support!</p>
                </div>
            </div>

            <div class="content-card thank-you-card">
                <h3>From the bottom of our hearts, thank you.</h3>
                <p>Every single donation, no matter the size, is a powerful investment in our community's future. It allows us to continue our vital work—providing mentorship, fostering discipline through martial arts, and creating safe spaces for young people to thrive.</p>
                <p>You are not just giving money; you are giving hope, opportunity, and a chance for a better path. Your generosity directly fuels our mission to "help us to help another."</p>
            </div>
        `;
    }

    async after_render() {
        new DonateManager();
    }
}