/**
 * Безопасный компонент фильтров
 */
class FiltersComponent {
    constructor(container, onFiltersChange, urlState) {
        this.container = container;
        this.onFiltersChange = onFiltersChange;
        this.urlState = urlState;
        this.currentFilters = {};
        this.currentCarData = {}; // ← ДОБАВЛЯЕМ ДЛЯ ХРАНЕНИЯ ДАННЫХ АВТО
        this.apiService = new ApiService();
    }

    /**
     * Инициализация фильтров
     */
    init() {
        this.restoreFiltersFromURL();
        this.render();
    }

    /**
     * Восстановление фильтров из URL
     */
    restoreFiltersFromURL() {
        this.currentFilters = {
            price_min: this.urlState.getNumericParam('price_min'),
            price_max: this.urlState.getNumericParam('price_max'),
            year_min: this.urlState.getNumericParam('year_min'),
            year_max: this.urlState.getNumericParam('year_max'),
            mileage_min: this.urlState.getNumericParam('mileage_min'),
            mileage_max: this.urlState.getNumericParam('mileage_max'),
            fuel: this.urlState.getArrayParam('fuel'),
            transmission: this.urlState.getArrayParam('transmission')
        };
    }

    /**
     * Отображение фильтров
     */
    render() {
        const fragment = document.createDocumentFragment();

        // Основные фильтры
        fragment.appendChild(this.createPriceFilter());
        fragment.appendChild(this.createYearFilter());
        fragment.appendChild(this.createMileageFilter());

        // Кнопки применения и сброса
        fragment.appendChild(this.createActionButtons());

        // Дополнительные фильтры
        fragment.appendChild(this.createAdditionalFilters());

        // Секции для динамических фильтров (изначально скрыты)
        fragment.appendChild(this.createFuelFilterSection());
        fragment.appendChild(this.createTransmissionFilterSection());

        SafeDOM.render(this.container, fragment);
    }

    /**
     * Создание секции фильтра топлива (изначально скрыта)
     */
    createFuelFilterSection() {
        const section = SafeDOM.createElement('div', {
            class: 'filter-section mb-4',
            id: 'fuelFilterSection',
            style: 'display: none;'
        });

        const title = SafeDOM.createElement('h6', {
            class: 'filter-title'
        }, '⛽ Тип топлива');

        const container = SafeDOM.createElement('div', {
            id: 'fuelFilters'
        });

        // Кнопки управления
        const buttonsRow = SafeDOM.createElement('div', {
            class: 'row g-2 mb-2'
        });

        const col1 = SafeDOM.createElement('div', { class: 'col-6' });
        const col2 = SafeDOM.createElement('div', { class: 'col-6' });

        const selectAllButton = SafeDOM.createButton(
            '✅ Все',
            () => this.selectAllFuelFilters(),
            'btn btn-outline-primary-custom btn-sm w-100'
        );

        const clearAllButton = SafeDOM.createButton(
            '❌ Очистить',
            () => this.clearAllFuelFilters(),
            'btn btn-outline-secondary btn-sm w-100'
        );

        col1.appendChild(selectAllButton);
        col2.appendChild(clearAllButton);
        buttonsRow.appendChild(col1);
        buttonsRow.appendChild(col2);

        const applyButton = SafeDOM.createButton(
            '✅ Применить',
            () => this.applyFuelFilter(),
            'btn btn-primary-custom btn-sm w-100 mt-2'
        );

        section.appendChild(title);
        section.appendChild(buttonsRow);
        section.appendChild(container);
        section.appendChild(applyButton);

        return section;
    }

