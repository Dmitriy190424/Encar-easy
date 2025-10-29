/**
 * Приложение фильтров - безопасная версия
 */
class FiltersApp {
    constructor() {
        this.apiService = new ApiService();
        this.urlState = new URLStateManager();
        this.init();
    }

    /**
     * Инициализация приложения
     */
    async init() {
        try {
            await this.loadFilters();
            this.setupEventListeners();
        } catch (error) {
            this.showError('Ошибка загрузки фильтров');
        }
    }

    /**
     * Загрузка фильтров
     */
    async loadFilters() {
        const content = document.getElementById('filtersContent');
        
        try {
            // Здесь будет загрузка доступных фильтров из API
            // Пока используем статическую структуру
            
            const filters = this.createFiltersStructure();
            this.renderFilters(content, filters);
            
        } catch (error) {
            console.error('Error loading filters:', error);
            this.showError('Ошибка загрузки фильтров');
        }
    }

    /**
     * Создание структуры фильтров
     */
    createFiltersStructure() {
        return {
            price: {
                title: '💰 Цена',
                type: 'range',
                min: 0,
                max: 10000,
                step: 100,
                unit: 'тыс. руб'
            },
            year: {
                title: '📅 Год выпуска',
                type: 'range',
                min: 1990,
                max: 2024,
                step: 1,
                unit: 'год'
            },
            mileage: {
                title: '📏 Пробег',
                type: 'range',
                min: 0,
                max: 300000,
                step: 1000,
                unit: 'км'
            },
            fuel: {
                title: '⛽ Тип топлива',
                type: 'checkbox',
                options: [
                    { value: 'gasoline', label: 'Бензин' },
                    { value: 'diesel', label: 'Дизель' },
                    { value: 'hybrid', label: 'Гибрид' },
                    { value: 'electric', label: 'Электро' }
                ]
            },
            transmission: {
                title: '⚙ Коробка передач',
                type: 'checkbox',
                options: [
                    { value: 'manual', label: 'Механика' },
                    { value: 'auto', label: 'Автомат' },
                    { value: 'cvt', label: 'Вариатор' }
                ]
            }
        };
    }

    /**
     * Рендеринг фильтров
     */
    renderFilters(container, filters) {
        const fragment = document.createDocumentFragment();
        
        Object.entries(filters).forEach(([key, filter]) => {
            const filterSection = this.createFilterSection(key, filter);
            fragment.appendChild(filterSection);
        });
        
        // Кнопки действий
        fragment.appendChild(this.createActionButtons());
        
        SafeDOM.render(container, fragment);
    }

    /**
     * Создание секции фильтра
     */
    createFilterSection(key, filter) {
        const section = SafeDOM.createElement('div', {
            class: 'filter-section mb-4'
        });

        const title = SafeDOM.createElement('h5', {
            class: 'filter-title'
        }, filter.title);

        section.appendChild(title);

        switch (filter.type) {
            case 'range':
                section.appendChild(this.createRangeFilter(key, filter));
                break;
            case 'checkbox':
                section.appendChild(this.createCheckboxFilter(key, filter));
                break;
        }

        return section;
    }

    /**
     * Создание диапазонного фильтра
     */
    createRangeFilter(key, filter) {
        const container = SafeDOM.createElement('div', {
            class: 'range-filter'
        });

        const currentValues = this.getCurrentFilterValues(key);
        const minValue = currentValues.min || filter.min;
        const maxValue = currentValues.max || filter.max;

        // Input для минимального значения
        const minInput = SafeDOM.createInput(
            'number',
            minValue,
            filter.min.toString(),
            'form-control mb-2',
            {
                id: `${key}_min`,
                min: filter.min,
                max: filter.max,
                step: filter.step
            }
        );

        // Input для максимального значения
        const maxInput = SafeDOM.createInput(
            'number',
            maxValue,
            filter.max.toString(),
            'form-control',
            {
                id: `${key}_max`,
                min: filter.min,
                max: filter.max,
                step: filter.step
            }
        );

        // Подпись с единицами измерения
        const unitLabel = SafeDOM.createElement('small', {
            class: 'text-muted'
        }, `(${filter.unit})`);

        container.appendChild(SafeDOM.createElement('label', {
            for: `${key}_min`
        }, 'От:'));
        container.appendChild(minInput);
        
        container.appendChild(SafeDOM.createElement('label', {
            for: `${key}_max`
        }, 'До:'));
        container.appendChild(maxInput);
        container.appendChild(unitLabel);

        return container;
    }

    /**
     * Создание чекбокс фильтра
     */
    createCheckboxFilter(key, filter) {
        const container = SafeDOM.createElement('div', {
            class: 'checkbox-filter'
        });

        const currentValues = this.getCurrentFilterValues(key) || [];

        filter.options.forEach(option => {
            const isChecked = currentValues.includes(option.value);
            
            const checkboxContainer = SafeDOM.createElement('div', {
                class: 'form-check'
            });

            const checkbox = SafeDOM.createElement('input', {
                type: 'checkbox',
                value: option.value,
                id: `${key}_${option.value}`,
                class: 'form-check-input',
                checked: isChecked
            });

            const label = SafeDOM.createElement('label', {
                for: `${key}_${option.value}`,
                class: 'form-check-label'
            }, option.label);

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            container.appendChild(checkboxContainer);
        });

        return container;
    }

