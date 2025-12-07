const express = require('express');

const WIKI_SUMMARY_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const WIKI_SEARCH_ENDPOINT = 'https://en.wikipedia.org/w/api.php';
const WIKI_MOBILE_SECTIONS_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/mobile-sections/';

const FRONT_PAGE_TOPICS = {
  community: [
    'Community organizing',
    'Violence prevention',
    'Youth mentoring',
    'Restorative justice',
    'Community development',
    'Social entrepreneurship',
    'Mutual aid (organization)',
    'Community safety partnership',
    'Grassroots democracy',
    'Social cohesion',
    'Volunteerism',
    'Civil society',
    'Community garden',
    'Collective impact',
    'Community resilience',
    'Neighbourhood support',
    'Social capital',
    'Community centre',
    'Community building',
    'Citizen action group'
  ],
  justice: [
    'Violence reduction unit',
    'Neighbourhood policing',
    'Community policing',
    'Knife crime in the United Kingdom',
    'Anti-social Behaviour Order',
    'Restorative justice',
    'Domestic violence in the United Kingdom',
    'Stop and search (United Kingdom)',
    'Gang injunction',
    'Probation in the United Kingdom',
    'Police community support officer',
    'Violence Against Women Act',
    'Transformative justice',
    'Criminal justice reform',
    'Crime prevention',
    'Police legitimacy',
    'Youth offending team',
    'Violence reduction unit (Scotland)',
    'Serious Violence Reduction Order',
    'Public safety'
  ],
  youth: [
    'Youth empowerment',
    'After-school activity',
    'Youth mentoring',
    'Youth club',
    'Youth leadership',
    'Positive youth development',
    'Youth work',
    'Youth academy',
    'Youth entrepreneurship',
    'Mentoring program',
    'Youth sports',
    'Youth theatre',
    'Youth activism',
    'Youth homelessness',
    'Young carers',
    'Apprenticeship',
    'Gap year',
    'Youth participation',
    'Youth conference',
    'Youth empowerment program'
  ],
  martialArts: [
    'Kickboxing',
    'Brazilian jiu-jitsu',
    'Muay Thai',
    'Karate',
    'Judo',
    'Taekwondo',
    'Boxing',
    'Mixed martial arts',
    'Kung fu',
    'Capoeira',
    'Krav Maga',
    'Sambo (martial art)',
    'Aikido',
    'Wing Chun',
    'Savate',
    'Shootfighting',
    'Jeet Kune Do',
    'Kyokushin',
    'Hapkido',
    'Combat sport'
  ],
  soundSystem: [
    'Sound system (DJ)',
    'Reggae',
    'Dub music',
    'Notting Hill Carnival',
    'Dancehall',
    'Roots reggae',
    'Selector (disc jockey)',
    'MC (rapper)',
    'Mobile disco',
    'Lovers rock',
    'Bass culture',
    'Jungle music',
    'Grime music',
    'Bristol sound',
    'Toasting (Jamaican music)',
    'Dubplate',
    'Record pressing plant',
    'Caribbean music in the United Kingdom',
    'UK sound system culture',
    'Community radio'
  ],
  wellbeing: [
    'Mental health',
    'Physical fitness',
    'Mindfulness',
    'Nutrition',
    'Breathwork',
    'Community health',
    'Meditation',
    'Yoga',
    'Tai chi',
    'Wellness program',
    'Public health',
    'Health education',
    'Holistic health',
    'Resilience (psychological)',
    'Stress management',
    'Mental health in the United Kingdom',
    'Sleep hygiene',
    'Healthy eating',
    'Wellbeing economy',
    'Positive psychology'
  ],
  recipes: [
    'Jerk chicken',
    'Callaloo',
    'Rice and peas',
    'Plantain',
    'Ackee and saltfish',
    'Curry goat',
    'Fried dumpling',
    'Bammy',
    'Pepperpot',
    'Festival (fried dough)',
    'Sorrel drink',
    'Ital cuisine',
    'Escovitch fish',
    'Caribbean roti',
    'Coconut rundown',
    'Mango chutney',
    'Breadfruit',
    'Sweet potato pudding',
    'Peanut punch',
    'Caribbean pepper sauce'
  ],
  opportunities: [
    'Social entrepreneurship',
    'Community development',
    'Job training',
    'Volunteer',
    'Community enterprise',
    'Work experience',
    'Incubator (business)',
    'Mentorship',
    'Business accelerator',
    'Small business support',
    'Startup ecosystem',
    'Workforce development',
    'Microfinance',
    'Creative industries',
    'Green jobs',
    'Digital inclusion',
    'STEM education',
    'Creative economy',
    'Crowdfunding',
    'Community-owned business'
  ],
  events: [
    'Community festival',
    'Carnival',
    'Fundraising',
    'Cultural event',
    'Block party',
    'Street performance',
    'Civic engagement',
    'Public art',
    'Night market',
    'Cultural heritage',
    'Community theatre',
    'Open mic',
    'Live art',
    'Parade',
    'Street food festival',
    'Community awards',
    'Film screening',
    'Youth showcase',
    'Neighbourhood day',
    'Community conference'
  ]
};

const FRONT_PAGE_CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes
let frontPageCache = {
  expiresAt: 0,
  payload: null,
};

const buildWikiUrl = (title) =>
  `${WIKI_SUMMARY_ENDPOINT}${encodeURIComponent(title.replace(/ /g, '_'))}?redirect=true`;

