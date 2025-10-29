/**
 * Полнофункциональное приложение деталей автомобиля
 * /static/js/modules/car-details-app.js
 */
class CarDetailsApp {
    constructor(carId) {
        this.carId = carId;
        this.apiService = new ApiService();
        this.carData = null;
        
        // Словарь оборудования (перенесен из шаблона)
        this.equipmentCodes = {
            '001': 'Антиблокировочная система тормозов (ABS)',
            '002': 'Электронно управляемая подвеска (ECS)',
            '003': 'CD-плеер',
            '004': 'AV-монитор передних сидений',
            '005': 'Навигационная система',
            '006': 'Центральный замок',
            '007': 'Электростеклоподъемники',
            '008': 'Усилитель руля',
            '010': 'Люк',
            '014': 'Кожаные сиденья',
            '015': 'Беспроводной замок дверей',
            '017': 'Алюминиевые диски',
            '019': 'Противобуксовочная система (TCS)',
            '020': 'Боковые подушки безопасности',
            '021': 'Электропривод сидений (водитель, пассажир)',
            '022': 'Подогрев сидений (передние, задние)',
            '023': 'Автоматический кондиционер',
            '024': 'Электропривод складывания зеркал',
            '026': 'Подушки безопасности (водитель, пассажир)',
            '027': 'Подушки безопасности (водитель, пассажир)',
            '029': 'Фары (HID, LED)',
            '030': 'Электрохромное зеркало заднего вида',
            '031': 'Управление на руле',
            '032': 'Парктроник (передний, задний)',
            '033': 'Датчик давления в шинах (TPMS)',
            '034': 'Вентилируемые сиденья (водитель, пассажир)',
            '035': 'Электропривод сидений (водитель, пассажир)',
            '051': 'Память сидений (водитель, пассажир)',
            '054': 'AV-монитор задних сидений',
            '055': 'Система курсовой устойчивости (ESC)',
            '056': 'Шторки безопасности',
            '057': 'Смарт-ключ',
            '058': 'Камера заднего вида',
            '059': 'Электропривод багажника',
            '062': 'Рейлинги на крыше',
            '063': 'Подогрев сидений (передние, задние)',
            '068': 'Круиз-контроль (обычный, адаптивный)',
            '071': 'AUX-разъем',
            '072': 'USB-разъем',
            '074': 'Транспондер для платных дорог',
            '075': 'Фары (HID, LED)',
            '077': 'Вентилируемые сиденья (водитель, пассажир)',
            '078': 'Память сидений (водитель, пассажир)',
            '079': 'Круиз-контроль (обычный, адаптивный)',
            '080': 'Система мягкого закрытия дверей',
            '081': 'Датчик дождя',
            '082': 'Подогрев руля',
            '083': 'Электрорегулировка руля',
            '084': 'Подрулевые лепестки переключения передач',
            '085': 'Парктроник (передний, задний)',
            '086': 'Система предупреждения о боковых объектах',
            '087': 'Камера 360 градусов',
            '088': 'Система предупреждения о покидании полосы (LDWS)',
            '089': 'Электропривод сидений (задние)',
            '090': 'Вентилируемые сиденья (задние)',
            '091': 'Массажные сиденья',
            '092': 'Шторы/жалюзи (задние сиденья, заднее стекло)',
            '093': 'Шторы/жалюзи (задние сиденья, заднее стекло)',
            '094': 'Электронный стояночный тормоз (EPB)',
            '095': 'Проекционный дисплей (HUD)',
            '096': 'Bluetooth',
            '097': 'Автоматическое освещение'
        };
    }

    /**
     * Инициализация приложения
     */
    async init() {
        try {
            await this.loadCarDetails();
        } catch (error) {
            this.showError('Ошибка загрузки данных автомобиля');
        }
    }

    /**
     * Загрузка деталей автомобиля через GET
     */
    async loadCarDetails() {
        try {
            const response = await this.apiService.getCarDetails(this.carId);
            
            if (response.status === 'success' && response.data) {
                this.carData = response.data;
                await this.processCarData();
                this.render();
            } else {
                throw new Error('Неверный формат ответа');
            }
        } catch (error) {
            console.error('Error loading car details:', error);
            this.showError('Ошибка загрузки данных автомобиля');
        }
    }

    /**
     * Обработка данных автомобиля
     */
    async processCarData() {
        // Получаем актуальные данные из URL параметров
        const urlPrice = this.getUrlPrice();
        const urlPhotos = this.getUrlPhotos();
        
        // Устанавливаем актуальную цену (приоритет URL -> API)
        this.carData.currentPrice = urlPrice !== null ? urlPrice : 
            (this.getSafeData('info.advertisement.price') || 0);
        
        // Объединяем фото
        const apiPhotos = this.getSafeData('info.photos', []);
        this.carData.mergedPhotos = this.mergePhotos(urlPhotos, apiPhotos);

        // 🔧 ДЕТАЛЬНАЯ ОТЛАДКА ДЛЯ ЗАМЕНЕННЫХ ДЕТАЛЕЙ
        const outers = this.getSafeData('checkup.outers', []);
       
        if (outers && Array.isArray(outers)) {
            outers.forEach((outer, index) => {
                
                if (outer.statusTypes && Array.isArray(outer.statusTypes)) {
                    outer.statusTypes.forEach((status, statusIndex) => {
                    });
                } else {
                }
            });
            
            // Анализ замененных деталей
            const replacedParts = this.getReplacedParts(outers);

        } else {
            console.log('No outers data or not an array');
        }

        // Очищаем sessionStorage
        this.cleanupSessionStorage();
    }

    /**
     * Получение цены из URL параметров
     */
    getUrlPrice() {
        const urlParams = new URLSearchParams(window.location.search);
        const price = urlParams.get('price');
        return price ? parseInt(price) : null;
    }

    /**
     * Получение фото из URL параметров
     */
    getUrlPhotos() {
        const urlParams = new URLSearchParams(window.location.search);
        const photosJson = urlParams.get('photos');
        try {
            return photosJson ? JSON.parse(photosJson) : [];
        } catch (e) {
            console.warn('Error parsing photos from URL:', e);
            return [];
        }
    }

