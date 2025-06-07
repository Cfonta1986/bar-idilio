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

// Cambia el fondo del header al hacer scroll
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('bg-opacity-95');
            header.classList.add('backdrop-blur-sm');
        } else {
            header.classList.remove('bg-opacity-95');
            header.classList.remove('backdrop-blur-sm');
        }
    });
}

// Animación al hacer scroll en las secciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observa las secciones para animación
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

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
  "imagenes/idilio.jpg"
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

// Refactor SonarLint S2589: eliminamos if redundante, ya que modalBg ya está comprobado arriba
document.getElementById('gallery-modal-bg').addEventListener('click', (e) => {
  if (e.target === modalBg) closeGalleryModal();
});

window.addEventListener('keydown', (e) => {
  // Refactor SonarLint S2589: solo comprobamos modalBg, ya que getElementById nunca retorna null para el mismo id dos veces en el mismo scope
  if (modalBg.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeGalleryModal();
  if (e.key === 'ArrowLeft') prevGalleryImg();
  if (e.key === 'ArrowRight') nextGalleryImg();
});

// --- Mostrar imagen de menú completo en el modal ---
const openMenuImageBtn = document.getElementById('open-menu-image');
if (openMenuImageBtn && modalBg && modalImg) {
  openMenuImageBtn.addEventListener('click', function () {
    modalImg.src = 'imagenes/idilio menu.jpg';
    document.body.appendChild(modalBg);
    modalBg.classList.remove('hidden');
    document.body.classList.add('modal-open');
    modalBg.style.position = 'fixed';
    modalBg.style.top = '0';
    modalBg.style.left = '0';
    modalBg.style.width = '100vw';
    modalBg.style.height = '100vh';
    modalBg.style.background = 'rgba(0,0,0,0.92)';
    modalBg.style.zIndex = '9999';
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
    if (modalPrev) modalPrev.style.display = 'none';
    if (modalNext) modalNext.style.display = 'none';
    [modalClose, modalPrev, modalNext].forEach(btn => {
      if (btn) btn.style.zIndex = '10001';
    });
  });
  if (modalClose) {
    modalClose.addEventListener('click', function () {
      if (modalPrev) modalPrev.style.display = '';
      if (modalNext) modalNext.style.display = '';
    });
  }
}