// frontend/static/js/api/WikiService.js

export default class WikiService {
    constructor(options = {}) {
        this.basePath = options.basePath || '/api/v2/wiki';
    }

    buildUrl(path, params = {}) {
        const url = new URL(this.basePath + path, window.location.origin);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                url.searchParams.set(key, value);
            }
        });
        return url.toString().replace(window.location.origin, '');
    }

    async request(path, params = {}) {
        const url = this.buildUrl(path, params);
        const res = await fetch(url, {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`WikiService error ${res.status}: ${text}`);
        }

        return res.json();
    }

    getFrontPage() {
        return this.request('/frontpage');
    }

    search(query) {
        return this.request('/search', { q: query });
    }
}
