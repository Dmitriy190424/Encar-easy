/**
 * Утилиты для страницы осмотра автомобиля
 */

// Функция для отладки
function toggleDebug() {
    const debugInfo = document.getElementById('debug-info');
    if (debugInfo) {
        debugInfo.style.display = debugInfo.style.display === 'block' ? 'none' : 'block';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    
    // Гарантируем, что все content элементы скрыты при загрузке
    const detailContents = document.querySelectorAll('.detail-content');
    detailContents.forEach(content => {
        content.style.display = 'none';
    });
});
