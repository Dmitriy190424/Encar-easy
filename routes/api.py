"""API роуты"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from services.catalog_service import encar_client, CatalogService
from services.session_manager import SessionManager

def setup_api_routes(app):
    @app.post("/example/api/catalog/cars")
    async def api_catalog_cars(request: Request):
        try:
            data = await request.json()
            car_data = data.get('car_data', {})
            pagination = data.get('pagination', {"limit": 20, "offset": 0})
            filters = data.get('filters', {})
            sorting = data.get('sorting', {})
            
            response = CatalogService.get_catalog_data(car_data, filters, sorting, pagination)
            if response:
                return JSONResponse(content=response)
            return JSONResponse(content={'error': 'API error'}, status_code=500)
        except Exception as e:
            print(f"Cars loading error: {e}")
            return JSONResponse(content={'error': 'Internal server error'}, status_code=500)
    
    @app.get("/example/api/health")
    async def api_health():
        """Проверка состояния API"""
        health_status = encar_client.check_api_health()
        return JSONResponse(content=health_status)
    
    @app.post("/example/api/catalog/fuels")
    async def api_catalog_fuels(request: Request):
        """API для получения типов топлива"""
        try:
            data = await request.json()
            car_data = data.get('car_data', {})
            
            response = encar_client.get_available_fuels(car_data)
            if response and response.get('status') == 'success':
                fuels = [{'value': fuel, 'label': fuel} for fuel in response.get('data', [])]
                
                return JSONResponse(content={
                    'status': 'success',
                    'data': fuels
                })
            
            raise HTTPException(status_code=500, detail="Failed to get fuel types")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error")
    
    @app.post("/example/api/catalog/transmissions")
    async def api_catalog_transmissions(request: Request):
        """API для получения типов трансмиссии"""
        try:
            data = await request.json()
            car_data = data.get('car_data', {})
            
            response = encar_client.get_available_transmissions(car_data)
            if response and response.get('status') == 'success':
                transmissions = [{'value': transmission, 'label': transmission} for transmission in response.get('data', [])]
                
                return JSONResponse(content={
                    'status': 'success', 
                    'data': transmissions
                })
            
            raise HTTPException(status_code=500, detail="Failed to get transmission types")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail="Internal server error")
    
    @app.post("/example/api/catalog/navigate")
    async def api_catalog_navigate(request: Request):
        """API для навигации по каталогу"""
        try:
            data = await request.json()
            car_data = data.get('car_data', {})
            filters = data.get('filters', {})
            sorting = data.get('sorting', {"sort_order": "price", "sort_direction": "ASC"})
            
            response = encar_client.simple_search(
                car_data=car_data,
                pagination={"limit": 1, "offset": 0},
                filters=filters,
                sorting=sorting
            )
            
            return JSONResponse(content=response)
            
        except Exception as e:
            error_message = str(e)
            print(f"Navigation error: {error_message}")
            
            if "API_KEY" in error_message:
                return JSONResponse(
                    content={'error': 'API_KEY_ERROR', 'message': error_message}, 
                    status_code=503
                )
            else:
                return JSONResponse(
                    content={'error': 'API_ERROR', 'message': error_message}, 
                    status_code=500
                )
    
    @app.post("/example/api/filters")
    async def update_filters(request: Request):
        """Обновление фильтров пользователя"""
        session_id, user_session = SessionManager.get_user_session(request)
        
        data = await request.json()
        user_session['filters'].update(data)
        
        return JSONResponse(content={'status': 'success', 'filters': user_session['filters']})
    
    @app.post("/example/api/filters/reset")
    async def reset_filters(request: Request):
        """Сброс фильтров"""
        session_id, user_session = SessionManager.get_user_session(request)
        user_session['filters'] = {}
        return JSONResponse(content={'status': 'success'})
