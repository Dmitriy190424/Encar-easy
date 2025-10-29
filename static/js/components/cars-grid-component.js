/**
 * Безопасный компонент сетки автомобилей
 */
class CarsGridComponent {
    constructor(container, onCarDetails, urlState) {
        this.container = container;
        this.onCarDetails = onCarDetails;
        this.urlState = urlState;
    }

    /**
     * Отображение автомобилей
     */
    render(carsData) {
        if (!carsData || !carsData.cars || carsData.cars.length === 0) {
            this.showEmptyState();
            return;
        }

        const fragment = document.createDocumentFragment();
        
        carsData.cars.forEach((car, index) => {
            const carCard = this.createCarCard(car, index);
            if (carCard) {
                fragment.appendChild(carCard);
            }
        });

        SafeDOM.render(this.container, fragment);
    }

    /**
     * Создание карточки автомобиля
     */
    createCarCard(car, index) {
        const col = SafeDOM.createElement('div', {
            class: 'col-xl-3 col-lg-4 col-md-6 d-flex'
        });

        const card = SafeDOM.createElement('div', {
            class: 'car-card d-flex flex-column h-100 w-100'
        });

        // Фото автомобиля
        card.appendChild(this.createCarImage(car));
        
        // Тело карточки
        const cardBody = SafeDOM.createElement('div', {
            class: 'card-body d-flex flex-column flex-grow-1'
        });
        
        cardBody.appendChild(this.createCarTitle(car));
        cardBody.appendChild(this.createCarSpecs(car));
        cardBody.appendChild(this.createCarPrice(car));
        
        // Контейнер для кнопок с привязкой к низу
        const buttonsContainer = SafeDOM.createElement('div', {
            class: 'mt-auto pt-3'
        });
        buttonsContainer.appendChild(this.createActionButtons(car));
        
        cardBody.appendChild(buttonsContainer);
        card.appendChild(cardBody);
        col.appendChild(card);
        
        return col;
    }

    /**
     * Создание блока с фото
     */
    createCarImage(car) {
        const imageContainer = SafeDOM.createElement('div', {
            class: 'car-image'
        });

        // Получаем первое доступное фото
        const firstPhoto = this.getFirstAvailablePhoto(car);
        
        if (firstPhoto) {
            // ФИКС: Используем прямой метод создания img без SafeDOM для URL
            const img = document.createElement('img');
            img.src = firstPhoto;
            img.alt = this.getCarTitle(car);
            img.className = 'img-fluid w-100 h-100';
            img.loading = 'lazy';
            img.style.objectFit = 'cover';
            
            // Обработчик ошибки загрузки фото
            img.addEventListener('error', () => {
                console.warn('Failed to load car photo:', firstPhoto);
                this.showPhotoPlaceholder(imageContainer);
            });
            
            // Обработчик успешной загрузки
            img.addEventListener('load', () => {
            });
            
            imageContainer.appendChild(img);

            // Счетчик фото
            const photoCount = this.getPhotoCount(car);
            if (photoCount > 1) {
                const photoCounter = SafeDOM.createElement('div', {
                    class: 'photo-counter'
                }, `📷 ${photoCount}`);
                imageContainer.appendChild(photoCounter);
            }
        } else {
            this.showPhotoPlaceholder(imageContainer);
        }

        return imageContainer;
    }

    /**
     * Получение первого доступного фото
     */
    getFirstAvailablePhoto(car) {
        // Приоритет: photos -> photo -> нет фото
        if (car.photos && car.photos.length > 0) {
            const photo = car.photos[0];
            // ФИКС: Возвращаем оригинальный URL без изменений
            return photo;
        }
        if (car.photo) {
            return car.photo;
        }
        return null;
    }

    /**
     * Показ заполнителя для фото
     */
    showPhotoPlaceholder(container) {
        const placeholder = SafeDOM.createElement('div', {
            class: 'd-flex align-items-center justify-content-center h-100 bg-light text-muted'
        }, '🚗 Нет фото');
        SafeDOM.render(container, placeholder);
    }

    /**
     * Получение количества фото
     */
    getPhotoCount(car) {
        if (car.photos && car.photos.length > 0) {
            return car.photos.length;
        }
        if (car.photo) {
            return 1;
        }
        return 0;
    }

    /**
     * Создание заголовка автомобиля
     */
    createCarTitle(car) {
        const title = this.getCarTitle(car);
        const titleEl = SafeDOM.createElement('h6', {
            class: 'card-title text-dark mb-2',
            title: title
        }, title);
        
        return titleEl;
    }

