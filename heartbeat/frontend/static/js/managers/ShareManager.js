export default class ShareManager {
    constructor() {
        if (ShareManager.instance) {
            return ShareManager.instance;
        }
        ShareManager.instance = this;
    }

    async share(data) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: data.title || document.title,
                    text: data.text || '',
                    url: data.url || window.location.href,
                });
                console.log('Content shared successfully');
            } catch (error) {
                // We can ignore the AbortError which happens when the user cancels the share dialogue
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        } else {
            // Fallback for browsers that do not support the Web Share API
            navigator.clipboard.writeText(data.url || window.location.href).then(() => {
                alert('Link copied to clipboard!'); // Simple user feedback
            }).catch(err => {
                console.error('Could not copy link: ', err);
            });
        }
    }
}