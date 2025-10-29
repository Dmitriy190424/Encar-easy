/**
 * Безопасный компонент пагинации
 */
class PaginationComponent {
    constructor(container, onPageChange, urlState) {
        this.container = container;
        this.onPageChange = onPageChange;
        this.urlState = urlState;
        this.config = {
            ITEMS_PER_PAGE: 20,
            MAX_PAGE: 1000
        };
    }

    /**
     * Отображение пагинации
     */
    render(paginationData, currentOffset) {
        if (!paginationData || paginationData.filtered_count <= this.config.ITEMS_PER_PAGE) {
            SafeDOM.render(this.container, SafeDOM.createText(''));
            return;
        }

        const totalPages = Math.ceil(paginationData.filtered_count / this.config.ITEMS_PER_PAGE);
        const currentPage = Math.floor(currentOffset / this.config.ITEMS_PER_PAGE) + 1;
        const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

        // Корректировка если текущая страница выходит за пределы
        if (currentPage !== safeCurrentPage) {
            this.onPageChange(safeCurrentPage);
            return;
        }

        const fragment = document.createDocumentFragment();
        const paginationList = SafeDOM.createElement('ul', {
            class: 'pagination justify-content-center'
        });

        // Кнопка "Назад"
        if (currentPage > 1) {
            paginationList.appendChild(this.createPageItem('‹ Назад', currentPage - 1, false));
        }

        // Первая страница
        if (currentPage > 3) {
            paginationList.appendChild(this.createPageItem('1', 1, false));
            if (currentPage > 4) {
                paginationList.appendChild(this.createEllipsis());
            }
        }

        // Страницы вокруг текущей
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationList.appendChild(this.createPageItem(i.toString(), i, i === currentPage));
        }

        // Последняя страница
        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) {
                paginationList.appendChild(this.createEllipsis());
            }
            paginationList.appendChild(this.createPageItem(totalPages.toString(), totalPages, false));
        }

        // Кнопка "Вперёд"
        if (currentPage < totalPages) {
            paginationList.appendChild(this.createPageItem('Вперёд ›', currentPage + 1, false));
        }

        fragment.appendChild(paginationList);
        SafeDOM.render(this.container, fragment);
    }

    /**
     * Создание элемента страницы
     */
    createPageItem(text, pageNumber, isActive = false) {
        const listItem = SafeDOM.createElement('li', {
            class: `page-item ${isActive ? 'active' : ''}`
        });

        if (isActive) {
            const span = SafeDOM.createElement('span', {
                class: 'page-link'
            }, text);
            listItem.appendChild(span);
        } else {
            const link = SafeDOM.createLink(text, '#',
                (e) => {
                    e.preventDefault();
                    this.onPageChange(pageNumber);
                },
                'page-link'
            );
            listItem.appendChild(link);
        }

        return listItem;
    }

    /**
     * Создание элемента многоточия
     */
    createEllipsis() {
        const listItem = SafeDOM.createElement('li', {
            class: 'page-item disabled'
        });

        const span = SafeDOM.createElement('span', {
            class: 'page-link'
        }, '...');

        listItem.appendChild(span);
        return listItem;
    }

    /**
     * Получение offset для страницы
     */
    getOffsetForPage(page) {
        return (Math.max(1, page) - 1) * this.config.ITEMS_PER_PAGE;
    }

    /**
     * Получение текущей страницы из offset
     */
    getCurrentPage(offset) {
        return Math.floor(offset / this.config.ITEMS_PER_PAGE) + 1;
    }
}
