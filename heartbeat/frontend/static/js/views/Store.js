import AbstractView from "./AbstractView.js";
import RightSidebar from "./_RightSidebar.js";
import ShareManager from "../managers/ShareManager.js";
import DropdownManager from "../managers/DropdownManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Store");
        this.products = [];
        this.filteredProducts = [];
        this.displayedProducts = [];
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.currentView = 'grid'; // 'grid' or 'list'
        this.currentSort = 'name-asc'; // Default sort
    }

    async getHtml() {
        try {
            const response = await fetch('/static/data/products.json');
            if (!response.ok) throw new Error("Network response was not ok");
            this.products = await response.json();
            this.filteredProducts = [...this.products];
            this.displayedProducts = this.filteredProducts.slice(0, this.itemsPerPage);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            return `<div class="main-content"><h2 class="page-title">Error Loading Store</h2><p>Could not fetch product data. Please try again later.</p></div>`;
        }

        const categories = ["All Categories", ...new Set(this.products.map(p => p.category))];

        return `
            
                <div class="main-content store-page-content">
                    <div class="store-header">
                        <h2 class="page-title"><i class="fa-solid fa-store fa-fw"></i> Affiliate Store</h2>
                        <div class="store-filters">
                            <div class="filter-group-left">
                                <div class="search-bar">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                    <input type="text" id="product-search" placeholder="Search products...">
                                </div>
                            </div>
                            <div class="filter-group-right">
                                <div class="custom-dropdown" id="category-filter" data-tooltip="Filter by Category">
                                    <div class="dropdown-selected">
                                        <span>All Categories</span>
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </div>
                                    <div class="dropdown-options">
                                        <ul>
                                            ${categories.map(cat => `<li data-value="${cat}">${cat}</li>`).join('')}
                                        </ul>
                                    </div>
                                    <input type="hidden" id="category-value" value="All Categories">
                                </div>
                                <div class="custom-dropdown" id="sort-filter" data-tooltip="Sort Products">
                                    <div class="dropdown-selected">
                                        <span><i class="fa-solid fa-arrow-up-a-z fa-fw"></i> Asc</span>
                                        <i class="fa-solid fa-chevron-down"></i>
                                    </div>
                                    <div class="dropdown-options">
                                        <ul>
                                            <li data-value="name-asc"><i class="fa-solid fa-arrow-up-a-z fa-fw"></i> Asc</li>
                                            <li data-value="name-desc"><i class="fa-solid fa-arrow-down-z-a fa-fw"></i> Desc</li>
                                        </ul>
                                    </div>
                                    <input type="hidden" id="sort-value" value="name-asc">
                                </div>
                                <div class="view-toggle">
                                    <button id="grid-view-btn" class="view-btn is-active" data-tooltip="Grid View"><i class="fa-solid fa-grip"></i></button>
                                    <button id="list-view-btn" class="view-btn" data-tooltip="List View"><i class="fa-solid fa-list"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="product-container" class="product-grid">
                        ${this.renderProducts()}
                    </div>
                    <div class="load-more-container">
                        <button id="load-more-btn" class="form-button">Load More</button>
                    </div>
                </div>
            
        `;
    }

    async after_render() {
        // Initialize dropdowns
        this.shareManager = new ShareManager();
        this.categoryDropdown = new DropdownManager('category-filter', () => {
            this.filterAndRender();
        });

        this.sortDropdown = new DropdownManager('sort-filter', (selectedValue) => {
            this.currentSort = selectedValue;
            console.log(`Sorting products by: ${selectedValue}`); // Log the sort action
            this.filterAndRender();
        });

        this.searchInput = document.getElementById('product-search');
        this.productContainer = document.getElementById('product-container');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.gridViewBtn = document.getElementById('grid-view-btn');
        this.listViewBtn = document.getElementById('list-view-btn');

        this.searchInput.addEventListener('input', () => this.filterAndRender());
        this.loadMoreBtn.addEventListener('click', () => this.loadMore());
        this.gridViewBtn.addEventListener('click', () => this.setView('grid'));
        this.listViewBtn.addEventListener('click', () => this.setView('list'));

        this.updateLoadMoreButton();
        this._attachCardEventListeners();
    }

    _attachCardEventListeners() {
        this.productContainer.addEventListener('click', e => {
            const shareButton = e.target.closest('.share-btn-card');
            if (shareButton) {
                e.preventDefault(); // Prevent link navigation if inside an <a> tag
                const card = shareButton.closest('[data-product-id]');
                const productId = card.dataset.productId;
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    this.shareManager.share({ title: product.name, text: product.description, url: new URL(`/store/${product.id}`, window.location.origin).href });
                }
            }
        });
    }

    filterAndRender() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const selectedCategory = document.getElementById('category-value').value;

        this.filteredProducts = this.products.filter(product => {
            const nameMatch = product.name.toLowerCase().includes(searchTerm);
            const descMatch = product.description.toLowerCase().includes(searchTerm);
            const categoryMatch = selectedCategory === 'All Categories' || product.category === selectedCategory;
            return (nameMatch || descMatch) && categoryMatch;
        });

        this.sortProducts();

        this.currentPage = 1;
        this.displayedProducts = this.filteredProducts.slice(0, this.itemsPerPage);
        this.productContainer.innerHTML = this.renderProducts();
        this.updateLoadMoreButton();
        this._attachCardEventListeners(); // Re-attach listeners for new content
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            if (this.currentSort === 'name-asc') {
                return a.name.localeCompare(b.name);
            } else if (this.currentSort === 'name-desc') {
                return b.name.localeCompare(a.name);
            }
            return 0;
        });
    }

    loadMore() {
        this.currentPage++;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const newProducts = this.filteredProducts.slice(startIndex, endIndex);
        this.displayedProducts.push(...newProducts);
        this.productContainer.insertAdjacentHTML('beforeend', this.renderProducts(newProducts));
        this._attachCardEventListeners(); // Re-attach for newly loaded items
        this.updateLoadMoreButton();
    }

    updateLoadMoreButton() {
        if (this.displayedProducts.length >= this.filteredProducts.length) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'inline-block';
        }
    }

    setView(view) {
        this.currentView = view;
        if (view === 'grid') {
            this.productContainer.classList.remove('store-list');
            this.productContainer.classList.add('product-grid');
            this.gridViewBtn.classList.add('is-active');
            this.listViewBtn.classList.remove('is-active');
        } else {
            this.productContainer.classList.remove('product-grid');
            this.productContainer.classList.add('store-list');
            this.listViewBtn.classList.add('is-active');
            this.gridViewBtn.classList.remove('is-active');
        }
        this.currentPage = 1;
        this.displayedProducts = this.filteredProducts.slice(0, this.itemsPerPage);
        this.productContainer.innerHTML = this.renderProducts();
        this.updateLoadMoreButton();
        this._attachCardEventListeners(); // Re-attach for new view
    }

    renderProducts(productsToRender = this.displayedProducts) {
        if (productsToRender.length === 0) {
            return `<p class="no-results">No products found matching your criteria.</p>`;
        }

        if (this.currentView === 'grid') {
            return productsToRender.map(product => {
                if (!product || !product.images || product.images.length === 0) return '';

                // Generate star rating HTML
                let reviewsHtml = '';
                if (product.customerReviews) {
                    const fullStars = Math.floor(product.customerReviews.starRating);
                    const halfStar = product.customerReviews.starRating % 1 >= 0.5 ? 1 : 0;
                    const emptyStars = 5 - fullStars - halfStar;
                    reviewsHtml = `
                        <div class="product-card-reviews">
                            <div class="stars">
                                ${'<i class="fa-solid fa-star"></i>'.repeat(fullStars)}
                                ${halfStar ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                                ${'<i class="fa-regular fa-star"></i>'.repeat(emptyStars)}
                            </div>
                            <span class="review-count">(${product.customerReviews.count.toLocaleString()} ratings)</span>
                        </div>
                    `;
                }

                return `
                    <div class="product-card" data-product-id="${product.id}">
                        <div class="product-card-image-wrapper">
                            <a href="/store/${product.id}" class="product-card-main-link" data-link>
                                <img src="${product.images[0]}" alt="${product.name}" class="product-card-image" loading="lazy">
                            </a>
                            <div class="product-card-icon-actions">
                                <a href="${product.amazonLink}" target="_blank" rel="noopener noreferrer" class="icon-action-btn amazon-icon-btn" data-tooltip="Buy on Amazon">
                                    <i class="fa-solid fa-shopping-cart"></i>
                                </a>
                                <button class="icon-action-btn share-btn-card" data-tooltip="Share Product">
                                    <i class="fa-solid fa-share-alt"></i>
                                </button>
                            </div>
                        </div>
                        <div class="product-card-content">
                            <span class="product-card-brand">${product.brand}</span>
                            <h4 class="product-card-title">${product.name}</h4>
                            ${reviewsHtml}
                            <div class="product-card-price">${product.price}</div>
                        </div>
                    </div>
                `;
            }).join('');
        } else { // List view
            return productsToRender.map(product => {
                if (!product || !product.images || product.images.length === 0) return '';

                // Generate star rating HTML (re-used from grid view)
                let reviewsHtml = '';
                if (product.customerReviews) {
                    const fullStars = Math.floor(product.customerReviews.starRating);
                    const halfStar = product.customerReviews.starRating % 1 >= 0.5 ? 1 : 0;
                    const emptyStars = 5 - fullStars - halfStar;
                    reviewsHtml = `
                        <div class="product-card-reviews">
                            <div class="stars">
                                ${'<i class="fa-solid fa-star"></i>'.repeat(fullStars)}
                                ${halfStar ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                                ${'<i class="fa-regular fa-star"></i>'.repeat(emptyStars)}
                            </div>
                            <span class="review-count">(${product.customerReviews.count.toLocaleString()} ratings)</span>
                        </div>
                    `;
                }

                return `
                    <div class="product-list-item" data-product-id="${product.id}">
                        <div class="product-list-image-wrapper">
                            <a href="/store/${product.id}" class="product-card-main-link" data-link>
                                <img src="${product.images[0]}" alt="${product.name}" class="product-list-image" loading="lazy">
                            </a>
                        </div>
                        <div class="product-list-content">
                            <span class="product-card-brand">${product.brand}</span>
                            <h4 class="product-card-title">${product.name}</h4>
                            ${reviewsHtml}
                            <div class="product-card-price">${product.price}</div>
                        </div>
                        <div class="product-list-actions">
                            <a href="${product.amazonLink}" target="_blank" rel="noopener noreferrer" class="icon-action-btn amazon-icon-btn" data-tooltip="Buy on Amazon">
                                <i class="fa-solid fa-shopping-cart"></i>
                            </a>
                            <button class="icon-action-btn share-btn-card" data-tooltip="Share Product">
                                <i class="fa-solid fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}