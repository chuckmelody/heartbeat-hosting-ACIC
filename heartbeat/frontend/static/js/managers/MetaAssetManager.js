export default class MetaAssetManager {
    constructor(backgroundImageSrc) {
        this.backgroundImageSrc = backgroundImageSrc;
        // Define all possible image sizes that can be generated
        this.allDefaultImageSizes = [
            { name: 'og-image', width: 1200, height: 630, label: 'Social Card (1200x630)' },
            { name: 'logo-square', width: 300, height: 300, label: 'Square Logo (300x300)' },
            { name: 'pwa-icon-512x512', width: 512, height: 512, label: 'PWA Icon (512x512)' },
            { name: 'pwa-icon-256x256', width: 256, height: 256, label: 'PWA Icon (256x256)' },
            { name: 'pwa-icon-192x192', width: 192, height: 192, label: 'PWA Icon (192x192)' },
            { name: 'apple-touch-icon', width: 180, height: 180, label: 'Apple Touch Icon (180x180)' },
            { name: 'favicon-48x48', width: 48, height: 48, label: 'Favicon (48x48)' },
            { name: 'favicon-32x32', width: 32, height: 32, label: 'Favicon (32x32)' },
            { name: 'favicon-16x16', width: 16, height: 16, label: 'Favicon (16x16)' },
        ];
        // Define which of these sizes are considered "icons" that can be replaced by a favicon source
        this.iconTypeNames = [
            'pwa-icon-512x512', 'pwa-icon-256x256', 'pwa-icon-192x192',
            'apple-touch-icon', 'favicon-48x48', 'favicon-32x32', 'favicon-16x16'
        ];
    }

    async generateAllAssets(title, shortName, subtitle, description, siteUrl, twitterHandle, facebookUrl = '', linkedinUrl = '', faviconSourceImageSrc = null) {
        const generatedImages = [];
        let imagesToGenerateWithTextOverlay = [];
        let iconSizesToGenerateFromSource = [];

        if (faviconSourceImageSrc) {
            // If favicon source is provided, separate icon sizes from text overlay sizes
            imagesToGenerateWithTextOverlay = this.allDefaultImageSizes.filter(size => !this.iconTypeNames.includes(size.name));
            iconSizesToGenerateFromSource = this.allDefaultImageSizes.filter(size => this.iconTypeNames.includes(size.name));
        } else {
            // If no favicon source, all images are generated with text overlay
            imagesToGenerateWithTextOverlay = this.allDefaultImageSizes;
        }

        // Generate images with text overlay
        const textOverlayPromises = imagesToGenerateWithTextOverlay.map(size => this.generateTextOverlayImage(size, title, subtitle));
        generatedImages.push(...(await Promise.all(textOverlayPromises)).filter(Boolean));

        // Generate icons from source if provided
        if (faviconSourceImageSrc && iconSizesToGenerateFromSource.length > 0) {
            const faviconSet = await this.generateFaviconSet(faviconSourceImageSrc, iconSizesToGenerateFromSource);
            generatedImages.push(...faviconSet.filter(Boolean));
        } else if (!faviconSourceImageSrc && iconSizesToGenerateFromSource.length > 0) {
            // If no favicon source was provided, but there are icon sizes that would normally be generated from a source,
            // generate them using the text overlay method. This covers cases where iconTypeNames are defined but no source is given.
            const iconPromises = iconSizesToGenerateFromSource.map(size => this.generateTextOverlayImage(size, title, subtitle));
            generatedImages.push(...(await Promise.all(iconPromises)).filter(Boolean));
        }

        const generatedHeadHtml = this.generateHeaderCode(title, description, siteUrl, twitterHandle, facebookUrl, linkedinUrl); // Pass social URLs
        const generatedManifestJson = this.generateManifestJson(title, shortName, description, siteUrl, generatedImages); // Pass generatedImages for manifest screenshots

        return {
            images: generatedImages,
            headHtml: generatedHeadHtml,
            manifestJson: generatedManifestJson
        };
    }

    generateTextOverlayImage(size, title, subtitle) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            const ctx = canvas.getContext('2d');

            const bgImage = new Image();
            bgImage.src = this.backgroundImageSrc;
            bgImage.onload = () => {
                ctx.drawImage(bgImage, 0, 0, size.width, size.height);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, size.width, size.height);
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const titleFontSize = Math.max(24, size.width / 15);
                ctx.font = `bold ${titleFontSize}px Montserrat, sans-serif`;
                ctx.fillText(title, size.width / 2, size.height / 2 - (titleFontSize / 2));

                const subtitleFontSize = Math.max(14, size.width / 30);
                ctx.font = `${subtitleFontSize}px Quicksand, sans-serif`;
                ctx.fillText(subtitle, size.width / 2, size.height / 2 + (titleFontSize / 2));

                const dataUrl = canvas.toDataURL('image/png');
                resolve({ name: `${size.name}.png`, dataUrl, label: size.label });
            };
            bgImage.onerror = () => {
                console.error("Background image failed to load.");
                resolve(null);
            };
        });
    }

    async generateFaviconSet(sourceImageSrc, sizes) {
        const generatedFavicons = [];
        const sourceImage = new Image();
        sourceImage.src = sourceImageSrc;

        try {
            await new Promise((resolve, reject) => {
            sourceImage.onload = resolve;
            sourceImage.onerror = reject;
        }).catch(error => {
            console.error("Favicon source image failed to load:", error);
            return []; // Return empty if source fails
        });

        } catch (error) {
            console.error("Favicon source image failed to load:", error);
            return []; // Explicitly return empty array if source fails
        }

        for (const size of sizes) {
            const canvas = document.createElement('canvas');
            canvas.width = size.width;
            canvas.height = size.height;
            const ctx = canvas.getContext('2d');

            // Draw the source image, scaling it to fit the canvas
            // Maintain aspect ratio and center it
            const aspectRatio = sourceImage.width / sourceImage.height;
            let drawWidth = size.width;
            let drawHeight = size.height;
            if (aspectRatio > 1) { // Wider than tall
                drawHeight = size.width / aspectRatio;
            } else { // Taller than wide
                drawWidth = size.height * aspectRatio;
            }
            const xOffset = (size.width - drawWidth) / 2;
            const yOffset = (size.height - drawHeight) / 2;
            ctx.drawImage(sourceImage, xOffset, yOffset, drawWidth, drawHeight);

            const dataUrl = canvas.toDataURL('image/png');
            generatedFavicons.push({ name: `${size.name}.png`, dataUrl, label: size.label });
        }
        return generatedFavicons;
    }

    generateHeaderCode(title, description, siteUrl, twitterHandle, facebookUrl, linkedinUrl) {
        const socialLinks = [];
        if (facebookUrl) socialLinks.push(`"${facebookUrl}"`);
        if (twitterHandle) socialLinks.push(`"https://www.twitter.com/${twitterHandle.substring(1)}"`);
        if (linkedinUrl) socialLinks.push(`"${linkedinUrl}"`);

        const imagePath = '/static/img/meta/';
        return `
<!-- Basic Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${siteUrl}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${siteUrl}${imagePath}og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="${title}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${siteUrl}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${siteUrl}${imagePath}og-image.png">
<meta name="twitter:creator" content="${twitterHandle}">
<meta name="twitter:site" content="${twitterHandle}">

<!-- PWA, Favicons, and Other Icons -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#ae2d1f">
<link rel="apple-touch-icon" href="${imagePath}apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="180x180" href="${imagePath}apple-touch-icon.png"> 
<link rel="icon" type="image/png" sizes="16x16" href="${imagePath}favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="${imagePath}favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="${imagePath}favicon-48x48.png">
<link rel="icon" type="image/png" sizes="192x192" href="${imagePath}pwa-icon-192x192.png">
<link rel="icon" type="image/png" sizes="256x256" href="${imagePath}pwa-icon-256x256.png">
<link rel="icon" type="image/png" sizes="512x512" href="${imagePath}pwa-icon-512x512.png">

<!-- Structured Data (JSON-LD) for Google -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${title}",
  "url": "${siteUrl}",
  "logo": "${siteUrl}${imagePath}logo-square.png",
  "description": "${description}",
  "sameAs": [${socialLinks.join(',\n    ')}]
}
</script>
            `.trim();
    }

    generateManifestJson(title, shortName, description, siteUrl, generatedImages = []) {
        const manifest = {
            name: title,
            short_name: shortName,
            description: description,
            scope: "/",
            start_url: "/",
            display: "standalone",
            orientation: "portrait",
            background_color: "#121212",
            theme_color: "#ae2d1f",
            categories: ["business", "education", "lifestyle", "social"],
            icons: [
                {
                    "src": "/static/img/meta/pwa-icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/static/img/meta/pwa-icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "maskable"
                },
                {
                    "src": "/static/img/meta/pwa-icon-256x256.png",
                    "sizes": "256x256",
                    "type": "image/png"
                },
                {
                    "src": "/static/img/meta/pwa-icon-256x256.png",
                    "sizes": "256x256",
                    "type": "image/png",
                    "purpose": "maskable"
                },
                {
                    "src": "/static/img/meta/pwa-icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "/static/img/meta/pwa-icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "maskable"
                }
            ], // End of icons array
            "screenshots": [], // Initialize empty, then populate dynamically
            "shortcuts": [
                {
                    "name": "Contact Us",
                    "short_name": "Contact",
                    "description": `Get in touch with the ${title} team`,
                    "url": "/contact",
                    "icons": [{ "src": "/static/img/meta/shortcut-contact.png", "sizes": "96x96" }] // Assuming you'll provide these
                },
                {
                    "name": "View Events",
                    "short_name": "Events",
                    "description": `See our upcoming community events`,
                    "url": "/events",
                    "icons": [{ "src": "/static/img/meta/shortcut-events.png", "sizes": "96x96" }] // Assuming you'll provide these
                }
            ]
        };

        // Dynamically add screenshots based on generatedImages
        const screenshotAssets = generatedImages.filter(img => img.name.startsWith('screenshot-'));
        screenshotAssets.forEach(asset => {
            const match = asset.label.match(/\((\d+)x(\d+)\)/); // Extracts base dimensions like 1280x720
            let sizes = '0x0';
            if (match) {
                const width = parseInt(match[1], 10);
                const height = parseInt(match[2], 10);
                // The actual image is scaled by 2, so the manifest must reflect the real dimensions.
                sizes = `${width * 2}x${height * 2}`;
            }
            manifest.screenshots.push({
                "src": `/static/img/screenshots/${asset.name}`,
                "sizes": sizes,
                "type": "image/png",
                "form_factor": asset.name.includes('desktop') ? "wide" : "narrow",
                "label": asset.label.replace('Screenshot', title) // Use title for label
            });
        });

        return JSON.stringify(manifest, null, 2);
    }

    async createDownloadZip(generatedAssets) {
        // Ensure JSZip is available globally
        if (typeof window.JSZip === 'undefined') {
            console.error("JSZip library not loaded. Please ensure the JSZip CDN script is in your index.html.");
            alert("Error: JSZip library not loaded. Cannot create zip file.");
            return;
        }
        const zip = new window.JSZip();
        
        const instructions = `Instructions:\n1. Upload all .png images in this zip file to '/static/img/meta/' on your website.\n2. Upload the 'manifest.json' file to the root of your website.\n3. Copy the code from _header_tags.html and paste it into the <head> section of your main HTML file.`;
        zip.file('README.txt', instructions);
        zip.file('_header_tags.html', generatedAssets.headHtml);
        zip.file('manifest.json', generatedAssets.manifestJson);

        generatedAssets.images.forEach(img => {
            const base64Data = img.dataUrl.split(',')[1];
            zip.file(img.name, base64Data, { base64: true });
        });

        return zip.generateAsync({ type: "blob" });
    }
}