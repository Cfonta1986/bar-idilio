// --- Scroll Progress Bar & Header Effects ---
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.querySelector('header');

    if (scrollProgress) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    }

    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});


// --- Active Menu Highlighting on Scroll ---
function highlightActiveMenu() {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('text-bar-gold');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('text-bar-gold');
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', highlightActiveMenu);
// === BAR IDILIO - MODERN VISUAL EFFECTS (PREMIUM & REFINED) ===

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Scroll Animations - Optimized for Performance
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Smooth Hover Effects
function initHoverEffects() {
    document.querySelectorAll('.hover-lift, .hover-lift-subtle').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('hover-lift') 
                ? 'translateY(-8px) scale(1.02)' 
                : 'translateY(-4px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Loading Animation
function initLoadingEffects() {
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        setTimeout(() => {
            initScrollAnimations();
            initParallax();
            initHoverEffects();
        }, 100);
    });
}

// Menú móvil: abrir/cerrar
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const icon = mobileMenuButton.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Cierra el menú móvil al hacer clic en un enlace
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Scroll suave para navegación
const header = document.querySelector('header');
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href?.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target && header) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Lazy loading para imágenes (cuando se agreguen imágenes reales)
const images = document.querySelectorAll('img[data-src]');
if (images.length > 0 && 'IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('loading');
              img.classList.add('loaded');
              imageObserver.unobserve(img);
          }
      });
  });
  images.forEach(img => {
      img.classList.add('loading');
      imageObserver.observe(img);
  });
}



// --- Carrusel y modal de galería: lógica revisada para overlay global y centrado real ---
const galleryImages = [
  "imagenes/idilio cafe y tostadas.jpg",
  "imagenes/idilio cafe y tostadas2.jpg",
  "imagenes/idilio cafe.jpg",
  "imagenes/idilio decoracion.jpg",
  "imagenes/idilio desayuno.jpg",
  "imagenes/idilio frente.jpg",
  "imagenes/idilio interior.jpg",
  "imagenes/idilio mesas.jpg",
  "imagenes/idilio vista.jpg",
  "imagenes/idilio.jpg",
  "imagenes/perrito.JPG",
  "imagenes/frente nuevo.jpg",
  "imagenes/frente lateral.jpg",
  "imagenes/decoracion y cafe.jpg"
];

const modalBg = document.getElementById('gallery-modal-bg');
const modalContent = document.getElementById('gallery-modal-content');
const modalImg = document.getElementById('gallery-modal-img');
const modalClose = document.getElementById('gallery-modal-close');
const modalPrev = document.getElementById('gallery-modal-prev');
const modalNext = document.getElementById('gallery-modal-next');

let currentImgIndex = 0;

function openGalleryModal(index) {
  if (!modalBg || !modalImg) return;
  currentImgIndex = index;
  modalImg.src = galleryImages[currentImgIndex];
  // Mueve el overlay al final del body para asegurar overlay global
  document.body.appendChild(modalBg);
  modalBg.classList.remove('hidden');
  document.body.classList.add('modal-open');
  // Overlay global
  modalBg.style.position = 'fixed';
  modalBg.style.top = '0';
  modalBg.style.left = '0';
  modalBg.style.width = '100vw';
  modalBg.style.height = '100vh';
  modalBg.style.background = 'rgba(0,0,0,0.92)';
  modalBg.style.zIndex = '9999';
  // Centrado absoluto de la imagen
  if (modalImg) {
    modalImg.style.position = 'fixed';
    modalImg.style.top = '50%';
    modalImg.style.left = '50%';
    modalImg.style.transform = 'translate(-50%, -50%)';
    modalImg.style.maxWidth = '96vw';
    modalImg.style.maxHeight = '92vh';
    modalImg.style.objectFit = 'contain';
    modalImg.style.margin = '0';
    modalImg.style.display = 'block';
    modalImg.style.background = '#fff';
    modalImg.style.borderRadius = '1rem';
    modalImg.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
    modalImg.style.zIndex = '10000';
  }
  // Asegura que los controles también estén sobre el overlay
  [modalClose, modalPrev, modalNext].forEach(btn => {
    if (btn) btn.style.zIndex = '10001';
  });
}

function closeGalleryModal() {
  if (!modalBg) return;
  modalBg.classList.add('hidden');
  document.body.classList.remove('modal-open');
  // Limpia estilos inline
  modalBg.style = '';
  if (modalImg) {
    modalImg.style = '';
  }
  [modalClose, modalPrev, modalNext].forEach(btn => {
    if (btn) btn.style = '';
  });
}

function prevGalleryImg() {
  currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
  modalImg.src = galleryImages[currentImgIndex];
}

function nextGalleryImg() {
  currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
  modalImg.src = galleryImages[currentImgIndex];
}

const galleryItems = document.querySelectorAll('.gallery-img');
galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => openGalleryModal(idx));
});

if (modalClose) modalClose.addEventListener('click', closeGalleryModal);
if (modalPrev) modalPrev.addEventListener('click', prevGalleryImg);
if (modalNext) modalNext.addEventListener('click', nextGalleryImg);

// Close modal when clicking overlay
document.getElementById('gallery-modal-bg').addEventListener('click', (e) => {
  if (e.target === modalBg) closeGalleryModal();
});

// Keyboard controls for gallery modal
window.addEventListener('keydown', (e) => {
  if (modalBg.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeGalleryModal();
  if (e.key === 'ArrowLeft') prevGalleryImg();
  if (e.key === 'ArrowRight') nextGalleryImg();
});

// --- Abrir PDF del menú completo en nueva pestaña ---
const openMenuImageBtn = document.getElementById('open-menu-image');
if (openMenuImageBtn) {
  openMenuImageBtn.addEventListener('click', function () {
    window.open('MENU/idilio menu.pdf', '_blank');
  });
}

// Initialize all modern effects
document.addEventListener('DOMContentLoaded', () => {
    initLoadingEffects();
    createBubbles();
    highlightActiveMenu();
});

