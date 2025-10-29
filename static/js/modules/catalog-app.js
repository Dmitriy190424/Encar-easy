/**
 * Главное приложение каталога - безопасная версия
 */
class CatalogApp {
    constructor() {
        this.apiService = new ApiService();
        this.urlState = new URLStateManager();
        
        // Текущее состояние
        this.state = {
            car_data: {},
            filters: {},
            pagination: { limit: 20, offset: 0 },
            sorting: { sort_order: 'price', sort_direction: 'ASC' }
        };

        // Компоненты
        this.components = {
            navigation: null,
            filters: null,
            carsGrid: null,
            pagination: null,
            sorting: null
        };

        this.init();
    }

    /**
     * Инициализация приложения
     */
    async init() {
        try {
            this.initializeComponents();
            this.restoreStateFromURL();
            await this.loadInitialData();
            this.setupEventListeners();
        } catch (error) {
            this.handleError('Ошибка инициализации приложения', error);
        }
    }

    /**
     * Инициализация компонентов
     */
    initializeComponents() {
        this.components.navigation = new NavigationComponent(
            document.getElementById('manufacturerNavigation'),
            (carData) => this.handleNavigation(carData),
            this.urlState
        );

        this.components.filters = new FiltersComponent(
            document.getElementById('filtersContainer'),
            (filters) => this.handleFiltersChange(filters),
            this.urlState
        );

        this.components.carsGrid = new CarsGridComponent(
            document.getElementById('carsGrid'),
            (carId) => this.openCarDetails(carId),
            this.urlState
        );

        this.components.pagination = new PaginationComponent(
            document.getElementById('pagination'),
            (page) => this.handlePageChange(page),
            this.urlState
        );

        this.components.sorting = new SortingComponent(
            document.getElementById('sortingContainer'),
            (sorting) => this.handleSortingChange(sorting),
            this.urlState
        );

        // Инициализация компонентов
        this.components.filters.init();
        this.components.sorting.init();
    }

    /* ############################################################################ */

    /**
     * Восстановление состояния из URL
     */
    restoreStateFromURL() {
        // Восстановление car_data
        this.state.car_data = {
            manufacturer: this.urlState.getParam('manufacturer'),
            modelgroup: this.urlState.getParam('modelgroup'),
            model: this.urlState.getParam('model'),
            badgegroup: this.urlState.getArrayParam('badgegroup'),
            badge: this.urlState.getParam('badge')
        };

        // Восстановление фильтров из URL
        this.state.filters = {
            price_min: this.urlState.getNumericParam('price_min'),
            price_max: this.urlState.getNumericParam('price_max'),
            year_min: this.urlState.getNumericParam('year_min'),
            year_max: this.urlState.getNumericParam('year_max'),
            mileage_min: this.urlState.getNumericParam('mileage_min'),
            mileage_max: this.urlState.getNumericParam('mileage_max'),
            fuel: this.urlState.getArrayParam('fuel'),
            transmission: this.urlState.getArrayParam('transmission')
        };
        // Восстановление сортировки (добавляем значения по умолчанию)
        this.state.sorting = {
            sort_order: this.urlState.getParam('sort_order', 'price'),
            sort_direction: this.urlState.getParam('sort_direction', 'ASC')
        };

    }

    /**
     * Загрузка начальных данных
     */
    async loadInitialData() {
        this.components.carsGrid.showLoadingState();

        try {
            // ПЕРЕМЕЩАЕМ: Сначала обновляем компоненты состоянием из URL
            this.updateComponentsFromState();
            
            if (Object.keys(this.state.car_data).length > 0) {
                await this.loadNavigationForState(this.state.car_data);
            } else {
                await this.loadNavigation();
            }
        } catch (error) {
            this.handleError('Ошибка загрузки данных', error);
        }
    }

    /**
     * Обновление компонентов из состояния
     */
    updateComponentsFromState() {
        
        // Обновляем фильтры компонента состоянием из URL
        if (this.components.filters) {
            this.components.filters.updateFilters(this.state.filters, this.state.car_data); // ← ПЕРЕДАЕМ car_data
        }
        
        // Обновляем сортировку компонента состоянием из URL
        if (this.components.sorting) {
            this.components.sorting.updateSorting(this.state.sorting);
        }
    }





    /* ############################################################################ */

    /**
     * Восстановление состояния из URL
     */
    /*
    restoreStateFromURL() {
        // Восстановление car_data
        this.state.car_data = {
            manufacturer: this.urlState.getParam('manufacturer'),
            modelgroup: this.urlState.getParam('modelgroup'),
            model: this.urlState.getParam('model'),
            badgegroup: this.urlState.getArrayParam('badgegroup'),
            badge: this.urlState.getParam('badge')
        };

        // Восстановление пагинации
        const page = this.urlState.getNumericParam('page', 1);
        this.state.pagination.offset = (page - 1) * 20;

        // Восстановление сортировки
        this.state.sorting = {
            sort_order: this.urlState.getParam('sort_order', 'price'),
            sort_direction: this.urlState.getParam('sort_direction', 'ASC')
        };
    }
        */

