class SortingComponent {
    constructor(container, onSortingChange, urlState) {
        this.container = container;
        this.onSortingChange = onSortingChange;
        this.urlState = urlState;
        this.currentSorting = {
            sort_order: 'price',
            sort_direction: 'ASC'
        };
    }

    /**
     * Инициализация компонента
     */
    init() {
        this.restoreSortingFromURL();
        this.render();
    }

    /**
     * Восстановление сортировки из URL
     */
    restoreSortingFromURL() {
        this.currentSorting = {
            sort_order: this.urlState.getParam('sort_order', 'price'),
            sort_direction: this.urlState.getParam('sort_direction', 'ASC')
        };
    }

    /**
     * Отображение компонента сортировки
     */
    render() {
        const fragment = document.createDocumentFragment();

        // Создаем select напрямую чтобы правильно установить selected
        const select = document.createElement('select');
        select.className = 'form-select form-select-sm';
        select.id = 'sortingSelect';

        // Варианты сортировки
        const sortOptions = [
            { value: 'price_ASC', label: '💰 Цена (по возрастанию)' },
            { value: 'price_DESC', label: '💰 Цена (по убыванию)' },
            { value: 'year_DESC', label: '📅 Год (сначала новые)' },
            { value: 'year_ASC', label: '📅 Год (сначала старые)' },
            { value: 'mileage_ASC', label: '📏 Пробег (по возрастанию)' },
            { value: 'mileage_DESC', label: '📏 Пробег (по убыванию)' },
            { value: 'car_id_DESC', label: '🆕 Сначала новые' }
        ];

        // Текущее значение для select
        const currentValue = `${this.currentSorting.sort_order}_${this.currentSorting.sort_direction}`;

        sortOptions.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.label;
            
            // Правильно устанавливаем selected
            if (option.value === currentValue) {
                optionEl.selected = true;
            }
            
            select.appendChild(optionEl);
        });

        // Обработчик изменения
        select.addEventListener('change', (e) => {
            const [sort_order, sort_direction] = e.target.value.split('_');
            this.handleSortingChange({ sort_order, sort_direction });
        });

        fragment.appendChild(select);
        SafeDOM.render(this.container, fragment);
    }

    /**
     * Обработчик изменения сортировки
     */
    handleSortingChange(sorting) {
        this.currentSorting = sorting;
        this.onSortingChange(sorting);
    }

    /**
     * Обновление сортировки из внешнего состояния
     */
    updateSorting(sorting) {
        this.currentSorting = { ...sorting };
        this.render();
    }

    /**
     * Получение текущей сортировки
     */
    getCurrentSorting() {
        return { ...this.currentSorting };
    }
}