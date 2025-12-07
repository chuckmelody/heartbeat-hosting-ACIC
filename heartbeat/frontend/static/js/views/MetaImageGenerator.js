import AbstractView from "./AbstractView.js";
import MetaAssetManager from "../managers/MetaAssetManager.js"; // Import the manager
import ModalManager from "../managers/ModalManager.js"; // Import ModalManager
import RightSidebar from "./_RightSidebar.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Meta Image Generator");
        // The background image can be easily changed here
        this.backgroundImageSrc = '/static/img/junior1.jpg';
    }

    async getHtml() {
        return `
            <div class="two-column-grid">
                <div class="main-content meta-image-generator-content">
                    <h2 class="page-title"><i class="fa-solid fa-wand-magic-sparkles fa-fw"></i> Meta & PWA Dashboard</h2>
                    
                    <!-- Controls Section -->
                    <div class="content-card">
                        <h3 class="content-subheader" style="margin-top: 0;">1. Configure Your Brand</h3>
                        <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
                            <div class="form-group">
                                <label for="meta-title">Site Title</label>
                                <input type="text" id="meta-title" value="Heartbeat A CIC">
                            </div>
                            <div class="form-group">
                                <label for="meta-shortname">PWA Short Name</label>
                                <input type="text" id="meta-shortname" value="Heartbeat">
                            </div>
                            <div class="form-group">
                                <label for="meta-subtitle">Image Subtitle</label>
                                <input type="text" id="meta-subtitle" value="Help us to help another.">
                            </div>
                            <div class="form-group">
                                <label for="twitter-handle">Twitter Handle (e.g., @YourHandle)</label>
                                <input type="text" id="twitter-handle" value="@HeartbeatACIC">
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="meta-description">Meta Description</label>
                                <textarea id="meta-description" rows="2">Heatbeat A CIC is a Community Interest Company dedicated to supporting community well-being through education, collaboration, and social innovation.</textarea>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="meta-url">Full Site URL</label>
                                <input type="text" id="meta-url" value="https://heartbeatacic.org">
                            </div>
                            <div class="form-group">
                                <label for="meta-facebook">Facebook URL (Optional)</label>
                                <input type="text" id="meta-facebook" value="">
                            </div>
                            <div class="form-group">
                                <label for="meta-linkedin">LinkedIn URL (Optional)</label>
                                <input type="text" id="meta-linkedin" value="">
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="background-image-upload">Upload Custom Background Image (Optional)</label>
                                <div class="custom-file-input-container">
                                    <input type="file" id="background-image-upload" class="custom-file-input" accept="image/*">
                                    <label for="background-image-upload" class="form-button secondary custom-file-label">
                                        <i class="fa-solid fa-upload fa-fw"></i> Choose File...
                                    </label>
                                    <span id="background-image-filename" class="file-name-display">No file chosen</span>
                                </div>
                                <div id="background-image-preview" class="image-upload-preview" style="background-image: url('${this.backgroundImageSrc}');">
                                    <span class="preview-text" style="${this.backgroundImageSrc ? 'display: none;' : ''}">Current / Uploaded Image</span>
                                </div>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="favicon-upload">Upload Favicon Source Image (Optional, for all favicons/PWA icons)</label>
                                <div class="custom-file-input-container">
                                    <input type="file" id="favicon-upload" class="custom-file-input" accept="image/*">
                                    <label for="favicon-upload" class="form-button secondary custom-file-label">
                                        <i class="fa-solid fa-upload fa-fw"></i> Choose File...
                                    </label>
                                    <span id="favicon-filename" class="file-name-display">No file chosen</span>
                                </div>
                                <div id="favicon-preview" class="image-upload-preview" style="background-image: url('/static/img/default-favicon.png');">
                                    <span class="preview-text">Current / Uploaded Favicon Source</span>
                                </div>
                            </div>
                        </div>
                        <button id="generate-images-btn" class="form-button">Generate Images</button>
                    </div>

                    <!-- New Screenshot Generator Section -->
                    <div class="content-card">
                        <h3 class="content-subheader" style="margin-top: 0;">Generate PWA Screenshots</h3>
                        <p>Enter the paths for the pages you want to capture (e.g., <code>/about</code>, <code>/contact</code>). The app will generate both desktop and mobile versions for each path using a backend service for pixel-perfect results.</p>
                        <div id="screenshot-paths-container" class="form-grid" style="grid-template-columns: 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label for="screenshot-path-1">Page Path 1</label>
                                <input type="text" id="screenshot-path-1" class="screenshot-path-input" value="/">
                            </div>
                            <div class="form-group">
                                <label for="screenshot-path-2">Page Path 2</label>
                                <input type="text" id="screenshot-path-2" class="screenshot-path-input" value="/events">
                            </div>
                            <div class="form-group">
                                <label for="screenshot-path-3">Page Path 3</label>
                                <input type="text" id="screenshot-path-3" class="screenshot-path-input" value="/store">
                            </div>
                            <div class="form-group">
                                <label for="screenshot-path-4">Page Path 4</label>
                                <input type="text" id="screenshot-path-4" class="screenshot-path-input" value="/about">
                            </div>
                            <div class="form-group">
                                <label for="screenshot-path-5">Page Path 5</label>
                                <input type="text" id="screenshot-path-5" class="screenshot-path-input" value="/contact">
                            </div>
                            <div class="form-group">
                                <label for="screenshot-path-6">Page Path 6</label>
                                <input type="text" id="screenshot-path-6" class="screenshot-path-input" value="/projects">
                            </div>
                            <button id="generate-all-screenshots-btn" class="form-button">
                                <i class="fa-solid fa-camera-retro fa-fw"></i> Generate All Screenshots
                            </button>
                        </div>
                    </div>

                    <!-- Output Section -->
                    <div id="output-dashboard" class="content-card" style="display: none;">
                        <div class="output-header">
                            <h3 class="content-subheader" style="margin-top: 0;">2. Generated Assets</h3>
                            <div class="dashboard-controls">
                                <div class="search-bar">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                    <input type="text" id="asset-search" placeholder="Filter assets...">
                                </div>
                                <button id="download-all-btn" class="form-button secondary"><i class="fa-solid fa-file-zipper fa-fw"></i> Download All (.zip)</button>
                            </div>
                        </div>
                        <div id="image-grid" class="image-grid">
                            <!-- Generated images will be appended here -->
                      </div>
                        
                        <div class="code-tabs">
                            <button class="code-tab-btn is-active" data-tab="head-code">Head Tags</button>
                            <button class="code-tab-btn" data-tab="manifest-code">manifest.json</button>
                            <button class="code-tab-btn" data-tab="screenshot-instructions-code">Screenshot Instructions</button>
                            <button class="code-tab-btn" data-tab="instructions-code">Instructions</button>
                        </div>
                        <div id="head-code" class="code-panel is-active">
                            <pre><code id="code-output-head" class="language-html"></code></pre>
                            <button class="form-button secondary copy-code-btn" data-target="code-output-head"><i class="fa-solid fa-copy fa-fw"></i> Copy Head Code</button>
                        </div>
                        <div id="manifest-code" class="code-panel">
                            <pre><code id="code-output-manifest" class="language-json"></code></pre>
                            <button class="form-button secondary copy-code-btn" data-target="code-output-manifest"><i class="fa-solid fa-copy fa-fw"></i> Copy Manifest Code</button>
                        </div>                        
                        <div id="screenshot-instructions-code" class="code-panel">
                            <div class="instructions">
                                <h3 class="content-subheader" style="margin-top: 0;">How It Works</h3>
                                <p>This tool uses a backend Playwright service for generating high-quality, accurate screenshots of your application pages.</p>
                                <h4>Step 1: Run the Services</h4>
                                <p>For this feature to work, both your main application server and the screenshot server must be running. Open two terminals:</p>
                                <ol>
                                    <li>In the first terminal, run the main app: <code>node server.js</code></li>
                                    <li>In the second terminal, run the screenshot service: <code>node screenshot-server.js</code></li>
                                </ol>
                                <h4>Step 2: Generate Screenshots</h4>
                                <ul>
                                    <li>Enter the paths for the pages you want to capture (e.g., <code>/about</code>, <code>/contact</code>).</li>
                                    <li>Click the "Generate All Screenshots" button.</li>
                                    <li>The dashboard will send requests to the backend service, which will launch a headless browser, navigate to each page, and return a perfect screenshot.</li>
                                </ul>
                            </div>
                        </div>
                        <div id="instructions-code" class="code-panel">
                            <div class="instructions">
                                <h3 class="content-subheader" style="margin-top: 0;">Implementation Guide</h3>
                                <p><strong>Step 1: Upload Your Files</strong></p>
                                <p>After downloading the <code>.zip</code> file, upload the contents to your web server in the following locations:</p>
                                <ul>
                                    <li>Upload all <strong><code>.png</code></strong> images to: <strong><code>/static/img/meta/</code></strong></li>
                                    <li>Upload the <strong><code>manifest.json</code></strong> file to the <strong>root directory</strong> of your website (e.g., alongside <code>index.html</code>).</li>
                                    <li>Upload the two <strong><code>.svg</code></strong> files (<code>favicon.svg</code> and <code>safari-pinned-tab.svg</code>) to the <strong>root directory</strong> of your website.</li>
                                </ul>
                                <p><strong>Step 2: Add Code to Your HTML</strong></p>
                                <p>Copy the complete <strong>Head Tags</strong> code block above and paste it inside the <code>&lt;head&gt;</code> section of your main <code>index.html</code> file. This single block contains all the necessary tags to make your new images work correctly across all platforms.</p>
                            </div>
                        </div>
                    </div>
                </div>
                ${await RightSidebar.render()}
            </div>
        `;
    }

    async after_render() {
        const metaAssetManager = new MetaAssetManager(this.backgroundImageSrc);
        this.modalManager = new ModalManager(); // Instantiate ModalManager and make it a class property

        const generateBtn = document.getElementById('generate-images-btn'); // Correctly declared
        const downloadAllBtn = document.getElementById('download-all-btn');
        const titleInput = document.getElementById('meta-title');
        const shortnameInput = document.getElementById('meta-shortname'); // Correctly declared
        const subtitleInput = document.getElementById('meta-subtitle');
        const descriptionInput = document.getElementById('meta-description');
        const urlInput = document.getElementById('meta-url');
        const twitterInput = document.getElementById('twitter-handle');
        const facebookInput = document.getElementById('meta-facebook');
        const linkedinInput = document.getElementById('meta-linkedin');
        const outputDashboard = document.getElementById('output-dashboard');
        const instructionsContainer = document.getElementById('instructions-container');
        const imageGrid = document.getElementById('image-grid'); // Declare imageGrid here
        const assetSearchInput = document.getElementById('asset-search');
        const codeOutputHead = document.getElementById('code-output-head');
        const codeOutputManifest = document.getElementById('code-output-manifest');
        // New favicon elements
        const faviconUploadInput = document.getElementById('favicon-upload');
        const faviconPreview = document.getElementById('favicon-preview');

        const codeTabs = document.querySelectorAll('.code-tab-btn');
        const codePanels = document.querySelectorAll('.code-panel');
        const copyCodeBtns = document.querySelectorAll('.copy-code-btn');
        const backgroundImageUploadInput = document.getElementById('background-image-upload');
        const backgroundImagePreview = document.getElementById('background-image-preview');

        // Screenshot elements
        const screenshotPathInputs = document.querySelectorAll('.screenshot-path-input');
        const generateAllScreenshotsBtn = document.getElementById('generate-all-screenshots-btn');

        // This object will hold the generated assets from MetaAssetManager,
        // separating meta images and PWA screenshots for better management.
        let currentGeneratedAssets = {
            metaImages: [],
            pwaScreenshots: [],
            headHtml: '',
            manifestJson: ''
        };
        this.faviconSrc = null; // New property to hold uploaded favicon source

        // Helper function to render all images (meta and screenshots)
        const renderAllImages = (clearGrid = true) => {
            if (clearGrid) {
                imageGrid.innerHTML = ''; // Clear existing images
            }
            // If not clearing the grid, it means screenshots were just generated, and we only need to add meta images.
            const imagesToRender = clearGrid ? [...currentGeneratedAssets.metaImages, ...currentGeneratedAssets.pwaScreenshots] : [...currentGeneratedAssets.metaImages];

            console.log(`[DEBUG] renderAllImages called. currentGeneratedAssets.metaImages:`, currentGeneratedAssets.metaImages);
            console.log(`[DEBUG] renderAllImages called. currentGeneratedAssets.pwaScreenshots:`, currentGeneratedAssets.pwaScreenshots);
            console.log(`[DEBUG] renderAllImages combining to imagesToRender:`, imagesToRender);
            imagesToRender.forEach(result => {
                if (result) {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = 'generated-image-item';
                    imgContainer.dataset.filterName = result.label.toLowerCase();
                    imgContainer.innerHTML = `
                        <a href="${result.dataUrl}" target="_blank" class="image-preview-wrapper" data-tooltip="View actual size">
                            <img src="${result.dataUrl}" alt="${result.label}">
                        </a>
                        <div class="image-item-info">
                            <span>${result.label}</span>
                            <a href="${result.dataUrl}" download="${result.name}" class="download-link" data-tooltip="Download PNG"><i class="fa-solid fa-download"></i></a>
                        </div>
                    `;
                    imageGrid.insertAdjacentElement('afterbegin', imgContainer);
                }
            });
        };

        generateBtn.addEventListener('click', async () => {
            imageGrid.innerHTML = '<p>Generating...</p>';
            outputDashboard.style.display = 'block';
            const title = titleInput.value;
            const shortName = shortnameInput.value;
            const subtitle = subtitleInput.value;
            const description = descriptionInput.value;
            const siteUrl = urlInput.value;
            const twitterHandle = twitterInput.value; // Get value
            const facebookUrl = facebookInput.value;
            const linkedinUrl = linkedinInput.value;
            const faviconSource = this.faviconSrc; // Use the uploaded favicon source
            
            // Generate only the meta images
            const textOverlayPromises = metaAssetManager.allDefaultImageSizes
                .filter(size => !metaAssetManager.iconTypeNames.includes(size.name))
                .map(size => metaAssetManager.generateTextOverlayImage(size, title, subtitle));

            const iconPromises = faviconSource 
                ? metaAssetManager.generateFaviconSet(faviconSource, metaAssetManager.allDefaultImageSizes.filter(size => metaAssetManager.iconTypeNames.includes(size.name)))
                : metaAssetManager.allDefaultImageSizes.filter(size => metaAssetManager.iconTypeNames.includes(size.name)).map(size => metaAssetManager.generateTextOverlayImage(size, title, subtitle));

            const generatedMetaImages = await Promise.all([...textOverlayPromises, ...iconPromises]);
            currentGeneratedAssets.metaImages = generatedMetaImages.flat().filter(Boolean);

            // --- UNIFIED UPDATE LOGIC ---
            // Now, generate both head tags and manifest using ALL available assets
            currentGeneratedAssets.headHtml = metaAssetManager.generateHeaderCode(title, description, siteUrl, twitterHandle, facebookUrl, linkedinUrl);
            currentGeneratedAssets.manifestJson = metaAssetManager.generateManifestJson(
                title, shortName, description, siteUrl, [...currentGeneratedAssets.metaImages, ...currentGeneratedAssets.pwaScreenshots]
            );

            // Render all images (meta + screenshots)
            renderAllImages(); 

            // Update UI from the single source of truth
            codeOutputHead.textContent = currentGeneratedAssets.headHtml;
            codeOutputManifest.textContent = currentGeneratedAssets.manifestJson;
        });

        // Handle screenshot generation using the Playwright backend service
        generateAllScreenshotsBtn.addEventListener('click', async () => {
            const pathsToCapture = Array.from(screenshotPathInputs).map(input => input.value).filter(path => path.trim() !== '');
            if (pathsToCapture.length === 0) {
                alert('Please enter at least one page path to generate screenshots.');
                return;
            }

            generateAllScreenshotsBtn.disabled = true;
            outputDashboard.style.display = 'block'; // Ensure output dashboard is visible
            generateAllScreenshotsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin fa-fw"></i> Generating...';

            // Clear existing PWA screenshots to prevent duplicates on re-generation
            currentGeneratedAssets.pwaScreenshots = [];

            // --- IMPROVED UX: RENDER PLACEHOLDERS FIRST ---
            const placeholderAssets = [];
            pathsToCapture.forEach(path => {
                if (!path.startsWith('/')) return;
                const screenshotSizes = [
                    { width: 1280, height: 720, nameSuffix: '-desktop', labelSuffix: 'Desktop' },
                    { width: 720, height: 1280, nameSuffix: '-mobile', labelSuffix: 'Mobile' }
                ];
                screenshotSizes.forEach(size => {
                    const placeholder = {
                        id: `placeholder-${path.replace(/\//g, '-')}-${size.nameSuffix}`,
                        label: `Generating... (${path}) ${size.labelSuffix}`
                    };
                    placeholderAssets.push(placeholder);
                });
            });

            // Render placeholders with spinners
            imageGrid.innerHTML = ''; // Clear grid first
            placeholderAssets.forEach(p => {
                const placeholderCard = `<div class="generated-image-item" id="${p.id}"><div class="image-preview-wrapper is-loading"><i class="fa-solid fa-spinner fa-spin"></i></div><div class="image-item-info"><span>${p.label}</span></div></div>`;
                imageGrid.insertAdjacentHTML('beforeend', placeholderCard);
            });

            // --- IMPROVED PARALLEL PROCESSING ---
            // Create an array of promises for all screenshot requests.
            const screenshotPromises = [];

            pathsToCapture.forEach(path => {
                if (!path.startsWith('/')) {
                    console.warn(`Skipping invalid path: ${path}`);
                    return; // 'continue' equivalent in forEach
                }
                const screenshotSizes = [
                    { width: 1280, height: 720, nameSuffix: '-desktop', labelSuffix: 'Desktop' },
                    { width: 720, height: 1280, nameSuffix: '-mobile', labelSuffix: 'Mobile' }
                ];

                screenshotSizes.forEach(size => {
                    console.log(`[Queueing Screenshot] Path: "${path}", Size: ${size.width}x${size.height}`);
                    const promise = fetch('http://localhost:7767/api/generate-screenshot', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'X-API-Secret': 'your-default-secret-key' // SECURITY: Add the secret key
                        },
                        body: JSON.stringify({ path, width: size.width, height: size.height })
                    })
                    .then(response => {
                        if (!response.ok) throw new Error(`Screenshot for ${path} failed: ${response.statusText}`);
                        return response.json();
                    })
                    .then(result => {
                        const asset = { // Return a structured object on success
                        id: `placeholder-${path.replace(/\//g, '-')}-${size.nameSuffix}`, // ID to find the placeholder
                        name: `screenshot${path.replace(/\//g, '-') || '-home'}${size.nameSuffix}.png`,
                        dataUrl: result.dataUrl,
                        label: `Screenshot (${path}) ${size.labelSuffix} (${size.width}x${size.height})`
                        };
                        // --- IMPROVED UX: UPDATE PLACEHOLDER ---
                        const cardToUpdate = document.getElementById(asset.id);
                        if (cardToUpdate) {
                            cardToUpdate.innerHTML = `
                                <a href="${asset.dataUrl}" target="_blank" class="image-preview-wrapper" data-tooltip="View actual size">
                                    <img src="${asset.dataUrl}" alt="${asset.label}">
                                </a>
                                <div class="image-item-info">
                                    <span>${asset.label}</span>
                                    <a href="${asset.dataUrl}" download="${asset.name}" class="download-link" data-tooltip="Download PNG"><i class="fa-solid fa-download"></i></a>
                                </div>
                            `;
                        }
                        return asset;
                    })
                    .catch(error => { // Catch errors for individual promises
                        console.error(`Error generating screenshot for path: ${path}`, error);
                        this.modalManager.showInfoModal('Error', `Failed to generate screenshot for ${path}. Make sure the Playwright server is running. Check console for details.`);
                        return null; // Return null for failed promises
                    });
                    screenshotPromises.push(promise);
                });
            });

            // Wait for all promises to resolve
            const results = await Promise.all(screenshotPromises);
            const allGeneratedScreenshots = results.filter(Boolean); // Filter out any nulls from failed promises            
            
            currentGeneratedAssets.pwaScreenshots = allGeneratedScreenshots;
            const currentTitle = titleInput.value;
            const currentShortName = shortnameInput.value;
            const currentDescription = descriptionInput.value;
            const currentSiteUrl = urlInput.value; // Corrected variable name
            const twitterHandle = twitterInput.value;
            const facebookUrl = facebookInput.value;
            const linkedinUrl = linkedinInput.value;

            // --- UNIFIED UPDATE LOGIC ---
            // Re-generate both head tags and manifest using ALL available assets
            currentGeneratedAssets.headHtml = metaAssetManager.generateHeaderCode(currentTitle, currentDescription, currentSiteUrl, twitterHandle, facebookUrl, linkedinUrl);
            currentGeneratedAssets.manifestJson = metaAssetManager.generateManifestJson(
                currentTitle, currentShortName, currentDescription, currentSiteUrl, [...currentGeneratedAssets.metaImages, ...currentGeneratedAssets.pwaScreenshots]
            );
            
            // --- FIX: Update both code output tabs ---
            codeOutputHead.textContent = currentGeneratedAssets.headHtml;
            codeOutputManifest.textContent = currentGeneratedAssets.manifestJson;

            // Provide user feedback
            this.modalManager.showInfoModal('Success', `${allGeneratedScreenshots.length} screenshots generated successfully!`);

            generateAllScreenshotsBtn.disabled = false;
            generateAllScreenshotsBtn.innerHTML = '<i class="fa-solid fa-camera-retro fa-fw"></i> Generate All Screenshots';
        });

        downloadAllBtn.addEventListener('click', async () => {
            const allImagesForZip = [...currentGeneratedAssets.metaImages, ...currentGeneratedAssets.pwaScreenshots];
            if (allImagesForZip.length === 0) {
                alert("Please generate the images first.");
                return;
            }

            try {
                console.log(`[DEBUG] Download All button clicked. Preparing zip.`);
                // Create a temporary object that MetaAssetManager.createDownloadZip expects
                const assetsToZip = {
                    images: allImagesForZip,
                    headHtml: currentGeneratedAssets.headHtml,
                    manifestJson: currentGeneratedAssets.manifestJson
                };

                console.log(`[DEBUG] Assets to be zipped:`, assetsToZip);
                const zipContentBlob = await metaAssetManager.createDownloadZip(assetsToZip);
                if (!zipContentBlob) {
                    console.error("Zip content was null or undefined, download aborted.");
                    alert("Failed to create zip file. No content generated.");
                    return;
                }
                const link = document.createElement('a');
                link.href = URL.createObjectURL(zipContentBlob);
                link.download = "meta_assets.zip";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Error during zip file generation or download:", error);
                alert("Failed to generate or download zip file. Check console for details.");
            }
        });

        // Handle custom background image upload
        backgroundImageUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                // Update filename display
                document.getElementById('background-image-filename').textContent = file.name;

                reader.onload = (e) => {
                    const newImageSrc = e.target.result;
                    // Update the view's internal state
                    this.backgroundImageSrc = newImageSrc;
                    // Update the manager's internal state (MetaAssetManager's backgroundImageSrc is public)
                    metaAssetManager.backgroundImageSrc = newImageSrc;
                    // Update the preview
                    backgroundImagePreview.style.backgroundImage = `url('${newImageSrc}')`;
                    backgroundImagePreview.querySelector('.preview-text').style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else {
                // If no file selected (e.g., user opened dialog and cancelled), revert to default.
                const defaultImage = '/static/img/junior1.jpg';
                this.backgroundImageSrc = defaultImage;
                metaAssetManager.backgroundImageSrc = defaultImage;
                backgroundImagePreview.style.backgroundImage = `url('${defaultImage}')`;
                backgroundImagePreview.querySelector('.preview-text').style.display = 'block';
                document.getElementById('background-image-filename').textContent = 'No file chosen';
            }
        });

        // Handle favicon upload
        faviconUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                // Update filename display
                document.getElementById('favicon-filename').textContent = file.name;

                reader.onload = (e) => {
                    const newImageSrc = e.target.result;
                    this.faviconSrc = newImageSrc; // Update view's favicon source
                    faviconPreview.style.backgroundImage = `url('${newImageSrc}')`;
                    faviconPreview.querySelector('.preview-text').style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else {
                // If no file selected, revert to default
                const defaultFavicon = '/static/img/default-favicon.png';
                this.faviconSrc = null; // Clear custom favicon source
                faviconPreview.style.backgroundImage = `url('${defaultFavicon}')`;
                faviconPreview.querySelector('.preview-text').style.display = 'block';
                document.getElementById('favicon-filename').textContent = 'No file chosen';
            }
        });


        copyCodeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const textToCopy = document.getElementById(targetId).textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fa-solid fa-check fa-fw"></i> Copied!';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            });
        });
        
        assetSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.generated-image-item').forEach(item => {
                const itemName = item.dataset.filterName;
                if (itemName.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        codeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                codeTabs.forEach(t => t.classList.remove('is-active'));
                codePanels.forEach(p => p.classList.remove('is-active'));
                tab.classList.add('is-active');
                document.getElementById(tab.dataset.tab).classList.add('is-active');
            });
        });
    }
}