/**
 * Безопасный сервис для работы с API
 */
class ApiService {
    constructor() {
        this.baseURL = '/example/api';
    }

    /**
     * Безопасный API запрос
     */
    async request(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw new Error('Ошибка соединения с сервером');
        }
    }

    /**
     * Навигация по каталогу
     */
    async navigateCatalog(carData, filters = {}, sorting = {}) {
        return this.request('catalog/navigate', {
            car_data: carData,
            filters: filters,
            sorting: sorting
        });
    }


    /**
     * Получение деталей автомобиля
     */
    async getRequest(endpoint) {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    async getCarDetails(carId) {
        return this.getRequest(`car/${carId}`);
    }

    /**
     * Получение вариантов топлива
     */
    async getFuelTypes(carData) {
        return this.request('catalog/fuels', {
            car_data: carData
        });
    }

    /**
     * Получение вариантов трансмиссии
     */
    async getTransmissionTypes(carData) {
        return this.request('catalog/transmissions', {
            car_data: carData
        });
    }


    /**
     * Обработка данных автомобилей - нормализация фото
     */
    processCarData(cars) {
        if (!Array.isArray(cars)) return cars;
        
        return cars.map(car => {
            // Нормализация поля photos - только проверяем наличие
            if (car.photos && Array.isArray(car.photos)) {
                // Оставляем оригинальные URL без изменений
                car.photos = car.photos.filter(photo => 
                    photo !== null && photo !== '' && typeof photo === 'string'
                );
            } else if (car.photo && typeof car.photo === 'string') {
                // Если есть отдельное поле photo, создаем массив photos
                car.photos = [car.photo];
            } else {
                // Если фото нет, создаем пустой массив
                car.photos = [];
            }
            
            return car;
        });
    }

    /**
     * Получение автомобилей с обработкой фото
     */
    async getCars(carData, pagination, filters = {}, sorting = {}) {
        try {
            const response = await this.request('catalog/cars', {
                car_data: carData,
                pagination: pagination,
                filters: filters,
                sorting: sorting
            });
            
            if (response && response.cars) {
                response.cars = this.processCarData(response.cars);
            }
            
            return response;
        } catch (error) {
            console.error('Error loading cars:', error);
            throw error;
        }
    }

}


