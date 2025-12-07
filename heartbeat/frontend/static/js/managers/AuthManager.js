import { setAuthToken, clearAuthToken, registerUnauthorizedHandler } from '../services/apiClient.js';
import { login as strapiLogin, register as strapiRegister, refresh as strapiRefresh, logout as strapiLogout } from '../services/strapiAuth.js';

const AUTH_DEBUG = Boolean(window.__HB_AUTH_DEBUG__);
const debugLog = (...args) => {
    if (AUTH_DEBUG) {
        console.log('[auth-debug][AuthManager]', ...args);
    }
};

const STORAGE_KEY = 'hb_auth_state';
const DEVICE_STORAGE_KEY = 'hb_device_id';

const getStoredState = () => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (error) {
        console.warn('Failed to parse auth state', error);
        return {};
    }
};

const persistState = (state) => {
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('Failed to persist auth state', error);
    }
};

const ensureDeviceId = () => {
    let deviceId = sessionStorage.getItem(DEVICE_STORAGE_KEY);
    if (!deviceId) {
        if (window.crypto?.randomUUID) {
            deviceId = window.crypto.randomUUID();
        } else {
            deviceId = `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        }
        sessionStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
    }
    return deviceId;
};

const broadcastAuthChange = () => {
    window.dispatchEvent(new CustomEvent('auth-change'));
};

export default class AuthManager {
    constructor() {
        if (AuthManager.instance) {
            return AuthManager.instance;
        }
        this.state = getStoredState();
        if (!this.state.deviceId) {
            this.state.deviceId = ensureDeviceId();
        }
        persistState(this.state);
        if (this.state.jwt) {
            setAuthToken(this.state.jwt);
        }

        registerUnauthorizedHandler(async () => {
            if (!this.state.jwt) {
                return false;
            }
            try {
                debugLog('auto-refresh attempt');
                const token = await this.refresh({ silent: true });
                return Boolean(token);
            } catch (error) {
                console.warn('Auto-refresh failed', error);
                await this.logout();
                return false;
            }
        });

        AuthManager.instance = this;
    }

    isLoggedIn() {
        return Boolean(this.state.jwt);
    }

    getProfile() {
        return this.state.user || null;
    }

    getAccessToken() {
        return this.state.jwt || null;
    }

    getDeviceId() {
        if (!this.state.deviceId) {
            this.state.deviceId = ensureDeviceId();
            persistState(this.state);
        }
        return this.state.deviceId;
    }

    _applySession(payload = {}, { silent = false } = {}) {
        const nextState = {
            ...this.state,
            jwt: payload.jwt ?? this.state.jwt ?? null,
            user: payload.user ?? this.state.user ?? null,
            deviceId: payload.deviceId || this.state.deviceId || ensureDeviceId(),
        };

        this.state = nextState;
        debugLog('session update', this.state);
        if (this.state.jwt) {
            setAuthToken(this.state.jwt);
        } else {
            clearAuthToken();
        }
        persistState(this.state);
        if (!silent) {
            broadcastAuthChange();
        }
    }

    async login(credentials) {
        const payload = {
            identifier: credentials.identifier,
            password: credentials.password,
            deviceId: credentials.deviceId || this.getDeviceId(),
        };

        debugLog('login start', payload.identifier);
        const response = await strapiLogin(payload);
        this._applySession(response);
        debugLog('login success', response.user);

        return response.user;
    }

    async register(data) {
        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            username: data.username,
            deviceId: data.deviceId || this.getDeviceId(),
        };

        debugLog('register start', payload.email);
        const response = await strapiRegister(payload);
        this._applySession(response);
        debugLog('register success', response.user);

        return response.user;
    }

    async refresh({ silent = false } = {}) {
        if (!this.state.deviceId) {
            return null;
        }

        try {
            debugLog('refresh start');
            const response = await strapiRefresh();
            if (response?.jwt) {
                this._applySession({ jwt: response.jwt }, { silent });
                debugLog('refresh success');
                return response.jwt;
            }
            return null;
        } catch (error) {
            console.warn('Refresh failed', error);
            await this.logout();
            if (!silent) {
                throw error;
            }
            return null;
        }
    }

    async logout() {
        if (this.state.jwt) {
            try {
                debugLog('logout start');
                await strapiLogout({ deviceId: this.state.deviceId });
            } catch (error) {
                console.warn('Logout request failed', error);
            }
        }

        const deviceId = this.state.deviceId || ensureDeviceId();
        this.state = { deviceId };
        clearAuthToken();
        persistState(this.state);
        broadcastAuthChange();
        debugLog('logout complete');
    }
}
