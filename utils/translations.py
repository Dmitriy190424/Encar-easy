"""
Утилиты для перевода и локализации - полная версия для отчетов
"""
from typing import Dict, Optional

# Полные словари переводов для отчетов осмотра
TRANSLATIONS = {
    'ru': {
        # Основные переводы отчета
        'title': 'Акт осмотра автомобиля',
        'km_label': 'км',
        'general_condition_label': 'Общее состояние',
        'first_reg_label': 'Первая регистрация',
        'transmission_label': 'Коробка передач', 
        'fuel_label': 'Топливо',
        'warranty_label': 'Гарантия',
        'engine_label': 'Двигатель',
        'odometer_label': 'Состояние одометра',
        'vin_label': 'Состояние VIN',
        'tuning_label': 'Тюнинг',
        'special_history_label': 'Особая история',
        'purpose_change_label': 'Смена назначения',
        'accident_label': 'История ДТП',
        'simple_repair_label': 'Простой ремонт',
        'detailed_condition_label': 'Детальная диагностика',
        'note_text': 'Данный отчет сгенерирован автоматически на основе диагностических данных',
        
        # Статусы
        'good_status': 'Хорошее',
        'no_status': 'Нет',
        'yes_status': 'Да',
        'repair_yes': 'Да',
        'repair_no': 'Нет',
        
        # Сообщения
        'no_data': 'Нет данных',
        'no_damages': 'Нет повреждений',
        
        # Легенда повреждений
        'legend_welding': 'Сварка',
        'legend_exchange': 'Замена', 
        'legend_corrosion': 'Коррозия',
        'legend_scratch': 'Царапина',
        'legend_dent': 'Вмятина',
        
        # Системы диагностики
        'system_names': {
            'ENGINE': 'Двигатель',
            'TRANSMISSION': 'Трансмиссия', 
            'SUSPENSION': 'Подвеска',
            'BRAKE': 'Тормоза',
            'ELECTRIC': 'Электрика',
            'BODY': 'Кузов',
            'INTERIOR': 'Салон',
            'Self -diagnosis': 'Самодиагностика',
            'Mobilization': 'Двигатель',
            'Power delivery': 'Привод',
            'Steering': 'Рулевое управление', 
            'braking': 'Тормозная система',
            'Electricity': 'Электрика',
            'fuel': 'Топливная система'
        },
        
        # Элементы диагностики
        'element_names': {
            'Engine Oil': 'Масло двигателя',
            'Transmission Fluid': 'Жидкость трансмиссии',
            'Brake Pads': 'Тормозные колодки',
            'Suspension': 'Подвеска',
            'Battery': 'Аккумулятор',
            'Tires': 'Шины',
            'Lights': 'Фары',
            'Mobilization': 'Двигатель',
            'Transmission': 'Трансмиссия',
            'Operating state (idling)': 'Рабочее состояние (холостой ход)',
            'Oil leakage': 'Утечка масла',
            'Oil flow': 'Расход масла',
            'Coolant leakage': 'Утечка охлаждающей жидкости',
            'Common rail': 'Common rail',
            'Automatic transmission (A/T)': 'Автоматическая коробка передач',
            'Manual transmission (M/T)': 'Механическая коробка передач',
            'Clutch assembly': 'Сцепление',
            'Constant joint': 'Шарнир',
            'Chuck and bearing': 'Патрон и подшипник',
            'Definal Gear': 'Главная передача',
            'Power steering operation oil leakage': 'Утечка масла ГУР',
            'Operating state': 'Рабочее состояние',
            'Brake Master Cylinder Oil Leakage': 'Утечка масла главного тормозного цилиндра',
            'Brake oil leakage': 'Утечка тормозной жидкости',
            'Omnipotence': 'Эффективность',
            'Generator output': 'Выход генератора',
            'Starting motor': 'Стартер',
            'Wiper motor function': 'Функция двигателя стеклоочистителя',
            'Indoor blower': 'Салонный вентилятор',
            'Radiator fan motor': 'Двигатель вентилятора радиатора',
            'Windows motor': 'Двигатель стеклоподъемника',
            'Fuel leak (LP gas included)': 'Утечка топлива (включая СУГ)'
        },
        
        # Статусы элементов
        'status_names': {
            'G': 'Хорошо',
            'B': 'Плохо', 
            'R': 'Требует ремонта',
            'N': 'Новый',
            'U': 'Б/У',
            'Goodness': 'Хорошо',
            'titration': 'Нормальный расход',
            'doesn\'t exist': 'Отсутствует'
        },
        
        # Типы повреждений
        'damage_status_translations': {
            'Sheet metal/welding': 'Сварка',
            'Exchange (replacement)': 'Замена',
            'Corrosion': 'Коррозия', 
            'Scratch': 'Царапина',
            'Dent': 'Вмятина',
            'Breakage': 'Поломка',
            'Crack': 'Трещина'
        },
        
        # Остальные переводы (из старой версии)
        'car_details': {
            'main_info': 'Основная информация',
            'photos': 'Фотографии',
            'insurance_history': 'Страховая история',
            'inspection': 'Диагностика',
            'price_info': 'Ценовая информация',
            'contact_info': 'Контактная информация',
            'ownership_history': 'История владения',
            'equipment': 'Оборудование',
            'accidents': 'ДТП',
            'owner': 'Владелец',
            'third_party': 'Третье лицо'
        },
        'catalog': {
            'manufacturer': 'Производитель',
            'model_group': 'Группа моделей',
            'model': 'Модель',
            'badge_group': 'Группа комплектаций',
            'badge': 'Комплектация',
            'price': 'Цена',
            'year': 'Год',
            'mileage': 'Пробег',
            'fuel_type': 'Топливо',
            'transmission': 'Коробка передач'
        },
        'filters': {
            'price_range': 'Диапазон цен',
            'year_range': 'Год выпуска',
            'mileage_range': 'Пробег',
            'fuel_type': 'Тип топлива',
            'transmission': 'Коробка передач',
            'apply_filters': 'Применить фильтры',
            'reset_filters': 'Сбросить фильтры'
        },
        'common': {
            'loading': 'Загрузка...',
            'error': 'Ошибка',
            'success': 'Успешно',
            'yes': 'Да',
            'no': 'Нет',
            'unknown': 'Неизвестно',
            'back': 'Назад',
            'next': 'Вперед',
            'apply': 'Применить',
            'cancel': 'Отмена'
        }
    },
    'en': {
        # English translations would go here
        # ... аналогичная структура на английском
    }
}

