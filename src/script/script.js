// script.js - Barbearia Alpha (COMPLETO E FUNCIONAL)

document.addEventListener('DOMContentLoaded', function() {
    console.log('Barbearia Alpha - Site carregado com sucesso!');

    // ===== MENU MOBILE =====
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('#mobile_nav_list a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
                mobileBtn.querySelector('i').classList.remove('fa-times');
                mobileBtn.querySelector('i').classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target) && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
                mobileBtn.querySelector('i').classList.remove('fa-times');
                mobileBtn.querySelector('i').classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ===== NAVEGAÇÃO SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Só aplicar para links internos (#)
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== ATUALIZAR NAVEGAÇÃO ATIVA =====
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('#nav_list a, #mobile_nav_list a');
        
        let current = '';
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.parentElement.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // ===== GALERIA - COMPLETAMENTE FUNCIONAL =====
    console.log('Inicializando galeria...');

    const modal = document.querySelector('.gallery-modal');
    const modalImage = document.querySelector('.modal-image');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryImages = [];
    let currentImageIndex = 0;

    // Coletar informações das imagens
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h4');
        const description = item.querySelector('p');

        if (img && img.src) {
            galleryImages.push({
                src: img.src,
                alt: img.alt || 'Imagem da galeria',
                title: title ? title.textContent : 'Nosso trabalho',
                description: description ? description.textContent : 'Confira a qualidade do nosso serviço'
            });
        }
    });

    console.log(`Galeria: ${galleryImages.length} imagens carregadas`);

    // ===== FILTROS DA GALERIA =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            console.log(`Filtro ativado: ${filter}`);
            
            // Atualizar botões ativos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Aplicar filtro
            galleryItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else if (item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ===== ABRIR IMAGENS NO MODAL =====
    
    // Método 1: Clique no botão de visualizar
    document.querySelectorAll('.view-btn').forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const galleryItem = this.closest('.gallery-item');
            openImageFromItem(galleryItem);
        });
    });

    // Método 2: Clique direto na imagem (fallback)
    document.querySelectorAll('.gallery-card').forEach((card, index) => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.view-btn') && !e.target.closest('.like-btn')) {
                const galleryItem = this.closest('.gallery-item');
                openImageFromItem(galleryItem);
            }
        });
    });

    function openImageFromItem(galleryItem) {
        const allItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
        currentImageIndex = allItems.indexOf(galleryItem);
        
        if (currentImageIndex >= 0 && galleryImages.length > 0) {
            const imageData = galleryImages[currentImageIndex];
            
            modalImage.src = imageData.src;
            modalImage.alt = imageData.alt;
            modalTitle.textContent = imageData.title;
            modalDescription.textContent = imageData.description;
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            console.log(`Modal aberto: ${currentImageIndex + 1}/${galleryImages.length}`);
        }
    }

    // ===== FECHAR MODAL =====
    function closeImageModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeImageModal);
    }

    // Fechar modal ao clicar no fundo
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // ===== NAVEGAÇÃO NO MODAL =====
    function navigateImages(direction) {
        if (galleryImages.length === 0) return;
        
        currentImageIndex += direction;
        
        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        }
        
        const imageData = galleryImages[currentImageIndex];
        modalImage.src = imageData.src;
        modalImage.alt = imageData.alt;
        modalTitle.textContent = imageData.title;
        modalDescription.textContent = imageData.description;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateImages(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navigateImages(1);
        });
    }

    // ===== NAVEGAÇÃO POR TECLADO =====
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'flex') {
            switch(e.key) {
                case 'ArrowLeft':
                    navigateImages(-1);
                    break;
                case 'ArrowRight':
                    navigateImages(1);
                    break;
                case 'Escape':
                    closeImageModal();
                    break;
            }
        }
    });

    // ===== CARROSSEL DE DEPOIMENTOS =====
    function initTestimonialsCarousel() {
        const track = document.querySelector('.testimonials-track');
        const items = document.querySelectorAll('.testimonial-item');
        const indicators = document.querySelectorAll('.testimonial-indicator');
        const prevBtn = document.querySelector('.testimonials-prev');
        const nextBtn = document.querySelector('.testimonials-next');
        
        if (!track || items.length === 0) return;
        
        let currentIndex = 0;
        const totalItems = items.length;
        
        function updateCarousel() {
            // Remove classe active de todos os itens
            items.forEach(item => item.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Adiciona classe active no item atual
            items[currentIndex].classList.add('active');
            if (indicators[currentIndex]) {
                indicators[currentIndex].classList.add('active');
            }
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }
        
        // Event listeners para botões
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        // Event listeners para indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Auto-play (opcional)
        let autoPlay = setInterval(nextSlide, 5000);
        
        // Pausar auto-play ao interagir
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
            carousel.addEventListener('mouseleave', () => {
                autoPlay = setInterval(nextSlide, 5000);
            });
        }
        
        // Inicializar
        updateCarousel();
    }

    // Inicializar carrossel de depoimentos
    if (document.querySelector('.testimonials-carousel')) {
        initTestimonialsCarousel();
    }

    // ===== BOTÕES DE AÇÃO =====
    
    // Botões de serviços - WhatsApp
    document.querySelectorAll('.service-cta').forEach(button => {
        button.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            const serviceTitle = serviceCard.querySelector('h3').textContent;
            const servicePrice = serviceCard.querySelector('.price').textContent;
            
            const message = `Olá! Gostaria de agendar o serviço: *${serviceTitle}* (${servicePrice})\nPoderia me informar os horários disponíveis?`;
            const whatsappUrl = `https://wa.me/5592992939495?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    });

    // Botão CTA da galeria
    const galleryCta = document.querySelector('.cta-button');
    if (galleryCta) {
        galleryCta.addEventListener('click', function() {
            const message = 'Olá! Gostaria de agendar um horário na Barbearia Alpha. Poderia me informar a disponibilidade?';
            window.open(`https://wa.me/5592992939495?text=${encodeURIComponent(message)}`, '_blank');
        });
    }

    // Botões hero section
    document.querySelectorAll('.btn-whatsapp').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const message = 'Olá! Gostaria de agendar um horário na Barbearia Alpha.';
                window.open(`https://wa.me/5592992939495?text=${encodeURIComponent(message)}`, '_blank');
            }
        });
    });

    // Botão de avaliação
    const testimonialCta = document.querySelector('.testimonials-cta .btn-default');
    if (testimonialCta) {
        testimonialCta.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirecionar para Google Maps ou outro serviço de avaliação
            alert('Obrigado pelo interesse em avaliar nossos serviços! Em breve teremos um sistema de avaliações online.');
        });
    }

    // Botões de endereço
    document.querySelectorAll('.btn-whatsapp-address').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const message = 'Olá! Vi o endereço no site e gostaria de agendar um horário.';
            window.open(`https://wa.me/5592992939495?text=${encodeURIComponent(message)}`, '_blank');
        });
    });

    document.querySelectorAll('.btn-call').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // O navegador vai perguntar se quer ligar
            console.log('Iniciando chamada...');
        });
    });

    // ===== ANIMAÇÕES DE SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .value-card, .gallery-item, .stat-card, .info-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // ===== OTIMIZAÇÕES =====
    
    // Preload de imagens críticas
    function preloadCriticalImages() {
        const criticalImages = [
            'src/img/barbeiro-gpt.png',
            'src/img/corte-1.jpg',
            'src/img/corte-2.jpg',
            'src/img/barba-1.avif',
            'src/img/barba-2.avif'
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Iniciar preload quando a página estiver carregada
    window.addEventListener('load', preloadCriticalImages);

    // ===== TRATAMENTO DE ERROS =====
    
    // Imagens quebradas
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`Imagem não carregada: ${this.src}`);
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+';
            this.alt = 'Imagem não disponível';
        });
    });

    // ===== FUNÇÕES DE DEBUG =====
    window.debugSite = function() {
        console.log('=== DEBUG BARBEARIA ALPHA ===');
        console.log('Itens da galeria:', document.querySelectorAll('.gallery-item').length);
        console.log('Imagens na galeria:', galleryImages.length);
        console.log('Botões de serviço:', document.querySelectorAll('.service-cta').length);
        console.log('Depoimentos:', document.querySelectorAll('.testimonial-item').length);
        console.log('Modal da galeria:', modal ? 'Encontrado' : 'Não encontrado');
    };

    // ===== INICIALIZAÇÃO FINAL =====
    console.log('✅ Todas as funcionalidades foram inicializadas');
    console.log('💈 Barbearia Alpha - Pronta para atender!');
});

// ===== FUNÇÕES GLOBAIS =====

// Formatar número de telefone
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Detectar dispositivo móvel
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || 
           (navigator.userAgent.indexOf('IEMobile') !== -1) ||
           (window.innerWidth <= 768);
}

// Copiar para área de transferência
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Texto copiado: ' + text);
    }, function(err) {
        console.error('Erro ao copiar: ', err);
    });
}

// ===== POLYFILLS =====

// IntersectionObserver polyfill para navegadores antigos
if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver não suportado. Carregando fallback...');
    // Fallback simples para animações
    window.addEventListener('scroll', function() {
        document.querySelectorAll('.service-card, .value-card').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });
}

// ===== CONFIGURAÇÕES GLOBAIS =====

// Desativar arrastar imagens (opcional)
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Prevenir clique direito em imagens (opcional)
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

console.log('🌐 Barbearia Alpha - JavaScript carregado');