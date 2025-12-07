export default class TooltipManager {
    constructor() {
        this.tooltipElement = null;
        this._createTooltipElement();
    }

    _createTooltipElement() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.classList.add('tooltip');
        document.body.appendChild(this.tooltipElement);
    }

    init() {
        let activeTooltipTarget = null; // Tracks the element currently showing a tooltip

        document.body.addEventListener('mouseover', e => {
            const target = e.target.closest('[data-tooltip]');
            if (target && target !== activeTooltipTarget) {
                // If a new tooltip target is found, or it's a different one
                if (activeTooltipTarget) {
                    this.hide(); // Hide the previous one
                }
                this.show(target);
                activeTooltipTarget = target;
            }
        });

        document.body.addEventListener('mouseout', e => {
            // Only hide if the mouse is leaving the active tooltip target and not entering one of its children
            // This prevents flickering when moving mouse within the same tooltip-triggering element
            if (activeTooltipTarget && !activeTooltipTarget.contains(e.relatedTarget)) {
                this.hide();
                activeTooltipTarget = null;
            }
        });

        document.body.addEventListener('mousedown', () => this.hide());
    }

    show(target) {
        const tooltipText = target.getAttribute('data-tooltip');
        if (!tooltipText) return;

        this.tooltipElement.textContent = tooltipText;

        const targetRect = target.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();

        let top = targetRect.top - tooltipRect.height - 10; // 10px gap
        let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);

        // Prevent going off-screen
        if (top < 0) {
            top = targetRect.bottom + 10;
        }
        if (left < 0) {
            left = 5;
        }
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 5;
        }

        this.tooltipElement.style.top = `${top}px`;
        this.tooltipElement.style.left = `${left}px`;

        this.tooltipElement.classList.add('is-visible');
    }

    hide() {
        this.tooltipElement.classList.remove('is-visible');
    }
}