/**
 * Сервис конвертации валют - единый источник курса
 */
class CurrencyService {
    static getExchangeRate() {
        // Временная константа, позже можно получать через API
        return 0.057279;
    }
    
    static convertToRub(priceWon) {
        if (priceWon === null || priceWon === undefined) return null;
        try {
            const rate = this.getExchangeRate();
            return Math.round(priceWon * 10000 * rate / 1000);
        } catch (e) {
            console.error('Currency conversion error:', e);
            return null;
        }
    }
    
    static convertToWon(priceRub) {
        if (priceRub === null || priceRub === undefined) return null;
        try {
            const rate = this.getExchangeRate();
            return Math.round(priceRub * 1000 / rate / 10000);
        } catch (e) {
            console.error('Currency conversion error:', e);
            return null;
        }
    }

    static formatPriceRub(priceWon) {
        const rub = this.convertToRub(priceWon);
        return rub !== null ? `${rub.toLocaleString()} тыс.₽` : '—';
    }

    static formatPriceWon(priceWon) {
        return priceWon !== null ? `${(priceWon * 10000).toLocaleString()} ₩` : '—';
    }
}
