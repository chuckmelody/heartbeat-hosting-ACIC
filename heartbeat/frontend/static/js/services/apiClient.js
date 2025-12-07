const DEFAULT_API_BASE = window.__HB_STRAPI_URL__ || '/api';
const AUTH_DEBUG = Boolean(window.__HB_AUTH_DEBUG__);

const debugLog = (...args) => {
    if (AUTH_DEBUG) {
        console.log('[auth-debug]', ...args);
    }
};

let authToken = null;
let unauthorizedHandler = null;

export const setAuthToken = (token) => {
    authToken = token || null;
};

export const clearAuthToken = () => {
    authToken = null;
};

export const registerUnauthorizedHandler = (handler) => {
    unauthorizedHandler = handler;
};

const buildUrl = (path = '') => {
    if (!path) return DEFAULT_API_BASE;
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${DEFAULT_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

const normalizeBody = (body) => {
    if (body === undefined || body === null) {
        return undefined;
    }
    if (typeof body === 'string' || body instanceof FormData || body instanceof Blob) {
        return body;
    }
    return JSON.stringify(body);
};

const parseResponse = async (response) => {
    if (response.status === 204) {
        return null;
    }
    const text = await response.text();
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch (error) {
        return text;
    }
};

export const fetchJSON = async (path, {
    method = 'GET',
    headers = {},
    body,
    credentials = 'include',
    auth = true,
    retryOnUnauthorized = true,
    _retried = false,
} = {}) => {
    const finalHeaders = {
        'Content-Type': 'application/json',
        ...headers,
    };

    if (authToken && auth && !finalHeaders.Authorization) {
        finalHeaders.Authorization = `Bearer ${authToken}`;
    }

    const url = buildUrl(path);
    debugLog('fetch', method, url, { headers: finalHeaders, body, auth });
    const response = await fetch(url, {
        method,
        headers: finalHeaders,
        body: normalizeBody(body),
        credentials,
    });

    if (!response.ok) {
        debugLog('response', response.status, response.statusText, url);
        if (response.status === 401 && auth && retryOnUnauthorized && typeof unauthorizedHandler === 'function' && !_retried) {
            const shouldRetry = await unauthorizedHandler();
            if (shouldRetry) {
                debugLog('retrying request after refresh', url);
                return fetchJSON(path, {
                    method,
                    headers,
                    body,
                    credentials,
                    auth,
                    retryOnUnauthorized,
                    _retried: true,
                });
            }
        }

        const errorPayload = await parseResponse(response);
        debugLog('error payload', errorPayload);
        const message = errorPayload?.error?.message || response.statusText;
        const error = new Error(message);
        error.status = response.status;
        error.payload = errorPayload;
        throw error;
    }

    const data = await parseResponse(response);
    debugLog('success', url, data);
    return data;
};

export const multiFetch = async (requests = []) => {
    if (!Array.isArray(requests)) {
        throw new Error('multiFetch expects an array of request definitions.');
    }

    const tasks = requests.map((request) => {
        const {
            key,
            path,
            options,
            transform,
        } = request;

        const promise = fetchJSON(path, options)
            .then((data) => (typeof transform === 'function' ? transform(data) : data))
            .then((data) => ({ status: 'fulfilled', key, data }))
            .catch((error) => ({ status: 'rejected', key, error }));

        return promise;
    });

    const results = await Promise.all(tasks);

    return results.reduce((acc, result) => {
        if (result.key) {
            acc[result.key] = result;
        } else {
            acc.__anonymous = acc.__anonymous || [];
            acc.__anonymous.push(result);
        }
        return acc;
    }, {});
};

export default {
    fetchJSON,
    multiFetch,
};
