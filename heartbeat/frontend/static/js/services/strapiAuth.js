import { fetchJSON } from './apiClient.js';

const AUTH_DEBUG = Boolean(window.__HB_AUTH_DEBUG__);
const debugLog = (...args) => {
  if (AUTH_DEBUG) {
    console.log('[auth-debug][strapiAuth]', ...args);
  }
};

const refreshHeaderValue = () => window.__HB_REFRESH_COOKIE__ || 'httpOnly';

const withRefreshHeader = (headers = {}) => ({
    'X-STRAPI-REFRESH-COOKIE': refreshHeaderValue(),
    ...headers,
});

export const login = async ({ identifier, password, deviceId }) => {
    const payload = {
        identifier: identifier?.trim().toLowerCase(),
        password,
        deviceId,
    };

    debugLog('login', payload);
    return fetchJSON('/auth/local', {
        method: 'POST',
        body: payload,
        headers: withRefreshHeader(),
        auth: false,
    });
};

export const register = async ({ username, email, password, firstName, lastName, deviceId }) => {
    const normalizedEmail = email?.trim().toLowerCase();
    const payload = {
        username: username?.trim() || normalizedEmail,
        email: normalizedEmail,
        password,
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        deviceId,
    };

    debugLog('register', payload);
    return fetchJSON('/auth/local/register', {
        method: 'POST',
        body: payload,
        headers: withRefreshHeader(),
        auth: false,
    });
};

export const refresh = async () => {
    debugLog('refresh');
    return fetchJSON('/auth/refresh', {
        method: 'POST',
        headers: withRefreshHeader(),
        auth: false,
        retryOnUnauthorized: false,
    });
};

export const logout = async ({ deviceId }) => {
    debugLog('logout', { deviceId });
    return fetchJSON('/auth/logout', {
        method: 'POST',
        body: { deviceId },
        headers: withRefreshHeader(),
    });
};

export const requestPasswordReset = async (email) => {
    debugLog('forgot-password', email);
    return fetchJSON('/auth/forgot-password', {
        method: 'POST',
        body: { email: email?.trim().toLowerCase() },
        auth: false,
    });
};

export const submitPasswordReset = async ({ code, password, passwordConfirmation }) => {
    debugLog('reset-password', { code });
    return fetchJSON('/auth/reset-password', {
        method: 'POST',
        body: { code, password, passwordConfirmation },
        auth: false,
    });
};
