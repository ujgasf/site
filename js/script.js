// ========== БАЗОВЫЕ ФУНКЦИИ ==========

// ФИКСИРОВАННЫЙ HEADER
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ========== ЭКСТРЕННОЕ ИСПРАВЛЕНИЕ РАСПОЛОЖЕНИЯ СОБЫТИЙ ==========
function fixEventsPosition() {
    console.log('Исправляем позиционирование секции событий...');
    
    // Уменьшаем hero секцию
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.height = '65vh';
        hero.style.minHeight = '400px';
        hero.style.overflow = 'hidden';
    }
    
    // Поднимаем секцию событий
    const events = document.getElementById('events');
    if (events) {
        events.style.paddingTop = '0';
        events.style.marginTop = '-80px';
        events.style.position = 'relative';
        events.style.zIndex = '2';
    }
    
    // Уменьшаем отступы у всех секций
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'events') {
            section.style.padding = '60px 0';
        }
    });
}

// ========== МОБИЛЬНОЕ МЕНЮ И ОСНОВНОЙ КОД ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация приложения...');
    
    // Применяем исправление сразу
    setTimeout(fixEventsPosition, 100);
    
    // Бургер-меню
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    
    if (burgerMenu && mobileMenu) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    if (mobileClose) {
        mobileClose.addEventListener('click', function() {
            burgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Выпадающие меню в мобильной версии
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdownMenu = this.nextElementSibling;
            dropdownMenu.classList.toggle('active');
        });
    });
    
    // ========== ВЫПАДАЮЩИЕ МЕНЮ В HEADER ==========
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        // Наведение для десктопа
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.classList.add('active');
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.classList.remove('active');
            }
        });
        
        // Клик для мобильных
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Закрытие всех выпадающих меню при клике вне
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // ========== ВЫПАДАЮЩИЙ СПИСОК В СЕКЦИИ "СОБЫТИЯ" ==========
    const eventsDropdown = document.querySelector('.events-dropdown');
    const eventsDropdownToggle = document.querySelector('.events-dropdown-toggle');
    
    if (eventsDropdown && eventsDropdownToggle) {
        console.log('Инициализируем выпадающий список событий...');
        
        // Открытие/закрытие выпадающего списка
        eventsDropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            eventsDropdown.classList.toggle('active');
        });

        // Закрытие при клике вне списка
        document.addEventListener('click', function(e) {
            if (eventsDropdown && !eventsDropdown.contains(e.target)) {
                eventsDropdown.classList.remove('active');
            }
        });

        // Обработка выбора события из списка
        const eventLinks = document.querySelectorAll('.events-dropdown-menu a');
        const eventItems = document.querySelectorAll('.event-item');
        
        eventLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Убираем активный класс у всех ссылок
                eventLinks.forEach(l => l.classList.remove('active'));
                
                // Добавляем активный класс к выбранной ссылке
                this.classList.add('active');
                
                // Получаем ID целевого события
                const targetId = this.getAttribute('href').substring(1);
                
                // Прокручиваем к выбранному событию
                const targetEvent = document.getElementById(targetId);
                if (targetEvent) {
                    // Убираем активный класс у всех событий
                    eventItems.forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Добавляем активный класс к целевому событию
                    targetEvent.classList.add('active');
                    
                    // Плавная прокрутка
                    const eventsList = document.querySelector('.events-list');
                    if (eventsList) {
                        const scrollPosition = targetEvent.offsetTop - eventsList.offsetTop;
                        
                        eventsList.scrollTo({
                            top: scrollPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                
                // Обновляем текст в кнопке
                eventsDropdownToggle.querySelector('span').textContent = this.textContent;
                
                // Закрываем выпадающий список
                eventsDropdown.classList.remove('active');
            });
        });

        // Инициализация первого события как активного
        if (eventLinks.length > 0) {
            // Устанавливаем первый элемент как активный
            eventLinks[0].classList.add('active');
            const firstEventId = eventLinks[0].getAttribute('href').substring(1);
            const firstEvent = document.getElementById(firstEventId);
            if (firstEvent) {
                firstEvent.classList.add('active');
            }
            // Устанавливаем текст кнопки
            eventsDropdownToggle.querySelector('span').textContent = eventLinks[0].textContent;
        }
    }
    
    // ========== ПЛАВНАЯ ПРОКРУТКА ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем пустые ссылки
            if (href === '#' || href === '') return;
            
            // Для ссылок на секции страницы
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                
                // Закрываем мобильное меню если открыто
                if (mobileMenu && burgerMenu) {
                    mobileMenu.classList.remove('active');
                    burgerMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Закрываем выпадающий список событий если открыт
                if (eventsDropdown) eventsDropdown.classList.remove('active');
                
                // Закрываем все выпадающие меню в header
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
                
                // Находим целевой элемент
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ========== ФОРМА КОНТАКТОВ ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                this.reset();
            } else {
                alert('Пожалуйста, заполните все обязательные поля');
            }
        });
    }
    
    // ========== КНОПКИ "ЗАКАЗАТЬ" ==========
    document.querySelectorAll('.btn-order').forEach(button => {
        button.addEventListener('click', function() {
            const contactsSection = document.getElementById('contacts');
            if (contactsSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = contactsSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== АНИМАЦИИ ПРИ СКРОЛЛЕ ==========
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .event-card, .stat-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Запускаем сразу
});

// ========== ЗАГРУЗКА СТРАНИЦЫ И ФИНАЛЬНЫЕ ИСПРАВЛЕНИЯ ==========
window.addEventListener('load', function() {
    console.log('Страница полностью загружена');
    document.body.classList.add('loaded');
    
    // Применяем исправления еще раз
    fixEventsPosition();
    
    // Дублируем на случай, если что-то перезаписывает стили
    setTimeout(fixEventsPosition, 300);
    setTimeout(fixEventsPosition, 800);
});

// Также применяем при изменении размера окна
window.addEventListener('resize', function() {
    setTimeout(fixEventsPosition, 100);
});