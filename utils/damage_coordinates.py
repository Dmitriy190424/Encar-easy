# utils/damage_coordinates.py
from typing import Dict, Any, List
from dataclasses import dataclass


@dataclass
class DamagePoint:
    """Класс для представления точки повреждения"""
    code: str
    x: float
    y: float
    name: str
    name_en: str
    scheme: str


class DamageCoordinatesManager:
    """Менеджер координат повреждений автомобиля"""
    
    def __init__(self):
        self.damage_colors = self._build_damage_colors()
        self.damage_points = self._build_damage_points()
        self.damage_coordinates = self._build_coordinates_mapping()
    
    def get_color(self, damage_code: str) -> str:
        """Возвращает цвет для кода повреждения"""
        return self.damage_colors.get(damage_code, '#3498db')
    
    def get_point(self, point_code: str) -> Dict[str, Any]:
        """Возвращает данные точки по коду"""
        return self.damage_coordinates.get(point_code, {})
    
    def get_points_by_scheme(self, scheme: str) -> List[Dict[str, Any]]:
        """Возвращает все точки для указанной схемы"""
        return [point for point in self.damage_coordinates.values() 
                if point.get('scheme') == scheme]
    
    def get_all_points(self) -> Dict[str, Dict[str, Any]]:
        """Возвращает все точки повреждений"""
        return self.damage_coordinates.copy()
    
    def _build_damage_colors(self) -> Dict[str, str]:
        """Строит mapping цветов для типов повреждений"""
        return {
            'W': '#e74c3c',  # Сварка/кузовные - Красный
            'X': '#f39c12',  # Замена - Оранжевый  
            'C': '#27ae60',  # Коррозия - Зеленый
            'A': '#3498db',  # Царапины - Синий
            'U': '#9b59b6',  # Вмятины - Фиолетовый
        }
    
    def _build_damage_points(self) -> List[DamagePoint]:
        """Создает список всех точек повреждений"""
        return [
            # Основные зоны кузова
            DamagePoint('P011', 50, 5, 'Капот', 'Hood', 'front'),
            DamagePoint('P021', 25, 21, 'Переднее крыло (левое)', 'Left front fender', 'front'),
            DamagePoint('P022', 75, 21, 'Переднее крыло(правое)', 'Right front fender', 'front'),
            DamagePoint('P031', 23, 41, 'Передняя дверь(левая)', 'Left front door', 'front'),
            DamagePoint('P032', 77, 41, 'Передняя дверь(правая)', 'Right front door', 'front'),
            DamagePoint('P033', 23, 60, 'Задняя дверь (левая)', 'Left rear door', 'front'),
            DamagePoint('P034', 77, 60, 'Задняя дверь(правая)', 'Right rear door', 'front'),
            DamagePoint('P041', 50, 92, 'Крышка багажника', 'Trunk', 'front'),
            
            DamagePoint('P061', 25, 73, 'Заднее левое крыло', 'Left rear fender', 'front'),
            DamagePoint('P062', 75, 73, 'Заднее правое крыло', 'Right rear fender', 'front'),
        ]
    
    def _build_coordinates_mapping(self) -> Dict[str, Dict[str, Any]]:
        """Строит mapping координат в оригинальном формате"""
        return {
            point.code: {
                'x': point.x,
                'y': point.y,
                'name': point.name,
                'name_en': point.name_en,
                'scheme': point.scheme
            }
            for point in self.damage_points
        }
    
    def get_front_scheme_points(self) -> Dict[str, Dict[str, Any]]:
        """Возвращает точки для передней схемы"""
        return {code: data for code, data in self.damage_coordinates.items() 
                if data.get('scheme') == 'front'}
    
    def get_back_scheme_points(self) -> Dict[str, Dict[str, Any]]:
        """Возвращает точки для задней схемы"""
        return {code: data for code, data in self.damage_coordinates.items() 
                if data.get('scheme') == 'back'}
    
    def validate_point_code(self, point_code: str) -> bool:
        """Проверяет валидность кода точки"""
        return point_code in self.damage_coordinates
    
    def get_point_name(self, point_code: str, lang: str = 'ru') -> str:
        """Возвращает название точки на указанном языке"""
        point = self.damage_coordinates.get(point_code, {})
        return point.get('name_en' if lang == 'en' else 'name', 'Unknown')


class DamageColorScheme:
    """Цветовая схема для типов повреждений"""
    
    COLORS = {
        'WELDING': '#e74c3c',      # Сварка/кузовные - Красный
        'REPLACEMENT': '#f39c12',  # Замена - Оранжевый  
        'CORROSION': '#27ae60',    # Коррозия - Зеленый
        'SCRATCH': '#3498db',      # Царапины - Синий
        'DENT': '#9b59b6',         # Вмятины - Фиолетовый
        'DEFAULT': '#3498db',      # По умолчанию - Синий
    }
    
    @classmethod
    def get_color(cls, damage_type: str) -> str:
        """Возвращает цвет для типа повреждения"""
        color_map = {
            'W': cls.COLORS['WELDING'],
            'X': cls.COLORS['REPLACEMENT'], 
            'C': cls.COLORS['CORROSION'],
            'A': cls.COLORS['SCRATCH'],
            'U': cls.COLORS['DENT']
        }
        return color_map.get(damage_type, cls.COLORS['DEFAULT'])


# Глобальный экземпляр для обратной совместимости
damage_manager = DamageCoordinatesManager()

# Глобальные константы для обратной совместимости с существующим кодом
DAMAGE_COLORS = damage_manager.damage_colors
DAMAGE_COORDINATES = damage_manager.damage_coordinates


# Функции для обратной совместимости с существующим кодом
def get_damage_coordinates(scheme_type: str) -> Dict[str, Dict]:
    """
    Получение координат для указанной схемы - для обратной совместимости
    """
    schemes = {
        'front': {},
        'rear': {},
        'left': {},
        'right': {}
    }
    return schemes.get(scheme_type, {})

def get_damage_color(damage_type: str) -> str:
    """
    Получение цвета для типа повреждения - для обратной совместимости
    """
    return DAMAGE_COLORS.get(damage_type, '#CCCCCC')