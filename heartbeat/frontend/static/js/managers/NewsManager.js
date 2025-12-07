// frontend/static/js/managers/NewsManager.js
import ModalManager from "./ModalManager.js";
import ArticleManager from "./ArticleManager.js";

const FILTER_CONFIG = [
    { key: "all", label: "All Stories", icon: "fa-solid fa-layer-group" },
    { key: "heartbeat", label: "Heartbeat", icon: "fa-solid fa-heart" },
    { key: "community", label: "Community", icon: "fa-solid fa-people-group" },
    { key: "justice", label: "Justice & Safety", icon: "fa-solid fa-scale-balanced" },
    { key: "sound", label: "Sound Systems", icon: "fa-solid fa-record-vinyl" },
    { key: "food", label: "Food & Recipes", icon: "fa-solid fa-utensils" },
    { key: "martial", label: "Martial Arts", icon: "fa-solid fa-hand-fist" },
    { key: "youth", label: "Youth & Mentors", icon: "fa-solid fa-children" },
    { key: "wellbeing", label: "Wellbeing", icon: "fa-solid fa-leaf" },
    { key: "opportunity", label: "Opportunities", icon: "fa-solid fa-lightbulb" },
    { key: "events", label: "Events & Culture", icon: "fa-solid fa-calendar-days" },
    { key: "local", label: "Local Stories", icon: "fa-solid fa-location-dot" },
    { key: "wiki", label: "Wiki Insight", icon: "fa-brands fa-wikipedia-w" },
];

const normalizeField = (value) =>
    (value || "")
        .toString()
        .toLowerCase();

const collectArticleFields = (article) => ({
    category: normalizeField(article.category),
    section: normalizeField(article.section),
    mood: normalizeField(article.mood),
    source: normalizeField(article.source),
    content: normalizeField(article.content),
    headline: normalizeField(article.headline),
});

const includesKeyword = (fields, keywords = []) =>
    keywords.some((keyword) => {
        const needle = keyword.toLowerCase();
        return (
            fields.category.includes(needle) ||
            fields.section.includes(needle) ||
            fields.content.includes(needle) ||
            fields.headline.includes(needle)
        );
    });

const FILTER_PREDICATES = {
    heartbeat: (fields, article) =>
        fields.source === "house" ||
        includesKeyword(fields, ["heartbeat", "the waffle", "ad block"]),
    sound: (fields) =>
        includesKeyword(fields, ["sound", "dub", "reggae", "music", "notting hill", "sound system"]),
    food: (fields) =>
        includesKeyword(fields, ["recipe", "food", "cooking", "kitchen", "jerk", "plantain", "callaloo", "rice"]),
    martial: (fields) =>
        includesKeyword(fields, ["martial", "kickboxing", "muay", "jiu-jitsu", "karate", "discipline", "self-defence"]),
    local: (fields) =>
        includesKeyword(fields, ["local", "northampton", "midlands", "uk", "community & courage"]),
    community: (fields) =>
        includesKeyword(fields, ["community", "neighbourhood", "courage", "bridge", "heartbeat"]),
    justice: (fields) =>
        includesKeyword(fields, ["justice", "violence", "safety", "police", "b.e.m", "restorative"]),
    youth: (fields) =>
        includesKeyword(fields, ["youth", "young", "mentor", "school", "academy", "club", "kids"]),
    wellbeing: (fields) =>
        includesKeyword(fields, ["wellbeing", "wellness", "health", "mental", "nutrition", "recipe"]),
    opportunity: (fields) =>
        includesKeyword(fields, ["opportunity", "programme", "training", "funding", "business", "advertise"]),
    events: (fields) =>
        includesKeyword(fields, ["event", "festival", "carnival", "sound system culture", "gala", "showcase"]),
    wiki: (fields) => fields.source === "wikipedia",
};

// House content – your own stories on top of wiki content
let houseArticles = [
    {
        id: "house-1",
        type: "lead-story",
        category: "Heartbeat A CIC",
        section: "Front Page",
        mood: "breaking", // breaking | happy | community | serious | feature
        headline: "Junior Anderson BEM: Bridging the Gap Between Street and System",
        byline: "By Heartbeat Staff | Today",
        content:
            "Drawing on experience in both martial arts and front-line policing, Junior Anderson BEM leads Heartbeat A CIC in building safer, more connected communities.",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
        source: "house",
    },
    {
        id: "house-2",
        type: "ad-block",
        section: "Ad Space",
        mood: "feature",
        headline: "Advertise in The Waffle",
        content:
            "Click here now – showcase your local business to our readers from just £25 a week.",
        cta: {
            text: "Find Out More",
            link: "/contact",
        },
        source: "house",
    },
];