    /**
     * Создание секции фильтра трансмиссии (изначально скрыта)
     */
    createTransmissionFilterSection() {
        const section = SafeDOM.createElement('div', {
            class: 'filter-section mb-4',
            id: 'transmissionFilterSection',
            style: 'display: none;'
        });

        const title = SafeDOM.createElement('h6', {
            class: 'filter-title'
        }, '⚙ Коробка передач');

        const container = SafeDOM.createElement('div', {
            id: 'transmissionFilters'
        });

        // Кнопки управления
        const buttonsRow = SafeDOM.createElement('div', {
            class: 'row g-2 mb-2'
        });

        const col1 = SafeDOM.createElement('div', { class: 'col-6' });
        const col2 = SafeDOM.createElement('div', { class: 'col-6' });

        const selectAllButton = SafeDOM.createButton(
            '✅ Все',
            () => this.selectAllTransmissionFilters(),
            'btn btn-outline-primary-custom btn-sm w-100'
        );

        const clearAllButton = SafeDOM.createButton(
            '❌ Очистить',
            () => this.clearAllTransmissionFilters(),
            'btn btn-outline-secondary btn-sm w-100'
        );

        col1.appendChild(selectAllButton);
        col2.appendChild(clearAllButton);
        buttonsRow.appendChild(col1);
        buttonsRow.appendChild(col2);

        const applyButton = SafeDOM.createButton(
            '✅ Применить',
            () => this.applyTransmissionFilter(),
            'btn btn-primary-custom btn-sm w-100 mt-2'
        );

        section.appendChild(title);
        section.appendChild(buttonsRow);
        section.appendChild(container);
        section.appendChild(applyButton);

        return section;
    }