const mapSummary = (summary) => {
  if (!summary) return null;
  const desktopUrl =
    summary?.content_urls?.desktop?.page ||
    `https://en.wikipedia.org/wiki/${encodeURIComponent(summary.title?.replace(/ /g, '_') || '')}`;

  return {
    id: summary.pageid || summary.titles?.canonical || summary.title,
    title: summary.title,
    description: summary.description || summary.extract || '',
    url: desktopUrl,
    thumbnailUrl: summary.thumbnail?.source || null,
    metadata: {
      extract: summary.extract,
      lang: summary.lang,
      pageid: summary.pageid,
      timestamp: summary.timestamp,
      coordinates: summary.coordinates || null,
    },
  };
};

const fetchSummary = async (title) => {
  try {
    const res = await fetch(buildWikiUrl(title), {
      headers: {
        'User-Agent': 'Heartbeat Hosting Wiki Gateway/1.0 (https://heartbeatacic.org)',
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Summary fetch failed (${res.status})`);
    }

    const json = await res.json();
    return mapSummary(json);
  } catch (error) {
    console.warn('[wiki-gateway] summary error', title, error.message);
    return null;
  }
};

const fetchGroupSummaries = async (titles = []) => {
  const results = await Promise.all(titles.map(fetchSummary));
  return results.filter(Boolean);
};

const fetchFrontPagePayload = async () => {
  const now = Date.now();
  if (frontPageCache.payload && frontPageCache.expiresAt > now) {
    return frontPageCache.payload;
  }

  const groupEntries = await Promise.all(
    Object.entries(FRONT_PAGE_TOPICS).map(async ([key, titles]) => {
      const items = await fetchGroupSummaries(titles);
      return [key, items];
    })
  );

  const payload = {
    generatedAt: new Date().toISOString(),
  };

  groupEntries.forEach(([key, value]) => {
    payload[key] = value;
  });

  frontPageCache = {
    expiresAt: now + FRONT_PAGE_CACHE_TTL_MS,
    payload,
  };

  const counts = groupEntries.reduce(
    (acc, [key, value]) => ({ ...acc, [key]: value.length }),
    {}
  );
  console.log('[wiki-gateway] frontpage payload generated', counts);

  return payload;
};

const searchWikipedia = async (query, limit = 10) => {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    format: 'json',
    srlimit: String(limit),
  });

  const url = `${WIKI_SEARCH_ENDPOINT}?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Heartbeat Hosting Wiki Gateway/1.0 (https://heartbeatacic.org)',
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Search failed (${res.status})`);
  }

  const data = await res.json();
  const searchResults = data?.query?.search || [];

  return searchResults.map((item) => ({
    id: item.pageid,
    title: item.title,
    snippet: item.snippet?.replace(/<\/?span[^>]*>/g, '') || '',
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
  }));
};

const buildMobileSectionUrl = (title) =>
  `${WIKI_MOBILE_SECTIONS_ENDPOINT}${encodeURIComponent(title.replace(/ /g, '_'))}`;

const fetchFullPage = async (title, maxSections = 8) => {
  if (!title) {
    throw new Error('Missing article title');
  }

  const res = await fetch(buildMobileSectionUrl(title), {
    headers: {
      'User-Agent': 'Heartbeat Hosting Wiki Gateway/1.0 (https://heartbeatacic.org)',
      Accept: 'application/json; charset=utf-8; profile="https://www.mediawiki.org/wiki/Specs/Mobile-Sections/0.14.1"',
    },
  });

  if (!res.ok) {
    throw new Error(`Full page fetch failed (${res.status})`);
  }

  const data = await res.json();
  const sections = [
    ...(data.lead?.sections || []),
    ...(data.remaining?.sections || []),
  ];

  const html = sections
    .slice(0, maxSections)
    .map((s) => s.text || '')
    .filter(Boolean)
    .join('<hr class="waffle-article-section-divider" />');

  return { title: data.lead?.displaytitle || title, html, sectionCount: sections.length };
};

const mountWiki = (app, options = {}) => {
  const basePath = options.basePath || '/api/v2/wiki';
  const router = express.Router();

  router.get('/frontpage', async (req, res, next) => {
    try {
      const payload = await fetchFrontPagePayload();
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.get('/search', async (req, res, next) => {
    try {
      const query = `${req.query.q || ''}`.trim();
      if (!query) {
        return res.status(400).json({ error: 'Missing search query (q)' });
      }

      const limit = Number(req.query.limit) || 10;
      const results = await searchWikipedia(query, Math.min(Math.max(limit, 1), 20));
      res.json({ query, results });
    } catch (error) {
      next(error);
    }
  });

  router.get('/fullpage', async (req, res, next) => {
    try {
      let title = `${req.query.title || ''}`.trim();
      const url = `${req.query.url || ''}`.trim();

      if (!title && url) {
        try {
          const parsed = new URL(url);
          title = decodeURIComponent(parsed.pathname.split('/').pop() || '');
        } catch (_) {
          // ignore parse errors
        }
      }

      if (!title) {
        return res.status(400).json({ error: 'Missing article title or url' });
      }

      const payload = await fetchFullPage(title);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.use((err, req, res, next) => {
    console.error('[wiki-gateway] error', err);
    res.status(500).json({ error: 'Wiki gateway error', detail: err.message });
  });

  app.use(basePath, router);
};

module.exports = { mountWiki };
