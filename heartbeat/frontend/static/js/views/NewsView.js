// ===============================
// THE WAFFLE – SINGLE STORY PAGE
// FULL ARTICLE, LONGER WIKI BODY
// ===============================

// frontend/static/js/views/NewsView.js
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.articleId = params.id;
        this.setTitle("Story");
    }

    async getHtml() {
        return `
            <section class="waffle-news-article-page">
                <div class="waffle-news-article-header">
                    <a href="/news" data-link class="waffle-back-btn">
                        <i class="fa-solid fa-arrow-left"></i>
                        Back to The Waffle
                    </a>
                </div>

                <div id="waffle-article-detail-root">
                    <div class="waffle-article-detail-loading">
                        <div class="waffle-article-loading-skeleton"></div>
                        <p style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--secondary-text-color);">
                            Loading full story&hellip;
                        </p>
                    </div>
                </div>
            </section>
        `;
    }

    async after_render() {
        const root = document.getElementById("waffle-article-detail-root");
        if (!root) return;

        const article = this._loadArticleFromCache(this.articleId);

        if (!article) {
            root.innerHTML = `
                <div class="waffle-article-detail-error">
                    <h3 class="waffle-article-error-title">Story not found</h3>
                    <p class="waffle-article-error-text">
                        We couldn't load this story. It may have expired from today's edition.
                    </p>
                    <a href="/news" data-link class="waffle-back-btn">
                        <i class="fa-solid fa-arrow-left"></i>
                        Back to The Waffle
                    </a>
                </div>
            `;
            return;
        }

        // Try to load richer wiki content for full story view
        let bodyHtml = article.content || "";
        if (article.source === "wikipedia" && article.url) {
            const wikiBody = await this._fetchFullWikiBody(article.url);
            if (wikiBody) {
                bodyHtml = wikiBody;
            }
        }
        const formattedBody = this._normalizeStoryBody(bodyHtml);

        // Mood pill mapping
        const mood = article.mood || "community";
        const moodLabelMap = {
            breaking: "Breaking",
            happy: "Happy News",
            community: "Community",
            serious: "In Depth",
            feature: "Feature",
        };
        const moodLabel = moodLabelMap[mood] || "Community";

        const moodPillClass =
            mood === "breaking"
                ? "waffle-mood-pill-breaking"
                : mood === "happy"
                ? "waffle-mood-pill-happy"
                : mood === "serious"
                ? "waffle-mood-pill-serious"
                : mood === "feature"
                ? "waffle-mood-pill-feature"
                : "waffle-mood-pill-community";

        const sectionLabel = article.section || "";
        const sectionChip =
            sectionLabel
                ? `<span class="waffle-section-chip">${sectionLabel}</span>`
                : "";

        const sourceLabel =
            article.source === "wikipedia"
                ? `<span class="waffle-article-main-source"><i class="fa-brands fa-wikipedia-w"></i>Wiki insight</span>`
                : `<span class="waffle-article-main-source">Heartbeat Original</span>`;

        const heroHtml = article.image
            ? `
                <div class="waffle-article-hero-image"
                     style="background-image: url('${article.image}');">
                </div>
            `
            : `
                <div class="waffle-article-hero-image waffle-article-hero-placeholder">
                    <i class="fa-solid fa-image"></i>
                    <span>No image available for this story.</span>
                </div>
            `;

        const wikiLinkHtml =
            article.source === "wikipedia" && article.url
                ? `
                    <div class="waffle-article-readmore-wiki">
                        Source:&nbsp;<a href="${article.url}" target="_blank" rel="noopener noreferrer">
                            Read the full reference article on Wikipedia
                        </a>
                    </div>
                `
                : "";

        root.innerHTML = `
            <article class="waffle-article-detail">
                <header class="waffle-article-detail-header">
                    <div class="waffle-article-kickers">
                        ${sectionChip}
                        <span class="waffle-mood-pill ${moodPillClass}">
                            ${moodLabel}
                        </span>
                    </div>
                    <h1 class="waffle-article-detail-headline">
                        ${article.headline}
                    </h1>
                    <div class="waffle-article-detail-meta">
                        ${
                            article.category
                                ? `<span class="waffle-article-main-category">${article.category}</span>`
                                : ""
                        }
                        ${
                            article.byline
                                ? `<span>${article.byline}</span>`
                                : ""
                        }
                        <span>${sourceLabel}</span>
                    </div>
                </header>

                ${heroHtml}

                <div class="waffle-article-detail-layout">
                    <div class="waffle-article-detail-main">
                        <div class="waffle-article-detail-body">
                            ${formattedBody}
                        </div>

                        ${wikiLinkHtml}

                        <div class="waffle-article-detail-cta-row">
                            <a href="/news" data-link class="waffle-back-btn">
                                <i class="fa-solid fa-arrow-left"></i>
                                Back to The Waffle
                            </a>

                            <a href="/news" data-link class="waffle-full-story-btn">
                                Full paper <i class="fa-solid fa-newspaper"></i>
                            </a>
                        </div>

                        <div class="waffle-article-main-fact-cards">
                            <div class="waffle-article-fact-card">
                                <h3><i class="fa-solid fa-lightbulb"></i> Key points</h3>
                                <ul>
                                    <li>Community-focused angle highlighted by The Waffle.</li>
                                    <li>Part of the Midlands edition – local story, wider impact.</li>
                                    <li>Blending lived experience, culture, and positive outcomes.</li>
                                </ul>
                            </div>
                            <div class="waffle-article-fact-card">
                                <h3><i class="fa-solid fa-circle-info"></i> About this section</h3>
                                <ul>
                                    <li>Stories rotate daily – check back for new features.</li>
                                    <li>Long-form read with context, not just a short snippet.</li>
                                    <li>More articles available on the main news page.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <aside class="waffle-article-detail-aside">
                        <div class="waffle-article-side-card">
                            <h3 class="waffle-side-card-title">
                                <i class="fa-solid fa-location-dot"></i> Midlands focus
                            </h3>
                            <p class="waffle-side-card-text">
                                The Waffle spotlights stories from Northamptonshire, Birmingham and across the wider Midlands – mixing happy news, sound system culture and community wins.
                            </p>
                        </div>
                        <div class="waffle-article-side-card">
                            <h3 class="waffle-side-card-title">
                                <i class="fa-solid fa-hand-fist"></i> Martial arts &amp; youth
                            </h3>
                            <p class="waffle-side-card-text">
                                From Lau Gar Kung Fu to ECKA, martial arts clubs in the region continue to mentor the next generation in discipline, confidence and self-respect.
                            </p>
                        </div>
                        <div class="waffle-article-side-card">
                            <h3 class="waffle-side-card-title">
                                <i class="fa-solid fa-volume-high"></i> Sound system heritage
                            </h3>
                            <p class="waffle-side-card-text">
                                Midlands sound systems helped build a scene where community, culture and basslines walk hand in hand – each edition of The Waffle keeps that history alive.
                            </p>
                        </div>
                    </aside>
                </div>
            </article>
        `;
    }

    _loadArticleFromCache(id) {
        try {
            const raw = sessionStorage.getItem(`waffle-article-${id}`);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (_) {
            return null;
        }
    }

    async _fetchFullWikiBody(articleUrl) {
        try {
            const title = this._extractWikiTitle(articleUrl);
            if (!title) return null;

            const apiUrl = `/api/v2/wiki/fullpage?title=${encodeURIComponent(title)}`;
            const res = await fetch(apiUrl, { headers: { Accept: "application/json" } });
            if (!res.ok) return null;
            const data = await res.json();
            return data.html || null;
        } catch (e) {
            console.warn("Failed to fetch full wiki body", e);
            return null;
        }
    }

    _extractWikiTitle(articleUrl) {
        if (!articleUrl) return "";
        try {
            const url = new URL(articleUrl);
            return decodeURIComponent(url.pathname.split("/").pop() || "");
        } catch (_) {
            return "";
        }
    }

    _normalizeStoryBody(bodyHtml = "") {
        const trimmed = (bodyHtml || "").trim();
        if (!trimmed) return "";

        const hasHtmlBlocks = /<(p|ul|ol|li|h\d|blockquote|hr|br)\b/i.test(trimmed);
        if (hasHtmlBlocks) {
            return trimmed;
        }

        const paragraphs = trimmed
            .split(/\n{2,}/)
            .map((p) => p.replace(/\s+/g, " ").trim())
            .filter(Boolean);

        if (!paragraphs.length) {
            return this._chunkPlainParagraphs(trimmed)
                .map((p) => `<p>${p}</p>`)
                .join("");
        }

        const expanded = paragraphs.flatMap((p) =>
            this._chunkPlainParagraphs(p)
        );

        return expanded.map((p) => `<p>${p}</p>`).join("");
    }

    _chunkPlainParagraphs(text, sentencesPerParagraph = 3) {
        const clean = (text || "").trim();
        if (!clean) return [];
        const sentences =
            clean.match(/[^.!?]+[.!?]['"]?(?=\s|$)/g)?.map((s) => s.trim()) || [];

        if (!sentences.length || sentences.length <= sentencesPerParagraph) {
            return [clean];
        }

        const chunks = [];
        for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
            chunks.push(sentences.slice(i, i + sentencesPerParagraph).join(" "));
        }

        return chunks;
    }
}
