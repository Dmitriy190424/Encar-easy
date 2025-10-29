"""Парсеры параметров запросов"""
from services.currency_service import CurrencyService

class CatalogParamsParser:
    @staticmethod
    def parse_car_data(request):
        manufacturer = request.query_params.get('manufacturer')
        modelgroup = request.query_params.get('modelgroup')
        model = request.query_params.get('model')
        badgegroup = request.query_params.get('badgegroup')
        badge = request.query_params.get('badge')
        
        car_data = {}
        if manufacturer:
            car_data['manufacturer'] = manufacturer
        if modelgroup:
            car_data['modelgroup'] = modelgroup
        if model:
            car_data['model'] = model
        if badgegroup:
            car_data['badgegroup'] = [item.strip() for item in badgegroup.split(',')]
        if badge:
            car_data['badge'] = badge
        return car_data
    
    @staticmethod
    def parse_filters(request):
        filters = {}
        
        price_min_rub = request.query_params.get('price_min')
        price_max_rub = request.query_params.get('price_max')
        
        if price_min_rub:
            try:
                filters['price_min'] = CurrencyService.convert_to_won(int(price_min_rub))
            except ValueError:
                pass
        if price_max_rub:
            try:
                filters['price_max'] = CurrencyService.convert_to_won(int(price_max_rub))
            except ValueError:
                pass
        
        filter_mappings = {
            'year_min': int,
            'year_max': int,
            'mileage_min': int,
            'mileage_max': int
        }
        
        for param_name, converter in filter_mappings.items():
            value = request.query_params.get(param_name)
            if value:
                try:
                    filters[param_name] = converter(value)
                except ValueError:
                    pass
        
        return filters
    
    @staticmethod
    def parse_sorting(request):
        return {
            'sort_order': request.query_params.get('sort_order', 'price'),
            'sort_direction': request.query_params.get('sort_direction', 'ASC')
        }
    
    @staticmethod
    def parse_pagination(request):
        page = request.query_params.get('page', '1')
        try:
            page = int(page)
        except ValueError:
            page = 1
        
        return {
            'limit': 20,
            'offset': (page - 1) * 20
        }
