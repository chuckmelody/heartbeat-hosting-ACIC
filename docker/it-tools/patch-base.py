#!/usr/bin/env python3
import glob
import os
import re
import sys
import textwrap

BASE = os.environ.get("IT_TOOLS_BASE", "/tools/it-tools/") or "/"
if not BASE.startswith("/"):
    BASE = "/" + BASE
if not BASE.endswith("/"):
    BASE = BASE + "/"

def normalize_hex(value: str) -> str:
    value = (value or "#ae2d1f").strip().lstrip("#")
    if len(value) == 3:
        value = "".join(ch * 2 for ch in value)
    value = (value + "0" * 6)[:6]
    return f"#{value.lower()}"


def mix_hex(value: str, ratio: float) -> str:
    normalized = normalize_hex(value)[1:]
    r = int(normalized[0:2], 16)
    g = int(normalized[2:4], 16)
    b = int(normalized[4:6], 16)

    def mix(channel: int) -> int:
        if ratio >= 0:
            return min(255, round(channel + (255 - channel) * ratio))
        return max(0, round(channel * (1 + ratio)))

    return "#{:02x}{:02x}{:02x}".format(mix(r), mix(g), mix(b))


ACCENT = normalize_hex(os.environ.get("HB_ACCENT_COLOR", "#ae2d1f"))
PALETTE = {
    "main": ACCENT,
    "bright": mix_hex(ACCENT, 0.35),
    "bold": mix_hex(ACCENT, -0.18),
    "hover": mix_hex(ACCENT, 0.55),
    "active": mix_hex(ACCENT, -0.35),
}

bundle_paths = glob.glob("/usr/share/nginx/html/assets/index-*.js")
if not bundle_paths:
    print("Unable to locate index bundle to patch BASE_URL", file=sys.stderr)
    sys.exit(1)

patched = []
for bundle_path in bundle_paths:
    with open(bundle_path, "r", encoding="utf-8") as fh:
        content = fh.read()

    new_content = content.replace('BASE_URL:"/"', f'BASE_URL:"{BASE}"')
    new_content, _ = re.subn(
        r'(baseUrl\{[^}]*default:)"\/"',
        r'\1"' + BASE + '"',
        new_content,
        count=1,
    )

    if new_content == content:
        continue

    with open(bundle_path, "w", encoding="utf-8") as fh:
        fh.write(new_content)

    patched.append(bundle_path)

if not patched:
    print("BASE_URL literal not found in any bundle; patch failed", file=sys.stderr)
    sys.exit(2)

print(f"Patched bundle(s): {', '.join(patched)}")

def gather_html_targets():
    targets = set()
    base_dir = "/usr/share/nginx/html"
    if os.path.isdir(base_dir):
        targets.add(os.path.join(base_dir, "index.html"))
        targets.update(glob.glob(os.path.join(base_dir, "**", "*.html"), recursive=True))
    return sorted(path for path in targets if os.path.isfile(path))


