import ModalManager from "./ModalManager.js";

export default class DonateManager {
    constructor() {
        this.modalManager = new ModalManager();

        // Donation form elements
        this.amountButtons = document.querySelectorAll('.amount-btn');
        this.customAmountInput = document.getElementById('custom-amount');
        this.donationAmountEl = document.getElementById('summary-donation');
        this.feeAmountEl = document.getElementById('summary-fee');
        this.totalAmountEl = document.getElementById('summary-total');
        this.donateBtn = document.getElementById('donate-btn');

        // Live counter elements
        this.donationCountEl = document.getElementById('donation-count');

        this.donationAmount = 25.00;
        this.transactionFee = 2.00;
        this.totalDonations = 1342; // Starting mock value

        this._init();
    }

    _init() {
        this._updateSummary();
        this._initAmountButtons();
        this._initCustomInput();
        this._initDonateButton();
        this._initLiveCounter();
    }

    _updateSummary() {
        const total = this.donationAmount + this.transactionFee;
        this.donationAmountEl.textContent = `£${this.donationAmount.toFixed(2)}`;
        this.feeAmountEl.textContent = `£${this.transactionFee.toFixed(2)}`;
        this.totalAmountEl.textContent = `£${total.toFixed(2)}`;
    }

    _initAmountButtons() {
        this.amountButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.amountButtons.forEach(btn => btn.classList.remove('is-selected'));
                button.classList.add('is-selected');
                this.donationAmount = parseFloat(button.dataset.amount);
                this.customAmountInput.value = '';
                this._updateSummary();
            });
        });
    }

    _initCustomInput() {
        this.customAmountInput.addEventListener('input', () => {
            this.amountButtons.forEach(btn => btn.classList.remove('is-selected'));
            const value = parseFloat(this.customAmountInput.value);
            this.donationAmount = isNaN(value) || value < 1 ? 1.00 : value;
            this._updateSummary();
        });
    }

    _initDonateButton() {
        this.donateBtn.addEventListener('click', () => {
            this._simulatePayment();
        });
    }

    _simulatePayment() {
        const total = this.donationAmount + this.transactionFee;
        this.modalManager.showFormModal({
            title: 'WaffleMedia Secure Checkout',
            fields: [
                { id: 'name', label: 'Name on Card', type: 'text' },
                { id: 'email', label: 'Email for Receipt', type: 'email' },
                { id: 'card', label: 'Card Number', type: 'text', value: '**** **** **** 4242' },
            ],
            onSave: (data) => {
                // Simulate a successful payment
                this.totalDonations++;
                this.donationCountEl.textContent = this.totalDonations;

                this.modalManager.showInfoModal(
                    'Donation Successful!',
                    `Thank you for your generous donation of £${total.toFixed(2)}. A receipt has been sent to ${data.email}. Your contribution makes a real difference.`
                );
            }
        });
    }

    _initLiveCounter() {
        // Set initial value
        this.donationCountEl.textContent = this.totalDonations;

        // Simulate Socket.IO: randomly increment the counter to give a "live" feel
        setInterval(() => {
            const shouldIncrement = Math.random() > 0.7; // 30% chance to increment
            if (shouldIncrement) {
                this.totalDonations++;
                this.donationCountEl.textContent = this.totalDonations;
                this._showLiveUpdateToast();
            }
        }, Math.random() * (15000 - 5000) + 5000); // Every 5-15 seconds
    }

    _showLiveUpdateToast() {
        let toast = document.querySelector('.donation-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'donation-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="fa-solid fa-heart"></i> Someone just donated!`;
        toast.classList.add('is-visible');

        setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 4000);
    }
}