// Cache article for the single-article page
const cacheArticleForDetail = (article) => {
    try {
        sessionStorage.setItem(
            `waffle-article-${article.id}`,
            JSON.stringify(article)
        );
    } catch (_) {
        // ignore quota errors etc.
    }
};

// Simple helper for daily variation (rotate list by day-of-year)
const rotateDaily = (articles) => {
    if (!articles || !articles.length) return [];
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const shift = dayOfYear % articles.length;
    return [...articles.slice(shift), ...articles.slice(0, shift)];
};

export default class NewsManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.modalManager = new ModalManager();
        this.articleManager = new ArticleManager();
        this.allArticles = [];
        this.currentPool = []; // only items we’re willing to show
        this.currentPageIndex = 0;

        // number of slots per “page” – denser layout (≥9 cards when available)
        this.pageSize = 12;

        this.init();
    }

    async init() {
        try {
            const wikiArticlesRaw = await this.articleManager.loadFrontPageArticles();

            // Daily rotation of wiki content so today feels different
            const wikiArticles = rotateDaily(wikiArticlesRaw);

            // Merge wiki + house content
            this.allArticles = [...wikiArticles, ...houseArticles];

            this.paginateAndRender();
        } catch (error) {
            console.error(
                "Failed to load wiki articles, falling back to house content",
                error
            );
            this.allArticles = [...houseArticles];
            this.paginateAndRender();
        }
    }

    /**
     * Only show articles with images (plus ad-block),
     * and always fill the page with up to pageSize items.
     */
    paginateAndRender() {
        // pool = only items with an image OR ad-block
        const pool = this.allArticles.filter(
            (a) => a.type === "ad-block" || !!a.image
        );

        this.currentPool = pool;

        const total = pool.length;

        if (!total) {
            this.render([]);
            return;
        }

        const pageArticles = [];
        const pageSize = Math.min(this.pageSize, total);

        for (let i = 0; i < pageSize; i++) {
            const idx = (this.currentPageIndex * this.pageSize + i) % total;
            pageArticles.push(pool[idx]);
        }

        this.render(pageArticles);
    }

    render(pageArticles) {
        const total = this.currentPool.length || 0;
        const totalPages = Math.max(1, Math.ceil(total / this.pageSize));
        const showPrev = totalPages > 1;
        const showNext = totalPages > 1;
        const dateLabel = new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        const filterButtonsMarkup = FILTER_CONFIG.map((filter) => {
            const isActive = filter.key === "all" ? "active" : "";
            return `
                <button type="button" class="glass-nav-button waffle-filter-btn ${isActive}" data-waffle-filter="${filter.key}">
                    <i class="${filter.icon}"></i>
                    <span>${filter.label}</span>
                </button>
            `;
        }).join("");

        const heroArticle = this._selectHeroArticle(pageArticles);
        const remainingArticles = heroArticle
            ? pageArticles.filter((article) => article.id !== heroArticle.id)
            : pageArticles;
        const bulletinItems = this._createBulletins(remainingArticles);

        this.container.innerHTML = `
            <div class="waffle-masthead">
                <div class="waffle-masthead-left">
                    <span class="waffle-masthead-label">The Waffle</span>
                    <span class="waffle-masthead-tagline">Community, Courage &amp; Sound System Culture</span>
                </div>
                <div class="waffle-masthead-right">
                    <span class="waffle-masthead-date">${new Date().toLocaleDateString()}</span>
                    <span class="waffle-masthead-edition">Edition ${this.currentPageIndex + 1}</span>
                </div>
            </div>

            <div class="waffle-filter-bar">
                <div class="waffle-filter-scroller">
                    ${filterButtonsMarkup}
                </div>

                <div class="waffle-sort">
                    <label for="waffle-sort-select">Sort:</label>
                    <select id="waffle-sort-select">
                        <option value="default">Default mix</option>
                        <option value="headline-asc">Headline A–Z</option>
                        <option value="headline-desc">Headline Z–A</option>
                        <option value="source">Source (House → Wiki)</option>
                    </select>
                </div>
            </div>

            <div class="waffle-redtop">
                <div class="waffle-redtop-flag">Heartbeat A CIC</div>
                <div class="waffle-redtop-name">NEWS</div>
                <div class="waffle-redtop-date">${dateLabel}</div>
            </div>

            ${
                heroArticle
                    ? `
                <section class="waffle-hero-wrap">
                    ${this._createHeroArticle(heroArticle)}
                    ${bulletinItems}
                </section>
            `
                    : ""
            }

            <div class="news-grid waffle-news-grid">
                ${remainingArticles
                    .map((article, index) => this._createArticleHTML(article, index))
                    .join("")}
            </div>

            <div class="waffle-pagination">
                ${
                    showPrev
                        ? `<button class="waffle-page-btn" data-waffle-action="prev"><i class="fa-solid fa-chevron-left"></i> Previous Page</button>`
                        : ""
                }
                ${
                    showNext
                        ? `<button class="waffle-page-btn primary" data-waffle-action="next">Turn Page <i class="fa-solid fa-book-open"></i></button>`
                        : ""
                }
            </div>
        `;

        this._attachEventListeners();
    }

    /**
     * Render a single article card.
     * - Only called for items with an image (or ad-block).
     * - Adds:
     *   - section chip (Page 3, Local, Sound System, etc.)
     *   - mood ribbon (Breaking, Happy, Community, Serious, Feature)
     *   - clickable headline + Full story button
     */
    _createArticleHTML(article, index = 0) {
        // --- Mood ribbon mapping ---
        const mood = article.mood || "community";
        const moodLabelMap = {
            breaking: "Breaking",
            happy: "Happy News",
            community: "Community",
            serious: "In Depth",
            feature: "Feature",
        };
        const moodLabel = moodLabelMap[mood] || "Community";
        const moodRibbonHtml = `
            <span class="waffle-mood-ribbon waffle-mood-${mood}">
                ${moodLabel}
            </span>
        `;

        // --- Section chip (e.g. Page 3, Local, Sound System, Sports) ---
        const sectionLabel = article.section || "";
        const sectionChipHtml = sectionLabel
            ? `<span class="waffle-section-chip">${sectionLabel}</span>`
            : "";

        const layoutClass = this._getCardLayoutClass(index);

        if (article.type === "ad-block") {
            // ad-block can stay even without image
            return `
                <article class="news-article waffle-article ad-block ${layoutClass}" data-id="${article.id}">
                    <div class="article-options">
                        <button class="article-options-btn" data-tooltip="Options">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                    </div>
                    ${sectionChipHtml}
                    ${moodRibbonHtml}
                    <h4 class="waffle-article-ad-title">${article.headline}</h4>
                    <p class="waffle-article-ad-body">${article.content}</p>
                    ${
                        article.cta
                            ? `<a href="${article.cta.link}" class="form-button" data-link>${article.cta.text}</a>`
                            : ""
                    }
                </article>
            `;
        }

        // If somehow this is called and no image, drop it (safety)
        if (!article.image) {
            return "";
        }

        // Clean headline so no <span class="mw-page-title-main"> etc
        const cleanHeadline = (article.headline || "").replace(/<\/?[^>]+(>|$)/g, "");

        // Real image from Wikipedia / house
        const imageHtml = `
            <div class="news-article-image waffle-article-image"
                 style="background-image: url('${article.image}');">
            </div>
        `;

        const sourceBadge =
            article.source === "wikipedia"
                ? `<span class="waffle-source-badge"><span class="badge-icon"><i class="fa-brands fa-wikipedia-w"></i></span><span class="badge-text">Insight</span></span>`
                : `<span class="waffle-source-badge waffle-source-badge--house"><span class="badge-icon"><i class="fa-solid fa-house"></i></span><span class="badge-text">Heartbeat</span></span>`;

        // Cache for the detail page
        cacheArticleForDetail(article);

        const articleLink = `/news/${encodeURIComponent(article.id)}`;
        const formattedContent = this._formatParagraphs(article.content, {
            maxParagraphs: 2,
            sentencesPerParagraph: 2,
            appendEllipsis: true,
        });

        return `
            <article class="news-article waffle-article ${article.type} ${layoutClass}" data-id="${article.id}">
                <div class="article-options">
                    <button class="article-options-btn" data-tooltip="Options">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </div>
                ${sectionChipHtml}
                ${moodRibbonHtml}
                ${imageHtml}
                <div class="article-meta-row">
                    <div class="article-category">${article.category || "Insight"}</div>
                    ${sourceBadge}
                </div>
                <h3 class="article-headline">
                    <a href="${articleLink}" data-link class="waffle-article-headline-link">
                        ${cleanHeadline}
                    </a>
                </h3>
                <p class="article-byline">${article.byline || ""}</p>
                <div class="article-content article-content--teaser">
                    ${formattedContent || ""}
                    ${
                        article.url
                            ? `<p class="waffle-article-link"><a href="${article.url}" target="_blank" rel="noopener noreferrer">Read full article on Wikipedia</a></p>`
                            : ""
                    }
                </div>

                <a href="${articleLink}" data-link class="waffle-article-readmore-btn">
                    Full story <i class="fa-solid fa-arrow-right"></i>
                </a>
            </article>
        `;
    }

    _formatParagraphs(text = "", options = {}) {
        const {
            maxParagraphs = 2,
            sentencesPerParagraph = 3,
            appendEllipsis = false,
        } = options;
        const cleaned = (text || "").replace(/\s+/g, " ").trim();
        if (!cleaned) return "";

        let paragraphs = cleaned
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean);

        if (!paragraphs.length) {
            const sentences =
                cleaned.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()) || [];
            if (!sentences.length) {
                paragraphs = [cleaned];
            } else {
                const generated = [];
                let buffer = [];
                sentences.forEach((sentence) => {
                    if (!sentence) return;
                    buffer.push(sentence);
                    if (buffer.length >= sentencesPerParagraph) {
                        generated.push(buffer.join(" "));
                        buffer = [];
                    }
                });
                if (buffer.length) {
                    generated.push(buffer.join(" "));
                }
                paragraphs = generated.length ? generated : [cleaned];
            }
        }

        const truncated = paragraphs.length > maxParagraphs;
        const selected = paragraphs.slice(0, maxParagraphs);

        if (appendEllipsis && truncated && selected.length) {
            const lastIndex = selected.length - 1;
            selected[lastIndex] = `${selected[lastIndex]}&nbsp;&hellip;`;
        }

        return selected.map((p) => `<p>${p}</p>`).join("");
    }

    _attachEventListeners() {
        const grid = this.container.querySelector(".waffle-news-grid");
        const scroller = this.container.querySelector(".waffle-filter-scroller");
        this._initFilterScroller(scroller);

        // --- Filter buttons ---
        const filterButtons = this.container.querySelectorAll(".waffle-filter-btn");

        const applyFilterKey = (key) => {
            const base = this.currentPool.length ? this.currentPool : this.allArticles;
            if (key === "all") return base;
            const predicate = FILTER_PREDICATES[key];
            if (!predicate) return base;
            return base.filter((article) => predicate(collectArticleFields(article), article));
        };

        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const filterKey = btn.dataset.waffleFilter || "all";

                filterButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                let filtered = applyFilterKey(filterKey);

                // Only keep items with images (and ad-block)
                filtered = filtered.filter(
                    (a) => a.type === "ad-block" || !!a.image
                );

                if (!filtered.length) {
                    filtered = this.currentPool.length
                        ? this.currentPool
                        : this.allArticles.filter(
                              (a) => a.type === "ad-block" || !!a.image
                          );
                }

                this.currentPool = filtered;
                this.currentPageIndex = 0;
                const total = filtered.length;
                const pageSize = Math.min(this.pageSize, total);
                const pageArticles = [];

                for (let i = 0; i < pageSize; i++) {
                    const idx = (this.currentPageIndex * this.pageSize + i) % total;
                    pageArticles.push(filtered[idx]);
                }

                if (scroller) {
                    const target = btn.offsetLeft - scroller.offsetLeft - 48;
                    this._animateScroller(scroller, target);
                }

                this.render(pageArticles);
            });
        });

        // --- Sort select (local sort) ---
        const sortSelect = this.container.querySelector("#waffle-sort-select");
        if (sortSelect) {
            sortSelect.addEventListener("change", () => {
                const value = sortSelect.value;

                const cloned = [...this.allArticles];

                if (value === "headline-asc") {
                    cloned.sort((a, b) =>
                        (a.headline || "").localeCompare(b.headline || "")
                    );
                } else if (value === "headline-desc") {
                    cloned.sort((a, b) =>
                        (b.headline || "").localeCompare(a.headline || "")
                    );
                } else if (value === "source") {
                    // House stories first, then wiki
                    cloned.sort((a, b) => {
                        const sa = a.source === "house" ? 0 : 1;
                        const sb = b.source === "house" ? 0 : 1;
                        return sa - sb;
                    });
                } else {
                    // default mix – leave as originally loaded
                }

                this.allArticles = cloned;
                this.currentPageIndex = 0;
                this.paginateAndRender();
            });
        }

        // Article options
        this._attachArticleOptionListeners();

        // Page-turn buttons
        const pagination = this.container.querySelector(".waffle-pagination");
        if (!pagination) return;

        pagination.querySelectorAll(".waffle-page-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const action = e.currentTarget.dataset.waffleAction;
                if (!action) return;

                const total = this.currentPool.length || this.allArticles.length;
                const totalPages = Math.max(1, Math.ceil(total / this.pageSize));

                const goToPage = (direction) => {
                    if (direction === "next") {
                        this.currentPageIndex = (this.currentPageIndex + 1) % totalPages;
                    } else if (direction === "prev") {
                        this.currentPageIndex =
                            (this.currentPageIndex - 1 + totalPages) % totalPages;
                    }
                    this.paginateAndRender();
                };

                if (window.gsap && grid) {
                    window.gsap.to(grid, {
                        duration: 0.4,
                        rotationY: 15,
                        opacity: 0,
                        transformOrigin: "50% 50%",
                        onComplete: () => {
                            goToPage(action);
                            const newGrid =
                                this.container.querySelector(".waffle-news-grid");
                            if (newGrid && window.gsap) {
                                window.gsap.fromTo(
                                    newGrid,
                                    { rotationY: -15, opacity: 0 },
                                    { rotationY: 0, opacity: 1, duration: 0.4 }
                                );
                            }
                        },
                    });
                } else {
                    goToPage(action);
                }
            });
        });
    }

    _attachArticleOptionListeners() {
        this.container
            .querySelectorAll(".article-options-btn")
            .forEach((button) => {
                button.addEventListener("click", (e) => {
                    const articleEl = e.target.closest(".news-article");
                    const articleId = articleEl?.dataset.id;

                    const article = this.allArticles.find((a) => a.id === articleId);
                    if (!article) return;

                    if (article.source === "wikipedia") {
                        this.modalManager.showInfoModal(
                            "Wiki Article",
                            "Wiki-sourced articles are read-only. To change the mix, reload tomorrow's edition or edit the topic list in the gateway."
                        );
                        return;
                    }

                    this._showEditModal(article);
                });
            });
    }

    _showEditModal(article) {
        this.modalManager.showFormModal({
            title: "Edit House Article",
            fields: [
                { id: "headline", label: "Headline", value: article.headline },
                { id: "category", label: "Category", value: article.category },
                {
                    id: "section",
                    label: "Section label (e.g. Page 3, Local, Sound System)",
                    value: article.section || "",
                },
                { id: "content", label: "Content", value: article.content, type: "textarea" },
            ],
            onSave: (data) => {
                const index = this.allArticles.findIndex((a) => a.id === article.id);
                if (index !== -1) {
                    this.allArticles[index] = { ...this.allArticles[index], ...data };
                    this.paginateAndRender();
                }
            },
        });
    }

    showCreateModal() {
        this.modalManager.showFormModal({
            title: "Create House Article",
            fields: [
                { id: "headline", label: "Headline" },
                { id: "category", label: "Category" },
                {
                    id: "section",
                    label: "Section label (e.g. Front Page, Local, Sound System, Page 3)",
                },
                { id: "content", label: "Content", type: "textarea" },
            ],
            onSave: (data) => {
                const newArticle = {
                    id: `house-${Date.now()}`,
                    type: "secondary-story",
                    byline: "By Heartbeat Staff | Just now",
                    image: null,
                    source: "house",
                    mood: "community",
                    ...data,
                };
                this.allArticles.unshift(newArticle);
                this.currentPageIndex = 0;
                this.paginateAndRender();
            },
        });
    }

    _deleteArticle(articleId) {
        this.modalManager.showConfirmModal(
            "Delete Article",
            "Are you sure you want to permanently delete this article?",
            () => {
                this.allArticles = this.allArticles.filter((a) => a.id !== articleId);
                this.currentPageIndex = 0;
                this.paginateAndRender();
            }
        );
    }

    _initFilterScroller(scroller) {
        if (!scroller) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        const stopDrag = () => {
            isDown = false;
            scroller.classList.remove("is-scrolling");
        };

        scroller.addEventListener("mousedown", (event) => {
            isDown = true;
            scroller.classList.add("is-scrolling");
            startX = event.pageX - scroller.offsetLeft;
            scrollLeft = scroller.scrollLeft;
        });

        scroller.addEventListener("mouseleave", stopDrag);
        scroller.addEventListener("mouseup", stopDrag);
        scroller.addEventListener("mousemove", (event) => {
            if (!isDown) return;
            event.preventDefault();
            const x = event.pageX - scroller.offsetLeft;
            const walk = (x - startX) * 2;
            scroller.scrollLeft = scrollLeft - walk;
        });

        scroller.addEventListener(
            "wheel",
            (event) => {
                if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
                event.preventDefault();
                const target = scroller.scrollLeft + event.deltaY;
                this._animateScroller(scroller, target);
            },
            { passive: false }
        );
    }

    _animateScroller(scroller, target) {
        if (!scroller) return;
        const max = scroller.scrollWidth - scroller.clientWidth;
        const next = Math.max(0, Math.min(target, max));

        if (window.gsap && typeof window.gsap.to === "function") {
            const hasScrollTo =
                window.gsap.plugins && window.gsap.plugins.scrollTo;
            if (hasScrollTo) {
                window.gsap.to(scroller, {
                    duration: 0.5,
                    ease: "power2.out",
                    scrollTo: { x: next },
                });
            } else {
                window.gsap.to(scroller, {
                    duration: 0.5,
                    ease: "power2.out",
                    scrollLeft: next,
                });
            }
        } else {
            scroller.scrollTo({
                left: next,
                behavior: "smooth",
            });
        }
    }

    _selectHeroArticle(pageArticles) {
        if (!pageArticles || !pageArticles.length) return null;
        const withImage = pageArticles.find((article) => !!article.image);
        return withImage || pageArticles[0];
    }

    _createHeroArticle(article) {
        const headline = (article.headline || "").replace(/<\/?[^>]+(>|$)/g, "");
        const articleLink = `/news/${encodeURIComponent(article.id)}`;
        const excerptHtml = this._formatParagraphs(article.content, {
            maxParagraphs: 3,
            sentencesPerParagraph: 3,
            appendEllipsis: true,
        });
        const sourceBadge =
            article.source === "wikipedia"
                ? `<span class="hero-source hero-source--wiki"><i class="fa-brands fa-wikipedia-w"></i> Wiki insight</span>`
                : `<span class="hero-source hero-source--house"><i class="fa-solid fa-heart"></i> Heartbeat exclusive</span>`;

        return `
            <article class="waffle-hero" data-id="${article.id}">
                <div class="waffle-hero-image">
                    ${
                        article.image
                            ? `<img src="${article.image}" alt="${headline}" loading="lazy" />`
                            : ""
                    }
                </div>
                <div class="waffle-hero-body">
                    <div class="hero-kicker">${article.category || "Headline"}</div>
                    <h2 class="hero-headline">
                        <a href="${articleLink}" data-link>${headline}</a>
                    </h2>
                    <p class="hero-byline">${article.byline || ""}</p>
                    ${sourceBadge}
                    ${
                        excerptHtml
                            ? `<div class="hero-excerpt">${excerptHtml}</div>`
                            : ""
                    }
                    <a class="hero-link" href="${articleLink}" data-link>
                        Continue reading <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    _createBulletins(articles) {
        if (!articles || !articles.length) {
            return `
                <div class="waffle-bulletin-board">
                    <h3>Morning briefing</h3>
                    <p class="bulletin-empty">Reload for more wiki stories.</p>
                </div>
            `;
        }

        const items = articles.slice(0, 4);
        return `
            <div class="waffle-bulletin-board">
                <h3>Morning briefing</h3>
                <ul>
                    ${items
                        .map(
                            (item) => `
                        <li>
                            <span class="bulletin-dot"></span>
                            <a href="/news/${encodeURIComponent(item.id)}" data-link>
                                ${item.headline || item.title}
                            </a>
                        </li>
                    `
                        )
                        .join("")}
                </ul>
            </div>
        `;
    }

    _getCardLayoutClass(index = 0) {
        const pattern = [
            "waffle-card--standard",
            "waffle-card--standard",
            "waffle-card--standard",
            "waffle-card--standard",
        ];
        return pattern[index % pattern.length];
    }
}