    /**
     * Основной рендеринг страницы
     */
    render() {
        const content = document.getElementById('carContent');
        const fragment = document.createDocumentFragment();
        
        const row = SafeDOM.createElement('div', { class: 'row' });

        // Левая колонка
        const leftCol = SafeDOM.createElement('div', { class: 'col-lg-8' });
        leftCol.appendChild(this.createPhotoGallery());
        leftCol.appendChild(this.createMainInfo());
        leftCol.appendChild(this.createInsuranceAndInspection());

        // Правая колонка
        const rightCol = SafeDOM.createElement('div', { class: 'col-lg-4' });
        rightCol.appendChild(this.createPriceInfo());
        rightCol.appendChild(this.createContactInfo());
        rightCol.appendChild(this.createOwnershipHistory());
        rightCol.appendChild(this.createEquipment());

        row.appendChild(leftCol);
        row.appendChild(rightCol);
        fragment.appendChild(row);

        SafeDOM.render(content, fragment);
        
        // Загружаем фото после рендера
        setTimeout(() => this.loadCarPhotos(), 100);
    }

    /**
     * Галерея фото
     */
    createPhotoGallery() {
        const card = SafeDOM.createElement('div', { class: 'card mb-4' });
        const cardBody = SafeDOM.createElement('div', { class: 'card-body' });

        const title = SafeDOM.createElement('h5', { class: 'card-title' }, '📷 Фотографии');
        cardBody.appendChild(title);

        const gallery = SafeDOM.createElement('div', { 
            id: 'carGallery',
            class: 'row g-2' 
        });

        // Заполнители для фото
        for (let i = 0; i < 8; i++) {
            const col = SafeDOM.createElement('div', { 
                class: 'col-6 col-md-4 col-lg-3' 
            });

            const ratio = SafeDOM.createElement('div', { class: 'ratio ratio-1x1' });
            const placeholder = SafeDOM.createElement('div', { 
                class: 'photo-placeholder loading-photo rounded' 
            });

            ratio.appendChild(placeholder);
            col.appendChild(ratio);
            gallery.appendChild(col);
        }

        cardBody.appendChild(gallery);
        card.appendChild(cardBody);

        return card;
    }

    /**
     * Основная информация
     */
    createMainInfo() {
        const card = SafeDOM.createElement('div', { class: 'card mb-4' });
        const cardHeader = SafeDOM.createElement('div', { 
            class: 'card-header bg-primary-custom text-white' 
        });
        cardHeader.appendChild(SafeDOM.createElement('h5', { class: 'mb-0' }, '📋 Основная информация'));
        
        const cardBody = SafeDOM.createElement('div', { class: 'card-body' });
        cardBody.appendChild(this.createSpecificationsGrid());
        
        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        return card;
    }

    /**
     * Сетка характеристик
     */
    createSpecificationsGrid() {
        const grid = SafeDOM.createElement('div', { class: 'car-specs-grid' });
        
        const specs = this.getCarSpecifications();
        specs.forEach(spec => {
            const item = SafeDOM.createElement('div', { class: 'spec-item' });
            item.appendChild(SafeDOM.createElement('div', { class: 'spec-label' }, spec.label));
            item.appendChild(SafeDOM.createElement('div', { class: 'spec-value' }, spec.value));
            grid.appendChild(item);
        });
        
        return grid;
    }

    /**
     * Получение характеристик автомобиля
     */
    getCarSpecifications() {
        const info = this.getSafeData('info', {});
        const category = this.getSafeData('info.category', {});
        const spec = this.getSafeData('info.spec', {});

        return [
            { label: '🚗 Модель', value: this.getCarTitle() },
            { label: '🆔 ID', value: info.vehicleId || '—' },
            { label: '🔢 Номер', value: this.findLicensePlate() },
            { label: '🔐 VIN', value: this.findVin() },
            { label: '🎨 Цвет', value: spec.colorName || '—' },
            { label: '⛽ Топливо', value: spec.fuelName || '—' },
            { label: '📏 Пробег', value: spec.mileage ? `${spec.mileage.toLocaleString()} км` : '—' },
            { label: '⚙ Коробка', value: spec.transmissionName || '—' },
            { label: '📅 Год', value: category.formYear || '—' },
            { label: '🚪 Кузов', value: spec.bodyName || '—' },
            { label: '🔧 Объем', value: spec.displacement ? `${spec.displacement} cc` : '—' },
            { label: '💺 Мест', value: spec.seatCount || '—' }
        ];
    }

    /**
     * Страховая история и диагностика
     */
    createInsuranceAndInspection() {
        const card = SafeDOM.createElement('div', { class: 'card mb-4' });
        const cardHeader = SafeDOM.createElement('div', { 
            class: 'card-header bg-light' 
        });
        cardHeader.appendChild(SafeDOM.createElement('h5', { class: 'mb-0' }, '📊 История и диагностика'));
        
        const cardBody = SafeDOM.createElement('div', { class: 'card-body' });

        // Страховая история
        const insuranceSection = SafeDOM.createElement('div', { class: 'mb-4' });
        insuranceSection.appendChild(this.createInsuranceSummary());
        
        // Контейнер для деталей ДТП
        const accidentDetailsContainer = SafeDOM.createElement('div', {
            class: 'accident-details',
            id: 'accidentDetails',
            style: 'display: none;'
        });
        insuranceSection.appendChild(accidentDetailsContainer);
        
        cardBody.appendChild(insuranceSection);

        // Диагностика
        const inspectionSection = SafeDOM.createElement('div', {});
        inspectionSection.appendChild(this.createInspectionSummary());
        
        // Контейнер для деталей диагностики
        const inspectionDetailsContainer = SafeDOM.createElement('div', {
            class: 'inspection-details',
            id: 'inspectionDetails',
            style: 'display: none;'
        });
        inspectionSection.appendChild(inspectionDetailsContainer);
        
        cardBody.appendChild(inspectionSection);

        card.appendChild(cardHeader);
        card.appendChild(cardBody);
        return card;
    }

    /**
     * Сводка страховой истории
     */
    createInsuranceSummary() {
        const container = SafeDOM.createElement('div', {});
        
        const header = SafeDOM.createElement('div', {
            class: 'd-flex justify-content-between align-items-center mb-2 clickable-item'
        });
        header.addEventListener('click', () => this.toggleAccidentDetails());

        const title = SafeDOM.createElement('h6', { class: 'text-dark mb-0' }, '📈 Страховая история');
        header.appendChild(title);

        const accidentCnt = this.getSafeData('open_data.accidentCnt', 0);
        const badgeClass = accidentCnt > 0 ? 'bg-warning' : 'bg-success';
        const badge = SafeDOM.createElement('span', {
            class: `badge accident-badge ${badgeClass}`
        }, `${accidentCnt} ДТП`);
        header.appendChild(badge);

        container.appendChild(header);
        container.appendChild(this.createAccidentSummary());
        
        return container;
    }

