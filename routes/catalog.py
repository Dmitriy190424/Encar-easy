"""Роуты каталога"""
from fastapi import Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from services.catalog_service import CatalogService
from services.session_manager import SessionManager
from routes.parsers import CatalogParamsParser
from routes.url_builder import URLParamsBuilder

templates = Jinja2Templates(directory="templates")

def setup_catalog_routes(app):
    @app.get("/example/", response_class=RedirectResponse)
    async def index():
        return RedirectResponse(url="/example/catalog")
    
    @app.get("/example/catalog", response_class=HTMLResponse)
    async def catalog(request: Request):
        car_data = CatalogParamsParser.parse_car_data(request)
        filters = CatalogParamsParser.parse_filters(request)
        sorting = CatalogParamsParser.parse_sorting(request)
        pagination = CatalogParamsParser.parse_pagination(request)
        
        manufacturers = CatalogService.get_manufacturers()
        
        session_id, user_session = SessionManager.get_user_session(request)
        user_session.update({
            'filters': filters,
            'car_data': car_data,
            'sorting': sorting,
            'pagination': pagination
        })
        
        url_params = URLParamsBuilder.update_url_params({
            'manufacturer': car_data.get('manufacturer'),
            'modelgroup': car_data.get('modelgroup'),
            'model': car_data.get('model'),
            'badgegroup': car_data.get('badgegroup'),
            'badge': car_data.get('badge'),
            'filters': {
                'price_min': request.query_params.get('price_min'),
                'price_max': request.query_params.get('price_max'),
                'year_min': request.query_params.get('year_min'),
                'year_max': request.query_params.get('year_max'),
                'mileage_min': request.query_params.get('mileage_min'),
                'mileage_max': request.query_params.get('mileage_max')
            },
            'sorting': sorting,
            'pagination': pagination
        })
        
        response = templates.TemplateResponse('catalog.html', {
            'request': request,
            'manufacturers': manufacturers,
            'current_filters': {
                'price_min': request.query_params.get('price_min'),
                'price_max': request.query_params.get('price_max'),
                'year_min': request.query_params.get('year_min'),
                'year_max': request.query_params.get('year_max'),
                'mileage_min': request.query_params.get('mileage_min'),
                'mileage_max': request.query_params.get('mileage_max')
            },
            'current_sorting': sorting,
            'current_page': pagination['offset'] // 20 + 1,
            'url_params': url_params
        })
        
        if not request.cookies.get("session_id"):
            response.set_cookie(key="session_id", value=session_id)
        
        return response