def build_theme_snippet():
    return textwrap.dedent(
        """
        <!-- Heartbeat theme injection -->
        <style id="hb-heartbeat-theme">
            :root {{
                --hb-accent: {main};
                --hb-accent-bright: {bright};
                --hb-accent-bold: {bold};
                --n-primary-color: var(--hb-accent);
                --n-primary-color-hover: var(--hb-accent-bright);
                --n-primary-color-pressed: var(--hb-accent-bold);
                --n-primary-color-suppl: var(--hb-accent);
                --n-item-text-color-active: var(--hb-accent);
                --n-item-text-color-active-hover: var(--hb-accent-bright);
                --n-item-icon-color-active: var(--hb-accent);
                --n-item-icon-color-active-hover: var(--hb-accent-bright);
                --n-item-border-color-active: var(--hb-accent);
                --n-info-color: var(--hb-accent);
                --n-success-color: var(--hb-accent);
                --n-input-border-color: var(--hb-accent);
                --n-input-border-color-hover: var(--hb-accent-bright);
                --n-input-border-color-pressed: var(--hb-accent-bold);
                --n-base-selection-border-color: var(--hb-accent);
                --n-base-selection-border-color-hover: var(--hb-accent-bright);
                --n-base-selection-border-color-active: var(--hb-accent);
                --n-color-picker-border-color: var(--hb-accent);
                --n-border-color: rgba(255, 255, 255, 0.08);
                --n-border-color-hover: rgba(255, 255, 255, 0.2);
                --n-border-color-pressed: rgba(255, 255, 255, 0.25);
                --n-border-radius: 4px;
                --n-border-radius-large: 4px;
                --n-close-color-hover: var(--hb-accent-bright);
                --n-color: rgba(12, 12, 18, 0.9);
                --n-color-hover: rgba(15, 15, 22, 0.95);
                --n-color-pressed: rgba(10, 10, 15, 0.95);
                --n-color-target: rgba(12, 12, 18, 0.95);
                --n-button-border-radius: 4px;
                --n-button-text-color: #f8f8ff;
                --n-button-text-color-hover: #fff;
                --n-loading-color: var(--hb-accent);
                --n-border-radius-circle: 4px;
            }}

            body {{
                scrollbar-width: thin;
                scrollbar-color: var(--hb-accent-bold) rgba(6, 6, 12, 0.95);
                background: radial-gradient(circle at 20% 20%, rgba(174, 45, 31, 0.08), rgba(6, 6, 10, 0.95)) !important;
                color: #f8f8ff;
            }}

            body, #app {{
                min-height: 100vh;
                background-color: #0b0c11;
            }}

            .n-layout, .n-layout-scroll-container, .n-scrollbar, .n-scrollbar-content {{
                background: transparent !important;
            }}

            .n-card, .n-collapse, .n-collapse-item, .n-tabs-pane, .n_drawer {{
                background: rgba(12, 12, 18, 0.9) !important;
                border-radius: 4px !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                box-shadow: 0 25px 60px rgba(9, 11, 22, 0.45) !important;
            }}

            .n-card-header, .n-card__content, .n-collapse-item__content-inner {{
                background: transparent !important;
            }}

            .n-input, .n-input--textarea, .n-select, .n-base-selection-label, .n-input-number, .n-upload-dragger {{
                background: rgba(20, 20, 26, 0.9) !important;
                border-radius: 4px !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                color: #f2f4ff !important;
            }}

            .n-input:hover,
            .n-input--textarea:hover,
            .n-select:hover,
            .n-base-selection:hover,
            .n-base-selection-label:hover,
            .n-input-number:hover,
            .n-upload-dragger:hover {{
                border-color: var(--hb-accent) !important;
                box-shadow: 0 0 0 1px var(--hb-accent) inset !important;
            }}

            .n-input:focus-within, .n-select:focus-within, .n-base-selection:focus-within {{
                border-color: var(--hb-accent) !important;
                box-shadow: 0 0 0 1px var(--hb-accent) inset !important;
                background: rgba(20, 8, 8, 0.92) !important;
            }}

            .n-button {{
                border-radius: 4px !important;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }}

            .n-button--primary-type {{
                background: linear-gradient(135deg, var(--hb-accent) 0%, var(--hb-accent-bold) 100%) !important;
                border: 1px solid var(--hb-accent-bold) !important;
                color: #fff !important;
            }}

            .n-button--primary-type:hover {{
                background: linear-gradient(135deg, var(--hb-accent-bright) 0%, var(--hb-accent) 100%) !important;
            }}

            .n-switch {{
                --n-switch-rail-background-color-active: var(--hb-accent);
                --n-switch-rail-border-color-active: var(--hb-accent);
                --n-switch-rail-background-color-hover: var(--hb-accent-bright);
            }}

            .n-tabs-nav-scroll-content, .n-tabs, .n-tabs-nav {{
                --n-tab-text-color-active: var(--hb-accent);
                --n-tab-text-color-hover: var(--hb-accent-bright);
            }}

            .n-gradient-text {{
                --n-color-start: var(--hb-accent);
                --n-color-end: var(--hb-accent-bright);
            }}

            ::-webkit-scrollbar {{
                width: 12px;
                height: 12px;
                background: transparent;
            }}

            ::-webkit-scrollbar-track {{
                background: rgba(6, 6, 12, 0.95);
                border-radius: 999px;
                border: 1px solid rgba(255, 255, 255, 0.04);
                box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.85);
            }}

            ::-webkit-scrollbar-thumb {{
                background: linear-gradient(180deg, var(--hb-accent-bright) 0%, var(--hb-accent) 95%);
                border-radius: 999px;
                border: 2px solid rgba(8, 8, 10, 0.85);
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.58), 0 0 10px var(--hb-accent);
            }}

            ::-webkit-scrollbar-thumb:hover {{
                background: linear-gradient(180deg, {hover} 0%, var(--hb-accent) 90%);
                box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.72), 0 0 12px {hover};
            }}

            ::-webkit-scrollbar-thumb:active {{
                background: linear-gradient(180deg, var(--hb-accent) 5%, {active} 100%);
            }}

            svg.gradient stop:nth-of-type(1) {{
                stop-color: var(--hb-accent-bright) !important;
            }}

            svg.gradient stop:nth-of-type(2),
            svg.gradient stop:nth-of-type(3) {{
                stop-color: var(--hb-accent) !important;
            }}

            svg.gradient path[fill="#14a058"] {{
                fill: var(--hb-accent-bold) !important;
            }}

            svg.gradient path[fill="url(#a)"] {{
                fill: var(--hb-accent) !important;
            }}

            a.support-button,
            [class*="support-button"],
            a[href*="buymeacoffee"],
            a[href*="buy-me-a-coffee"] {{
                display: none !important;
            }}
        </style>
        <script id="hb-heartbeat-sanitize">
            (function () {{
                const hideSupport = () => {{
                    document
                        .querySelectorAll('a[href*="buymeacoffee"], .support-button')
                        .forEach((node) => {{
                            const target = node.closest('[data-v-6488e27f]') || node;
                            target.style.setProperty('display', 'none', 'important');
                        }});
                }};
                hideSupport();
                const observer = new MutationObserver(hideSupport);
                observer.observe(document.documentElement, {{ childList: true, subtree: true }});
            }})();
        </script>
        """
    ).format(**PALETTE)