    /**
     * Загрузка начальных данных
     */
    /*
    async loadInitialData() {
        this.components.carsGrid.showLoadingState();

        try {
            if (Object.keys(this.state.car_data).length > 0) {
                await this.loadNavigationForState(this.state.car_data);
            } else {
                await this.loadNavigation();
            }
        } catch (error) {
            this.handleError('Ошибка загрузки данных', error);
        }
    }
        */

    /**
     * Загрузка навигации
     */

    /*  ################################################################################ */

    /**
     * Загрузка навигации
     */
    async loadNavigation() {
        try {
            const navData = await this.apiService.navigateCatalog(
                this.prepareCarDataForAPI(this.state.car_data),
                this.state.filters, // ← ДОБАВЛЯЕМ ФИЛЬТРЫ ИЗ СОСТОЯНИЯ
                this.state.sorting
            );

            this.components.navigation.render(navData);
            await this.loadCars();
        } catch (error) {
            this.handleError('Ошибка загрузки навигации', error);
        }
    }

    /**
     * Загрузка навигации для состояния
     */
    async loadNavigationForState(carData) {
        try {
            const navData = await this.apiService.navigateCatalog(
                this.prepareCarDataForAPI(carData),
                this.state.filters, // ← ДОБАВЛЯЕМ ФИЛЬТРЫ ИЗ СОСТОЯНИЯ
                this.state.sorting
            );

            this.components.navigation.render(navData);
            await this.loadCars();
        } catch (error) {
            this.handleError('Ошибка загрузки навигации', error);
        }
    }
    /*  ################################################################################ */

    showApiKeyError(message) {
        const errorHtml = `
            <div class="alert alert-danger">
                <h5>❌ Ошибка настройки API</h5>
                <p>${message}</p>
                <p><strong>Решение:</strong> Проверьте настройки API ключа в файле .env</p>
                <button onclick="location.reload()" class="btn btn-primary">Обновить страницу</button>
            </div>
        `;
        this.container.innerHTML = errorHtml;
    }

    /**
     * Загрузка навигации для состояния
     */
    /*
    async loadNavigationForState(carData) {
        try {
            const navData = await this.apiService.navigateCatalog(
                this.prepareCarDataForAPI(carData),
                this.state.filters,
                this.state.sorting
            );

            this.components.navigation.render(navData);
            await this.loadCars();
        } catch (error) {
            this.handleError('Ошибка загрузки навигации', error);
        }
    }
        */

    /**
     * Загрузка автомобилей с отладкой
     */
    async loadCars() {
        try {
            
            const apiFilters = this.convertFiltersForAPI(this.state.filters);

            const carsData = await this.apiService.getCars(
                this.prepareCarDataForAPI(this.state.car_data),
                this.state.pagination,
                apiFilters,
                this.state.sorting
            );
            if (carsData?.cars?.length > 0) {
            }

            this.components.carsGrid.render(carsData);
            this.components.pagination.render(carsData.pagination, this.state.pagination.offset);
            this.updateResultsCount(carsData.pagination?.filtered_count || 0);
        } catch (error) {
            this.handleError('Ошибка загрузки автомобилей', error);
        }
    }

    /**
     * Тестирование загрузки изображения
     */
    testImageLoad(url) {

        const testImg = new Image();
        testImg.src = url;
    }

    /**
     * Обработчик навигации
     */
    async handleNavigation(carData) {
        try {
            this.components.navigation.resetSelection();
            this.state.car_data = carData;
            this.resetToFirstPage();
            
            await this.loadNavigationForState(carData);
            this.updateURL();
        } catch (error) {
            this.handleError('Ошибка навигации', error);
        }
    }

    /**
     * Обработчик изменения фильтров
     */
    // В catalog-app.js
    async handleFiltersChange(filters) {
        try {
            this.state.filters = filters;
            this.resetToFirstPage();
            this.updateURL(); // ОБЯЗАТЕЛЬНО обновляем URL
            await this.loadCars();
        } catch (error) {
            this.handleError('Ошибка применения фильтров', error);
        }
    }

    async handleSortingChange(sorting) {
        try {
            this.state.sorting = sorting;
            this.resetToFirstPage();
            this.updateURL(); // ОБЯЗАТЕЛЬНО обновляем URL
            await this.loadCars();
        } catch (error) {
            this.handleError('Ошибка применения сортировки', error);
        }
    }

    async handlePageChange(page) {
        try {
            this.state.pagination.offset = (page - 1) * 20;
            this.updateURL(); // ОБЯЗАТЕЛЬНО обновляем URL
            await this.loadCars();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            this.handleError('Ошибка перехода на страницу', error);
        }
    }

    /**
     * Обработчик изменения сортировки
     */
    /*
    async handleSortingChange(sorting) {
        try {
            this.state.sorting = sorting;
            this.resetToFirstPage();
            this.updateURL();
            await this.loadCars();
        } catch (error) {
            this.handleError('Ошибка применения сортировки', error);
        }
    }
        */
    /**
     * Обработчик изменения страницы
     */
    /*
    async handlePageChange(page) {
        try {
            this.state.pagination.offset = (page - 1) * 20;
            this.updateURL();
            await this.loadCars();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            this.handleError('Ошибка перехода на страницу', error);
        }
    }
        */

