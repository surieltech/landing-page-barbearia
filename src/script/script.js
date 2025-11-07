// src/script/script.js

$(document).ready(function() {
    // ===== VARIÁVEIS GLOBAIS =====
    let currentTestimonialSlide = 0;
    let currentGalleryModalIndex = 0;
    let galleryItems = [];

    // ===== MENU MOBILE =====
    function initMobileMenu() {
        $('#mobile_btn').on('click', function() {
            $('#mobile_menu').toggleClass('active');
            $(this).find('i').toggleClass('fa-bars fa-times');
        });

        // Fechar menu ao clicar em um link
        $('#mobile_nav_list .nav-item a').on('click', function() {
            $('#mobile_menu').removeClass('active');
            $('#mobile_btn').find('i').removeClass('fa-times').addClass('fa-bars');
        });
    }

        // ===== FUNÇÃO PARA ATUALIZAR MENU ATIVO PARA UMA SEÇÃO ESPECÍFICA =====
    function updateActiveMenuForSection(sectionId) {
        $('.nav-item').removeClass('active');
        $(`a[href="#${sectionId}"]`).parent().addClass('active');
        
        // Atualizar também no mobile
        $(`#mobile_nav_list a[href="#${sectionId}"]`).parent().addClass('active');
    }

    
    // ===== HEADER FIXO E MENU ATIVO =====
    function initHeaderScroll() {
        let lastScrollTop = 0;
        
        $(window).on('scroll', function() {
            const scrollTop = $(this).scrollTop();
            const header = $('header');
            
            // Adicionar sombra no header ao scrollar
            if (scrollTop > 100) {
                header.addClass('scrolled');
            } else {
                header.removeClass('scrolled');
            }
            
            // Atualizar menu ativo baseado na seção visível
            updateActiveMenu();
            lastScrollTop = scrollTop;
        });
    }

    function updateActiveMenu() {
        const scrollPos = $(document).scrollTop() + 100;
        
        $('section').each(function() {
            const section = $(this);
            const sectionTop = section.offset().top;
            const sectionBottom = sectionTop + section.outerHeight();
            const sectionId = section.attr('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                $('.nav-item').removeClass('active');
                $(`a[href="#${sectionId}"]`).parent().addClass('active');
                
                // Atualizar também no mobile
                $(`#mobile_nav_list a[href="#${sectionId}"]`).parent().addClass('active');
            }
        });
    }

    // ===== FILTRO DA GALERIA =====
    function initGalleryFilter() {
        $('.filter-btn').on('click', function() {
            const filter = $(this).data('filter');
            
            // Atualizar botão ativo
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            
            // Filtrar itens
            if (filter === 'all') {
                $('.gallery-item').fadeIn(400);
            } else {
                $('.gallery-item').hide();
                $(`.gallery-item.${filter}`).fadeIn(400);
            }
        });
    }

    // ===== MODAL DA GALERIA =====
    function initGalleryModal() {
        // Coletar todos os itens da galeria
        galleryItems = $('.gallery-item').toArray();
        
        // Abrir modal ao clicar no botão de visualizar
        $('.view-btn').on('click', function(e) {
            e.stopPropagation();
            const galleryCard = $(this).closest('.gallery-item');
            currentGalleryModalIndex = galleryItems.indexOf(galleryCard[0]);
            openGalleryModal(currentGalleryModalIndex);
        });
        
        // Abrir modal ao clicar na imagem (para itens antes/depois)
        $('.gallery-card').on('click', function() {
            if (!$(this).hasClass('before-after')) {
                const galleryItem = $(this).closest('.gallery-item');
                currentGalleryModalIndex = galleryItems.indexOf(galleryItem[0]);
                openGalleryModal(currentGalleryModalIndex);
            }
        });
        
        // Fechar modal
        $('.close-modal').on('click', closeGalleryModal);
        $('.gallery-modal').on('click', function(e) {
            if (e.target === this) {
                closeGalleryModal();
            }
        });
        
        // Navegação do modal
        $('.prev-btn').on('click', function(e) {
            e.stopPropagation();
            navigateGalleryModal(-1);
        });
        
        $('.next-btn').on('click', function(e) {
            e.stopPropagation();
            navigateGalleryModal(1);
        });
        
        // Navegação por teclado
        $(document).on('keydown', function(e) {
            if ($('.gallery-modal').is(':visible')) {
                if (e.key === 'Escape') closeGalleryModal();
                if (e.key === 'ArrowLeft') navigateGalleryModal(-1);
                if (e.key === 'ArrowRight') navigateGalleryModal(1);
            }
        });
    }

    function openGalleryModal(index) {
        const item = $(galleryItems[index]);
        const imageSrc = item.find('img').attr('src');
        const title = item.find('.gallery-info h4').text() || 'Imagem da Galeria';
        const description = item.find('.gallery-info p').text() || '';
        
        $('.modal-image').attr('src', imageSrc);
        $('.modal-title').text(title);
        $('.modal-description').text(description);
        $('.gallery-modal').fadeIn(300);
        
        // Prevenir scroll do body
        $('body').css('overflow', 'hidden');
    }

    function closeGalleryModal() {
        $('.gallery-modal').fadeOut(300);
        $('body').css('overflow', 'auto');
    }

    function navigateGalleryModal(direction) {
        currentGalleryModalIndex += direction;
        
        // Loop através dos itens
        if (currentGalleryModalIndex >= galleryItems.length) {
            currentGalleryModalIndex = 0;
        } else if (currentGalleryModalIndex < 0) {
            currentGalleryModalIndex = galleryItems.length - 1;
        }
        
        openGalleryModal(currentGalleryModalIndex);
    }

    // ===== CARROSSEL DE DEPOIMENTOS =====
    function initTestimonialsCarousel() {
        const $slide = $('.testimonials-slide');
        const $items = $('.testimonial-item');
        const totalSlides = $items.length;
        
        // Botões de navegação
        $('.testimonials-prev').on('click', function() {
            navigateTestimonials(-1);
        });
        
        $('.testimonials-next').on('click', function() {
            navigateTestimonials(1);
        });
        
        // Indicadores
        $('.testimonial-indicator').on('click', function() {
            const slideIndex = $(this).data('slide');
            goToTestimonialSlide(slideIndex);
        });
        
        // Auto-play (opcional)
        let autoPlayInterval = setInterval(() => {
            navigateTestimonials(1);
        }, 5000);
        
        // Pausar auto-play ao interagir
        $('.testimonials-carousel').on('mouseenter', function() {
            clearInterval(autoPlayInterval);
        }).on('mouseleave', function() {
            autoPlayInterval = setInterval(() => {
                navigateTestimonials(1);
            }, 5000);
        });
    }

    function navigateTestimonials(direction) {
        const $items = $('.testimonial-item');
        const totalSlides = $items.length;
        
        currentTestimonialSlide += direction;
        
        if (currentTestimonialSlide >= totalSlides) {
            currentTestimonialSlide = 0;
        } else if (currentTestimonialSlide < 0) {
            currentTestimonialSlide = totalSlides - 1;
        }
        
        goToTestimonialSlide(currentTestimonialSlide);
    }

    function goToTestimonialSlide(slideIndex) {
        const $slide = $('.testimonials-slide');
        const slideWidth = $('.testimonial-item').outerWidth();
        
        $slide.css('transform', `translateX(-${slideIndex * 100}%)`);
        currentTestimonialSlide = slideIndex;
        
        // Atualizar indicadores
        $('.testimonial-indicator').removeClass('active');
        $(`.testimonial-indicator[data-slide="${slideIndex}"]`).addClass('active');
    }

    // ===== BOTÕES DE AGENDAMENTO =====
    function initBookingButtons() {
        // Botões de serviço
        $('.service-cta').on('click', function() {
            const serviceName = $(this).closest('.service-card').find('h3').text();
            const message = `Olá! Gostaria de agendar um horário para: ${serviceName}`;
            const whatsappUrl = `https://wa.me/5592992939495?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
        
        // Botão CTA da galeria
        $('.cta-button').on('click', function() {
            const message = "Olá! Gostaria de agendar um horário na Barbearia Alpha.";
            const whatsappUrl = `https://wa.me/5592992939495?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
        
        // Botão de avaliações
        $('.btn-default').on('click', function(e) {
            e.preventDefault();
            // Aqui você pode implementar um formulário de avaliação
            // ou redirecionar para Google Meu Negócio, etc.
            alert('Em breve: formulário de avaliação online!');
        });
    }

    // ===== ANIMAÇÕES AO SCROLL =====
    function initScrollAnimations() {
        const $animatedElements = $('.service-card, .value-card, .info-card, .gallery-item, .team-member, .stat-card');
        
        function checkAnimation() {
            const windowHeight = $(window).height();
            const windowTop = $(window).scrollTop();
            const windowBottom = windowTop + windowHeight;
            
            $animatedElements.each(function() {
                const $element = $(this);
                const elementTop = $element.offset().top;
                const elementBottom = elementTop + $element.outerHeight();
                
                // Verificar se o elemento está visível na tela
                if (elementBottom >= windowTop && elementTop <= windowBottom) {
                    $element.addClass('fade-in-up');
                }
            });
        }
        
        // Verificar animações ao carregar e ao scrollar
        checkAnimation();
        $(window).on('scroll', checkAnimation);
    }

    // ===== CONTADORES ANIMADOS =====
    function initCounters() {
        const $counters = $('.stat .number');
        let started = false;
        
        function startCounters() {
            if (started) return;
            
            $counters.each(function() {
                const $this = $(this);
                const target = parseInt($this.text().replace(/[^0-9]/g, ''));
                const suffix = $this.text().replace(/[0-9]/g, '');
                let count = 0;
                const duration = 2000; // 2 segundos
                const increment = target / (duration / 16); // 60fps
                
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        $this.text(target + suffix);
                        clearInterval(timer);
                    } else {
                        $this.text(Math.floor(count) + suffix);
                    }
                }, 16);
            });
            
            started = true;
        }
        
        // Iniciar contadores quando a seção about estiver visível
        function checkCounters() {
            const $aboutSection = $('#about');
            const windowHeight = $(window).height();
            const windowTop = $(window).scrollTop();
            const windowBottom = windowTop + windowHeight;
            const sectionTop = $aboutSection.offset().top;
            
            if (windowBottom > sectionTop + 200) {
                startCounters();
            }
        }
        
        $(window).on('scroll', checkCounters);
    }

    // ===== FORMULÁRIO DE CONTATO (FUTURO) =====
    function initContactForm() {
        // Placeholder para futuro formulário de contato
        console.log('Sistema de formulário pronto para implementação');
    }

    // ===== BOTÃO FLUTUANTE DO WHATSAPP =====
    function initFloatingWhatsApp() {
        // O botão já está no HTML, apenas adicionamos funcionalidade extra se necessário
        $('.whatsapp-float').on('click', function(e) {
            e.preventDefault();
            const message = "Olá! Gostaria de mais informações sobre os serviços da Barbearia Alpha.";
            const whatsappUrl = `https://wa.me/5592992939495?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }

    // ===== DETECÇÃO DE DISPOSITIVO =====
    function initDeviceDetection() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            $('body').addClass('mobile-device');
        } else {
            $('body').addClass('desktop-device');
        }
    }

    // ===== OTIMIZAÇÃO DE PERFORMANCE =====
    function initPerformanceOptimizations() {
        // Lazy loading para imagens
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            $('img[data-src]').each(function() {
                imageObserver.observe(this);
            });
        }
    }

    // ===== INICIALIZAÇÃO DE TODAS AS FUNCIONALIDADES =====
    function initAll() {
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initGalleryFilter();
        initGalleryModal();
        initTestimonialsCarousel();
        initBookingButtons();
        initScrollAnimations();
        initCounters();
        initContactForm();
        initFloatingWhatsApp();
        initDeviceDetection();
        initPerformanceOptimizations();

        // Atualizar menu ativo ao carregar a página
        updateActiveMenu();
        
        console.log('Barbearia Alpha - Site inicializado com sucesso!');
    }

    // ===== INICIALIZAR TUDO =====
    initAll();

    // ===== TRATAMENTO DE ERROS =====
    $(window).on('error', function(e) {
        console.error('Erro no site:', e);
    });

    // ===== AJUSTES DE LAYOUT DINÂMICOS =====
    function adjustLayout() {
        // Ajustar altura do hero para a tela visível
        const windowHeight = $(window).height();
        const headerHeight = $('header').outerHeight();
        $('.hero-section').css('min-height', windowHeight - headerHeight);
    }

    // Executar ajustes de layout
    adjustLayout();
    $(window).on('resize', adjustLayout);
});

// ===== FUNÇÕES GLOBAIS ADICIONAIS =====
// Função para formatar telefone (caso precise no futuro)
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

// Função para validar email (caso precise no futuro)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para debounce (otimização de performance)
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Service Worker para PWA (opcional - para futuro)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso: ', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha no registro do ServiceWorker: ', error);
            });
    });
}