// frontend/static/js/managers/ArticleManager.js
import WikiService from '../api/WikiService.js';

export default class ArticleManager {
    constructor() {
        this.wikiService = new WikiService();
        this.sessionKey = 'hb_news_state_v1';
    }

    loadState() {
        try {
            const raw = sessionStorage.getItem(this.sessionKey);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    saveState(state) {
        try {
            sessionStorage.setItem(this.sessionKey, JSON.stringify(state));
        } catch {
            // ignore
        }
    }

    /**
     * Load “edition” of The Waffle – mixed from wiki + house articles.
     */
    async loadFrontPageArticles() {
        const existing = this.loadState();
        if (existing && Array.isArray(existing.articles)) {
            return existing.articles;
        }

        const front = await this.wikiService.getFrontPage();
        try {
            console.groupCollapsed('Wiki frontpage payload');
            console.dir(front);
            console.groupEnd();
        } catch (err) {
            console.warn('Unable to log wiki payload', err);
        }

        const articles = [];

        // Community & violence reduction – headline material
        (front.community || []).forEach((item, idx) => {
            const type = idx === 0 ? 'lead-story' : 'secondary-story';
            articles.push({
                id: `wiki-community-${item.id || idx}`,
                type,
                category: idx === 0 ? 'Community & Courage' : 'Community Insight',
                headline: item.title,
                byline: 'From Wikipedia – community & justice',
                content: item.metadata?.extract || item.description || '',
                image: item.thumbnailUrl,
                url: item.url,
                source: 'wikipedia',
            });
        });

        // Justice & safety
        (front.justice || []).forEach((item, idx) => {
            articles.push({
                id: `wiki-justice-${item.id || idx}`,
                type: 'secondary-story',
                category: 'Justice & Safety',
                mood: 'serious',
                section: 'Community Justice',
                headline: item.title,
                byline: 'From Wikipedia – safer streets insight',
                content: item.metadata?.extract || item.description || '',
                image: item.thumbnailUrl,
                url: item.url,
                source: 'wikipedia',
            });
        });

        // Youth & mentors
        (front.youth || []).forEach((item, idx) => {
            articles.push({
                id: `wiki-youth-${item.id || idx}`,
                type: 'secondary-story',
                category: 'Youth & Mentors',
                mood: 'happy',
                section: 'Next Gen',
                headline: item.title,
                byline: 'From Wikipedia – empowering young people',
                content: item.metadata?.extract || item.description || '',
                image: item.thumbnailUrl,
                url: item.url,
                source: 'wikipedia',
            });
        });

        // Martial arts & sports – sidebar / secondary
        (front.martialArts || []).forEach((item, idx) => {
            articles.push({
                id: `wiki-martial-${item.id || idx}`,
                type: 'sidebar-story',
                category: 'Discipline & Strength',
                section: 'Martial Focus',
                headline: item.title,
                byline: 'From Wikipedia – martial arts background',
                content: item.metadata?.extract || item.description || '',
                image: item.thumbnailUrl,
                url: item.url,
                source: 'wikipedia',
            });
        });

        // Sound system – flavour & culture
        (front.soundSystem || []).forEach((item, idx) => {
            articles.push({
                id: `wiki-sound-${item.id || idx}`,
                type: 'secondary-story',
                category: 'Sound System Culture',
                section: 'Culture',
                headline: item.title,
                byline: 'From Wikipedia – reggae & sound systems',
                content: item.metadata?.extract || item.description || '',
                image: item.thumbnailUrl,
                url: item.url,
                source: 'wikipedia',
            });
        });

        // Wellbeing
        (front.wellbeing || []).forEach((item, idx) => {
            articles.push({
                id: `wiki-wellbeing-${item.id || idx}`,
                type: 'sidebar-story',
                category: 'Wellbeing',
                mood: 'feature',
                section: 'Wellbeing',
                headline: item.title,
                byline: 'From Wikipedia – wellbeing insight',
                content: item.metadata?.extract || item.description || '',
                image: item.thumbnailUrl,
                url: item.url,
                source: 'wikipedia',
            });
        });

        // Recipes – these can show lower down the page
        (front.recipes || []).forEach((item, idx) => {
            articles.push({
                id: `wiki-recipe-${item.id || idx}`,
                type: 'sidebar-story',
                category: 'Food & Recipes',
                section: 'Recipe',
                headline: item.title,
                byline: 'From Wikipedia – recipe background',
                content: item.metadata?.extract || item.description || '',
                image: item.thumbnailUrl,
                url: item.url,
                source: 'wikipedia',
            });
        });

        // Opportunities
        (front.opportunities || []).forEach((item, idx) => {
            articles.push({
                id: `wiki-opportunity-${item.id || idx}`,
                type: 'secondary-story',
                category: 'Opportunities',
                mood: 'feature',
                section: 'Opportunity',
                headline: item.title,
                byline: 'From Wikipedia – opportunity & enterprise',
                content: item.metadata?.extract || item.description || '',
                image: item.thumbnailUrl,
                url: item.url,
                source: 'wikipedia',
            });
        });

        // Events & culture
        (front.events || []).forEach((item, idx) => {
            articles.push({
                id: `wiki-event-${item.id || idx}`,
                type: 'secondary-story',
                category: 'Events & Culture',
                mood: 'feature',
                section: 'Culture Calendar',
                headline: item.title,
                byline: 'From Wikipedia – events & culture',
                content: item.metadata?.extract || item.description || '',
                image: item.thumbnailUrl,
                url: item.url,
                source: 'wikipedia',
            });
        });

        const state = {
            articles,
            generatedAt: front.generatedAt || new Date().toISOString(),
        };
        this.saveState(state);

        return articles;
    }
}
