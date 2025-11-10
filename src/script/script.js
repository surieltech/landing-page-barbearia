// Navegação e Scroll Suave
document.addEventListener('DOMContentLoaded', function() {
    // Menu Mobile
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');
    const navItems = document.querySelectorAll('.nav-item');

    // Alternar menu mobile
    mobileBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um item
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        });
    });

    // Scroll suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Ativar seção atual no menu
    function activateCurrentSection() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('#nav_list .nav-item, #mobile_nav_list .nav-item');
        
        let currentSection = '';
        
        // Remover todas as classes active primeiro
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Verificar qual seção está visível
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Ativar apenas o link correspondente à seção atual
        if (currentSection) {
            navLinks.forEach(link => {
                const linkHref = link.querySelector('a').getAttribute('href');
                if (linkHref === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Ativar ao carregar e ao scrollar
    window.addEventListener('load', activateCurrentSection);
    window.addEventListener('scroll', activateCurrentSection);

    // Header com efeito de scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#navbar') && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    });
});

// Galeria - Filtros e Modal
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalImage = galleryModal.querySelector('.modal-image');
    const modalTitle = galleryModal.querySelector('.modal-title');
    const modalDescription = galleryModal.querySelector('.modal-description');
    const closeModal = galleryModal.querySelector('.close-modal');
    const prevBtn = galleryModal.querySelector('.prev-btn');
    const nextBtn = galleryModal.querySelector('.next-btn');

    let currentImageIndex = 0;
    let filteredItems = [];

    // Filtros da galeria
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Ativar botão de filtro
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filtrar itens
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Modal da galeria
    function openModal(index) {
        const items = Array.from(document.querySelectorAll('.gallery-item[style*="display: block"]'));
        const item = items[index];
        const img = item.querySelector('img');
        
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalTitle.textContent = item.querySelector('h4').textContent;
        modalDescription.textContent = item.querySelector('p').textContent;
        
        galleryModal.style.display = 'flex';
        currentImageIndex = index;
        filteredItems = items;
    }

    // Event listeners para abrir modal
    document.querySelectorAll('.view-btn').forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const items = Array.from(document.querySelectorAll('.gallery-item[style*="display: block"]'));
            const itemIndex = items.indexOf(this.closest('.gallery-item'));
            openModal(itemIndex);
        });
    });

    // Fechar modal
    closeModal.addEventListener('click', function() {
        galleryModal.style.display = 'none';
    });

    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            galleryModal.style.display = 'none';
        }
    });

    // Navegação do modal
    prevBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
        openModal(currentImageIndex);
    });

    nextBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % filteredItems.length;
        openModal(currentImageIndex);
    });

    // Teclado para navegação do modal
    document.addEventListener('keydown', function(e) {
        if (galleryModal.style.display === 'flex') {
            if (e.key === 'Escape') {
                galleryModal.style.display = 'none';
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
});

// Carrossel de Depoimentos
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.testimonials-slide');
    const prevBtn = document.querySelector('.testimonials-prev');
    const nextBtn = document.querySelector('.testimonials-next');
    const indicators = document.querySelectorAll('.testimonial-indicator');
    const items = document.querySelectorAll('.testimonial-item');
    
    let currentIndex = 0;
    const itemWidth = items[0].offsetWidth + 32; // Largura + gap

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
        // Atualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    // Indicadores clicáveis
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Auto-play (opcional)
    let autoPlay = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }, 5000);

    // Pausar auto-play no hover
    carousel.parentElement.addEventListener('mouseenter', () => {
        clearInterval(autoPlay);
    });

    carousel.parentElement.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        }, 5000);
    });
});