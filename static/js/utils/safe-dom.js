/**
 * Безопасные утилиты для работы с DOM - защита от XSS
 */
class SafeDOM {
    /**
     * Экранирование HTML спецсимволов (только для текстового содержимого)
     */
    static escapeHTML(unsafe) {
        if (unsafe === null || unsafe === undefined) return '';
        const str = String(unsafe);
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;");
    }

    // В методе createElement замените обработку checked
    static createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        // Безопасные атрибуты
        Object.entries(attributes).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'src' || key === 'href') {
                    // URL не экранируем!
                    element.setAttribute(key, value);
                } else if (key === 'checked') {
                    // ОСОБАЯ ОБРАБОТКА ДЛЯ CHECKED
                    if (value === true || value === 'true') {
                        element.setAttribute(key, '');
                    }
                    // Если false - не устанавливаем атрибут
                } else {
                    // Остальные атрибуты экранируем
                    element.setAttribute(key, this.escapeHTML(value));
                }
            }
        });
        
        // Безопасное текстовое содержимое
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    /**
     * Создание текстового узла
     */
    static createText(text) {
        return document.createTextNode(this.escapeHTML(text));
    }

    /**
     * Создание кнопки с безопасным обработчиком
     */
    static createButton(text, onClick, classes = '', attributes = {}) {
        const button = this.createElement('button', {
            type: 'button',
            class: classes,
            ...attributes
        }, text);
        
        if (onClick) {
            button.addEventListener('click', onClick);
        }
        
        return button;
    }

    /**
     * Создание ссылки с безопасными атрибутами
     */
    static createLink(text, href, onClick = null, classes = '', attributes = {}) {
        const link = this.createElement('a', {
            href: href || '#',
            class: classes,
            ...attributes
        }, text);
        
        if (onClick) {
            link.addEventListener('click', (e) => {
                if (!href || href === '#') {
                    e.preventDefault();
                }
                onClick(e);
            });
        }
        
        return link;
    }

    /**
     * Создание изображения с безопасной загрузкой
     */
    static createImage(src, alt, classes = '', attributes = {}) {
        const img = this.createElement('img', {
            src: src,
            alt: alt,
            class: classes,
            loading: 'lazy',
            ...attributes
        });
        
        return img;
    }

    /**
     * Создание input элемента
     */
    static createInput(type, value, placeholder, classes = '', attributes = {}) {
        const input = this.createElement('input', {
            type: type,
            value: value || '',
            placeholder: placeholder || '',
            class: classes,
            ...attributes
        });
        
        return input;
    }

    /**
     * Создание select элемента с опциями
     */
    static createSelect(options, selectedValue, onChange, classes = '', attributes = {}) {
        const select = this.createElement('select', {
            class: classes,
            ...attributes
        });
        
        options.forEach(option => {
            const optionEl = this.createElement('option', {
                value: option.value,
                selected: option.value === selectedValue
            }, option.label);
            
            select.appendChild(optionEl);
        });
        
        if (onChange) {
            select.addEventListener('change', onChange);
        }
        
        return select;
    }

    /**
     * Безопасное добавление дочерних элементов
     */
    static appendChildren(parent, ...children) {
        children.forEach(child => {
            if (child) {
                parent.appendChild(child);
            }
        });
        return parent;
    }

    /**
     * Очистка контейнера и безопасное добавление элементов
     */
    static render(container, ...elements) {
        // Безопасная очистка
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Безопасное добавление
        this.appendChildren(container, ...elements);
        
        return container;
    }

    /**
     * Рендеринг списка с кастомным рендерером
     */
    static renderList(container, items, itemRenderer) {
        const fragment = document.createDocumentFragment();
        
        items.forEach((item, index) => {
            const element = itemRenderer(item, index);
            if (element) {
                fragment.appendChild(element);
            }
        });
        
        this.render(container, fragment);
    }
}