"""Роуты деталей автомобиля и инспекции"""
from fastapi import Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from services.catalog_service import encar_client
from services.session_manager import SessionManager
from utils.inspection_generator import InspectionGenerator
from utils.damage_coordinates import DAMAGE_COLORS

templates = Jinja2Templates(directory="templates")

def setup_car_details_routes(app):
    @app.get("/example/car/{car_id}", response_class=HTMLResponse)
    async def car_details(request: Request, car_id: int):
        return templates.TemplateResponse('car_details.html', {
            'request': request, 
            'car_id': car_id
        })
    
    @app.get("/example/api/car/{car_id}")
    async def api_car_details(car_id: int):
        car_data = encar_client.get_car_details(car_id)
        if car_data and car_data.get('status') == 'success':
            return JSONResponse(content=car_data)
        return JSONResponse(content={'error': 'Car not found'}, status_code=404)
    
    @app.get("/example/car/{car_id}/inspection", response_class=HTMLResponse)
    async def car_inspection(request: Request, car_id: int):
        lang = request.query_params.get('lang', 'ru')
        
        car_data = encar_client.get_car_details(car_id)
        if not car_data or car_data.get('status') != 'success':
            return templates.TemplateResponse('inspection/error.html', {
                'request': request,
                'message': "Данные автомобиля не найдены"
            }, status_code=404)
        
        car_info_data = car_data.get('data', {})
        checkup_data = car_info_data.get('checkup', {})
        formats = checkup_data.get('formats', [])
        images = checkup_data.get('images', [])
        
        if 'IMAGE' in formats:
            info_data = car_info_data.get('info', {})
            spec_data = info_data.get('spec', {})
            category_data = info_data.get('category', {})
            
            report_data = {
                'lang': lang,
                'car_model': f"{category_data.get('manufacturerName', '')} {category_data.get('modelGroupName', '')}".strip(),
                'car_year': category_data.get('formYear', '—'),
                'vin': spec_data.get('vin', '—'),
                'images': images
            }
            
            template = 'inspection/report_image.html'
        else:
            generator = InspectionGenerator()
            report_data = generator.generate_report(car_info_data, lang)
            
            if report_data and report_data.get('error'):
                return templates.TemplateResponse('inspection/error.html', {
                    'request': request,
                    'message': report_data['error']
                }, status_code=500)
            
            template = f'inspection/report_{lang}.html'
        
        return templates.TemplateResponse(template, {
            'request': request,
            'report_data': report_data,
            'DAMAGE_COLORS': DAMAGE_COLORS
        })
