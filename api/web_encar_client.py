# api/web_encar_client.py
import requests
import json
from decouple import config
from typing import Dict, Any, Optional, List

class WebEncarClient:
    def __init__(self):
        self.base_url = config('ENCAR_API_URL', default='https://api-centr.ru/auto_korea')
        self.api_key = config('ENCAR_API_KEY', default='')
        self.session = None
        self._setup_session()
    
    def _setup_session(self):
        """Настройка сессии с правильными заголовками"""
        self.session = requests.Session()
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
        
        if self._has_valid_api_key():
            headers["Authorization"] = self.api_key
            print(f"✅ API ключ загружен (длина: {len(self.api_key)})")
        else:
            print("❌ API ключ не найден или невалиден")
        
        self.session.headers.update(headers)
    
    def _has_valid_api_key(self) -> bool:
        """Проверяет валидность API ключа"""
        invalid_keys = ['', 'your_encar_api_key_here', 'test', 'demo']
        return bool(self.api_key and self.api_key not in invalid_keys)
    
    def _make_api_request(self, endpoint: str, payload: Dict) -> Optional[Dict]:
        """Выполняет API запрос с обработкой ошибок"""
        if not self._has_valid_api_key():
            raise Exception("API_KEY_NOT_CONFIGURED: Не настроен API ключ. Проверьте файл .env")
        
        try:
            response = self.session.post(
                f"{self.base_url}/{endpoint}", 
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 401:
                raise Exception("API_KEY_INVALID: Неверный API ключ")
            elif response.status_code == 403:
                raise Exception("API_ACCESS_DENIED: Доступ запрещен")
            else:
                raise Exception(f"API_ERROR_{response.status_code}: {response.text}")
                
        except requests.exceptions.Timeout:
            raise Exception("API_TIMEOUT: Превышено время ожидания ответа от API")
        except requests.exceptions.ConnectionError:
            raise Exception("API_CONNECTION_ERROR: Ошибка подключения к API")
        except Exception as e:
            if "API_KEY" in str(e):
                raise e
            raise Exception(f"API_REQUEST_ERROR: {str(e)}")
    
    def simple_search(self, car_data=None, pagination=None, filters=None, sorting=None) -> Dict[str, Any]:
        """Упрощенный поиск с пагинацией, фильтрами и сортировкой"""
        # Значения по умолчанию
        car_data = car_data or {}
        pagination = pagination or {"limit": 20, "offset": 0}
        filters = filters or {}
        sorting = sorting or {"sort_order": "price", "sort_direction": "ASC"}
        
        # Формирование payload
        payload = {
            "car_data": car_data,
            "pagination": pagination,
            "filters": self._clean_filters(filters),
            "sorting": sorting
        }
        
        # Выполнение API запроса
        return self._make_api_request("simple_search", payload)
    
    def get_car_details(self, car_id: int, lang: str = "eng") -> Dict[str, Any]:
        """Получение деталей автомобиля"""
        payload = {
            "car_id": car_id,
            "lang": lang
        }
        
        return self._make_api_request("car_info", payload)
    
    def get_available_fuels(self, car_data: Dict) -> Optional[Dict]:
        """Получает доступные варианты топлива для выбранных параметров"""
        try:
            # Всегда используем прямой запрос к API с правильным форматом
            return self._get_available_options("get_fuel", car_data, "fuels")
        except Exception as e:
            print(f"Error getting fuel types: {e}")
            return None

    def get_available_transmissions(self, car_data: Dict) -> Optional[Dict]:
        """Получает доступные варианты трансмиссии для выбранных параметров"""
        try:
            # Всегда используем прямой запрос к API с правильным форматом  
            return self._get_available_options("get_transmission", car_data, "transmissions")
        except Exception as e:
            print(f"Error getting transmission types: {e}")
            return None
    
    def _get_available_options(self, endpoint: str, car_data: Dict, option_type: str) -> Optional[Dict]:
        """Общий метод для получения доступных опций"""
        # Преобразуем car_data в формат который ожидает API
        clean_car_data = self._clean_filters(car_data)
        
        # Формируем payload в правильном формате (как в curl примере)
        payload = {
            "manufacturer": [clean_car_data.get('manufacturer')] if clean_car_data.get('manufacturer') else [],
            "model": [clean_car_data.get('model')] if clean_car_data.get('model') else [],
            "badge": [clean_car_data.get('badge')] if clean_car_data.get('badge') else []
        }
        
        # Очищаем от None значений
        payload = {k: v for k, v in payload.items() if v and v[0] is not None}
        
        return self._make_api_request(endpoint, payload)
    
    def _clean_filters(self, filters: Dict) -> Dict:
        """Очистка фильтров от пустых значений"""
        if not filters:
            return {}
        
        cleaned = {}
        for key, value in filters.items():
            # Для массивов fuel и transmission - оставляем даже пустые массивы
            # чтобы бэкенд понимал, что нужно учитывать все значения
            if key in ['fuel', 'transmission']:
                cleaned[key] = value
            elif self._is_valid_filter_value(value):
                cleaned[key] = value
        
        return cleaned
    
    def _is_valid_filter_value(self, value: Any) -> bool:
        """Проверяет валидность значения фильтра"""
        if value is None or value == "":
            return False
        if isinstance(value, list) and len(value) == 0:
            return False
        return True
    
    def check_api_health(self) -> Dict[str, Any]:
        """Проверка доступности API и валидности ключа"""
        try:
            # Простой запрос для проверки
            test_response = self.simple_search(
                car_data={},
                pagination={"limit": 1, "offset": 0},
                filters={}
            )
            return {
                "status": "success",
                "message": "API доступен и ключ валиден",
                "data": test_response
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e),
                "data": None
            }