    /**
     * Создание характеристик автомобиля
     */
    createCarSpecs(car) {
        const specsContainer = SafeDOM.createElement('div', {
            class: 'car-specs small text-muted mb-3'
        });

        const year = car.form_year || '—';
        const mileage = car.mileage ? `${car.mileage.toLocaleString()} км` : '—';
        const fuel = car.fuel_type || '—';
        const transmission = car.transmission || '—';

        const specsText = SafeDOM.createElement('div', {}, `📅 ${year} • 📏 ${mileage}`);
        const specsText2 = SafeDOM.createElement('div', {}, `⛽ ${fuel} • ⚙ ${transmission}`);
        
        specsContainer.appendChild(specsText);
        specsContainer.appendChild(specsText2);
        
        return specsContainer;
    }

    /**
     * Создание блока цены
     */
    createCarPrice(car) {
        const priceRub = CurrencyService.convertToRub(car.price);
        const priceText = priceRub ? `${priceRub.toLocaleString()} тыс.₽` : '—';
        
        const priceEl = SafeDOM.createElement('div', {
            class: 'price-tag mb-3'
        }, priceText);
        
        return priceEl;
    }

    /**
     * Создание кнопок действий
     */
    createActionButtons(car) {
        const buttonsContainer = SafeDOM.createElement('div', {
            class: 'd-grid gap-2'
        });

        // Кнопка "Подробнее"
        const detailsButton = SafeDOM.createButton('📋 Подробнее', 
            () => this.openCarDetails(car),
            'btn btn-primary-custom btn-sm'
        );
        buttonsContainer.appendChild(detailsButton);

        // Кнопка "На сайте Encar"
        const encarLink = SafeDOM.createLink('🌐 На сайте Encar', 
            car.url,
            null,
            'btn btn-outline-secondary btn-sm',
            { target: '_blank', rel: 'noopener noreferrer' }
        );
        buttonsContainer.appendChild(encarLink);

        return buttonsContainer;
    }

    /**
     * Открытие деталей автомобиля
     */
    openCarDetails(car) {
        // Передаем цену и фото через URL параметры
        const params = new URLSearchParams({
            price: car.price || '0',
            photos: JSON.stringify(car.photos || [])
        });
        
        const url = `/example/car/${car.car_id}?${params.toString()}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    /**
     * Получение заголовка автомобиля
     */
    getCarTitle(car) {
        const parts = [];
        if (car.manufacturer) parts.push(car.manufacturer);
        if (car.model) parts.push(car.model);
        if (car.badge) parts.push(car.badge);
        if (car.badge_detail) parts.push(car.badge_detail);
        
        return parts.join(' ').trim() || 'Автомобиль';
    }

    /**
     * Показ состояния "нет данных"
     */
    showEmptyState() {
        const emptyState = SafeDOM.createElement('div', {
            class: 'col-12 text-center py-5'
        });

        const content = SafeDOM.createElement('div', {
            class: 'text-muted'
        });

        const icon = SafeDOM.createElement('h5', {}, '🚗 Автомобили не найдены');
        const text = SafeDOM.createElement('p', {}, 'Попробуйте изменить параметры фильтров');

        content.appendChild(icon);
        content.appendChild(text);
        emptyState.appendChild(content);

        SafeDOM.render(this.container, emptyState);
    }

    /**
     * Показ состояния загрузки
     */
    showLoadingState() {
        const loadingState = SafeDOM.createElement('div', {
            class: 'col-12 text-center py-5'
        });

        const spinner = SafeDOM.createElement('div', {
            class: 'spinner-border text-primary-custom',
            role: 'status'
        });
        spinner.appendChild(SafeDOM.createElement('span', {
            class: 'visually-hidden'
        }, 'Загрузка...'));

        const text = SafeDOM.createElement('p', {
            class: 'text-muted mt-2'
        }, 'Загружаем автомобили...');

        loadingState.appendChild(spinner);
        loadingState.appendChild(text);

        SafeDOM.render(this.container, loadingState);
    }

    /**
     * Показ состояния ошибки
     */
    showErrorState(message) {
        const errorState = SafeDOM.createElement('div', {
            class: 'col-12'
        });

        const alert = SafeDOM.createElement('div', {
            class: 'alert alert-danger text-center'
        });

        const title = SafeDOM.createElement('h5', {}, '❌ Ошибка');
        const text = SafeDOM.createElement('p', {}, message);
        const retryButton = SafeDOM.createButton('Попробовать снова', 
            () => window.location.reload(),
            'btn btn-primary-custom btn-sm mt-2'
        );

        alert.appendChild(title);
        alert.appendChild(text);
        alert.appendChild(retryButton);
        errorState.appendChild(alert);

        SafeDOM.render(this.container, errorState);
    }
}
