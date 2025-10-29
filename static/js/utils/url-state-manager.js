/**
 * Безопасное управление состоянием через URL параметры
 */
class URLStateManager {
    constructor() {
        this.currentParams = new URLSearchParams(window.location.search);
    }

    /**
     * Безопасное получение параметра
     */
    getParam(name, defaultValue = null) {
        const value = this.currentParams.get(name);
        return value !== null ? SafeDOM.escapeHTML(value) : defaultValue;
    }

    /**
     * Безопасное получение числового параметра
     */
    getNumericParam(name, defaultValue = null) {
        const value = this.getParam(name);
        if (value === null) return defaultValue;
        
        const num = parseInt(value, 10);
        return isNaN(num) ? defaultValue : num;
    }

    /**
     * Безопасное получение массива параметров
     */
    getArrayParam(name, defaultValue = []) {
        const value = this.getParam(name);
        if (!value) return defaultValue;
        
        return value.split(',').map(item => SafeDOM.escapeHTML(item.trim()));
    }

    /**
     * Безопасное обновление URL
     */
    updateURL(params = {}) {
        const newParams = new URLSearchParams();
        
        // Добавляем только безопасные значения
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        newParams.set(key, value.map(SafeDOM.escapeHTML).join(','));
                    }
                } else {
                    newParams.set(key, SafeDOM.escapeHTML(String(value)));
                }
            }
        });
        
        const newUrl = `${window.location.pathname}?${newParams.toString()}`;
        window.history.replaceState({}, '', newUrl);
        this.currentParams = newParams;
    }

    /**
     * Получение всех параметров как объекта
     */
    getAllParams() {
        const params = {};
        for (const [key, value] of this.currentParams.entries()) {
            params[key] = SafeDOM.escapeHTML(value);
        }
        return params;
    }

    /**
     * Сброс параметров
     */
    reset() {
        window.history.replaceState({}, '', window.location.pathname);
        this.currentParams = new URLSearchParams();
    }
}
