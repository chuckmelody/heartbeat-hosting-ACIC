export default class MailManager {
    constructor() {
        if (MailManager.instance) {
            return MailManager.instance;
        }
        MailManager.instance = this;
    }

    async send(data) {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
 
            if (!response.ok) {
                // Handle server errors (e.g., 500 Internal Server Error)
                return { success: false, message: 'An error occurred on the server. Please try again.' };
            }
 
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Network or fetch error:", error);
            return { success: false, message: 'A network error occurred. Please check your connection.' };
        }
    }
}