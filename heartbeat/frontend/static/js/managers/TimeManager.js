export default class TimeManager {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.error(`TimeManager: Element with id "${elementId}" not found.`);
            return;
        }
        this.intervalId = null;
    }

    start() {
        this.updateTime(); // Update immediately on start
        this.intervalId = setInterval(() => this.updateTime(), 1000); // Update every second
    }

    stop() {
        clearInterval(this.intervalId);
    }

    updateTime() {
        this.element.textContent = this._getFormattedDateTime();
    }

    _getFormattedDateTime() {
        const now = new Date();

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const day = now.getDate();
        const daySuffix = this._getDaySuffix(day);

        let dateString = now.toLocaleDateString('en-GB', options);
        dateString = dateString.replace(day, `${day}${daySuffix}`);

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        return `${dateString}, ${timeString}`;
    }

    _getDaySuffix(day) {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }
}