    /**
     * Сводка ДТП
     */
    createAccidentSummary() {
        const openData = this.getSafeData('open_data', {});
        const myAccidentCnt = this.getSafeData('open_data.myAccidentCnt', 0);
        const otherAccidentCnt = this.getSafeData('open_data.otherAccidentCnt', 0);
        const totalCost = (this.getSafeData('open_data.myAccidentCost', 0) + 
                          this.getSafeData('open_data.otherAccidentCost', 0)) * CurrencyService.getExchangeRate();

        const summary = SafeDOM.createElement('div', { class: 'accident-summary' });
        
        const row = SafeDOM.createElement('div', { class: 'row small text-center' });

        // ДТП владельца
        const col1 = SafeDOM.createElement('div', { class: 'col-4' });
        col1.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, '👤 ДТП владельца'));
        col1.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, myAccidentCnt.toString()));
        row.appendChild(col1);

        // ДТП других
        const col2 = SafeDOM.createElement('div', { class: 'col-4' });
        col2.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, '👥 ДТП других'));
        col2.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, otherAccidentCnt.toString()));
        row.appendChild(col2);

        // Общая сумма
        const col3 = SafeDOM.createElement('div', { class: 'col-4' });
        col3.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, '💰 Общая сумма'));
        const costText = totalCost > 0 ? Math.round(totalCost).toLocaleString() + ' ₽' : '—';
        col3.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, costText));
        row.appendChild(col3);

        summary.appendChild(row);
        return summary;
    }

    /**
     * Детали страховой истории
     */
    createAccidentDetails() {
        const openData = this.getSafeData('open_data', {});
        const accidents = this.getSafeData('open_data.accidents', []);
        
        const container = SafeDOM.createElement('div', { class: 'mt-3' });
        
        const alert = SafeDOM.createElement('div', { 
            class: 'alert alert-info small mb-3' 
        });
        alert.appendChild(SafeDOM.createElement('strong', {}, '📋 Все зарегистрированные ДТП'));
        container.appendChild(alert);
        
        if (accidents.length > 0) {
            accidents.forEach((acc, index) => {
                const accidentItem = this.createAccidentItem(acc, index);
                container.appendChild(accidentItem);
            });
        } else {
            container.appendChild(SafeDOM.createElement('div', { 
                class: 'text-muted small' 
            }, 'Детальная информация о ДТП отсутствует'));
        }
        
        return container;
    }

    /**
     * Элемент ДТП
     */
    createAccidentItem(acc, index) {
        const accidentType = acc.type === '2' ? '👤 Владелец' : 
                          acc.type === '3' ? '👥 Третье лицо' : 
                          '❓ Тип не указан';
        
        const insuranceBenefit = acc.insuranceBenefit ? 
            Math.round(acc.insuranceBenefit * CurrencyService.getExchangeRate()).toLocaleString() : null;
        
        const item = SafeDOM.createElement('div', { class: 'small border-bottom py-2' });
        
        const header = SafeDOM.createElement('div', { class: 'fw-bold' }, `ДТП ${index + 1} (${accidentType})`);
        item.appendChild(header);
        
        const date = SafeDOM.createElement('div', {}, `📅 Дата: ${acc.date || 'дата неизвестна'}`);
        item.appendChild(date);
        
        if (insuranceBenefit) {
            const benefit = SafeDOM.createElement('div', {}, 
                `💵 Страховая выплата: ${insuranceBenefit} ₽ (${acc.insuranceBenefit.toLocaleString()} ₩)`);
            item.appendChild(benefit);
        }
        
        if (acc.partCost) {
            const partCost = SafeDOM.createElement('div', {}, 
                `🔧 Запчасти: ${Math.round(acc.partCost * CurrencyService.getExchangeRate()).toLocaleString()} ₽ (${acc.partCost.toLocaleString()} ₩)`);
            item.appendChild(partCost);
        }
        
        if (acc.laborCost) {
            const laborCost = SafeDOM.createElement('div', {}, 
                `👷 Работа: ${Math.round(acc.laborCost * CurrencyService.getExchangeRate()).toLocaleString()} ₽ (${acc.laborCost.toLocaleString()} ₩)`);
            item.appendChild(laborCost);
        }
        
        if (acc.paintingCost) {
            const paintingCost = SafeDOM.createElement('div', {}, 
                `🎨 Покраска: ${Math.round(acc.paintingCost * CurrencyService.getExchangeRate()).toLocaleString()} ₽ (${acc.paintingCost.toLocaleString()} ₩)`);
            item.appendChild(paintingCost);
        }
        
        return item;
    }

    /**
     * Сводка диагностики
     */
    createInspectionSummary() {
        const container = SafeDOM.createElement('div', {});
        
        const header = SafeDOM.createElement('div', {
            class: 'd-flex justify-content-between align-items-center mb-2 clickable-item'
        });
        header.addEventListener('click', () => this.toggleInspectionDetails());

        const title = SafeDOM.createElement('h6', { class: 'text-dark mb-0' }, '🔧 Диагностика');
        header.appendChild(title);

        const badge = SafeDOM.createElement('span', {
            class: 'badge inspection-badge bg-info'
        }, 'Детали');
        header.appendChild(badge);

        container.appendChild(header);
        container.appendChild(this.createInspectionDetailsSummary());
        
        return container;
    }

    /**
     * Детали диагностики (сводка)
     */
    createInspectionDetailsSummary() {
        const masterDetail = this.getSafeData('checkup.master.detail', {});
        const carState = this.getSafeData('checkup.master.detail.carStateType.title', '—');
        const boardState = this.getSafeData('checkup.master.detail.boardStateType.title', '—');

        const summary = SafeDOM.createElement('div', { class: 'inspection-summary' });
        
        const row = SafeDOM.createElement('div', { class: 'row small' });

        // Состояние автомобиля
        const col1 = SafeDOM.createElement('div', { class: 'col-6' });
        col1.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, 'Состояние автомобиля'));
        col1.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, carState));
        row.appendChild(col1);

        // Состояние кузова
        const col2 = SafeDOM.createElement('div', { class: 'col-6' });
        col2.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, 'Состояние кузова'));
        col2.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, boardState));
        row.appendChild(col2);

        summary.appendChild(row);
        return summary;
    }

    /**
     * Детали диагностики
     */
    createInspectionDetails() {
        const checkup = this.getSafeData('checkup', {});
        const master = this.getSafeData('checkup.master', null);
        const masterDetail = master ? this.getSafeData('checkup.master.detail', {}) : {};
        
        const container = SafeDOM.createElement('div', { class: 'mt-3' });
        
        if (masterDetail && masterDetail.vin) {
            const detailsGrid = SafeDOM.createElement('div', { class: 'mb-3' });
            
            const row = SafeDOM.createElement('div', { class: 'row small' });
            
            // Гарантия
            const guarantyCol = SafeDOM.createElement('div', { class: 'col-6' });
            guarantyCol.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, 'Гарантия'));
            guarantyCol.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, 
                this.getSafeData('checkup.master.detail.guarantyType.title', '—')));
            row.appendChild(guarantyCol);
            
            // Диагност
            const inspectorCol = SafeDOM.createElement('div', { class: 'col-6' });
            inspectorCol.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, 'Диагност'));
            inspectorCol.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, 
                masterDetail.inspName || '—'));
            row.appendChild(inspectorCol);
            
            // Тюнинг
            const tuningCol = SafeDOM.createElement('div', { class: 'col-6' });
            tuningCol.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, 'Тюнинг'));
            tuningCol.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, 
                masterDetail.tuning ? 'Да' : 'Нет'));
            row.appendChild(tuningCol);
            
            // Пробег
            const mileageCol = SafeDOM.createElement('div', { class: 'col-6' });
            mileageCol.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, 'Пробег'));
            mileageCol.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, 
                masterDetail.mileage ? masterDetail.mileage.toLocaleString() + ' км' : '—'));
            row.appendChild(mileageCol);
            
            // Дата диагностики
            const dateCol = SafeDOM.createElement('div', { class: 'col-12' });
            dateCol.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, 'Дата диагностики'));
            dateCol.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, 
                masterDetail.issueDate ? this.formatDate(masterDetail.issueDate) : '—'));
            row.appendChild(dateCol);
            
            detailsGrid.appendChild(row);
            container.appendChild(detailsGrid);
        } else if (master) {
            const alert = SafeDOM.createElement('div', { class: 'alert alert-info small mb-3' }, 
                'Диагностика проведена, но детальная информация отсутствует');
            container.appendChild(alert);
        } else {
            const alert = SafeDOM.createElement('div', { class: 'alert alert-warning small mb-3' }, 
                'Диагностика не проводилась');
            container.appendChild(alert);
        }
        
        // 🔧 ИСПРАВЛЕННАЯ ЛОГИКА: Замененные детали
        const replacedPartsSection = this.createSimpleReplacedPartsSection();
        container.appendChild(replacedPartsSection);
        
        return container;
    }

    /**
     * Упрощенный метод для отображения замененных деталей
     */
    createSimpleReplacedPartsSection() {
        const outers = this.getSafeData('checkup.outers', []);
        
        const container = SafeDOM.createElement('div', { class: 'mb-3' });
        const title = SafeDOM.createElement('strong', { class: 'd-block mb-2' }, '🛠 Замененные детали:');
        container.appendChild(title);
        
        if (!outers || !Array.isArray(outers) || outers.length === 0) {
            container.appendChild(SafeDOM.createElement('div', { 
                class: 'text-muted small' 
            }, 'Нет данных о деталях'));
            return container;
        }
        
        let replacedCount = 0;
        
        outers.forEach((outer, index) => {
            
            if (outer && outer.statusTypes && Array.isArray(outer.statusTypes)) {
                const hasReplacement = outer.statusTypes.some(st => {
                    if (!st) return false;
                    const isReplaced = st.code === 'X' || (st.title && st.title.includes('Exchange'));
                    return isReplaced;
                });
                
                if (hasReplacement) {
                    replacedCount++;
                    const partName = outer.type?.title || `Деталь ${index + 1}`;
                    
                    const partItem = SafeDOM.createElement('div', { 
                        class: 'small border-bottom py-2' 
                    });
                    partItem.appendChild(SafeDOM.createText(partName));
                    
                    // Добавляем статус если есть
                    if (outer.statusTypes[0]?.title && outer.statusTypes[0].title !== 'Exchange (replacement)') {
                        const statusBadge = SafeDOM.createElement('span', { 
                            class: 'badge bg-secondary ms-2' 
                        }, outer.statusTypes[0].title);
                        partItem.appendChild(statusBadge);
                    }
                    
                    container.appendChild(partItem);
                }
            }
        });
        
        if (replacedCount === 0) {
            container.appendChild(SafeDOM.createElement('div', { 
                class: 'text-muted small' 
            }, '✅ Нет замененных деталей'));
        } else {
            const counter = SafeDOM.createElement('div', { 
                class: 'text-muted small mt-2' 
            }, `Всего заменено деталей: ${replacedCount}`);
            container.appendChild(counter);
        }

        return container;
    }

    /**
     * Получить замененные детали (статус "Exchange")
     */
    getReplacedParts(outers) {
        if (!outers || !Array.isArray(outers)) {
            console.warn('getReplacedParts: Outers is not array or empty:', outers);
            return [];
        }
        
        const replaced = outers
            .filter(outer => {
                if (!outer) {
                    return false;
                }
                
                const statusTypes = outer.statusTypes;
                
                if (!statusTypes || !Array.isArray(statusTypes)) {
                    return false;
                }
                
                const hasReplacement = statusTypes.some(st => {
                    if (!st) {
                        return false;
                    }
                    
                    const isReplaced = st.code === 'X' || st.title === 'Exchange (replacement)';
                    return isReplaced;
                });
                
                return hasReplacement;
            })
            .map(outer => {
                const type = outer.type?.title || 'Неизвестная деталь';
                const status = outer.statusTypes?.[0]?.title || 'Неизвестный статус';
                const result = { type, status };
                return result;
            });
        
        return replaced;
    }

    /**
     * Форматирование даты
     */
    formatDate(dateStr) {
        if (!dateStr || dateStr.length !== 8) return '—';
        return `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`;
    }

    /**
     * Ценовая информация
     */
    createPriceInfo() {
        const card = SafeDOM.createElement('div', { class: 'card mb-4' });
        const cardBody = SafeDOM.createElement('div', { class: 'card-body' });

        // Заголовок с ценой
        const priceRub = CurrencyService.convertToRub(this.carData.currentPrice);
        const priceTitle = SafeDOM.createElement('h4', { 
            class: 'card-title text-dark mb-3' 
        }, priceRub ? `${priceRub.toLocaleString()} тыс.₽` : 'Цена не указана');
        
        cardBody.appendChild(priceTitle);
        
        // Сравнение цен
        const priceComparison = this.createPriceComparison();
        if (priceComparison) {
            cardBody.appendChild(priceComparison);
        }
        
        // Информация о цене
        cardBody.appendChild(this.createPriceDetails());
        
        // Кнопки действий
        cardBody.appendChild(this.createActionButtons());

        card.appendChild(cardBody);
        return card;
    }

    /**
     * Сравнение цен (новая vs текущая)
     */
    createPriceComparison() {
        const advertisement = this.getSafeData('info.advertisement', {});
        const category = this.getSafeData('info.category', {});
        
        const currentPrice = this.carData.currentPrice || advertisement.price || 0;
        const originalPrice = category.originPrice;
        
        // Если есть originalPrice и можно сделать осмысленное сравнение
        if (originalPrice && originalPrice > 0 && currentPrice > 0 && currentPrice < originalPrice) {
            const priceReduction = originalPrice - currentPrice;
            const percentOfNew = Math.round((currentPrice / originalPrice) * 100);
            const savingsPercent = 100 - percentOfNew;
            
            const originalPriceInRub = CurrencyService.convertToRub(originalPrice);
            const reductionInRub = CurrencyService.convertToRub(priceReduction);

            const alert = SafeDOM.createElement('div', { class: 'alert alert-success mb-3' });
            
            const headerRow = SafeDOM.createElement('div', {
                class: 'd-flex justify-content-between align-items-center'
            });
            
            const leftCol = SafeDOM.createElement('div', {});
            leftCol.appendChild(SafeDOM.createElement('strong', {}, `💰 Экономия ${savingsPercent}%`));
            leftCol.appendChild(SafeDOM.createElement('div', { class: 'small' }, 'от цены нового автомобиля'));
            
            const rightCol = SafeDOM.createElement('div', { class: 'text-end' });
            rightCol.appendChild(SafeDOM.createElement('div', { 
                class: 'text-muted small' 
            }, `Новый: ${originalPriceInRub ? originalPriceInRub.toLocaleString() + ' тыс.₽' : '—'}`));
            rightCol.appendChild(SafeDOM.createElement('div', { 
                class: 'text-success small' 
            }, `Выгода: ${reductionInRub ? reductionInRub.toLocaleString() + ' тыс.₽' : '—'}`));
            
            headerRow.appendChild(leftCol);
            headerRow.appendChild(rightCol);
            alert.appendChild(headerRow);

            // Прогресс-бар
            const progressContainer = SafeDOM.createElement('div', { class: 'progress mt-2' });
            progressContainer.style.height = '8px';
            const progressBar = SafeDOM.createElement('div', {
                class: 'progress-bar bg-success',
                style: `width: ${percentOfNew}%`
            });
            progressContainer.appendChild(progressBar);
            alert.appendChild(progressContainer);

            const progressText = SafeDOM.createElement('div', {
                class: 'small text-muted text-center mt-1'
            }, `Текущая цена → ${percentOfNew}% от новой`);
            alert.appendChild(progressText);

            return alert;
        }
        
        // Если originalPrice отсутствует - показываем информационный блок
        if (!originalPrice || originalPrice <= 0) {
            const currentPriceInRub = CurrencyService.convertToRub(currentPrice);
            
            const alert = SafeDOM.createElement('div', { class: 'alert alert-info mb-3' });
            
            const headerRow = SafeDOM.createElement('div', {
                class: 'd-flex justify-content-between align-items-center'
            });
            
            const leftCol = SafeDOM.createElement('div', {});
            leftCol.appendChild(SafeDOM.createElement('strong', {}, 'ℹ️ Сравнение с новым автомобилем'));
            leftCol.appendChild(SafeDOM.createElement('div', { class: 'small' }, 'Информация о цене нового автомобиля отсутствует'));
            
            const rightCol = SafeDOM.createElement('div', { class: 'text-end' });
            rightCol.appendChild(SafeDOM.createElement('div', { 
                class: 'text-dark small' 
            }, `Текущая цена: ${currentPriceInRub ? currentPriceInRub.toLocaleString() + ' тыс.₽' : '—'}`));
            
            headerRow.appendChild(leftCol);
            headerRow.appendChild(rightCol);
            alert.appendChild(headerRow);

            return alert;
        }
        
        return null;
    }

    /**
     * Детали цены
     */
    createPriceDetails() {
        const advertisement = this.getSafeData('info.advertisement', {});
        const category = this.getSafeData('info.category', {});
        
        const currentPrice = this.carData.currentPrice || advertisement.price || 0;
        const originalPrice = category.originPrice; // не подставляем currentPrice!
        
        const priceInRub = CurrencyService.convertToRub(currentPrice);
        const originalPriceInRub = CurrencyService.convertToRub(originalPrice);

        const container = SafeDOM.createElement('div', { class: 'price-section mb-3' });

        // Цена в вонах
        const wonPrice = SafeDOM.createElement('h2', { 
            class: 'price-tag mb-1' 
        }, currentPrice ? `${(currentPrice * 10000).toLocaleString()} ₩` : '—');
        container.appendChild(wonPrice);

        // Информация о снижении цены - ТОЛЬКО если есть originalPrice
        if (originalPrice && originalPrice !== currentPrice) {
            const priceReduction = originalPrice - currentPrice;
            const reductionText = SafeDOM.createElement('div', { class: 'text-success small' });
            reductionText.appendChild(SafeDOM.createText(`📉 Снижена на ${(priceReduction * 10000).toLocaleString()} ₩ `));
            
            const rubReduction = CurrencyService.convertToRub(priceReduction);
            if (rubReduction) {
                reductionText.appendChild(SafeDOM.createText(`(~${rubReduction.toLocaleString()} тыс.₽)`));
            }
            container.appendChild(reductionText);

            const originalText = SafeDOM.createElement('div', { class: 'text-muted small' });
            originalText.appendChild(SafeDOM.createText(`Была: ${(originalPrice * 10000).toLocaleString()} ₩ `));
            
            if (originalPriceInRub) {
                originalText.appendChild(SafeDOM.createText(`(~${originalPriceInRub.toLocaleString()} тыс.₽)`));
            }
            container.appendChild(originalText);
        }

        // Блок с цифрами
        const numbersContainer = SafeDOM.createElement('div', {
            class: 'mb-3 p-3 bg-light rounded'
        });
        
        const numbersRow = SafeDOM.createElement('div', { class: 'row text-center small' });
        
        // Текущая цена
        const currentCol = SafeDOM.createElement('div', { 
            class: originalPrice ? 'col-6' : 'col-12' 
        });
        currentCol.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, '🎯 Текущая цена'));
        currentCol.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, 
            priceInRub ? `${priceInRub.toLocaleString()} тыс.₽` : '—'));
        numbersRow.appendChild(currentCol);

        // Цена нового - показываем только если есть originalPrice
        if (originalPrice) {
            const originalCol = SafeDOM.createElement('div', { class: 'col-6' });
            originalCol.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, '🆕 Цена нового'));
            originalCol.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, 
                originalPriceInRub ? `${originalPriceInRub.toLocaleString()} тыс.₽` : '—'));
            numbersRow.appendChild(originalCol);
        }

        numbersContainer.appendChild(numbersRow);
        container.appendChild(numbersContainer);

        return container;
    }

    /**
     * Кнопки действий
     */
    createActionButtons() {
        const container = SafeDOM.createElement('div', { class: 'd-grid gap-2 btn-group-mobile' });

        // Кнопка "На сайте Encar"
        const encarLink = SafeDOM.createLink(
            '🌐 Открыть на Encar',
            `https://fem.encar.com/cars/detail/${this.carId}`,
            null,
            'btn btn-primary-custom',
            { target: '_blank', rel: 'noopener noreferrer' }
        );
        container.appendChild(encarLink);

        // Кнопка "Акт осмотра"
        const hasInspection = this.getSafeData('checkup.master') !== null;
        if (hasInspection) {
            const inspectionButton = SafeDOM.createButton(
                '📋 Акт осмотра',
                () => this.generateInspectionReport(),
                'btn btn-outline-primary-custom'
            );
            container.appendChild(inspectionButton);
        } else {
            const noInspection = SafeDOM.createElement('div', { 
                class: 'text-muted text-center py-2' 
            }, '🔍 Осмотр не проводился');
            container.appendChild(noInspection);
        }

        // Кнопка "Назад"
        const backButton = SafeDOM.createButton(
            '← Назад к каталогу',
            () => window.history.back(),
            'btn btn-outline-secondary'
        );
        container.appendChild(backButton);

        return container;
    }

    /**
     * Контактная информация
     */
    createContactInfo() {
        const contact = this.getSafeData('info.contact', {});
        const partnership = this.getSafeData('info.partnership', {});
        
        if (!contact || !contact.userType) {
            const card = SafeDOM.createElement('div', { class: 'card mb-4' });
            const cardBody = SafeDOM.createElement('div', { class: 'card-body' });
            cardBody.appendChild(SafeDOM.createElement('p', { class: 'text-muted' }, 'Контактная информация отсутствует'));
            card.appendChild(cardBody);
            return card;
        }

        const card = SafeDOM.createElement('div', { class: 'card mb-4' });
        const cardBody = SafeDOM.createElement('div', { class: 'card-body' });
        
        const title = SafeDOM.createElement('h5', { class: 'card-title' }, '📞 Контакты');
        cardBody.appendChild(title);

        const content = SafeDOM.createElement('div', { class: 'small' });

        // Тип продавца
        const sellerType = SafeDOM.createElement('div', { class: 'mb-2' });
        sellerType.appendChild(SafeDOM.createElement('strong', {}, 'Тип продавца:'));
        sellerType.appendChild(SafeDOM.createElement('br'));
        sellerType.appendChild(SafeDOM.createText(
            contact.userType === 'DEALER' ? '🏢 Дилер' : '👤 Частное лицо'
        ));
        content.appendChild(sellerType);

        // Адрес
        if (contact.address) {
            const address = SafeDOM.createElement('div', { class: 'mb-2' });
            address.appendChild(SafeDOM.createElement('strong', {}, '📍 Адрес:'));
            address.appendChild(SafeDOM.createElement('br'));
            address.appendChild(SafeDOM.createText(contact.address));
            content.appendChild(address);
        }

        // Телефон
        if (contact.no) {
            const phone = SafeDOM.createElement('div', { class: 'mb-2' });
            phone.appendChild(SafeDOM.createElement('strong', {}, '📞 Телефон:'));
            phone.appendChild(SafeDOM.createElement('br'));
            
            let phoneText = contact.no;
            if (contact.contactType) {
                phoneText += ` (${this.getContactType(contact.contactType)})`;
            }
            phone.appendChild(SafeDOM.createText(phoneText));
            content.appendChild(phone);
        }

        // Телефон дилера
        const dealerPhone = this.getSafeData('info.partnership.dealer.firm.telephoneNumber');
        if (dealerPhone) {
            const dealerPhoneElem = SafeDOM.createElement('div', { class: 'mb-2' });
            dealerPhoneElem.appendChild(SafeDOM.createElement('strong', {}, '🏢 Телефон дилера:'));
            dealerPhoneElem.appendChild(SafeDOM.createElement('br'));
            dealerPhoneElem.appendChild(SafeDOM.createText(dealerPhone));
            content.appendChild(dealerPhoneElem);
        }

        // Центры диагностики
        const diagnosisCenters = this.getSafeData('info.partnership.dealer.firm.diagnosisCenters', []);
        if (diagnosisCenters.length > 0) {
            const centers = SafeDOM.createElement('div', { class: 'mb-2' });
            centers.appendChild(SafeDOM.createElement('strong', {}, '🔧 Центры диагностики:'));
            centers.appendChild(SafeDOM.createElement('br'));
            centers.appendChild(SafeDOM.createText(
                diagnosisCenters.map(center => center.name).join(', ')
            ));
            content.appendChild(centers);
        }

        cardBody.appendChild(content);
        card.appendChild(cardBody);
        return card;
    }

    /**
     * История владения
     */
    createOwnershipHistory() {
        const openData = this.getSafeData('open_data', {});
        const ownerChanges = this.getSafeData('open_data.ownerChanges', []);
        const carInfoChanges = this.getSafeData('open_data.carInfoChanges', []);
        
        if (ownerChanges.length === 0 && carInfoChanges.length === 0) {
            return SafeDOM.createText('');
        }

        const card = SafeDOM.createElement('div', { class: 'card mb-4' });
        const cardBody = SafeDOM.createElement('div', { class: 'card-body' });

        const title = SafeDOM.createElement('h6', { class: 'text-dark mb-3' }, '🔄 История владения');
        cardBody.appendChild(title);

        // История владельцев
        if (ownerChanges.length > 0) {
            const ownersSection = SafeDOM.createElement('div', { class: 'mb-3' });
            ownersSection.appendChild(SafeDOM.createElement('strong', {}, 'Владельцы:'));
            
            ownerChanges.forEach((date, index) => {
                const ownerItem = SafeDOM.createElement('div', { 
                    class: 'small border-bottom py-1' 
                }, `${index + 1}. ${date}`);
                ownersSection.appendChild(ownerItem);
            });
            
            cardBody.appendChild(ownersSection);
        }

        // История номерных знаков
        if (carInfoChanges.length > 0) {
            const platesSection = SafeDOM.createElement('div', { class: 'mb-3' });
            platesSection.appendChild(SafeDOM.createElement('strong', {}, '🚘 Номерные знаки:'));
            
            carInfoChanges.forEach(change => {
                const plateItem = SafeDOM.createElement('div', { 
                    class: 'small border-bottom py-1' 
                }, `📅 ${change.date} - ${change.carNo}`);
                platesSection.appendChild(plateItem);
            });
            
            cardBody.appendChild(platesSection);
        }

        // Статистика
        const statsRow = SafeDOM.createElement('div', { class: 'row small text-center' });
        
        const ownerChangesCount = SafeDOM.createElement('div', { class: 'col-6' });
        ownerChangesCount.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, '🔄 Смен владельцев'));
        ownerChangesCount.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, 
            this.getSafeData('open_data.ownerChangeCnt', 0).toString()));
        statsRow.appendChild(ownerChangesCount);

        const plateChangesCount = SafeDOM.createElement('div', { class: 'col-6' });
        plateChangesCount.appendChild(SafeDOM.createElement('div', { class: 'text-muted' }, '🚘 Смен номеров'));
        plateChangesCount.appendChild(SafeDOM.createElement('div', { class: 'fw-bold' }, 
            this.getSafeData('open_data.carNoChangeCnt', 0).toString()));
        statsRow.appendChild(plateChangesCount);

        cardBody.appendChild(statsRow);
        card.appendChild(cardBody);
        
        return card;
    }

    /**
     * Оборудование
     */
    createEquipment() {
        const options = this.getSafeData('info.options', {});
        const standardOptions = this.getSafeData('info.options.standard', []);
        const choiceOptions = this.getSafeData('info.options.choice', []);
        const tuningOptions = this.getSafeData('info.options.tuning', []);
        
        if (standardOptions.length === 0 && choiceOptions.length === 0 && tuningOptions.length === 0) {
            return SafeDOM.createText('');
        }

        const card = SafeDOM.createElement('div', { class: 'card mb-4' });
        const cardBody = SafeDOM.createElement('div', { class: 'card-body' });

        const title = SafeDOM.createElement('h6', { class: 'text-dark mb-3' }, '🛠 Оборудование');
        cardBody.appendChild(title);

        // Стандартное оборудование
        if (standardOptions.length > 0) {
            cardBody.appendChild(this.createEquipmentSection('standard', '⚙️ Стандартное', standardOptions, 'bg-secondary'));
        }

        // Дополнительное оборудование
        if (choiceOptions.length > 0) {
            cardBody.appendChild(this.createEquipmentSection('choice', '🎯 Дополнительное', choiceOptions, 'bg-primary'));
        }

        // Тюнинг
        if (tuningOptions.length > 0) {
            cardBody.appendChild(this.createEquipmentSection('tuning', '🚀 Тюнинг', tuningOptions, 'bg-warning'));
        }

        card.appendChild(cardBody);
        return card;
    }

    /**
     * Секция оборудования
     */
    createEquipmentSection(type, title, options, badgeClass) {
        const section = SafeDOM.createElement('div', { class: 'mb-3' });
        
        const toggle = SafeDOM.createElement('div', {
            class: 'd-flex justify-content-between align-items-center equipment-toggle'
        });
        toggle.addEventListener('click', () => this.toggleEquipmentDetails(type));

        toggle.appendChild(SafeDOM.createElement('strong', {}, title));
        
        const badge = SafeDOM.createElement('span', {
            class: `badge ${badgeClass}`
        }, options.length.toString());
        toggle.appendChild(badge);

        section.appendChild(toggle);

        // Детали оборудования (изначально скрыты)
        const details = SafeDOM.createElement('div', {
            class: 'equipment-details',
            'data-type': type,
            style: 'display: none;'
        });
        
        const detailsContent = SafeDOM.createElement('div', { class: 'mt-2' });
        
        const descriptions = this.convertEquipmentCodes(options);
        descriptions.forEach(desc => {
            const item = SafeDOM.createElement('div', { 
                class: 'small border-bottom py-1' 
            }, desc);
            detailsContent.appendChild(item);
        });
        
        details.appendChild(detailsContent);
        section.appendChild(details);

        return section;
    }

    // ========== УТИЛИТЫ И ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

    /**
     * Загрузка реальных фото
     */
    loadCarPhotos() {
        const gallery = document.getElementById('carGallery');
        const photos = this.getSafeData('mergedPhotos', []);

        if (photos.length === 0) {
            SafeDOM.render(gallery, this.createNoPhotosMessage());
            return;
        }

        const fragment = document.createDocumentFragment();
        
        photos.slice(0, 12).forEach((photo, index) => {
            const photoUrl = typeof photo === 'string' ? photo : (photo.path || '');
            
            const col = SafeDOM.createElement('div', { 
                class: 'col-6 col-md-4 col-lg-3' 
            });

            const ratio = SafeDOM.createElement('div', { class: 'ratio ratio-1x1' });
            const img = SafeDOM.createImage(
                photoUrl,
                `Фото автомобиля ${index + 1}`,
                'img-fluid rounded'
            );
            img.style.objectFit = 'cover';
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', () => this.openPhotoModal(photoUrl));
            
            // Обработчик ошибки загрузки фото
            img.addEventListener('error', () => {
                img.classList.add('photo-placeholder');
                img.style.display = 'flex';
                img.style.alignItems = 'center';
                img.style.justifyContent = 'center';
                img.innerHTML = '🚗';
            });

            ratio.appendChild(img);
            col.appendChild(ratio);
            fragment.appendChild(col);
        });

        SafeDOM.render(gallery, fragment);
    }

    /**
     * Сообщение об отсутствии фото
     */
    createNoPhotosMessage() {
        const container = SafeDOM.createElement('div', { 
            class: 'col-12 text-center py-3' 
        });

        const content = SafeDOM.createElement('div', { class: 'text-muted' });
        const icon = SafeDOM.createElement('div', { style: 'font-size: 3rem;' }, '🚗');
        const text = SafeDOM.createElement('p', {}, 'Фотографии отсутствуют');

        content.appendChild(icon);
        content.appendChild(text);
        container.appendChild(content);

        return container;
    }

    /**
     * Получение цены из sessionStorage
     */
    getSessionPrice() {
        try {
            const sessionPrice = sessionStorage.getItem(`carPrice_${this.carId}`);
            if (sessionPrice && !isNaN(sessionPrice)) {
                const price = parseInt(sessionPrice);
                return price > 0 ? price : null;
            }
        } catch (e) {
            console.warn('Не удалось получить цену из sessionStorage');
        }
        return null;
    }

    /**
     * Получение фото из sessionStorage
     */
    getSessionPhotos() {
        try {
            const storedPhotos = sessionStorage.getItem(`carPhotos_${this.carId}`);
            if (storedPhotos) {
                return JSON.parse(storedPhotos);
            }
        } catch (e) {
            console.warn('Не удалось получить фото из sessionStorage');
        }
        return [];
    }

    /**
     * Объединение фото из разных источников
     */
    mergePhotos(catalogPhotos, apiPhotos) {
        const uniqueUrls = new Set();
        const result = [];
        
        // Добавляем фото из каталога
        catalogPhotos.forEach(photo => {
            if (photo && !uniqueUrls.has(photo)) {
                uniqueUrls.add(photo);
                result.push(photo);
            }
        });
        
        // Добавляем фото из API
        if (Array.isArray(apiPhotos)) {
            apiPhotos.forEach(photo => {
                const photoPath = typeof photo === 'string' ? photo : (photo.path || '');
                if (photoPath && !uniqueUrls.has(photoPath)) {
                    uniqueUrls.add(photoPath);
                    result.push(photoPath);
                }
            });
        }
        
        return result;
    }

    /**
     * Очистка sessionStorage
     */
    cleanupSessionStorage() {
        try {
            sessionStorage.removeItem(`carPrice_${this.carId}`);
            sessionStorage.removeItem(`carPhotos_${this.carId}`);
        } catch (e) {
            console.warn('Не удалось очистить sessionStorage');
        }
    }

    /**
     * Безопасное получение данных по пути
     */
    getSafeData(path, defaultValue = null) {
        return path.split('.').reduce((acc, key) => {
            try {
                return acc && acc[key] !== undefined ? acc[key] : defaultValue;
            } catch {
                return defaultValue;
            }
        }, this.carData);
    }

    /**
     * Получение заголовка автомобиля
     */
    getCarTitle() {
        const category = this.getSafeData('info.category', {});
        const parts = [
            category.manufacturerName,
            category.modelGroupName, 
            category.gradeName
        ].filter(Boolean);
        
        return parts.join(' ').trim() || '—';
    }

    /**
     * Поиск VIN
     */
    findVin() {
        const paths = [
            'info.vin',
            'checkup.master.detail.vin', 
            'open_data.vin'
        ];
        
        for (const path of paths) {
            const value = this.getSafeData(path);
            if (value) return value;
        }
        return '—';
    }

    /**
     * Поиск номерного знака
     */
    findLicensePlate() {
        const plates = [];
        
        const vehicleNo = this.getSafeData('info.vehicleNo');
        if (vehicleNo) plates.push(vehicleNo);
        
        const carNo = this.getSafeData('open_data.carNo');
        if (carNo) plates.push(carNo);
        
        return plates.length > 0 ? plates.join(' / ') : '—';
    }

    /**
     * Получение типа контакта
     */
    getContactType(type) {
        const types = {
            'MOBILE': 'мобильный',
            'PHONE': 'телефон',
            'FAX': 'факс'
        };
        return types[type] || type;
    }

    /**
     * Преобразование кодов оборудования в описания
     */
    convertEquipmentCodes(codes) {
        return codes.map(code => {
            const formattedCode = code.toString().padStart(3, '0');
            return this.equipmentCodes[formattedCode] || `Неизвестная опция (${formattedCode})`;
        });
    }

    // ========== ИНТЕРАКТИВНЫЕ ФУНКЦИИ ==========

    toggleAccidentDetails() {
        const details = document.getElementById('accidentDetails');
        const summary = document.querySelector('.accident-summary');
        
        if (details && summary) {
            if (details.style.display === 'none' || !details.style.display) {
                details.style.display = 'block';
                summary.style.display = 'none';
                if (details.innerHTML === '') {
                    details.appendChild(this.createAccidentDetails());
                }
            } else {
                details.style.display = 'none';
                summary.style.display = 'block';
            }
        }
    }

    toggleInspectionDetails() {
        const details = document.getElementById('inspectionDetails');
        const summary = document.querySelector('.inspection-summary');
        
        if (details && summary) {
            if (details.style.display === 'none' || !details.style.display) {
                details.style.display = 'block';
                summary.style.display = 'none';
                if (details.innerHTML === '') {
                    details.appendChild(this.createInspectionDetails());
                }
            } else {
                details.style.display = 'none';
                summary.style.display = 'block';
            }
        }
    }

    toggleEquipmentDetails(type) {
        const details = document.querySelector(`.equipment-details[data-type="${type}"]`);
        if (details) {
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        }
    }

    openPhotoModal(photoUrl) {
        const modalPhoto = document.getElementById('modalPhoto');
        if (modalPhoto) {
            modalPhoto.src = photoUrl;
            const modal = new bootstrap.Modal(document.getElementById('photoModal'));
            modal.show();
        }
    }

    generateInspectionReport() {
        window.open(`/example/car/${this.carId}/inspection?lang=ru`, '_blank', 'noopener,noreferrer');
    }

    /**
     * Показ ошибки
     */
    showError(message) {
        const content = document.getElementById('carContent');
        
        const alert = SafeDOM.createElement('div', { class: 'alert alert-danger text-center' });
        alert.appendChild(SafeDOM.createElement('h5', {}, '❌ Ошибка'));
        alert.appendChild(SafeDOM.createElement('p', {}, message));
        
        const retryButton = SafeDOM.createButton(
            'Попробовать снова',
            () => this.init(),
            'btn btn-primary-custom btn-sm mt-2'
        );
        alert.appendChild(retryButton);
        
        const backButton = SafeDOM.createButton(
            '← Назад',
            () => window.history.back(),
            'btn btn-outline-secondary btn-sm ms-2 mt-2'
        );
        alert.appendChild(backButton);

        SafeDOM.render(content, alert);
    }
}