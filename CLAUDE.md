# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Descripción General del Proyecto

**Bar Idilio** es un sitio web responsivo para una cafetería en Rosario, Argentina. Es un sitio HTML/CSS/JavaScript estático (sin proceso de construcción) que muestra el menú del café, galería, información de contacto y ambiente. El sitio enfatiza animaciones suaves, responsividad móvil y patrones modernos de UI/UX.

## Arquitectura

El proyecto utiliza una estructura simple y plana:

- **index.html** — Estructura de página principal con secciones para hero, acerca de, menú, galería y contacto
- **main.js** — Interacciones centrales: animaciones de scroll, efectos parallax, menú móvil, modal de galería con controles de teclado, navegación suave
- **menu-dinamico.js** — Obtiene y renderiza el menú dinámicamente desde un documento compartido de Google Sheets
- **styles.css** — CSS personalizado para animaciones, efectos glassmorphism, modal de galería y ajustes específicos para móvil
- **.env** — Variables de entorno para URLs de contacto e información (Facebook, WhatsApp, Maps, teléfono)

## Stack Tecnológico

- **Estilos:** Tailwind CSS (vía CDN) + CSS personalizado
- **Iconos:** Font Awesome 6.4.0 (vía CDN)
- **Tipografía:** Google Fonts (Playfair Display, Inter, Poppins)
- **Fuente de datos:** Google Sheets (items del menú obtenidos vía API de exportación CSV)
- **Incrustaciones:** iframe de Google Maps para ubicación

## Características Clave y Notas de Implementación

### Animaciones y Efectos
- **Animaciones de scroll** — Usa IntersectionObserver para disparar animaciones fadeIn/slideUp/slideLeft en secciones cuando entran en el viewport
- **Efecto parallax** — La imagen de fondo de la sección hero se mueve más lentamente que la velocidad de scroll
- **Burbujas animadas** — Burbujas flotantes generadas aleatoriamente en el fondo del hero
- **Barra de progreso de scroll** — Barra fija en la parte superior que se rellena mientras se scrollea
- **Menú móvil** — Se desliza desde la izquierda en móvil con transiciones suaves
- **Efectos hover** — glassmorphism-card, hover-lift, efectos de escala en galería

### Galería y Modal
- Diseño de grid con 2-4 columnas dependiendo del tamaño de pantalla
- Haz clic en cualquier imagen para abrir modal a pantalla completa con:
  - Imagen centrada sobre overlay oscuro
  - Botones Anterior/Siguiente para navegación de carrusel
  - Botón cerrar (X) en la esquina superior derecha
  - Controles de teclado: Flechas Izquierda/Derecha para navegar, Escape para cerrar
  - Estilos del modal establecidos inline por JavaScript para z-indexing y centrado adecuados

### Menú Dinámico
- Obtiene datos desde Google Sheets usando exportación CSV (dos hojas: Cafetería & Promociones)
- Analiza CSV y renderiza dos columnas (una por categoría)
- Mensaje de error si falla la obtención de datos

### Responsividad Móvil
- Header fijo que se vuelve transparente al hacer scroll
- Botón de alternancia del menú móvil (icono de hamburguesa)
- Los layouts de grid se ajustan: 2 cols → 1 col en móvil
- Los tamaños de texto se reducen en pantallas más pequeñas
- Galería: 4 cols en escritorio → 2 cols en móvil
- Las imágenes usan versiones PNG optimizadas en la carpeta `imagenes2/`

## Cómo Desarrollar

Como este es un sitio estático sin proceso de construcción:

1. **Editar archivos directamente** — Realiza cambios en archivos HTML, CSS o JS en tu editor
2. **Ver localmente** — Abre `index.html` en un navegador (se recomienda usar live server para comportamiento de scroll suave)
3. **Probar responsividad** — Usa DevTools para alternar emulación de dispositivos (móvil, tablet, escritorio)
4. **Actualizar información de contacto** — Edita el archivo `.env` y actualiza valores codificados en HTML donde sea necesario
5. **Actualizar menú** — Edita el documento compartido de Google Sheets (ver `menu-dinamico.js` para el ID de la hoja)
6. **Agregar imágenes** — Coloca imágenes en `imagenes/` (originales) e `imagenes2/` (PNGs optimizados)

## Tareas Comunes

### Agregar una nueva sección
1. Añade un nuevo `<section id="section-id">` en `index.html`
2. Enlázalo en la navegación (header y footer)
3. Añade animación de scroll envolviendo elementos con la clase `scroll-animate`
4. Estiliza usando clases de Tailwind; añade CSS personalizado a `styles.css` si es necesario

### Modificar items del menú
- Edita la Google Sheets compartida con ID `1wTR_tsoWs9PyoaO7IJ0wM3iEALFoF591AbMxzHYt9KE`
- Dos hojas: gid=0 (Cafetería), gid=1214247464 (Promociones)
- El menú se carga automáticamente al cargar la página

### Actualizar colores y fuentes
- Paleta de colores de café definida en la configuración de Tailwind en el `<head>` de index.html:
  - `coffee-brown`, `coffee-light`, `coffee-cream`, `coffee-gold`, `coffee-dark`
- Fuentes: Playfair Display (serif), Inter (sans), Poppins (modern)
- Ajusta en el bloque `tailwind.config` o crea reglas CSS en `styles.css`

### Agregar imágenes a la galería
1. Guarda imágenes de alta resolución en la carpeta `imagenes/`
2. Crea versiones PNG optimizadas en la carpeta `imagenes2/`
3. Añade elemento de imagen en el grid de galería con:
   - `class="gallery-img"` (requerido para manejador de clic)
   - `data-img="imagenes/filename.jpg"` (versión de alta resolución)
   - `<img src="imagenes2/filename.png">` (miniatura)

## Notas y Patrones

- **Imágenes:** Carga perezosa vía atributo `loading="lazy"`
- **Accesibilidad:** Etiquetas ARIA en botones; estructura HTML semántica
- **Rendimiento:** Backdrop-filter, scale/transform en lugar de cambios de layout; animaciones CSS sobre JS cuando sea posible
- **Móvil:** Siempre prueba en dispositivo real o emulación de DevTools; presta atención a tamaños de botones amigables con táctil (mín 44x44px)
- **Delays de animación:** Usa clases de Tailwind `animation-delay-*` o inline `style="animation-delay: Xms"`
- **Comportamiento de scroll:** `html { scroll-behavior: smooth; }` en CSS maneja el scrolling suave para enlaces de anclaje
- **Header fijo:** El header permanece fijo con z-index 50; ajusta si agregas overlays
- **Modal z-index:** Modal de galería usa z-index 9999+ para superponer todo

## Despliegue

Este es un sitio estático—simplemente carga todos los archivos en un servidor web. No se necesita paso de construcción. Todas las dependencias se cargan vía CDN, por lo que se requiere conectividad a internet para que se muestren fuentes, iconos y mapas.