def get_translation(key: str, lang: str = 'ru', default: Optional[str] = None) -> str:
    """
    Получение перевода по ключу
    """
    try:
        keys = key.split('.')
        translation = TRANSLATIONS[lang]
        
        for k in keys:
            translation = translation[k]
            
        return translation
    except (KeyError, TypeError):
        return default or key

# ... остальные функции из старой версии ...

def get_car_spec_translation(spec_key: str, lang: str = 'ru') -> str:
    """
    Получение перевода для характеристики автомобиля
    """
    translations = {
        'ru': {
            'manufacturer': 'Производитель',
            'model': 'Модель',
            'year': 'Год выпуска',
            'mileage': 'Пробег',
            'fuel_type': 'Топливо',
            'transmission': 'Коробка передач',
            'color': 'Цвет',
            'vin': 'VIN',
            'vehicle_no': 'Номер',
            'displacement': 'Объем двигателя',
            'seat_count': 'Количество мест'
        },
        'en': {
            'manufacturer': 'Manufacturer',
            'model': 'Model',
            'year': 'Year',
            'mileage': 'Mileage',
            'fuel_type': 'Fuel Type',
            'transmission': 'Transmission',
            'color': 'Color',
            'vin': 'VIN',
            'vehicle_no': 'Vehicle Number',
            'displacement': 'Engine Displacement',
            'seat_count': 'Seat Count'
        }
    }
    
    return translations.get(lang, {}).get(spec_key, spec_key)

def format_number(number, lang: str = 'ru') -> str:
    """
    Форматирование чисел согласно локали
    """
    if number is None:
        return ''
    
    if lang == 'ru':
        return f"{number:,}".replace(',', ' ')
    else:
        return f"{number:,}"

def format_price(price, currency: str = 'RUB', lang: str = 'ru') -> str:
    """
    Форматирование цены
    """
    if price is None:
        return ''
    
    formatted_number = format_number(price, lang)
    
    currency_symbols = {
        'RUB': '₽',
        'USD': '$',
        'EUR': '€',
        'KRW': '₩'
    }
    
    symbol = currency_symbols.get(currency, currency)
    
    if lang == 'ru' and currency == 'KRW':
        return f"{formatted_number} {symbol}"
    else:
        return f"{symbol}{formatted_number}"