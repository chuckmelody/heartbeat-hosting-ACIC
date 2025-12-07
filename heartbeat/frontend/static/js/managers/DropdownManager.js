export default class DropdownManager {
    constructor(dropdownId, onSelectCallback) {
        this.dropdown = document.getElementById(dropdownId);
        if (!this.dropdown) {
            console.error(`Dropdown with id "${dropdownId}" not found.`);
            return;
        }

        this.selected = this.dropdown.querySelector('.dropdown-selected');
        this.optionsContainer = this.dropdown.querySelector('.dropdown-options');
        this.options = this.dropdown.querySelectorAll('.dropdown-options li');
        this.hiddenInput = this.dropdown.querySelector('input[type="hidden"]');
        this.onSelectCallback = onSelectCallback;

        if (!this.selected || !this.optionsContainer || !this.hiddenInput) {
            console.error(`Dropdown with id "${dropdownId}" is missing required child elements.`);
            return;
        }

        this.initListeners();
        this.close();
        this.updateSelectedText();
    }

    initListeners() {
        this.selected.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        this.options.forEach(option => {
            option.addEventListener('click', () => {
                this.selected.querySelector('span').textContent = option.textContent;
                this.hiddenInput.value = option.dataset.value;
                
                this.options.forEach(opt => opt.classList.remove('is-selected'));
                option.classList.add('is-selected');

                this.close();

                if (this.onSelectCallback) {
                    this.onSelectCallback(option.dataset.value);
                }
            });
        });

        document.addEventListener('click', () => this.close());
    }

    toggle() {
        this.optionsContainer.classList.toggle('is-open');
        this.selected.querySelector('i').classList.toggle('is-rotated');
    }

    close() {
        this.optionsContainer.classList.remove('is-open');
        this.selected.querySelector('i').classList.remove('is-rotated');
    }

    updateSelectedText() {
        const initialValue = this.hiddenInput.value;
        const initialOption = Array.from(this.options).find(opt => opt.dataset.value === initialValue);
        if (initialOption) {
            this.selected.querySelector('span').textContent = initialOption.textContent;
            initialOption.classList.add('is-selected');
        }
    }
}