    /**
     * Подготовка car_data для API
     */
    prepareCarDataForAPI(carData) {
        const cleaned = { ...carData };
        
        // Очистка пустых значений
        Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === null || cleaned[key] === undefined || cleaned[key] === '') {
                delete cleaned[key];
            }
        });

        // Обработка строковых полей
        const stringFields = ['manufacturer', 'modelgroup', 'model', 'badge'];
        stringFields.forEach(field => {
            if (cleaned[field] && Array.isArray(cleaned[field])) {
                cleaned[field] = cleaned[field][0];
            }
        });

        // Обработка badgegroup
        if (cleaned.badgegroup && Array.isArray(cleaned.badgegroup) && cleaned.badgegroup.length === 1) {
            cleaned.badgegroup = cleaned.badgegroup[0];
        }

        return cleaned;
    }

    /**
     * Конвертация фильтров для API
     */
    convertFiltersForAPI(filters) {
        const apiFilters = { ...filters };
        
        
        // Конвертация цен в воны (только если значения есть)
        if (apiFilters.price_min !== null && apiFilters.price_min !== undefined) {
            apiFilters.price_min = CurrencyService.convertToWon(apiFilters.price_min);
        }
        if (apiFilters.price_max !== null && apiFilters.price_max !== undefined) {
            apiFilters.price_max = CurrencyService.convertToWon(apiFilters.price_max);
        }
        
        return apiFilters;
    }

    /**
     * Сброс на первую страницу
     */
    resetToFirstPage() {
        this.state.pagination.offset = 0;
    }

    /**
     * Обновление URL
     */
    updateURL() {
        const params = {
            // Параметры навигации
            ...this.state.car_data,
            
            // Параметры фильтров
            ...this.state.filters,
            
            // Параметры сортировки ← ДОБАВЛЯЕМ
            ...this.state.sorting,
            
            // Пагинация
            page: this.components.pagination.getCurrentPage(this.state.pagination.offset)
        }

        // Очистка только полностью пустых значений
        Object.keys(params).forEach(key => {
            if (params[key] === null || params[key] === undefined || params[key] === '') {
                delete params[key];
            }
            // Для массивов - удаляем если пустые
            if (Array.isArray(params[key]) && params[key].length === 0) {
                delete params[key];
            }
        });

        this.urlState.updateURL(params);
    }

    /**
     * Обновление счетчика результатов
     */
    updateResultsCount(count) {
        const element = document.getElementById('resultsCount');
        if (element) {
            element.textContent = `Найдено: ${count.toLocaleString()} автомобилей`;
        }
    }

    /**
     * Открытие деталей автомобиля
     */
    openCarDetails(carId) {
        window.open(`/example/car/${carId}`, '_blank', 'noopener,noreferrer');
    }

    /**
     * Обработка ошибок
     */
    handleError(message, error) {
        console.error(message, error);
        this.components.carsGrid.showErrorState(message);
    }

    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Обработчик обновления данных
        const refreshButton = document.getElementById('refreshButton');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.loadCars());
        }

        // Обработчик ресайза для мобильных фильтров
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Обработчик ресайза окна
     */
    handleResize() {
        // Логика для мобильных фильтров
        this.toggleMobileFilters();
    }

    /**
     * Переключение мобильных фильтров
     */
    toggleMobileFilters() {
        // Реализация переключения фильтров на мобильных устройствах
        const filtersSidebar = document.querySelector('.col-md-3.col-lg-2');
        if (!filtersSidebar) return;

        const isMobile = window.innerWidth <= 768;
        const existingToggle = document.getElementById('toggleFilters');

        if (isMobile && !existingToggle) {
            this.createMobileFiltersToggle();
        } else if (!isMobile && existingToggle) {
            existingToggle.remove();
            filtersSidebar.style.display = 'block';
        }
    }

    /**
     * Создание переключателя мобильных фильтров
     */
    createMobileFiltersToggle() {
        const filtersSidebar = document.querySelector('.col-md-3.col-lg-2');
        const filtersToggle = SafeDOM.createButton(
            '📋 Показать фильтры',
            () => this.toggleFiltersVisibility(),
            'btn btn-primary-custom w-100 mb-3 d-md-none',
            { id: 'toggleFilters' }
        );

        filtersSidebar.parentNode.insertBefore(filtersToggle, filtersSidebar);
        filtersSidebar.style.display = 'none';
    }

    /**
     * Переключение видимости фильтров
     */
    toggleFiltersVisibility() {
        const filtersSidebar = document.querySelector('.col-md-3.col-lg-2');
        const toggleButton = document.getElementById('toggleFilters');

        if (filtersSidebar && toggleButton) {
            const isVisible = filtersSidebar.style.display !== 'none';
            filtersSidebar.style.display = isVisible ? 'none' : 'block';
            toggleButton.textContent = isVisible ? '📋 Показать фильтры' : '✕ Скрыть фильтры';
        }
    }


}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new CatalogApp();
});