def brand_html_document(path: str, snippet: str) -> bool:
    with open(path, "r", encoding="utf-8") as page:
        html = page.read()

    original = html
    replacements = {
        "IT Tools - Handy online tools for developers": "Heartbeat Utility Bench · IT Tools",
        "Handy online tools for developers": "Heartbeat Utility Bench",
    }

    new_description = (
        "Self-hosted checksum, encoding, colour, and network utilities running safely inside "
        "dev.heartbeat.local so sensitive data never leaves Heartbeat A CIC."
    )
    escaped_description = new_description.replace("&", "&amp;")

    description_targets = [
        'content="Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers &amp; people working in IT."',
        "Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers &amp; people working in IT.",
    ]

    for target in description_targets:
        html = html.replace(target, escaped_description if "&amp;" in target else new_description)

    for old, new in replacements.items():
        html = html.replace(old, new)

    html = html.replace('stop-color="#25636c"', f'stop-color="{PALETTE["bright"]}"')
    html = html.replace('stop-color="#3b956f"', f'stop-color="{PALETTE["main"]}"')
    html = html.replace('stop-color="#14a058"', f'stop-color="{PALETTE["main"]}"')
    html = html.replace('fill="#14a058"', f'fill="{PALETTE["bold"]}"')

    if "hb-heartbeat-theme" not in html and "</head>" in html:
        html = html.replace("</head>", snippet + "\n</head>", 1)

    if html != original:
        with open(path, "w", encoding="utf-8") as page:
            page.write(html)
        return True

    return False


theme_snippet = build_theme_snippet()
branded_targets = []
for candidate in gather_html_targets():
    try:
        if brand_html_document(candidate, theme_snippet):
            branded_targets.append(candidate)
    except Exception as error:
        print(f"Failed to brand {candidate}: {error}", file=sys.stderr)

if branded_targets:
    print(f"Heartbeat branding injected into: {', '.join(branded_targets)}")
else:
    print("No HTML branding targets updated; upstream layout may have changed", file=sys.stderr)

def replace_hex_everywhere(root: str, original: str, replacement: str) -> list[str]:
    pattern = re.compile(re.escape(original), re.IGNORECASE)
    touched = []
    for path in glob.glob(os.path.join(root, "**", "*"), recursive=True):
        if not os.path.isfile(path):
            continue
        if not path.endswith((".css", ".js", ".html", ".svg")):
            continue
        with open(path, "r", encoding="utf-8", errors="ignore") as fh:
            content = fh.read()
        new_content, count = pattern.subn(replacement, content)
        if count:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(new_content)
            touched.append(path)
    return touched

HEX_OVERRIDE_TARGET = "#36AD6AFF"
recolored_files = replace_hex_everywhere("/usr/share/nginx/html", HEX_OVERRIDE_TARGET, ACCENT)
if recolored_files:
    print(f"Swapped {HEX_OVERRIDE_TARGET} -> {ACCENT} in {len(recolored_files)} asset(s).")
else:
    print(f"No occurrences of {HEX_OVERRIDE_TARGET} found; nothing replaced.")
