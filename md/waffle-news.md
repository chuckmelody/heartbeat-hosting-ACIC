# Waffle News Layout Reference

The `/news` route now renders a UK-style red-top front page with curated hero, bulletins, and masonry cards. This guide explains the structure so future tweaks are straightforward.

## Layout at a glance

1. **Red-top banner** (`.waffle-redtop`): highlights “Heartbeat A CIC” + “NEWS” with the edition date. Uses Playfair/Libre Baskerville to echo traditional print headlines.
2. **Hero wrap** (`.waffle-hero-wrap`): two-column section with the lead story on the left and a “Morning briefing” bulletin stack on the right. The hero image floats with `shape-outside` so text wraps naturally; badges call out whether the piece is a Heartbeat exclusive or a Wiki insight.
3. **Filter scroller** (`.waffle-filter-bar`): reuses the glass nav styling. It’s draggable, wheel-scrollable, and GSAP nudges it when you tap a category. Each chip maps to the predicates in `FILTER_CONFIG`.
4. **Masonry grid** (`.waffle-news-grid` + `.waffle-card--*`): the rest of the edition uses CSS grid with dense flow. Layout classes (`tall`, `wide`, `short`, `standard`) cycle so the cards feel staggered and “busy” like a red-top. Existing blur cards, ribbons, and options remain.
5. **Sort control** (`.waffle-sort`): sticky, glassy select aligned with the filter bar for quick resorting.

## Hero + bulletins

`NewsManager.render()` picks the first article with a thumbnail as the hero. Bulletins pull the next four items and list them with neon dots. Both blocks use the same data set that feeds the cards, so filters/sorting automatically rebuild them.

## Cards and GSAP touches

Filters now re-render the entire view (hero, bulletins, grid) so the experience stays consistent. The filter scroller relies on GSAP (with ScrollToPlugin when available) to ease the horizontal scroll, falling back to smooth scrolling if the plugin isn’t loaded.

## Styling

Fonts are loaded at the top of `frontend/static/css/news.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Libre+Baskerville:wght@400;700&display=swap');
```

Key class groups:

- `.waffle-redtop`, `.waffle-redtop-flag`, `.waffle-redtop-name`
- `.waffle-hero`, `.waffle-hero-image`, `.hero-headline`, `.hero-source`
- `.waffle-bulletin-board`, `.bulletin-dot`
- `.waffle-card--tall|wide|short|standard`

Responsive rules collapse the hero to one column at ≤1024px, stack the sort/filter controls, and ensure wide cards revert to single-column on phones.

Keep these structures when adding new blocks (ads, promos, etc.) so the red-top aesthetic and GSAP interactions stay coherent.***
