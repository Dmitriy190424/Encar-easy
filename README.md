# Encar Easy

🌐 **Простой и удобный клиент для работы с данными Encar через API**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.119.0-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Python 3.10](https://img.shields.io/badge/Python-3.10-blue?logo=python)](https://python.org)

Проект демонстрирует возможности использования API, предоставляемого по адресам:
- https://api-centr.ru (регистрация и получение API ключа)
- https://api-centr.ru/auto_korea/docs (Swagger UI документация)

## 🚀 Основной функционал

- **Каталог автомобилей** - просмотр и фильтрация авто с Encar
- **Детальная информация** - полные данные по конкретному автомобилю
- **Система фильтров** - расширенный поиск по параметрам
- **Визуализация повреждений** - интерактивные схемы осмотра
- **Мультивалютность** - отображение цен в разных валютах

## 🛠 Технологии

### Backend
- **Python 3.10** - основной язык программирования
- **FastAPI 0.119.0** - современный ASGI фреймворк
- **Requests** - для работы с HTTP запросами
- **Jinja2** - шаблонизатор для HTML

### Frontend
- **Vanilla JavaScript** - модульная архитектура компонентов
- **CSS3** - адаптивная верстка
- **SVG графика** - интерактивные схемы автомобилей
- **Компонентный подход** - переиспользуемые UI компоненты

## ⚡ Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com/Dmitriy190424/Encar-easy.git
cd encar-easy
```
### 2. Установка зависимостей
```bash
pip install -r requirements.txt
```
### 3. Настройка окружения
Создайте файл .env и добавьте ваш API ключ:

```env
ENCAR_API_KEY=your_api_key_here
```
### 4. Запуск приложения
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```
Приложение будет доступно по адресу: http://localhost:5000

🎯 Ключевые возможности
Каталог автомобилей
Поиск и фильтрация по марке, модели, году

Сортировка по цене, дате добавления

Пагинация результатов

Поддержка множества брендов

Детали автомобиля
Полная техническая информация

История обслуживания

Фотографии и документы

Отчеты осмотра

Система осмотра
Интерактивные схемы повреждений

Визуализация дефектов

Генерация отчетов в формате HTML

📚 API Endpoints
GET / - главная страница

GET /catalog - каталог автомобилей

GET /car/{car_id} - детальная информация об автомобиле

GET /api/search - API поиска автомобилей

GET /api/filters - доступные фильтры

## 🤝 Разработка

### Установка для разработки
```bash
git clone https://github.com/Dmitriy190424/Encar-easy.git
cd encar-easy
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или venv\Scripts\activate  # Windows
pip install -r requirements.txt
```
### Запуск в режиме разработки
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 5000
```
## 👥 Контакты
GitHub: Dmitriy190424

Email: kormdb@gmail.com

**Демо:** [https://api-centr.ru/example](https://api-centr.ru/example)

**Важные замечания:**
- 📍 Требуется API ключ от [api-centr.ru](https://api-centr.ru)
- 💰 Курс валюты фиксирован (измените `KRW_TO_RUB_RATE` в `/services/currency_service.py` при необходимости)
- 🚀 Готовый сервер: [api-centr.ru/example](https://api-centr.ru/example)
