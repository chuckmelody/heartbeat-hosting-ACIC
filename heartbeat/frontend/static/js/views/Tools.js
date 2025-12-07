import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Tools");
    }

    async getHtml() {
        return `
            <section class="tools-page">
                <div class="tools-hero-card glass-panel">
                    <div>
                        <p class="tools-kicker">Heartbeat A CIC · Utilities</p>
                        <h2 class="tools-title"><i class="fa-solid fa-toolbox fa-fw"></i> Tool Bench</h2>
                        <p class="tools-lede">
                            Spin up checksum engines, token decoders, colour translators, lorem builders, and network probes without leaving Heartbeat’s infra.
                            It’s the same open-source <strong>IT Tools</strong> power, but tuned to our glassmorphic workspace.
                        </p>
                    </div>
                    <div class="tools-hero-actions">
                        <a href="https://github.com/CorentinTh/it-tools" class="glass-link" target="_blank" rel="noopener noreferrer">
                            <i class="fa-brands fa-github"></i> View upstream project
                        </a>
                        <button class="glass-button" data-open-tools>
                            <i class="fa-solid fa-up-right-from-square"></i> Open full screen
                        </button>
                    </div>
                </div>

                <article class="tools-workbench glass-panel">
                    <div class="tools-card-header">
                        <div>
                            <p class="tools-card-kicker">Always-on</p>
                            <h3>Embedded IT Tools workspace</h3>
                        </div>
                        <span class="tools-pill">Live</span>
                    </div>
                    <p class="tools-card-body">
                        Every widget runs from the container we host alongside the SPA, so hashes, payloads, and snippets never exit <code>dev.heartbeat.local</code>.
                        Use it when you’re debugging, demoing, or training. If the canvas ever loads blank, restart it with <code>./scripts/tools-up.sh</code>.
                    </p>
                    <div class="tools-iframe-wrap">
                        <iframe
                            src="/tools/it-tools"
                            title="IT Tools"
                            loading="lazy"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        ></iframe>
                    </div>
                    <div class="tools-iframe-toolbar">
                        <div>
                            <p class="tools-card-kicker">Need a bigger canvas?</p>
                            <p class="tools-card-body">Launch the workspace in a dedicated tab for full height.</p>
                        </div>
                        <button class="glass-button" data-open-tools>
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Open /tools/it-tools
                        </button>
                    </div>
                </article>

                <article class="tools-card glass-panel">
                    <div class="tools-card-header">
                        <div>
                            <p class="tools-card-kicker">General public notice</p>
                            <h3>How to use the hosted utilities</h3>
                        </div>
                    </div>
                    <p class="tools-card-body">
                        Heartbeat runs the entire toolkit 24/7, so engineers and volunteers always have checksum generators, inspectors, and formatters on tap.
                        Treat it like your command centre for shipping, coaching, or diagnosing issues—no copying into third-party sites, no privacy headaches.
                    </p>
                    <div class="tools-spotlights">
                        <div class="tools-spotlight-item">
                            <div class="tools-spotlight-icon">
                                <i class="fa-solid fa-bolt"></i>
                            </div>
                            <div>
                                <h5>Generators & encoders</h5>
                                <p>Create UUIDs, JWT payloads, lorem ipsum text, QR codes, and base64/Gzip snippets. Perfect for preparing documentation or teaching sessions.</p>
                            </div>
                        </div>
                        <div class="tools-spotlight-item">
                            <div class="tools-spotlight-icon">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </div>
                            <div>
                                <h5>Inspect & validate</h5>
                                <p>Drop JSON, YAML, HTML, or JWT tokens into the viewers to prettify, minify, or verify signatures. Nothing leaves the browser.</p>
                            </div>
                        </div>
                        <div class="tools-spotlight-item">
                            <div class="tools-spotlight-icon">
                                <i class="fa-solid fa-shuffle"></i>
                            </div>
                            <div>
                                <h5>Format & convert</h5>
                                <p>Run quick colour conversions, hash comparisons, and timestamp transforms when you need answers faster than writing bespoke scripts.</p>
                            </div>
                        </div>
                        <div class="tools-spotlight-item">
                            <div class="tools-spotlight-icon">
                                <i class="fa-solid fa-shield-heart"></i>
                            </div>
                            <div>
                                <h5>Safe sandbox</h5>
                                <p>The workspace lives inside our Docker stack. Restart it with <code>./scripts/tools-up.sh</code> if required and use the full-screen button for dedicated tabs.</p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        `;
    }

    async after_render() {
        const openTools = (event) => {
            event.preventDefault();
            window.open('/tools/it-tools', '_blank', 'noopener');
        };

        document.querySelectorAll('[data-open-tools]').forEach((trigger) => {
            trigger.addEventListener('click', openTools);
        });

        const normalizeHex = (hex) => {
            if (!hex) return '#ae2d1f';
            let value = hex.trim().replace('#', '');
            if (value.length === 3) {
                value = value.split('').map((char) => char + char).join('');
            }
            return `#${value.slice(0, 6)}`;
        };

        const mixHex = (hex, ratio) => {
            const normalized = normalizeHex(hex).replace('#', '');
            const r = parseInt(normalized.slice(0, 2), 16);
            const g = parseInt(normalized.slice(2, 4), 16);
            const b = parseInt(normalized.slice(4, 6), 16);

            const mixChannel = (value) => {
                if (ratio >= 0) {
                    return Math.round(value + (255 - value) * ratio);
                }
                return Math.round(value * (1 + ratio));
            };

            const toHex = (value) => value.toString(16).padStart(2, '0');

            return `#${toHex(mixChannel(r))}${toHex(mixChannel(g))}${toHex(mixChannel(b))}`;
        };

        const getAccentPalette = () => {
            const root = getComputedStyle(document.documentElement);
            const accent = normalizeHex(root.getPropertyValue('--accent-color') || '#ae2d1f');
            return {
                main: accent,
                bright: mixHex(accent, 0.35),
                bold: mixHex(accent, -0.15),
                hover: mixHex(accent, 0.5),
                active: mixHex(accent, -0.3),
            };
        };

        const iframe = document.querySelector('.tools-iframe-wrap iframe');
        const injectScrollbars = () => {
            if (!iframe?.contentDocument) return;
            const doc = iframe.contentDocument;
            if (doc.getElementById('hb-tools-scrollbars')) return;
            const palette = getAccentPalette();
            const style = doc.createElement('style');
            style.id = 'hb-tools-scrollbars';
            style.textContent = `
                :root,
                body {
                    scrollbar-width: thin;
                    scrollbar-color: ${palette.bold} rgba(8, 8, 12, 0.9);
                }

                ::-webkit-scrollbar {
                    width: 12px;
                    height: 12px;
                    background: transparent;
                }

                ::-webkit-scrollbar-track {
                    background: rgba(6, 6, 12, 0.95);
                    border-radius: 999px;
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.85);
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, ${palette.bright} 0%, ${palette.main} 95%);
                    border-radius: 999px;
                    border: 2px solid rgba(8, 8, 10, 0.85);
                    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.58), 0 0 10px ${palette.main}55;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, ${palette.hover} 0%, ${palette.main} 90%);
                    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.72), 0 0 12px ${palette.hover}55;
                }

                ::-webkit-scrollbar-thumb:active {
                    background: linear-gradient(180deg, ${palette.main} 5%, ${palette.active} 100%);
                }

                ::-webkit-scrollbar-corner {
                    background: transparent;
                }

                svg.gradient stop:nth-of-type(1) {
                    stop-color: ${palette.bright} !important;
                }

                svg.gradient stop:nth-of-type(2),
                svg.gradient stop:nth-of-type(3) {
                    stop-color: ${palette.main} !important;
                }

                svg.gradient path[fill="#14a058"] {
                    fill: ${palette.bold} !important;
                }

                svg.gradient path[fill="url(#a)"] {
                    fill: ${palette.main} !important;
                }

                a.support-button,
                [class*="support-button"],
                a[href*="buymeacoffee"],
                a[href*="buy-me-a-coffee"] {
                    display: none !important;
                }
            `;
            doc.head.appendChild(style);
        };

        const pruneSupportWidgets = () => {
            if (!iframe?.contentDocument) return;
            const doc = iframe.contentDocument;
            doc.querySelectorAll('a[href*="buymeacoffee"], .support-button').forEach((node) => {
                const wrapper = node.closest('div[data-v-6488e27f]') ?? node;
                wrapper.style.setProperty('display', 'none', 'important');
            });
        };

        if (iframe) {
            iframe.addEventListener('load', () => {
                try {
                    injectScrollbars();
                    pruneSupportWidgets();
                } catch (error) {
                    console.warn('Unable to inject it-tools scrollbar theme:', error);
                }
            });
            if (iframe.contentDocument?.readyState === 'complete') {
                injectScrollbars();
                pruneSupportWidgets();
            }
        }
    }
}