    /**
     * Получение текущих значений фильтра
     */
    getCurrentFilterValues(key) {
        // Здесь будет логика получения значений из URL или состояния
        return [];
    }

    /**
     * Создание кнопок действий
     */
    createActionButtons() {
        const container = SafeDOM.createElement('div', {
            class: 'action-buttons mt-4'
        });

        const applyButton = SafeDOM.createButton(
            '✅ Применить фильтры',
            () => this.applyFilters(),
            'btn btn-primary-custom me-2'
        );

        const resetButton = SafeDOM.createButton(
            '🗑 Сбросить фильтры',
            () => this.resetFilters(),
            'btn btn-outline-secondary'
        );

        const saveButton = SafeDOM.createButton(
            '💾 Сохранить настройки',
            () => this.saveFilters(),
            'btn btn-outline-primary-custom ms-2'
        );

        container.appendChild(applyButton);
        container.appendChild(resetButton);
        container.appendChild(saveButton);

        return container;
    }

    /**
     * Применение фильтров
     */
    applyFilters() {
        const filters = this.collectFilters();

        this.showSuccess('Фильтры применены');
    }

    /**
     * Сбор значений фильтров
     */
    collectFilters() {
        const filters = {};
        
        // Сбор значений диапазонных фильтров
        ['price', 'year', 'mileage'].forEach(key => {
            const minInput = document.getElementById(`${key}_min`);
            const maxInput = document.getElementById(`${key}_max`);
            
            if (minInput && minInput.value) filters[`${key}_min`] = parseInt(minInput.value);
            if (maxInput && maxInput.value) filters[`${key}_max`] = parseInt(maxInput.value);
        });
        
        // Сбор значений чекбокс фильтров
        ['fuel', 'transmission'].forEach(key => {
            const checkboxes = document.querySelectorAll(`input[type="checkbox"][id^="${key}_"]:checked`);
            filters[key] = Array.from(checkboxes).map(cb => cb.value);
        });
        
        return filters;
    }

    /**
     * Сброс фильтров
     */
    resetFilters() {
        // Сброс всех input элементов
        const inputs = document.querySelectorAll('input[type="number"], input[type="checkbox"]');
        inputs.forEach(input => {
            if (input.type === 'number') {
                input.value = '';
            } else if (input.type === 'checkbox') {
                input.checked = false;
            }
        });
        
        this.showSuccess('Фильтры сброшены');
    }

    /**
     * Сохранение фильтров
     */
    saveFilters() {
        const filters = this.collectFilters();
        
        try {
            localStorage.setItem('savedFilters', JSON.stringify(filters));
            this.showSuccess('Настройки сохранены');
        } catch (error) {
            this.showError('Ошибка сохранения настроек');
        }
    }

    /**
     * Загрузка сохраненных фильтров
     */
    loadSavedFilters() {
        try {
            const saved = localStorage.getItem('savedFilters');
            if (saved) {
                const filters = JSON.parse(saved);
                this.applySavedFilters(filters);
                this.showSuccess('Настройки загружены');
            }
        } catch (error) {
            console.error('Error loading saved filters:', error);
        }
    }

    /**
     * Применение сохраненных фильтров
     */
    applySavedFilters(filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (key.endsWith('_min') || key.endsWith('_max')) {
                const input = document.getElementById(key);
                if (input) input.value = value;
            } else if (Array.isArray(value)) {
                value.forEach(val => {
                    const checkbox = document.getElementById(`${key}_${val}`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        });
    }

    /**
     * Показ успешного сообщения
     */
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Показ сообщения об ошибке
     */
    showError(message) {
        this.showMessage(message, 'danger');
    }

    /**
     * Показ сообщения
     */
    showMessage(message, type = 'info') {
        // Создаем временное уведомление
        const alert = SafeDOM.createElement('div', {
            class: `alert alert-${type} alert-dismissible fade show`,
            role: 'alert',
            style: 'position: fixed; top: 20px; right: 20px; z-index: 1050;'
        });

        alert.appendChild(SafeDOM.createText(message));
        
        const closeButton = SafeDOM.createElement('button', {
            type: 'button',
            class: 'btn-close',
            'data-bs-dismiss': 'alert',
            'aria-label': 'Close'
        });

        alert.appendChild(closeButton);
        document.body.appendChild(alert);

        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Обработчик для загрузки сохраненных фильтров
        const loadButton = document.getElementById('loadSavedFilters');
        if (loadButton) {
            loadButton.addEventListener('click', () => this.loadSavedFilters());
        }
    }
}
