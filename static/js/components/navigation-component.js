/**
 * Безопасный компонент навигации по каталогу
 */
class NavigationComponent {
    constructor(container, onNavigate, urlState) {
        this.container = container;
        this.onNavigate = onNavigate;
        this.urlState = urlState;
        this.selectedItems = {
            badgegroup: [],
            badge: []
        };
    }

    /**
     * Отображение навигации
     */
    render(navData) {
        if (!navData) return;

        const fragment = document.createDocumentFragment();
        
        // Кнопка "Назад" или "Все производители"
        fragment.appendChild(this.createBackButton(navData.previous_state));
        
        // Дочерние элементы
        if (navData.children) {
            Object.entries(navData.children).forEach(([entity, items]) => {
                if (Array.isArray(items) && items.length > 0) {
                    fragment.appendChild(this.createEntitySection(entity, items, navData));
                }
            });
        }

        SafeDOM.render(this.container, fragment);
        this.updateNavigationTitle(navData.current_state, navData.models_period);
    }

    /**
     * Создание кнопки "Назад"
     */
    createBackButton(previousState) {
        if (Object.keys(previousState || {}).length > 0) {
            return SafeDOM.createLink('← Назад', '#', 
                () => this.onNavigate(previousState),
                'manufacturer-link text-primary-custom'
            );
        } else {
            return SafeDOM.createLink('🏠 Все производители', '#',
                () => this.onNavigate({}),
                'manufacturer-link text-primary-custom'
            );
        }
    }

    /**
     * Создание секции для типа сущности
     */
    createEntitySection(entity, items, navData) {
        const section = document.createDocumentFragment();
        const isCheckboxMode = entity === 'badgegroup' || entity === 'badge';
        
        // Заголовок секции
        if (isCheckboxMode) {
            const title = SafeDOM.createElement('div', {
                class: 'manufacturer-item'
            });
            title.appendChild(SafeDOM.createText('Выберите один или несколько:'));
            section.appendChild(title);
        }
        
        // Элементы
        items.slice(0, 15).forEach(item => {
            section.appendChild(this.createEntityItem(entity, item, navData, isCheckboxMode));
        });
        
        // Кнопка "Показать еще"
        if (items.length > 15 && !isCheckboxMode) {
            section.appendChild(this.createShowMoreButton(entity, items, navData));
        }
        
        // Кнопка применения для чекбоксов
        if (isCheckboxMode) {
            section.appendChild(this.createApplyButton(entity, navData));
        }
        
        return section;
    }



    /**
     * Получение иконки производителя - ФИКСИРУЕМ ПУТИ
     */
    getManufacturerIcon(manufacturer) {
        if (!manufacturer) return '/example/static/images/brands/default.svg';
        
        const brandSlugs = {
            'Acura': 'acura', 'Alfa Romeo': 'alfaromeo', 'Astonmartin': 'astonmartin',
            'Audi': 'audi', 'BMW': 'bmw', 'BYD': 'byd', 'Bentley': 'bentley',
            'Buick': 'buick', 'Cadillac': 'cadillac', 'Chevrolet': 'chevrolet',
            'Chrysler': 'chrysler', 'Citroen-DS': 'citroen', 'Daihatsu': 'daihatsu',
            'Dodge': 'dodge', 'Ferrari': 'ferrari', 'Fiat': 'fiat', 'Ford': 'ford',
            'Genesis': 'genesis', 'Honda': 'honda', 'Hummer': 'hummer', 'Hyundai': 'hyundai',
            'Infiniti': 'infiniti', 'Jaguar': 'jaguar', 'Jeep': 'jeep', 'Kia': 'kia',
            'Lamborghini': 'lamborghini', 'Land Rover': 'landrover', 'Lexus': 'lexus',
            'Lincoln': 'lincoln', 'Lotus': 'lotus', 'Maserati': 'maserati', 'Mazda': 'mazda',
            'Mclaren': 'mclaren', 'Mercedes-Benz': 'mercedes', 'Mini': 'mini',
            'Mitsubishi': 'mitsubishi', 'Nissan': 'nissan', 'Peugeot': 'peugeot',
            'Polestar': 'polestar', 'Porsche': 'porsche', 'Renault-KoreaSamsung': 'renault',
            'Rolls-Royce': 'rollsroyce', 'Saab': 'saab', 'Smart': 'smart', 'Subaru': 'subaru',
            'Suzuki': 'suzuki', 'Tesla': 'tesla', 'Toyota': 'toyota', 'Volkswagen': 'volkswagen',
            'Volvo': 'volvo'
        };
        
        const slug = brandSlugs[manufacturer];
        // ФИКС: Правильный путь без экранирования
        const iconPath = slug ? `/example/static/images/brands/${slug}.svg` : '/example/static/images/brands/default.svg';
        
        return iconPath;
    }

    /**
     * Создание элемента навигации
     */
    createEntityItem(entity, item, navData, isCheckboxMode) {
        const itemContainer = SafeDOM.createElement('div', {
            class: 'manufacturer-item'
        });

        if (isCheckboxMode) {
            // ... код чекбоксов без изменений
        } else {
            // Ссылка для одиночного выбора
            const nextState = { ...navData.current_state, [entity]: item };
            const displayName = this.formatDisplayName(entity, item, navData.models_period);
            
            const link = SafeDOM.createLink('', '#',
                () => this.onNavigate(nextState),
                'manufacturer-link'
            );
            
            // Иконка производителя (только для manufacturer)
            if (entity === 'manufacturer') {
                const iconUrl = this.getManufacturerIcon(item);
               
                const icon = SafeDOM.createImage(
                    iconUrl,  // URL передается без экранирования
                    item,
                    'brand-icon'
                );
                icon.setAttribute('width', '16');
                icon.setAttribute('height', '16');
                
                // Добавляем обработчик ошибки загрузки иконки
                icon.addEventListener('error', () => {
                    console.warn('Failed to load brand icon:', iconUrl);
                    // Пробуем загрузить дефолтную иконку
                    icon.src = '/example/static/images/brands/default.svg';
                });
                
                link.appendChild(icon);
            }
            
            // Добавляем текст после иконки
            link.appendChild(SafeDOM.createText(' ' + displayName));
            itemContainer.appendChild(link);
        }

        return itemContainer;
    }

