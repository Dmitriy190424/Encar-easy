"""Главный файл приложения"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from routes.catalog import setup_catalog_routes
from routes.car_details import setup_car_details_routes
from routes.api import setup_api_routes

app = FastAPI(title="Auto Catalog API", 
              docs_url="/example/docs", 
              openapi_url="/example/openapi.json")

# Middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Статические файлы
app.mount("/example/static", StaticFiles(directory="static"), name="static")

# Настройка роутов
setup_catalog_routes(app)
setup_car_details_routes(app)
setup_api_routes(app)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=5000)
