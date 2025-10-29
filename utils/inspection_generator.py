"""
Генератор актов осмотра автомобилей - исправленная версия
"""
import os
from typing import Dict, Any, List, Tuple
from datetime import datetime
from .translations import TRANSLATIONS
from .damage_coordinates import DAMAGE_COORDINATES, DAMAGE_COLORS


class InspectionGenerator:
    """Генератор отчетов осмотра автомобилей - исправленная версия"""
    
    def __init__(self):
        # Используем правильные пути для FastAPI
        self.front_svg = "/example/static/images/car_scheme_front.svg"
        self.back_svg = "/example/static/images/car_scheme_back.svg"
    
    def generate_report(self, car_data: Dict[str, Any], lang: str = 'ru') -> Dict[str, Any]:
        """Генерирует данные для отчета осмотра - ИСПРАВЛЕННАЯ ВЕРСИЯ"""
        try:
            # ИСПРАВЛЕНИЕ: Проверяем разные возможные структуры данных
            if not car_data:
                return {'error': 'No car data provided'}
            
            # Проверяем разные форматы успешного ответа
            if car_data.get('status') == 'success':
                data = car_data.get('data', {})
            else:
                # Если статуса нет, возможно данные уже в корне
                data = car_data
            
            if not data:
                return {'error': 'No car data available'}
            
            t = TRANSLATIONS[lang]
            
            # Извлечение данных из структуры ответа
            info = data.get('info', {})
            spec = info.get('spec', {})
            category = info.get('category', {})
            checkup = data.get('checkup', {})
            open_data = data.get('open_data', {})
            
            master = checkup.get('master', {})
            detail = master.get('detail', {}) if master else {}
            
            # Формирование отчета
            report_data = {
                'lang': lang,
                'translations': t,
                'car_model': self._get_car_model(category),
                'car_year': category.get('formYear', '—'),
                'vin': self._find_vin(data),
                'mileage': self._format_mileage(spec.get('mileage', 0)),
                'first_registration_date': self._format_date(detail.get('firstRegistrationDate', '')),
                'transmission_type': spec.get('transmissionName', '—'),
                'fuel_type': spec.get('fuelName', '—'),
                'warranty_type': self._get_warranty_type(detail),
                'engine_type': detail.get('motorType', '—'),
                'mileage_condition': t.get('good_status', 'Хорошее'),
                'vin_condition': t.get('good_status', 'Хорошее'),
                'tuning_status': self._get_tuning_status(detail, t),
                'special_history': t.get('no_status', 'Нет'),
                'purpose_change': t.get('no_status', 'Нет'),
                'accident_history': self._get_accident_history(open_data, lang),
                'simple_repair': self._get_simple_repair_status(master, t),
                'inspection_date': self._format_inspection_date(master.get('registrationDate', '')),
                'inspector_name': detail.get('inspName', '—'),
                'diagnosis_sections': self._generate_diagnosis_sections(checkup, lang),
                'repair_list': self._generate_repair_list(checkup, lang),
                'svg_schemes': self._generate_svg_schemes(checkup, lang),
                'damage_points': self._get_damage_points(checkup, lang),
                'front_svg': self.front_svg,
                'back_svg': self.back_svg
            }
            
            return report_data
            
        except Exception as e:
            print(f"Inspection generation error: {str(e)}")
            import traceback
            traceback.print_exc()
            return {'error': f'Report generation error: {str(e)}'}

    def _get_car_model(self, category: Dict[str, Any]) -> str:
        """Получает полное название модели автомобиля"""
        try:
            manufacturer = category.get('manufacturerName', '')
            model_group = category.get('modelGroupName', '')
            grade = category.get('gradeName', '')
            return f"{manufacturer} {model_group} {grade}".strip()
        except Exception:
            return "Неизвестная модель"
    
    def _find_vin(self, data: Dict[str, Any]) -> str:
        """Находит VIN в данных автомобиля - ИСПРАВЛЕННАЯ ВЕРСИЯ"""
        try:
            # Поиск в основной информации
            if data.get('info', {}).get('vin'):
                return data['info']['vin']
            
            # Поиск в данных диагностики
            if data.get('checkup', {}).get('master', {}).get('detail', {}).get('vin'):
                return data['checkup']['master']['detail']['vin']
            
            return '—'
        except Exception:
            return '—'

    # Остальные методы остаются без изменений...
    def _format_mileage(self, mileage: int) -> str:
        """Форматирует пробег с разделителями"""
        try:
            return f"{mileage:,}".replace(',', ' ') if mileage else '0'
        except Exception:
            return '0'

    def _format_date(self, date_str: str) -> str:
        """Форматирует дату из формата ГГГГММДД"""
        try:
            if not date_str or len(date_str) != 8:
                return '—'
            return f"{date_str[:4]}/{date_str[4:6]}/{date_str[6:8]}"
        except Exception:
            return '—'

    def _format_inspection_date(self, date_str: str) -> str:
        """Форматирует дату осмотра"""
        try:
            if not date_str:
                return datetime.now().strftime('%d.%m.%Y')
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            return date_obj.strftime('%d.%m.%Y')
        except (ValueError, TypeError):
            return datetime.now().strftime('%d.%m.%Y')

    def _get_warranty_type(self, detail: Dict[str, Any]) -> str:
        """Получает тип гарантии"""
        try:
            guaranty_type = detail.get('guarantyType', {})
            return guaranty_type.get('title', '—') if guaranty_type else '—'
        except Exception:
            return '—'

    def _get_tuning_status(self, detail: Dict[str, Any], translations: Dict[str, str]) -> str:
        """Получает статус тюнинга"""
        try:
            return translations.get('no_status', 'Нет') if not detail.get('tuning') else translations.get('yes_status', 'Да')
        except Exception:
            return '—'

    def _get_simple_repair_status(self, master: Dict[str, Any], translations: Dict[str, str]) -> str:
        """Получает статус простого ремонта"""
        try:
            return translations.get('repair_yes', 'Да') if master.get('simpleRepair') else translations.get('repair_no', 'Нет')
        except Exception:
            return '—'

    def _get_accident_history(self, open_data: Dict[str, Any], lang: str) -> str:
        """Генерирует текст истории аварий"""
        try:
            accident_cnt = open_data.get('accidentCnt', )
            if accident_cnt == 0:
                return 'Нет'
            elif accident_cnt == 1:
                return '1 авария' if lang == 'ru' else '1 accident'
            else:
                return f'{accident_cnt} аварии' if lang == 'ru' else f'{accident_cnt} accidents'
        except Exception:
            return '—'

    def _generate_diagnosis_sections(self, checkup: Dict[str, Any], lang: str) -> str:
        """Генерирует HTML для разделов диагностики"""
        try:
            t = TRANSLATIONS[lang]
            inners = checkup.get('inners', [])
            
            if not inners:
                return f'<p class="no-data">{t.get("no_data", "Нет данных")}</p>'
            
            sections_html = []
            
            for system in inners:
                section_html = self._generate_system_section(system, t)
                if section_html:
                    sections_html.append(section_html)
            
            return '\n'.join(sections_html)
        except Exception as e:
            print(f"Diagnosis sections error: {e}")
            return '<p class="no-data">Ошибка загрузки диагностики</p>'

    def _generate_system_section(self, system: Dict[str, Any], translations: Dict[str, Any]) -> str:
        """Генерирует HTML для одной системы"""
        system_title = system.get('type', {}).get('title', 'Другое')
        system_code = system.get('type', {}).get('code', '')
        
        # Пробуем найти перевод по коду, затем по названию, затем используем оригинал
        system_name = translations.get('system_names', {}).get(system_code, 
                    translations.get('system_names', {}).get(system_title,
                    system_title))
        
        children = system.get('children', [])
        if not children:
            return ''
        
        items_html = self._generate_system_items(children, translations)
        
        return f'''
        <div class="detail-section">
            <button type="button" class="detail-toggle" onclick="toggleSection(this)">
                <span class="toggle-icon">▶</span>
                <span class="system-name">{system_name}</span>
            </button>
            <div class="detail-content">
                <table class="diagnosis-table">
                    {items_html}
                </table>
            </div>
        </div>
        '''

    # В методе _generate_system_items ИСПРАВИТЬ получение названий элементов:
    def _generate_system_items(self, children: List[Dict[str, Any]], translations: Dict[str, Any]) -> str:
        """Генерирует HTML для элементов системы"""
        items_html = []
        
        for item in children:
            item_title_orig = item.get('type', {}).get('title', '')
            
            # Пробуем найти перевод, затем используем оригинал
            item_title = translations.get('element_names', {}).get(item_title_orig, item_title_orig)
            
            status_type = item.get('statusType', {}) or {}
            status_code = status_type.get('code', '') if status_type else ''
            status_title = status_type.get('title', '') if status_type else ''
            
            # Пробуем найти перевод статуса по коду, затем по названию
            status_value = translations.get('status_names', {}).get(status_code,
                            translations.get('status_names', {}).get(status_title, 
                            status_title if status_title else '-'))
            
            items_html.append(f'''
            <tr>
                <td class="element-name">{item_title}</td>
                <td class="element-status">{status_value}</td>
            </tr>
            ''')
        
        return '\n'.join(items_html)
        

    def _generate_repair_list(self, checkup: Dict[str, Any], lang: str) -> str:
        """Генерирует список деталей с ремонтом/заменой"""
        try:
            t = TRANSLATIONS[lang]
            outers = checkup.get('outers', [])
            
            if not outers:
                return f'<p class="no-data">Нет данных о ремонтах и заменах</p>'
            
            rows_html = self._generate_repair_rows(outers, t)
            
            return f'''
            <div class="repair-section">
                <button type="button" class="detail-toggle" onclick="toggleSection(this)">
                    <span class="toggle-icon">▶</span>
                    <span class="system-name">Детали с ремонтом/заменой</span>
                </button>
                <div class="detail-content" style="display: none;">
                    <table class="repair-table">
                        <thead>
                            <tr>
                                <th>Деталь</th>
                                <th>Тип ремонта</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows_html}
                        </tbody>
                    </table>
                </div>
            </div>
            '''
        except Exception as e:
            print(f"Repair list error: {e}")
            return '<p class="no-data">Ошибка загрузки ремонтов</p>'

    def _generate_repair_rows(self, outers: List[Dict[str, Any]], translations: Dict[str, Any]) -> str:
        """Генерирует строки таблицы ремонтов"""
        try:
            rows = []
            
            for damage in outers:
                row_html = self._generate_repair_row(damage, translations)
                rows.append(row_html)
            
            return '\n'.join(rows)
        except Exception as e:
            print(f"Repair rows error: {e}")
            return ''

    def _generate_repair_row(self, damage: Dict[str, Any], translations: Dict[str, Any]) -> str:
        """Генерирует одну строку таблицы ремонтов"""
        try:
            damage_name = damage.get('type', {}).get('title', 'Неизвестная деталь')
            repair_type, status = self._get_repair_info(damage, translations)
            
            return f'''
            <tr>
                <td class="part-name">{damage_name}</td>
                <td class="repair-type">{repair_type}</td>
                <td class="repair-status">{status}</td>
            </tr>
            '''
        except Exception:
            return ''

    def _get_repair_info(self, damage: Dict[str, Any], translations: Dict[str, Any]) -> Tuple[str, str]:
        """Получает информацию о ремонте"""
        try:
            status_types = damage.get('statusTypes', [])
            
            if not status_types:
                return '—', '—'
            
            status_type = status_types[0]
            repair_type = translations.get('damage_status_translations', {}).get(
                status_type.get('title', ''), 
                status_type.get('title', '—')
            )
            status = translations.get('status_names', {}).get(
                status_type.get('code', ''), 
                status_type.get('title', '—')
            )
            
            return repair_type, status
        except Exception:
            return '—', '—'


    def _generate_svg_schemes(self, checkup: Dict[str, Any], lang: str) -> str:
        """Генерирует HTML со схемами повреждений"""
        try:
            t = TRANSLATIONS[lang]
            outers = checkup.get('outers', [])
            
            if not outers:
                return f'<p class="no-data">{t["no_damages"]}</p>'
            
            front_damages, back_damages = self._categorize_damages(outers)
            
            schemes_html = self._build_schemes_html(front_damages, back_damages, lang)
            
            return schemes_html
            
        except Exception as e:
            print(f"SVG schemes error: {e}")
            import traceback
            traceback.print_exc()
            return '<p class="no-data">Ошибка загрузки схем</p>'
    

    def _categorize_damages(self, outers: List[Dict[str, Any]]) -> Tuple[List, List]:
        """Разделяет повреждения по типам схем - используем готовые координаты"""
        front_damages = []
        back_damages = []
        
        for damage in outers:
            damage_type = damage.get('type', {})
            damage_code = damage_type.get('code', '')  # P032, P021, P061
            
            # Используем готовые координаты из damage_coordinates.py
            if damage_code in DAMAGE_COORDINATES:
                coords = DAMAGE_COORDINATES[damage_code]
                if coords['scheme'] == 'front':
                    front_damages.append(damage)
                elif coords['scheme'] == 'back':
                    back_damages.append(damage)
            else:
                # Если кода нет в координатах, добавляем в front
                front_damages.append(damage)
        
        return front_damages, back_damages

    # В методе _get_damage_info ИСПОЛЬЗУЕМ готовые цвета:
    def _get_damage_info(self, damage: Dict[str, Any], translations: Dict[str, Any]) -> Dict[str, str]:
        """Получает информацию о повреждении - используем готовые цвета"""
        status_types = damage.get('statusTypes', [])
        
        if not status_types:
            return {
                'color': '#3498db',
                'status': 'Повреждение'
            }
        
        status_type = status_types[0]
        status_code = status_type.get('code', '')  # W, X, C, A, U
        
        # Используем готовые цвета из damage_coordinates.py
        color = DAMAGE_COLORS.get(status_code, '#3498db')
        
        status_title = status_type.get('title', '')
        
        return {
            'color': color,
            'status': translations.get('damage_status_translations', {}).get(status_title, status_title)
        }
    
    # В методе _get_damage_points ИСПРАВИТЬ подсчет для легенды:
    def _get_damage_points(self, checkup: Dict[str, Any], lang: str) -> Dict[str, Dict]:
        """Возвращает статистику повреждений для легенды - считаем ВСЕ повреждения"""
        try:
            t = TRANSLATIONS[lang]
            outers = checkup.get('outers', [])
            damage_stats = {}
            
            for damage in outers:
                self._process_damage(damage, damage_stats, t)
            
            return damage_stats
        except Exception:
            return {}
    
    def _map_damage_to_coordinates(self, damage_title: str, damage_code: str) -> str:
        """Сопоставляет название повреждения с ключами координат - ИСПРАВЛЕННАЯ ВЕРСИЯ"""
        # Используем КОД из API напрямую, так как в координатах есть точные соответствия
        return damage_code  # P032, P021, P061

    # В методе _build_schemes_html ИСПРАВИТЬ логику отображения:
    def _build_schemes_html(self, front_damages: List, back_damages: List, lang: str) -> str:
        """Строит HTML для схем - показываем только схемы с повреждениями"""
        schemes_html = '<div class="schemes-container">'
        schemes_html += '<div class="scheme-wrapper">'
        
        # Показываем только схемы, где есть повреждения
        if front_damages:
            schemes_html += self._generate_scheme_html(front_damages, 'front', lang)
        
        if back_damages:
            schemes_html += self._generate_scheme_html(back_damages, 'back', lang)
        
        # Если нет повреждений вообще, показываем сообщение
        if not front_damages and not back_damages:
            schemes_html += f'<p class="no-data">{TRANSLATIONS[lang]["no_damages"]}</p>'
        
        schemes_html += '</div>'
        schemes_html += '</div>'
        
        return schemes_html

    # В методе _generate_scheme_html ИСПРАВИТЬ названия:
    def _generate_scheme_html(self, damages: List, scheme_type: str, lang: str) -> str:
        """Генерирует HTML для одной схемы"""
        try:
            svg_path = self.front_svg if scheme_type == 'front' else self.back_svg
            # Меняем названия на "Вид сверху" и "Вид снизу"
            scheme_name = "Вид сверху" if scheme_type == 'front' else "Вид снизу"
            
            damage_count = len(damages)
            
            return f'''
            <div class="scheme-container">
                <div class="scheme-title">{scheme_name} ({damage_count} повреждений)</div>
                <div style="position: relative; display: inline-block;">
                    <img src="{svg_path}" width="400" height="300" alt="{scheme_name}" style="display: block;">
                    {self._generate_damage_points_html(damages, scheme_type, TRANSLATIONS[lang])}
                </div>
            </div>
            '''
        except Exception as e:
            print(f"Scheme HTML error: {e}")
            return f'<div class="scheme-container">Ошибка: {str(e)}</div>'

    def _generate_damage_points_html(self, damages: List, scheme_type: str, translations: Dict[str, Any]) -> str:
        """Генерирует HTML для точек повреждений"""
        try:
            points_html = ''
            damage_count = 0
            
            for damage in damages:
                point_html = self._generate_damage_point_html(damage, scheme_type, translations)
                if point_html:
                    points_html += point_html
                    damage_count += 1
            
            return points_html
        except Exception as e:
            print(f"Damage points HTML error: {e}")
            return ''

    
    # В методе _generate_damage_point_html ДОБАВИТЬ отладку:
    def _generate_damage_point_html(self, damage: Dict[str, Any], scheme_type: str, 
                                translations: Dict[str, Any]) -> str:
        """Генерирует HTML для одной точки повреждения"""
        try:
            damage_type = damage.get('type', {})
            damage_code = damage_type.get('code', '')
            damage_title = damage_type.get('title', '')
            
            coordinates_key = self._map_damage_to_coordinates(damage_title, damage_code)
            
            
            if coordinates_key not in DAMAGE_COORDINATES:
                print(f"  No coordinates found for {coordinates_key}")
                return ''
            
            coords = DAMAGE_COORDINATES[coordinates_key]
            if coords['scheme'] != scheme_type:
                print(f"  Scheme mismatch: {coords['scheme']} != {scheme_type}")
                return ''
            
            damage_info = self._get_damage_info(damage, translations)
            
            return f'''
            <div class="damage-point" 
                style="left: {coords['x']}%; top: {coords['y']}%; background: {damage_info['color']};"
                title="{coords['name']}: {damage_info['status']}">
            </div>
            '''
        except Exception as e:
            print(f"Damage point HTML error: {e}")
            return ''


    def _process_damage(self, damage: Dict[str, Any], damage_stats: Dict, 
                       translations: Dict[str, Any]) -> None:
        """Обрабатывает одно повреждение"""
        try:
            status_types = damage.get('statusTypes', [])
            if not status_types:
                return
            
            status_type = status_types[0]
            damage_type_key = status_type.get('title', 'Неизвестно')
            
            damage_data = self._get_damage_type_data(damage_type_key, translations)
            damage_type_name = damage_data['name']
            color_code = damage_data['code']
            
            if damage_type_name in damage_stats:
                damage_stats[damage_type_name]['count'] += 1
            else:
                damage_stats[damage_type_name] = {
                    'count': 1,
                    'color': DAMAGE_COLORS.get(color_code, '#3498db')
                }
        except Exception:
            pass

    def _get_damage_type_data(self, damage_type_key: str, 
                            translations: Dict[str, Any]) -> Dict[str, str]:
        """Получает данные типа повреждения"""
        try:
            damage_type_mapping = {
                'Sheet metal/welding': {'code': 'W', 'name': translations.get('legend_welding', 'Сварка')},
                'Exchange (replacement)': {'code': 'X', 'name': translations.get('legend_exchange', 'Замена')},
                'Corrosion': {'code': 'C', 'name': translations.get('legend_corrosion', 'Коррозия')},
                'Scratch': {'code': 'A', 'name': translations.get('legend_scratch', 'Царапина')},
                'Dent': {'code': 'U', 'name': translations.get('legend_dent', 'Вмятина')}
            }
            
            return damage_type_mapping.get(damage_type_key, {
                'code': 'A', 
                'name': translations.get('damage_status_translations', {}).get(damage_type_key, damage_type_key)
            })
        except Exception:
            return {'code': 'A', 'name': damage_type_key}