    /**
     * Обработчик изменения чекбокса
     */
    handleCheckboxChange(entity, item) {
        const index = this.selectedItems[entity].indexOf(item);
        if (index > -1) {
            this.selectedItems[entity].splice(index, 1);
        } else {
            this.selectedItems[entity].push(item);
        }
    }

    /**
     * Создание кнопки применения для чекбоксов
     */
    createApplyButton(entity, navData) {
        const container = SafeDOM.createElement('div', {
            class: 'manufacturer-more'
        });
        
        const button = SafeDOM.createButton('✅ Применить выбор', 
            () => this.applyCheckboxSelection(entity, navData.current_state),
            'btn btn-primary-custom btn-sm w-100'
        );
        
        container.appendChild(button);
        return container;
    }

    /**
     * Применение выбора чекбоксов
     */
    applyCheckboxSelection(entity, baseState) {
        if (this.selectedItems[entity].length === 0) {
            delete baseState[entity];
        } else {
            baseState[entity] = [...this.selectedItems[entity]];
        }
        
        this.onNavigate(baseState);
    }

    /**
     * Создание кнопки "Показать еще"
     */
    createShowMoreButton(entity, items, navData) {
        const container = SafeDOM.createElement('div', {
            class: 'manufacturer-more'
        });
        
        const link = SafeDOM.createLink(
            `📋 Показать еще ${items.length - 15}...`, '#',
            () => this.showAllItems(entity, items, navData.current_state),
            'manufacturer-link text-primary-custom'
        );
        
        container.appendChild(link);
        return container;
    }

    /**
     * Показать все элементы
     */
    showAllItems(entity, items, currentState) {
        const fragment = document.createDocumentFragment();
        
        // Кнопка назад
        fragment.appendChild(SafeDOM.createLink('← Назад', '#',
            () => this.onNavigate(currentState),
            'manufacturer-link text-primary-custom'
        ));
        
        // Все элементы
        items.forEach(item => {
            const nextState = { ...currentState, [entity]: item };
            const displayName = this.formatDisplayName(entity, item);
            
            const link = SafeDOM.createLink(displayName, '#',
                () => this.onNavigate(nextState),
                'manufacturer-link'
            );
            
            const itemContainer = SafeDOM.createElement('div', {
                class: 'manufacturer-item'
            });
            itemContainer.appendChild(link);
            fragment.appendChild(itemContainer);
        });
        
        SafeDOM.render(this.container, fragment);
    }

    /**
     * Форматирование отображаемого имени
     */
    formatDisplayName(entity, item, modelsPeriod = null) {
        if (entity === 'model' && modelsPeriod && modelsPeriod[item]) {
            const period = this.getModelPeriod(item, modelsPeriod);
            return item + period;
        }
        return item;
    }

    /**
     * Получение периода модели
     */
    getModelPeriod(modelName, modelsPeriod) {
        if (!modelsPeriod || !modelsPeriod[modelName]) return '';
        const period = modelsPeriod[modelName];
        return this.formatProductionPeriod(period.start_date, period.end_date);
    }

    /**
     * Форматирование периода производства
     */
    formatProductionPeriod(startDate, endDate) {
        if (!startDate) return '';
        const formatDate = (dateNum) => dateNum ? Math.floor(dateNum / 100) : '';
        const startFormatted = formatDate(startDate);
        const endFormatted = formatDate(endDate) || 'н.в.';
        return ` (${startFormatted}-${endFormatted})`;
    }


    /**
     * Обновление заголовка навигации
     */
    updateNavigationTitle(currentState, modelsPeriod) {
        const titleEl = document.getElementById('navigationTitle');
        if (!titleEl) return;

        if (!currentState || Object.keys(currentState).length === 0) {
            titleEl.textContent = '🏭 Производитель';
            return;
        }
        
        const { manufacturer, modelgroup, model, badgegroup, badge } = currentState;
        let title = '';
        
        if (manufacturer) title += `🏭 ${manufacturer}\n`;
        if (model) {
            let modelDisplay = model;
            if (modelsPeriod && modelsPeriod[model]) {
                const period = this.getModelPeriod(model, modelsPeriod);
                modelDisplay = model + period;
            }
            title += `🚗 ${modelDisplay}\n`;
        } else if (modelgroup) {
            title += `📊 ${modelgroup}\n`;
        }
        if (badgegroup) {
            title += `⚙ ${Array.isArray(badgegroup) ? badgegroup.join(', ') : badgegroup}\n`;
        }
        if (badge) {
            title += `🎯 ${Array.isArray(badge) ? badge.join(', ') : badge}\n`;
        }
        
        titleEl.textContent = title.trim() || '🏭 Производитель';
    }

    /**
     * Сброс выбранных элементов
     */
    resetSelection() {
        this.selectedItems.badgegroup = [];
        this.selectedItems.badge = [];
    }
}
