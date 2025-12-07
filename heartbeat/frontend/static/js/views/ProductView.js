import AbstractView from "./AbstractView.js";
import ShareManager from "../managers/ShareManager.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.productId = params.id;
        this.setTitle("Product Details");
    }

    async getHtml() {
        console.log(`[DEBUG] 1. getHtml() started for product ID: ${this.productId}`);
        // Fetch products (mock data for now)
        let products = [];
        try {
            const response = await fetch('/static/data/products.json');
            products = await response.json();
        } catch (error) {
            console.error("Failed to fetch products:", error);
            console.log(`[DEBUG] 1a. FAILED to fetch products.json.`);
            return `<h2 class="page-title">Error loading product details.</h2>`;
        }

        const product = products.find(p => p.id === this.productId);
        console.log(`[DEBUG] 2. Searching for product... Found:`, product ? product : 'NOT FOUND');

        if (!product) {
            return `<h2 class="page-title">Product Not Found</h2>`;
        }

        // --- Build All Dynamic Components Conditionally ---

        // Check if we have the detailed Amazon API structure
        const hasDetailedInfo = product.ItemInfo && product.Images;

        // Determine correct data source
        const title = product.name;
        const brand = product.brand;
        const description = product.description; // Use the simple description for now
        const amazonLink = product.amazonLink;

        // 1. Image Gallery - Handles both simple and detailed structures
        let mainImage;
        let thumbnailImages = '';
        if (hasDetailedInfo) {
            mainImage = product.Images.Primary.Large.URL;
            if (product.Images.Variants && product.Images.Variants.length > 0) {
                thumbnailImages = product.Images.Variants.map(variant => 
                    `<div class="thumbnail-image" style="background-image: url('${variant.Large.URL}')" data-image-url="${variant.Large.URL}"></div>`
                ).join('');
            }
        } else {
            mainImage = product.images && product.images.length > 0 ? product.images[0] : '';
            // FIX: Generate thumbnails for ALL available images, not just if there's more than one.
            if (product.images && product.images.length > 0) {
                thumbnailImages = product.images.map(img =>
                    `<div class="thumbnail-image" style="background-image: url('${img}')" data-image-url="${img}"></div>`
                ).join('');
            }
        }
        console.log(`[DEBUG] 3. Main image URL determined: ${mainImage}`);
        console.log(`[DEBUG] 4. Thumbnail HTML generated (length): ${thumbnailImages.length}`);

        // 2. Customer Reviews - Only shows if data exists
        let reviewsHtml = '';
        if (product.customerReviews) {
            const fullStars = Math.floor(product.customerReviews.starRating);
            const halfStar = product.customerReviews.starRating % 1 >= 0.5 ? 1 : 0;
            const emptyStars = 5 - fullStars - halfStar;
            reviewsHtml = `
                <div class="customer-reviews" data-tooltip="${product.customerReviews.starRating} out of 5 stars">
                    <div class="stars">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(fullStars)}
                        ${halfStar ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                        ${'<i class="fa-regular fa-star"></i>'.repeat(emptyStars)}
                    </div>
                    <span class="review-count">(${product.customerReviews.count.toLocaleString()} ratings)</span>
                </div>
            `;
        }

        // 3. Variations - Only shows if data exists
        let variationsHtml = '';
        if (product.variationSummary && product.variationSummary.dimensions) {
            variationsHtml = `
                <div class="product-variations">
                    <h4 class="product-section-title"><i class="fa-solid fa-tags fa-fw"></i> Available Options</h4>
                    <p>This product may be available in other options (e.g., ${product.variationSummary.dimensions.join(', ')}) on Amazon.</p>
                </div>
            `;
        }

        // 4. Detailed "About this item" list - Only shows if data exists
        let detailedFeaturesHtml = '';
        if (product.detailedFeatures && product.detailedFeatures.length > 0) {
            detailedFeaturesHtml = `
                <div class="content-card">
                    <h3 class="content-subheader">About This Item</h3>
                    <ul class="detailed-features-list">
                        ${product.detailedFeatures.map(feature => {
                            // Improved logic to handle bold text and colon
                            const match = feature.match(/\*\*(.*?):\*\*\s*(.*)/s);
                            if (match) {
                                const boldPart = match[1];
                                const restPart = match[2];
                                return `<li><strong>${boldPart}:</strong> ${restPart}</li>`;
                            } else {
                                return `<li>${feature}</li>`; // Fallback if no colon
                            }
                        }).join('')}
                    </ul>
                </div>
            `;
        }

        // 4b. Key Features List (for top section)
        let keyFeaturesHtml = '';
        if (product.features && product.features.length > 0) {
            keyFeaturesHtml = `
                <div class="product-key-features">
                    <ul class="key-features-list">${product.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
                </div>
            `;
        }

        // 5. "More Like This" Section - Fetches related products
        let moreLikeThisHtml = '';
        // Find products in the same category, exclude the current one, and take up to 5.
        const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5); 
        if (relatedProducts.length > 0) {
            moreLikeThisHtml = `
                <div class="more-like-this-container content-card">
                    <h3 class="content-subheader">More Like This</h3>
                    <div class="product-grid">
                        ${relatedProducts.map(relatedProduct => {
                            let reviewsHtml = '';
                            if (relatedProduct.customerReviews) {
                                const fullStars = Math.floor(relatedProduct.customerReviews.starRating);
                                const halfStar = relatedProduct.customerReviews.starRating % 1 >= 0.5 ? 1 : 0;
                                const emptyStars = 5 - fullStars - halfStar;
                                reviewsHtml = `
                                    <div class="product-card-reviews">
                                        <div class="stars">
                                            ${'<i class="fa-solid fa-star"></i>'.repeat(fullStars)}
                                            ${halfStar ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
                                            ${'<i class="fa-regular fa-star"></i>'.repeat(emptyStars)}
                                        </div>
                                        <span class="review-count">(${relatedProduct.customerReviews.count.toLocaleString()} ratings)</span>
                                    </div>
                                `;
                            }
                            return `
                                <div class="product-card" data-product-id="${relatedProduct.id}">
                                    <div class="product-card-image-wrapper">
                                        <a href="/store/${relatedProduct.id}" class="product-card-main-link" data-link>
                                            <img src="${relatedProduct.images[0]}" alt="${relatedProduct.name}" class="product-card-image" loading="lazy">
                                        </a>
                                        <div class="product-card-icon-actions">
                                            <a href="${relatedProduct.amazonLink}" target="_blank" rel="noopener noreferrer" class="icon-action-btn amazon-icon-btn" data-tooltip="Buy on Amazon"><i class="fa-solid fa-shopping-cart"></i></a>
                                            <button class="icon-action-btn share-btn-card" data-tooltip="Share Product"><i class="fa-solid fa-share-alt"></i></button>
                                        </div>
                                    </div>
                                    <div class="product-card-content">
                                        <span class="product-card-brand">${relatedProduct.brand}</span>
                                        <h4 class="product-card-title">${relatedProduct.name}</h4>
                                        ${reviewsHtml}
                                        <div class="product-card-price">${relatedProduct.price}</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        console.log(`[DEBUG] 5. Returning final HTML for router.`);
        return `
            <div class="event-view-header">
                <h2 class="page-title"><i class="fa-solid fa-box-open fa-fw"></i> ${title}</h2>
                <div class="event-view-nav">
                    <a href="/store" class="form-button secondary back-to-store-btn" data-link><i class="fa-solid fa-arrow-left fa-fw"></i> All Products</a>
                </div>
            </div>
            <div class="two-column-grid product-view-layout">
                <div class="main-content">
                    <div class="content-card" id="product-gallery-card">
                        <div class="product-gallery">
                            <div class="main-product-image" style="background-image: url('${mainImage}')"></div>
                            ${thumbnailImages ? `<div class="thumbnail-grid">${thumbnailImages}</div>` : ''}
                        </div>
                    </div>
                    <!-- "About this item" section moved here, into its own card -->
                    ${detailedFeaturesHtml}
                </div>
                <div class="right-sidebar">
                    <div class="content-card">
                        <div class="product-detail-info">
                            <span class="brand">${brand}</span>
                            <h1 class="product-title-main">${title}</h1>
                            ${reviewsHtml}
                            <hr class="product-divider">
                            ${product.price ? `<p class="product-price">${product.price}</p>` : ''}
                            ${product.availability ? `<p class="product-availability">${product.availability}</p>` : ''}
                            
                            <!-- Key Features moved into sidebar -->
                            ${keyFeaturesHtml}
                            
                            <div class="price-update-info">
                                <p class="price-disclaimer">Price accurate as of ${new Date(product.lastUpdated).toLocaleString()}.</p>
                            </div>
                            <div class="main-action-row">
                                <a href="${amazonLink}" target="_blank" rel="noopener noreferrer" class="form-button amazon-button">
                                    <i class="fa-solid fa-shopping-cart fa-fw"></i> Buy on Amazon
                                </a>
                                <button class="icon-action-btn share-btn" data-tooltip="Share this product">
                                    <i class="fa-solid fa-share-alt"></i>
                                </button>
                            </div>
                            <div class="sidebar-button-row">
                                <button class="form-button secondary add-to-list-btn">
                                    <i class="fa-solid fa-plus fa-fw"></i> Add to List
                                </button>
                                <button class="form-button secondary refresh-price-btn" data-tooltip="This is a placeholder. Real-time price refresh requires backend integration.">
                                    <i class="fa-solid fa-arrows-rotate fa-fw"></i> Refresh Price
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-view-bottom-section">
                ${product.productDetails ? `
                    <div class="product-details-section-container">
                        <h3 class="content-subheader">Product Information</h3>
                        <div class="content-card product-details-card" style="background-image: url('${product.images[1] || mainImage}')">
                            <div class="card-content-overlay">
                                <h4 class="product-section-title">${product.name}</h4>
                            <div class="product-details-content-grid">
                                <ul class="product-details-list">
                                    ${Object.entries(product.productDetails).map(([key, value]) => {
                                        const detailIcons = {
                                            itemWeight: 'fa-weight-hanging',
                                            manufacturer: 'fa-industry',
                                            material: 'fa-shirt',
                                            closureType: 'fa-circle-nodes',
                                            ageRange: 'fa-child-reaching',
                                            dimensions: 'fa-ruler-combined',
                                            length: 'fa-ruler-horizontal'
                                        };
                                        const iconClass = detailIcons[key] || 'fa-circle-dot'; // Default icon
                                        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                        return `
                                            <li>
                                                <i class="fa-solid ${iconClass} fa-fw"></i>
                                                <span><strong>${formattedKey}:</strong> ${value}</span>
                                            </li>
                                        `;
                                    }).join('')}
                                </ul>
                                <p class="product-details-description">${product.description}</p>
                            </div>
                            ${variationsHtml}
                            <div class="card-branding-footer">
                                <img src="/static/img/meta/favicon-48x48.png" alt="Heartbeat A CIC Logo">
                                <span>Presented by Heartbeat A CIC</span>
                            </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                <!-- "More Like This" section -->
                ${moreLikeThisHtml}
            </div>
        `;
    }

    async after_render() {
        super.after_render();
        console.log(`[DEBUG] 6. after_render() started.`);

        // --- Simplified Image Gallery Logic (from EventView) ---
        const mainImageContainer = document.querySelector('.main-product-image');
        const thumbnails = document.querySelectorAll('.thumbnail-image');

        console.log(`[DEBUG] 7. Searching for gallery elements in the DOM.`);
        console.log(`[DEBUG] -> Found main image container:`, mainImageContainer ? 'Yes' : 'No');
        console.log(`[DEBUG] -> Found thumbnails: ${thumbnails.length}`);

        if (mainImageContainer) {
            // Thumbnail click logic
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const newImageUrl = thumb.dataset.imageUrl;
                    console.log(`[DEBUG] Thumbnail clicked. New URL: ${newImageUrl}. Starting CSS transition.`);

                    // Prevent changing if the same image is clicked
                    if (mainImageContainer.style.backgroundImage.includes(newImageUrl)) {
                        return;
                    }

                    // Set the new image on the ::before pseudo-element for the fade
                    mainImageContainer.style.setProperty('--new-image-url', `url(${newImageUrl})`);
                    mainImageContainer.classList.add('is-fading');

                    // After the fade completes, update the main background and reset
                    mainImageContainer.addEventListener('transitionend', () => {
                        mainImageContainer.style.backgroundImage = `url('${newImageUrl}')`;
                        mainImageContainer.classList.remove('is-fading');
                        mainImageContainer.style.removeProperty('--new-image-url');
                        console.log(`[DEBUG] CSS transition complete.`);
                    }, { once: true }); // Use { once: true } to auto-remove the listener

                    thumbnails.forEach(t => t.classList.remove('is-active'));
                    thumb.classList.add('is-active');
                });
            });
            if (thumbnails.length > 0) {
                console.log(`[DEBUG] 8. Setting first thumbnail as active.`);
                thumbnails[0].classList.add('is-active');
            }
        }
        console.log(`[DEBUG] 9. after_render() finished.`);

        // --- Share Button Logic ---
        const shareManager = new ShareManager();
        const shareBtn = document.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                const response = await fetch('/static/data/products.json');
                const products = await response.json();
                const product = products.find(p => p.id === this.productId);
                if (product) {
                    shareManager.share({ title: product.name, text: product.description, url: window.location.href });
                }
            });
        }
    }
}