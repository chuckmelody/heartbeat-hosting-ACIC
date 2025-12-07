import AbstractView from "./AbstractView.js";
import PostManager from "../managers/PostManager.js";
import ModalManager from "../managers/ModalManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("My Profile");
    }

    // Helper function to render the sales table body
    renderSalesTable(sales) {
        if (!sales || sales.length === 0) {
            return `<tr><td colspan="6" style="text-align: center;">No sales data available.</td></tr>`;
        }
        return sales.map(sale => `
            <tr>
                <td>${sale.date}</td>
                <td>${sale.product}</td>
                <td>£${sale.saleAmount.toFixed(2)}</td>
                <td>£${sale.totalCommission.toFixed(2)}</td>
                <td><strong>£${sale.yourEarnings.toFixed(2)}</strong></td>
                <td><span class="status-${sale.status.toLowerCase()}">${sale.status}</span></td>
            </tr>
        `).join('');
    }

    async getHtml() {
        // --- Mock Data & Calculations ---
        const mockSales = [
            { date: '2025-10-28', product: 'Boxing Gloves - 16oz', saleAmount: 44.99, totalCommission: 3.60, yourEarnings: 3.24, status: 'Cleared' },
            { date: '2025-10-26', product: 'Karate Gi - 10oz', saleAmount: 59.99, totalCommission: 4.80, yourEarnings: 4.32, status: 'Cleared' },
            { date: '2025-10-22', product: 'Focus Mitts - Curved', saleAmount: 35.00, totalCommission: 2.80, yourEarnings: 2.52, status: 'Pending' },
            { date: '2025-10-15', product: 'BJJ Gi - Lightweight', saleAmount: 89.99, totalCommission: 7.20, yourEarnings: 6.48, status: 'Returned' },
            { date: '2025-09-30', product: 'Shin Guards', saleAmount: 49.99, totalCommission: 4.00, yourEarnings: 3.60, status: 'Cleared' },
        ];

        // In a real app, this would come from the backend
        const lifetimeEarnings = 1245.50;
        const totalPaidOut = 1100.00;
        // For testing, we'll calculate a balance that allows payout
        const currentBalance = 145.50; // Hardcoded for demonstration

        const isPayoutAvailable = currentBalance >= 50;

        return `
            <div class="profile-header">
                <div class="profile-cover"></div>
                <div class="profile-details">
                    <div class="profile-picture"></div>
                    <div class="profile-info">
                        <h2>Junior Anderson BEM</h2>
                        <span>@junior.a</span>
                    </div>
                </div>
                <nav class="profile-nav">
                    <div class="profile-tab is-active" data-tab="posts">Posts</div>
                    <div class="profile-tab" data-tab="about">About</div>
                    <div class="profile-tab" data-tab="accounts">Accounts</div>
                    <div class="profile-tab" data-tab="history">History</div>
                </nav>
            </div>

            <div class="profile-content-grid">
                <div class="left-sidebar">
                    <div class="content-card">
                        <h3 class="content-subheader" style="margin-top: 0;"><i class="fa-solid fa-circle-info fa-fw"></i> Intro</h3>
                        <p>Founder & Director of Heatbeat A CIC. Retired Police Officer and Martial Arts Coach dedicated to community empowerment.</p>
                    </div>
                </div>

                <div class="main-content">
                    <!-- Posts Tab Panel -->
                    <div id="posts-panel" class="profile-tab-panel is-active">
                        <div class="content-card create-post-card" id="create-post-trigger">
                            <div class="create-post-avatar"></div>
                            <div class="create-post-input">What's on your mind, Junior?</div>
                        </div>
                        <div class="post-feed" id="profile-post-feed" style="margin-top: 2rem;">
                            <!-- User's posts will be rendered here -->
                        </div>
                    </div>

                    <!-- About Tab Panel -->
                    <div id="about-panel" class="profile-tab-panel">
                        <div class="content-card">
                            <h3 class="content-subheader" style="margin-top: 0;">About Junior Anderson</h3>
                            <p>The driving force behind Heatbeat A CIC is our founder and director, Junior Anderson, a distinguished figure whose life has been dedicated to public service. As a retired Police Officer formerly with the Gangs Unit, Junior witnessed firsthand the complex challenges facing young people and the critical need for early intervention.</p>
                            <p>In recognition of his profound and lasting impact, Junior was awarded the prestigious British Empire Medal (BEM) in the 2021 Queen's Birthday Honours for his "services to the community in Northamptonshire."</p>
                        </div>
                    </div>

                    <!-- Accounts Tab Panel -->
                    <div id="accounts-panel" class="profile-tab-panel">
                        <div class="content-card">
                            <h3 class="content-subheader" style="margin-top: 0;"><i class="fa-solid fa-sack-dollar fa-fw"></i> Your Earnings</h3>
                            <p>This dashboard shows the affiliate earnings generated by your website. Payouts are processed monthly for balances over £50.</p>
                            
                            <!-- Summary Cards -->
                            <div class="accounts-summary-grid">
                                <div class="summary-card">
                                    <i class="fa-solid fa-coins"></i>
                                    <span>Lifetime Earnings</span>
                                    <strong>£${lifetimeEarnings.toFixed(2)}</strong>
                                </div>
                                <div class="summary-card">
                                    <i class="fa-solid fa-hand-holding-dollar"></i>
                                    <span>Total Paid Out</span>
                                    <strong>£${totalPaidOut.toFixed(2)}</strong>
                                </div>
                                <div class="summary-card">
                                    <i class="fa-solid fa-wallet"></i>
                                    <span>Current Balance</span>
                                    <strong class="current-balance">£${currentBalance.toFixed(2)}</strong>
                                </div>
                            </div>

                            <!-- Recent Sales Table -->
                            <h4 class="content-subheader">Recent Sales</h4>
                            <div class="accounts-table-container">
                                <table class="accounts-table">
                                    <thead>
                                        <tr>
                                            <th data-sort="date" class="sortable">Date <i class="fa-solid fa-sort"></i></th>
                                            <th>Product</th>
                                            <th data-sort="saleAmount" class="sortable">Sale Amount <i class="fa-solid fa-sort"></i></th>
                                            <th>Commission</th>
                                            <th data-sort="yourEarnings" class="sortable">Your Earnings (90%) <i class="fa-solid fa-sort"></i></th>
                                            <th data-sort="status" class="sortable">Status <i class="fa-solid fa-sort"></i></th>
                                        </tr>
                                    </thead>
                                    <tbody id="sales-table-body">
                                        ${this.renderSalesTable(mockSales)}
                                    </tbody>
                                </table>
                            </div>
                            <button id="request-payout-btn" class="form-button" style="margin-top: 1.5rem;" ${!isPayoutAvailable ? 'disabled' : ''} data-tooltip="${!isPayoutAvailable ? 'Your balance must be over £50 to request a payout.' : 'Request a payout to your registered bank account.'}">Request Payout</button>
                        </div>
                    </div>

                    <!-- History Tab Panel -->
                    <div id="history-panel" class="profile-tab-panel">
                        <div class="content-card">
                            <h3 class="content-subheader" style="margin-top: 0;">Activity History</h3>
                            <p>This section will show your recent activity, such as donations made, events registered for, and posts you've liked. (Backend required)</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async after_render() {
        const modalManager = new ModalManager();

        // --- Mock Data for Sorting ---
        let mockSales = [
            { date: '2025-10-28', product: 'Boxing Gloves - 16oz', saleAmount: 44.99, totalCommission: 3.60, yourEarnings: 3.24, status: 'Cleared' },
            { date: '2025-10-26', product: 'Karate Gi - 10oz', saleAmount: 59.99, totalCommission: 4.80, yourEarnings: 4.32, status: 'Cleared' },
            { date: '2025-10-22', product: 'Focus Mitts - Curved', saleAmount: 35.00, totalCommission: 2.80, yourEarnings: 2.52, status: 'Pending' },
            { date: '2025-10-15', product: 'BJJ Gi - Lightweight', saleAmount: 89.99, totalCommission: 7.20, yourEarnings: 6.48, status: 'Returned' },
            { date: '2025-09-30', product: 'Shin Guards', saleAmount: 49.99, totalCommission: 4.00, yourEarnings: 3.60, status: 'Cleared' },
        ];
        let currentSort = { key: 'date', direction: 'desc' };

        const salesTableBody = document.getElementById('sales-table-body');
        const sortableHeaders = document.querySelectorAll('.accounts-table th.sortable');

        // Tab switching logic
        const tabs = document.querySelectorAll('.profile-tab');
        const panels = document.querySelectorAll('.profile-tab-panel');

        // Initialize Post Manager for the profile feed
        new PostManager('profile-post-feed');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all tabs and panels
                tabs.forEach(t => t.classList.remove('is-active'));
                panels.forEach(p => p.classList.remove('is-active'));

                // Activate the clicked tab and corresponding panel
                tab.classList.add('is-active');
                const panelId = `${tab.dataset.tab}-panel`;
                document.getElementById(panelId).classList.add('is-active');
            });
        });

        // --- Payout Modal Logic ---
        document.getElementById('request-payout-btn').addEventListener('click', () => {
            const balance = document.querySelector('.current-balance').textContent;
            modalManager.showHardConfirmModal({
                title: 'Confirm Payout Request',
                message: `You are about to request a payout of <strong>${balance}</strong> to your registered bank account. This action cannot be undone.`,
                confirmText: 'Confirm Request',
                onConfirm: () => {
                    console.log('Payout requested for', balance);
                    modalManager.showInfoModal('Request Submitted', `Your payout request for ${balance} has been submitted. You will receive a confirmation email shortly.`);
                }
            });
        });

        // --- Table Sorting Logic ---
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortKey = header.dataset.sort;
                const isAsc = currentSort.key === sortKey && currentSort.direction === 'asc';
                currentSort.direction = isAsc ? 'desc' : 'asc';
                currentSort.key = sortKey;

                // Sort the data
                mockSales.sort((a, b) => {
                    const valA = a[sortKey];
                    const valB = b[sortKey];
                    let comparison = 0;
                    if (valA > valB) {
                        comparison = 1;
                    } else if (valA < valB) {
                        comparison = -1;
                    }
                    return currentSort.direction === 'asc' ? comparison : comparison * -1;
                });

                // Update UI
                salesTableBody.innerHTML = this.renderSalesTable(mockSales);
                updateHeaderIcons();
            });
        });

        const updateHeaderIcons = () => {
            sortableHeaders.forEach(header => {
                const icon = header.querySelector('i');
                if (header.dataset.sort === currentSort.key) {
                    icon.className = `fa-solid fa-sort-${currentSort.direction}`;
                } else {
                    icon.className = 'fa-solid fa-sort';
                }
            });
        };

        // Create Post Modal Logic
        document.getElementById('create-post-trigger').addEventListener('click', () => {
            modalManager.showCreatePostModal((postData) => {
                // This is where you would send the data to the backend
                console.log('New post created (frontend simulation):', postData);
                // For now, we can just show an info modal
                modalManager.showInfoModal('Post Created', 'Your new post has been successfully created.');
            });
        });
    }
}