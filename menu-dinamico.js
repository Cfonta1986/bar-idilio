// Este archivo obtiene y renderiza el menú desde dos hojas de Google Sheets
const SHEET_ID = '1wTR_tsoWs9PyoaO7IJ0wM3iEALFoF591AbMxzHYt9KE';
// Hoja 1: Cafetería (gid=0) - Hoja 2: Promociones (gid=1214247464)
// Se usa /export?format=csv (y no gviz) porque gviz detecta tipos de columna y
// puede fusionar filas en una sola celda si la hoja tiene formatos mezclados.
const sheetUrl = gid => `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;

// Parser CSV completo: respeta comillas, comas y saltos de línea dentro de celdas
function parseCSV(text) {
    const rows = [];
    let row = [], cell = '', inQuotes = false;
    text = text.replace(/^\uFEFF/, '');
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { cell += '"'; i++; }
                else inQuotes = false;
            } else cell += c;
        } else if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(cell); cell = ''; }
        else if (c === '\n' || c === '\r') {
            if (c === '\r' && text[i + 1] === '\n') i++;
            row.push(cell); cell = '';
            rows.push(row); row = [];
        } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
}

// Convierte filas CSV en [{nombre, precio}], tolerando columnas extra/vacías,
// encabezados y precios con símbolos ($, puntos, comas, espacios)
function extractItems(rows, headerNames) {
    return rows.map(r => {
        const cells = r.map(c => (c || '').trim());
        const nombre = cells[0];
        if (!nombre || headerNames.includes(nombre.toLowerCase())) return null;
        const precioCelda = cells.slice(1).find(c => /\d/.test(c));
        if (!precioCelda) return null;
        const precio = precioCelda.replace(/[^\d]/g, '');
        return precio ? { nombre, precio } : null;
    }).filter(Boolean);
}

async function fetchMenuFromSheets() {
    try {
        const [cafRes, promoRes] = await Promise.all([
            fetch(sheetUrl(0)),
            fetch(sheetUrl(1214247464))
        ]);
        if (!cafRes.ok) console.error('Error al cargar cafetería:', cafRes.status, cafRes.statusText);
        if (!promoRes.ok) console.error('Error al cargar promociones:', promoRes.status, promoRes.statusText);
        if (!cafRes.ok || !promoRes.ok) throw new Error('No se pudo obtener el menú');
        const [cafCsv, promoCsv] = await Promise.all([cafRes.text(), promoRes.text()]);
        const headers = ['cafeteria', 'cafetería', 'promos', 'promociones', 'precio'];
        renderMenu(
            extractItems(parseCSV(cafCsv), headers),
            extractItems(parseCSV(promoCsv), headers)
        );
    } catch (e) {
        console.error('Error general al cargar el menú:', e);
        document.getElementById('menu-dinamico').innerHTML = '<div class="text-bar-brown text-center py-12">No se pudo cargar el menú dinámico. Por favor, intenta más tarde.</div>';
    }
}

// Función global para renderizar el menú
function renderMenu(cafeteria, promos) {
    const container = document.getElementById('menu-dinamico');
    if (!container) return;

    let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-bar-cream rounded-xl border border-bar-brown border-opacity-10 p-8 md:p-10 shadow-sm">
            <div class="flex items-center mb-8">
                <div class="w-10 h-10 bg-bar-deep rounded-full flex items-center justify-center mr-4">
                    <i class="fas fa-coffee text-bar-gold text-lg"></i>
                </div>
                <h3 class="text-3xl font-display font-bold text-bar-deep">Cafetería</h3>
            </div>
            <div class="space-y-0">
                ${cafeteria.map(item => `
                <div class="menu-item flex justify-between items-center py-4 px-0">
                    <div class="text-bar-deep font-medium text-lg">${item.nombre}</div>
                    <div class="text-bar-brown font-semibold text-lg text-right ml-4">$${item.precio}</div>
                </div>`).join('')}
            </div>
        </div>
        <div class="bg-bar-cream rounded-xl border border-bar-brown border-opacity-10 p-8 md:p-10 shadow-sm">
            <div class="flex items-center mb-8">
                <div class="w-10 h-10 bg-bar-deep rounded-full flex items-center justify-center mr-4">
                    <i class="fas fa-star text-bar-gold text-lg"></i>
                </div>
                <h3 class="text-3xl font-display font-bold text-bar-deep">Promociones</h3>
            </div>
            <div class="space-y-0">
                ${promos.map(item => `
                <div class="menu-item flex justify-between items-center py-4 px-0">
                    <div class="text-bar-deep font-medium text-lg">${item.nombre}</div>
                    <div class="text-bar-brown font-semibold text-lg text-right ml-4">$${item.precio}</div>
                </div>`).join('')}
            </div>
        </div>
    </div>`;
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', fetchMenuFromSheets);