// Main JavaScript for Lambe Lambe Veterinária

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    whatsappNumber: '5554999999999',
    scrollOffset: 80,
    animationDuration: 300,
};

// ===== DOM ELEMENTS =====
const elements = {
    header: document.getElementById('header'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    whatsappFloat: document.getElementById('whatsapp-float'),
};

// ===== HEADER SCROLL EFFECT =====
function handleScroll() {
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        elements.header.classList.add('scrolled');
    } else {
        elements.header.classList.remove('scrolled');
    }
}

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
    const icon = elements.mobileMenuBtn.querySelector('i');
    
    elements.mobileMenu.classList.toggle('active');
    
    if (elements.mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Fechar menu ao clicar em um link
function closeMobileMenuOnClick() {
    const mobileLinks = elements.mobileMenu.querySelectorAll('a');
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (elements.mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignorar links vazios
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetPosition = target.offsetTop - CONFIG.scrollOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== WHATSAPP TRACKING =====
function trackWhatsAppClick(source) {
    // Google Analytics tracking (quando implementado)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'WhatsApp',
            'event_label': source,
        });
    }
    
    // Meta Pixel tracking (quando implementado)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
            source: source,
        });
    }
    
    console.log('WhatsApp click tracked:', source);
}

// Adicionar tracking aos botões WhatsApp
function initWhatsAppTracking() {
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackWhatsAppClick(buttonText || 'Unknown');
        });
    });
}

// ===== SCROLL TO TOP BUTTON =====
function createScrollToTopButton() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-to-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'fixed bottom-24 right-6 bg-gray-700 hover:bg-gray-800 text-white w-12 h-12 rounded-full items-center justify-center shadow-lg transition transform hover:scale-110 z-40 hidden';
    
    document.body.appendChild(scrollTopBtn);
    
    // Mostrar/ocultar botão baseado no scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.remove('hidden');
            scrollTopBtn.classList.add('flex');
        } else {
            scrollTopBtn.classList.add('hidden');
            scrollTopBtn.classList.remove('flex');
        }
    });
    
    // Scroll to top ao clicar
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== LAZY LOADING DE IMAGENS =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ANIMAÇÃO DE NÚMEROS (CONTADOR) =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Inicializar contadores quando visíveis
function initCounters() {
    const counters = document.querySelectorAll('.stats-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// ===== FADE IN ON SCROLL =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => scrollObserver.observe(element));
}

// ===== ACCORDION =====
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Fechar todos os outros
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Abrir o clicado (se não estava aberto)
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// ===== FORM VALIDATION =====
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
            
            // Remover erro ao digitar
            input.addEventListener('input', function() {
                this.classList.remove('border-red-500');
            }, { once: true });
        }
    });
    
    return isValid;
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animação de entrada
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== COPY TO CLIPBOARD =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copiado para a área de transferência!');
    }).catch(() => {
        showToast('Erro ao copiar', 'error');
    });
}

// ===== UTM PARAMETERS =====
function getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        source: urlParams.get('utm_source') || '',
        medium: urlParams.get('utm_medium') || '',
        campaign: urlParams.get('utm_campaign') || '',
        content: urlParams.get('utm_content') || '',
    };
}

// Armazenar UTM no sessionStorage
function storeUTMParameters() {
    const utm = getUTMParameters();
    if (utm.source) {
        sessionStorage.setItem('utm_params', JSON.stringify(utm));
    }
}

// ===== PERFORMANCE MONITORING =====
function monitorPerformance() {
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('Performance:', entry.name, entry.duration);
            }
        });
        
        perfObserver.observe({ entryTypes: ['navigation', 'resource'] });
    }
}

// ===== GOOGLE ANALYTICS HELPER =====
function sendGAEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
        });
    }
}

// ===== META PIXEL HELPER =====
function sendMetaEvent(eventName, parameters = {}) {
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, parameters);
    }
}

// ===== DEVICE DETECTION =====
function detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    return {
        isMobile: /mobile|android|ios|iphone|ipad|ipod/.test(userAgent),
        isTablet: /tablet|ipad/.test(userAgent),
        isDesktop: !/mobile|tablet|android|ios/.test(userAgent),
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lambe Lambe Veterinária - Website loaded');
    
    // Event Listeners
    window.addEventListener('scroll', handleScroll);
    elements.mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
    
    // Initialize features
    closeMobileMenuOnClick();
    initSmoothScroll();
    initWhatsAppTracking();
    createScrollToTopButton();
    initLazyLoading();
    initCounters();
    initScrollAnimations();
    initAccordion();
    storeUTMParameters();
    
    // Device info
    const device = detectDevice();
    console.log('Device:', device);
    
    // Performance monitoring (apenas em desenvolvimento)
    // monitorPerformance();
});

// ===== SERVICE WORKER (PWA - Opcional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Descomente para ativar PWA
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ===== EXPORT FUNCTIONS (para uso em outras páginas) =====
window.LambeLambe = {
    trackWhatsAppClick,
    showToast,
    sendGAEvent,
    sendMetaEvent,
    copyToClipboard,
    getUTMParameters,
};