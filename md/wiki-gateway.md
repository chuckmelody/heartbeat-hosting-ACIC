# Wiki Gateway Reference

The media gateway turns a few friendly HTTP calls into curated Wikipedia content for the SPA. Everything lives inside `heartbeat/media-gateway/index.js`.

## Endpoints (all prefixed with `/api/v2/wiki`)

| Route | Description |
| --- | --- |
| `GET /frontpage` | Returns curated topic groups (Community, Justice & Safety, Youth, Martial Arts, Sound System Culture, Wellbeing, Food & Recipes, Opportunities, Events). Each group contains Wikipedia summaries with `id`, `title`, `description`, `thumbnailUrl`, original `url`, plus `metadata.extract`. Responses are cached in-memory for 15 minutes so repeated page loads stay fast. |
| `GET /search?q=term&limit=10` | Proxies Wikipedia's search API so the browser doesn't hit CORS issues. Sanitises snippets and returns canonical wiki links. |

Both endpoints add a descriptive `User-Agent` header so Wikimedia can contact us if needed. Errors surface as JSON `{ error: 'Wiki gateway error', detail: '...' }` and are logged server-side.

## How the SPA uses it

1. `frontend/static/js/api/WikiService.js` builds URLs under `/api/v2/wiki`.
2. `ArticleManager.loadFrontPageArticles()` calls `WikiService.getFrontPage()`, logs the entire payload to the browser console (`Wiki frontpage payload` group), and converts each group into article cards (with sections matching the filters: Community, Justice & Safety, Youth & Mentors, Sound System, Wellbeing, Food, Martial Arts, Opportunities, Events, etc.).
3. `NewsView` uses the article’s `url` to fetch a full body from Wikipedia when you open a card, so you get the detailed sections inline.

Because the objects are logged, you can inspect every article straight from DevTools and verify the API output matches what’s rendered.

## Updating topics

The curated titles live in `FRONT_PAGE_TOPICS` inside `heartbeat/media-gateway/index.js`. Edit those arrays to swap out Wikipedia articles (e.g., add new community stories, recipes, etc.). The next request after the 15‑minute cache expires will pick up the changes automatically.
