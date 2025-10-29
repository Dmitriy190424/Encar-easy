"""Сервис для работы с валютами"""
class CurrencyService:
    KRW_TO_RUB_RATE = 0.057279
    
    @staticmethod
    def get_exchange_rate() -> float:
        return CurrencyService.KRW_TO_RUB_RATE
    
    @staticmethod
    def convert_to_rub(price_won: float) -> int:
        if price_won is None:
            return None
        try:
            rate = CurrencyService.get_exchange_rate()
            return int(price_won * 10000 * rate / 1000)
        except (TypeError, ValueError) as e:
            print(f"Currency conversion error: {e}")
            return None
    
    @staticmethod
    def convert_to_won(price_rub: float) -> int:
        if price_rub is None:
            return None
        try:
            rate = CurrencyService.get_exchange_rate()
            return int(price_rub * 1000 / rate / 10000)
        except (TypeError, ValueError) as e:
            print(f"Currency conversion error: {e}")
            return None
