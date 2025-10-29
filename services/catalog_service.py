"""Сервис для работы с каталогом"""
from api.web_encar_client import WebEncarClient
from services.currency_service import CurrencyService

encar_client = WebEncarClient()

class CatalogService:
    @staticmethod
    def get_manufacturers():
        try:
            response = encar_client.simple_search(
                car_data={},
                pagination={"limit": 1, "offset": 0},
                filters={}
            )
            if response and 'children' in response:
                return response['children'].get('manufacturer', [])[:20]
        except Exception as e:
            print(f"Error loading manufacturers: {e}")
        return []
    
    @staticmethod
    def get_catalog_data(car_data, filters, sorting, pagination):
        try:
            clean_filters = {k: v for k, v in filters.items() if v is not None}
            
            response = encar_client.simple_search(
                car_data=car_data,
                pagination=pagination,
                filters=clean_filters,
                sorting=sorting
            )
            
            if response and 'cars' in response:
                for car in response['cars']:
                    if car.get('price') is not None:
                        car['price_rub'] = CurrencyService.convert_to_rub(car['price'])
            
            return response
        except Exception as e:
            print(f"Catalog data error: {e}")
            return None