    /**
     * Выбрать все варианты топлива
     */
    selectAllFuelFilters() {
        const checkboxes = document.querySelectorAll('#fuelFilters input[type="checkbox"]');
        const allValues = [];
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            allValues.push(checkbox.value);
        });
        
        // Обновляем текущие фильтры
        this.currentFilters.fuel = allValues;
    }

    /**
     * Очистить все варианты топлива
     */
    clearAllFuelFilters() {
        const checkboxes = document.querySelectorAll('#fuelFilters input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Очищаем текущие фильтры
        this.currentFilters.fuel = [];
    }

    /**
     * Выбрать все варианты трансмиссии
     */
    selectAllTransmissionFilters() {
        const checkboxes = document.querySelectorAll('#transmissionFilters input[type="checkbox"]');
        const allValues = [];
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            allValues.push(checkbox.value);
        });
        
        // Обновляем текущие фильтры
        this.currentFilters.transmission = allValues;
    }

    /**
     * Очистить все варианты трансмиссии
     */
    clearAllTransmissionFilters() {
        const checkboxes = document.querySelectorAll('#transmissionFilters input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Очищаем текущие фильтры
        this.currentFilters.transmission = [];
    }

    /**
     * Загрузка фильтров топлива
     */
    async loadFuelFilters() {
        try {
            const section = document.getElementById('fuelFilterSection');
            const container = document.getElementById('fuelFilters');
            
            if (!section || !container) {
                console.error('Fuel filter elements not found');
                return;
            }

            // СЧИТЫВАЕМ текущие фильтры топлива из URL
            const urlFuelFilters = this.urlState.getArrayParam('fuel', []);
            this.currentFilters.fuel = [...urlFuelFilters];
            
            // Показываем загрузку
            container.innerHTML = '';
            const loading = SafeDOM.createElement('div', {
                class: 'text-center py-2'
            });
            loading.appendChild(SafeDOM.createElement('div', {
                class: 'spinner-border spinner-border-sm text-primary-custom',
                role: 'status'
            }));
            container.appendChild(loading);
            
            // Показываем секцию
            section.style.display = 'block';

            // ОТЛАДКА ЗАПРОСА
            const requestData = {
                car_data: this.currentCarData || {}
            };

            // Загружаем данные через API
            const response = await this.apiService.getFuelTypes(this.currentCarData || {});
            
            // ОТЛАДКА ОТВЕТА - ДЕТАЛЬНАЯ

            if (response && response.status === 'success' && response.data) {
                // ПРЕОБРАЗУЕМ ДАННЫЕ ИЗ API В НУЖНЫЙ ФОРМАТ
                const fuelOptions = this.transformFuelData(response.data);
                
                this.displayFuelFilters(fuelOptions, this.currentFilters.fuel);
            } else {
                console.error('API не вернул данные по топливу');
                this.showFilterError('fuelFilters', 'Не удалось загрузить варианты топлива');
            }
            
        } catch (error) {
            console.error('Ошибка загрузки фильтров топлива:', error);
            this.showFilterError('fuelFilters', 'Ошибка загрузки вариантов топлива');
        }
    }


    /**
     * Загрузка фильтров трансмиссии
     */
    async loadTransmissionFilters() {
        try {
            const section = document.getElementById('transmissionFilterSection');
            const container = document.getElementById('transmissionFilters');
            
            if (!section || !container) {
                console.error('Transmission filter elements not found');
                return;
            }
            
            // СЧИТЫВАЕМ текущие фильтры трансмиссии из URL
            const urlTransmissionFilters = this.urlState.getArrayParam('transmission', []);
            
            this.currentFilters.transmission = [...urlTransmissionFilters];
            
            // Показываем загрузку
            container.innerHTML = '';
            const loading = SafeDOM.createElement('div', {
                class: 'text-center py-2'
            });
            loading.appendChild(SafeDOM.createElement('div', {
                class: 'spinner-border spinner-border-sm text-primary-custom',
                role: 'status'
            }));
            container.appendChild(loading);
            
            // Показываем секцию
            section.style.display = 'block';

            // Загружаем данные через API - БЕЗ FALLBACK
            const response = await this.apiService.getTransmissionTypes(this.currentCarData || {});


            if (response && response.status === 'success' && response.data) {
                this.displayTransmissionFilters(response.data, this.currentFilters.transmission);
            } else {
                // ЕСЛИ API НЕ ОТВЕЧАЕТ - ПОКАЗЫВАЕМ ОШИБКУ
                console.error('API не вернул данные по трансмиссии');
                this.showFilterError('transmissionFilters', 'Не удалось загрузить варианты КПП');
            }
            
        } catch (error) {
            console.error('Ошибка загрузки фильтров трансмиссии:', error);
            this.showFilterError('transmissionFilters', 'Ошибка загрузки вариантов КПП');
        }
    }

    /**
     * Отображение фильтров топлива
     */
    displayFuelFilters(fuels, currentFuelFilters = []) {
        const container = document.getElementById('fuelFilters');
        if (!container) return;

        container.innerHTML = '';

        if (!fuels || fuels.length === 0) {
            container.appendChild(SafeDOM.createElement('div', {
                class: 'text-muted small'
            }, 'Варианты не найдены'));
            return;
        }

        fuels.forEach(fuel => {
            // ПРЯМОЕ СРАВНЕНИЕ БЕЗ НОРМАЛИЗАЦИИ
            const isChecked = currentFuelFilters.includes(fuel.value);
            
            const checkboxContainer = SafeDOM.createElement('div', {
                class: 'form-check'
            });

            const checkbox = SafeDOM.createElement('input', {
                type: 'checkbox',
                value: fuel.value,
                id: `fuel_${fuel.value}`,
                class: 'form-check-input',
                checked: isChecked
            });
            checkbox.addEventListener('change', () => this.handleFuelCheckboxChange(fuel.value));

            const label = SafeDOM.createElement('label', {
                for: `fuel_${fuel.value}`,
                class: 'form-check-label small'
            }, fuel.label);

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            container.appendChild(checkboxContainer);
        });
    }

    /**
     * Отображение фильтров трансмиссии
     */
    displayTransmissionFilters(transmissions, currentTransmissionFilters = []) {
        const container = document.getElementById('transmissionFilters');
        if (!container) return;

        container.innerHTML = '';

        if (!transmissions || transmissions.length === 0) {
            container.appendChild(SafeDOM.createElement('div', {
                class: 'text-muted small'
            }, 'Варианты не найдены'));
            return;
        }


        transmissions.forEach(transmission => {
            // ПРЯМОЕ СРАВНЕНИЕ БЕЗ НОРМАЛИЗАЦИИ
            const isChecked = currentTransmissionFilters.includes(transmission.value);


            const checkboxContainer = SafeDOM.createElement('div', {
                class: 'form-check'
            });

            const checkbox = SafeDOM.createElement('input', {
                type: 'checkbox',
                value: transmission.value,
                id: `transmission_${transmission.value}`,
                class: 'form-check-input',
                checked: isChecked
            });
            checkbox.addEventListener('change', () => this.handleTransmissionCheckboxChange(transmission.value));

            const label = SafeDOM.createElement('label', {
                for: `transmission_${transmission.value}`,
                class: 'form-check-label small'
            }, transmission.label);

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            container.appendChild(checkboxContainer);
        });
    }

    /**
     * Обработчик изменения чекбокса топлива
     */
    handleFuelCheckboxChange(fuelValue) {
        if (!this.currentFilters.fuel) {
            this.currentFilters.fuel = [];
        }

        const checkbox = document.getElementById(`fuel_${fuelValue}`);
        if (!checkbox) return;

        if (checkbox.checked) {
            if (!this.currentFilters.fuel.includes(fuelValue)) {
                this.currentFilters.fuel.push(fuelValue);
            }
        } else {
            const index = this.currentFilters.fuel.indexOf(fuelValue);
            if (index > -1) {
                this.currentFilters.fuel.splice(index, 1);
            }
        }
    }

    /**
     * Обработчик изменения чекбокса трансмиссии
     */
    handleTransmissionCheckboxChange(transmissionValue) {
        if (!this.currentFilters.transmission) {
            this.currentFilters.transmission = [];
        }

        const checkbox = document.getElementById(`transmission_${transmissionValue}`);
        if (!checkbox) return;

        if (checkbox.checked) {
            if (!this.currentFilters.transmission.includes(transmissionValue)) {
                this.currentFilters.transmission.push(transmissionValue);
            }
        } else {
            const index = this.currentFilters.transmission.indexOf(transmissionValue);
            if (index > -1) {
                this.currentFilters.transmission.splice(index, 1);
            }
        }
    }

    /**
     * Применение фильтра топлива
     */
    applyFuelFilter() {
        // Сохраняем текущее состояние чекбоксов
        const fuelCheckboxes = document.querySelectorAll('#fuelFilters input[type="checkbox"]');
        const selectedFuels = [];
        
        fuelCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedFuels.push(checkbox.value);
            }
        });

        // Обновляем фильтры и применяем
        this.currentFilters.fuel = selectedFuels;
        this.onFiltersChange({ ...this.currentFilters, fuel: selectedFuels });
        this.hideFilterSection('fuelFilterSection');
    }

    /**
     * Применение фильтра трансмиссии
     */
    applyTransmissionFilter() {
        // Сохраняем текущее состояние чекбоксов
        const transmissionCheckboxes = document.querySelectorAll('#transmissionFilters input[type="checkbox"]');
        const selectedTransmissions = [];
        
        transmissionCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedTransmissions.push(checkbox.value);
            }
        });

        // Обновляем фильтры и применяем
        this.currentFilters.transmission = selectedTransmissions;
        this.onFiltersChange({ ...this.currentFilters, transmission: selectedTransmissions });
        this.hideFilterSection('transmissionFilterSection');
    }

    /**
     * Скрытие секции фильтра
     */
    hideFilterSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    }

    /**
     * Показ ошибки в фильтре
     */
    showFilterError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.appendChild(SafeDOM.createElement('div', {
                class: 'text-danger small'
            }, message));
        }
    }

    // ... остальные методы (createPriceFilter, createYearFilter, createMileageFilter, 
    // createActionButtons, createAdditionalFilters, applyFilters, resetAllFilters и т.д.)
    // остаются без изменений
    //#############################


    /**
     * Создание фильтра цены
     */
    createPriceFilter() {
        const section = SafeDOM.createElement('div', {
            class: 'mb-3'
        });

        const label = SafeDOM.createElement('label', {
            class: 'form-label small'
        }, '💰 Цена, тыс руб');

        const row = SafeDOM.createElement('div', {
            class: 'row g-2'
        });

        // ФИКС: Проверяем на null/undefined, но сохраняем 0
        const priceMinValue = this.currentFilters.price_min !== null &&
            this.currentFilters.price_min !== undefined ?
            this.currentFilters.price_min : '';

        const priceMaxValue = this.currentFilters.price_max !== null &&
            this.currentFilters.price_max !== undefined ?
            this.currentFilters.price_max : '';

        const priceMinInput = SafeDOM.createInput(
            'number',
            priceMinValue,  // ФИКС: Сохраняем 0 если есть
            'От',
            'form-control form-control-sm',
            {
                id: 'priceMin',
                min: '0',           // ФИКС: Добавляем ограничения
                step: '100'         // ФИКС: Шаг 100
            }
        );

        const priceMaxInput = SafeDOM.createInput(
            'number',
            priceMaxValue,  // ФИКС: Сохраняем 0 если есть
            'До',
            'form-control form-control-sm',
            {
                id: 'priceMax',
                min: '0',           // ФИКС: Добавляем ограничения
                step: '100'         // ФИКС: Шаг 100
            }
        );

        const col1 = SafeDOM.createElement('div', { class: 'col-6' });
        const col2 = SafeDOM.createElement('div', { class: 'col-6' });

        col1.appendChild(priceMinInput);
        col2.appendChild(priceMaxInput);
        row.appendChild(col1);
        row.appendChild(col2);

        section.appendChild(label);
        section.appendChild(row);

        return section;
    }

    /**
     * Создание фильтра года выпуска
     */
    createYearFilter() {
        const section = SafeDOM.createElement('div', {
            class: 'mb-3'
        });

        const label = SafeDOM.createElement('label', {
            class: 'form-label small'
        }, '📅 Год выпуска');

        const row = SafeDOM.createElement('div', {
            class: 'row g-2'
        });

        // ФИКС: Проверяем на null/undefined, но сохраняем 0
        const yearMinValue = this.currentFilters.year_min !== null &&
            this.currentFilters.year_min !== undefined ?
            this.currentFilters.year_min : '';

        const yearMaxValue = this.currentFilters.year_max !== null &&
            this.currentFilters.year_max !== undefined ?
            this.currentFilters.year_max : '';

        const yearMinInput = SafeDOM.createInput(
            'number',
            yearMinValue,  // ФИКС: Сохраняем 0 если есть
            'От',
            'form-control form-control-sm',
            {
                id: 'yearMin',
                min: '1990',        // ФИКС: Добавляем ограничения
                max: '2024',
                step: '1'
            }
        );

        const yearMaxInput = SafeDOM.createInput(
            'number',
            yearMaxValue,  // ФИКС: Сохраняем 0 если есть
            'До',
            'form-control form-control-sm',
            {
                id: 'yearMax',
                min: '1990',        // ФИКС: Добавляем ограничения
                max: '2024',
                step: '1'
            }
        );

        const col1 = SafeDOM.createElement('div', { class: 'col-6' });
        const col2 = SafeDOM.createElement('div', { class: 'col-6' });

        col1.appendChild(yearMinInput);
        col2.appendChild(yearMaxInput);
        row.appendChild(col1);
        row.appendChild(col2);

        section.appendChild(label);
        section.appendChild(row);

        return section;
    }

    /**
     * Создание фильтра пробега
     */
    createMileageFilter() {
        const section = SafeDOM.createElement('div', {
            class: 'mb-3'
        });

        const label = SafeDOM.createElement('label', {
            class: 'form-label small'
        }, '📏 Пробег, км');

        const row = SafeDOM.createElement('div', {
            class: 'row g-2'
        });

        const mileageMinInput = SafeDOM.createInput(
            'number',
            this.currentFilters.mileage_min || '',
            'От',
            'form-control form-control-sm',
            { id: 'mileageMin' }
        );

        const mileageMaxInput = SafeDOM.createInput(
            'number',
            this.currentFilters.mileage_max || '',
            'До',
            'form-control form-control-sm',
            { id: 'mileageMax' }
        );

        const col1 = SafeDOM.createElement('div', { class: 'col-6' });
        const col2 = SafeDOM.createElement('div', { class: 'col-6' });

        col1.appendChild(mileageMinInput);
        col2.appendChild(mileageMaxInput);
        row.appendChild(col1);
        row.appendChild(col2);

        section.appendChild(label);
        section.appendChild(row);

        return section;
    }

    /**
     * Создание кнопок действий
     */
    createActionButtons() {
        const section = SafeDOM.createElement('div', {
            class: 'mb-4'
        });

        const applyButton = SafeDOM.createButton(
            '✅ Применить фильтры',
            () => this.applyFilters(),
            'btn btn-primary-custom w-100 btn-sm'
        );

        const resetButton = SafeDOM.createButton(
            '🗑 Сбросить все фильтры',
            () => this.resetAllFilters(),
            'btn btn-outline-secondary w-100 btn-sm mt-2'
        );

        section.appendChild(applyButton);
        section.appendChild(resetButton);

        return section;
    }

    /**
     * Создание дополнительных фильтров
     */
    createAdditionalFilters() {
        const section = SafeDOM.createElement('div', {
            class: 'filter-section mb-4'
        });

        const title = SafeDOM.createElement('h6', {
            class: 'filter-title'
        }, '🔧 Дополнительные фильтры');

        const fuelButton = SafeDOM.createButton(
            '⛽ Показать варианты топлива',
            () => this.loadFuelFilters(),
            'btn btn-outline-primary-custom btn-sm w-100 mb-2'
        );

        const transmissionButton = SafeDOM.createButton(
            '⚙ Показать варианты КПП',
            () => this.loadTransmissionFilters(),
            'btn btn-outline-primary-custom btn-sm w-100'
        );

        section.appendChild(title);
        section.appendChild(fuelButton);
        section.appendChild(transmissionButton);

        return section;
    }

    /**
     * Применение фильтров
     */
    /*
    applyFilters() {
        const filters = {
            price_min: this.getInputValue('priceMin'),
            price_max: this.getInputValue('priceMax'),
            year_min: this.getInputValue('yearMin'),
            year_max: this.getInputValue('yearMax'),
            mileage_min: this.getInputValue('mileageMin'),
            mileage_max: this.getInputValue('mileageMax'),
            fuel: this.currentFilters.fuel || [],
            transmission: this.currentFilters.transmission || []
        };

        this.currentFilters = filters;
        this.onFiltersChange(filters);
    }
        */

    /**
     * Получение значения input
     */
    getInputValue(elementId) {
        const element = document.getElementById(elementId);
        if (!element || !element.value) return null;

        const value = parseInt(element.value, 10);
        return isNaN(value) ? null : value;
    }

    /**
     * Сброс всех фильтров
     */
    resetAllFilters() {
        // Сброс значений inputs
        ['priceMin', 'priceMax', 'yearMin', 'yearMax', 'mileageMin', 'mileageMax'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });

        // Сброс состояния
        this.currentFilters = {
            fuel: [],
            transmission: []
        };

        this.onFiltersChange(this.currentFilters);
    }

    /**
     * Получение текущих фильтров
     */
    getCurrentFilters() {
        return { ...this.currentFilters };
    }

    /**
     * Обновление фильтров из внешнего состояния
     */
    /**
     * Обновление фильтров из внешнего состояния
     */
    updateFilters(newFilters, carData = {}) {
        this.currentFilters = { ...newFilters };
        this.currentCarData = { ...carData }; // ← ОБНОВЛЯЕМ ДАННЫЕ АВТО
        this.render();
    }

    /**
     * Применение фильтров с обновлением URL
     */
    applyFilters() {
        const filters = {
            price_min: this.getInputValue('priceMin'),
            price_max: this.getInputValue('priceMax'),
            year_min: this.getInputValue('yearMin'),
            year_max: this.getInputValue('yearMax'),
            mileage_min: this.getInputValue('mileageMin'),
            mileage_max: this.getInputValue('mileageMax'),
            fuel: this.currentFilters.fuel || [],
            transmission: this.currentFilters.transmission || []
        };

        this.currentFilters = filters;
        this.onFiltersChange(filters); // Это вызовет updateURL в CatalogApp
    }

    /**
     * Преобразование данных топлива из API в формат для фронтенда
     */
    transformFuelData(apiData) {
        if (!Array.isArray(apiData)) return [];

        
        // Если данные уже в правильном формате (объекты с value/label) - возвращаем как есть
        if (apiData.length > 0 && apiData[0].value && apiData[0].label) {
            return apiData;
        }
        
        // Если данные в формате строк - преобразуем
        if (apiData.length > 0 && typeof apiData[0] === 'string') {
            const fuelLabels = {
                'Diesel': 'Дизель',
                'Electricity': 'Электрический',
                'Gasoline': 'Бензин',
                'Gasoline+Electricity': 'Бензин+Электричество',
                'Gasoline+LPG': 'Бензин+Газ',
                'CNG': 'Газ',
                'Diesel+Electricity': 'Дизель+Электричество', 
                'Hydrogen': 'Водород',
                'LPG': 'Газ',
                'LPG+Electricity': 'Газ+Электричество',
                'Other': 'Другое'
            };
            
            const transformed = apiData.map(fuelValue => ({
                value: fuelValue,
                label: fuelLabels[fuelValue] || fuelValue
            }));
            return transformed;
        }
        
        return [];
    }
}
