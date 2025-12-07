    // frontend/static/js/views/News.js
    import AbstractView from "./AbstractView.js";
    import NewsManager from "../managers/NewsManager.js";

    export default class extends AbstractView {
        constructor(params) {
            super(params);
            this.setTitle("News");
        }

        async getHtml() {
            return `
                <section class="waffle-news-page">
                    <header class="waffle-news-header">
                        <h2 class="page-title waffle-page-title">
                            <i class="fa-solid fa-newspaper fa-fw"></i>
                            The Waffle – Midlands Edition
                        </h2>
                        <p class="waffle-page-kicker">
                            Happy news, hard truths, sound system culture, and community wins – all on one page.
                        </p>
                        <div class="waffle-news-actions">
                            <button id="create-article-btn"
                                class="form-button"
                                data-tooltip="Create a new news article">
                                <i class="fa-solid fa-plus fa-fw"></i> Create Article
                            </button>
                        </div>
                    </header>

                    <div class="news-grid" id="news-container">
                        <!-- News articles will be rendered here by NewsManager -->
                    </div>
                </section>
            `;
        }

        async after_render() {
            const newsManager = new NewsManager('news-container');

            const createBtn = document.getElementById('create-article-btn');
            if (createBtn) {
                createBtn.addEventListener('click', () => {
                    newsManager.showCreateModal();
                });
            }
        }
    }
