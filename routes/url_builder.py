"""Построитель URL параметров"""
class URLParamsBuilder:
    @staticmethod
    def update_url_params(params):
        url_params = {}
        
        URLParamsBuilder._add_navigation_params(url_params, params)
        URLParamsBuilder._add_filter_params(url_params, params)
        URLParamsBuilder._add_sorting_params(url_params, params)
        URLParamsBuilder._add_pagination_params(url_params, params)
        
        return url_params
    
    @staticmethod
    def _add_navigation_params(url_params, params):
        navigation_keys = ['manufacturer', 'modelgroup', 'model']
        for key in navigation_keys:
            if params.get(key):
                url_params[key] = params[key]
        
        list_keys = ['badgegroup', 'badge']
        for key in list_keys:
            if params.get(key):
                if isinstance(params[key], list):
                    url_params[key] = ','.join(params[key])
                else:
                    url_params[key] = params[key]
    
    @staticmethod
    def _add_filter_params(url_params, params):
        filters = params.get('filters', {})
        filter_keys = ['price_min', 'price_max', 'year_min', 'year_max', 'mileage_min', 'mileage_max']
        for key in filter_keys:
            if filters.get(key):
                url_params[key] = filters[key]
    
    @staticmethod
    def _add_sorting_params(url_params, params):
        sorting = params.get('sorting', {})
        if sorting.get('sort_order'):
            url_params['sort_order'] = sorting['sort_order']
        if sorting.get('sort_direction'):
            url_params['sort_direction'] = sorting['sort_direction']
    
    @staticmethod
    def _add_pagination_params(url_params, params):
        pagination = params.get('pagination', {})
        if pagination.get('offset', 0) > 0:
            page = (pagination['offset'] // 20) + 1
            if page > 1:
                url_params['page'] = page
