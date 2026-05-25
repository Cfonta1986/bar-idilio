// Este archivo obtiene y renderiza el menú desde dos hojas de Google Sheets
async function fetchMenuFromSheets() {
    const sheetId = '1wTR_tsoWs9PyoaO7IJ0wM3iEALFoF591AbMxzHYt9KE';
    // Hoja 1: Cafetería (gid=0)
    // Hoja 2: Promociones (gid=1214247464)
    const urlCafeteria = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=0`;
    const urlPromos = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=1214247464`;
    try {
        // Fetch cafetería y promociones en paralelo
        const [cafRes, promoRes] = await Promise.all([
            fetch(urlCafeteria),
            fetch(urlPromos)
        ]);
        if (!cafRes.ok) {
            console.error('Error al cargar cafetería:', cafRes.status, cafRes.statusText, urlCafeteria);
        }
        if (!promoRes.ok) {
            console.error('Error al cargar promociones:', promoRes.status, promoRes.statusText, urlPromos);
        }
        if (!cafRes.ok || !promoRes.ok) throw new Error('No se pudo obtener el menú');
        const [cafCsv, promoCsv] = await Promise.all([
            cafRes.text(),
            promoRes.text()
        ]);
        // Parse cafetería
        const cafRows = cafCsv.split('\n').map(row => row.split(','));
        const cafItems = cafRows.slice(1).filter(r => r[0] && r[0].trim() !== '');
        // Parse promos
        const promoRows = promoCsv.split('\n').map(row => row.split(','));
        const promoItems = promoRows.slice(1).filter(r => r[0] && r[0].trim() !== '');
        renderMenu(cafItems, promoItems);
    } catch (e) {
        console.error('Error general al cargar el menú:', e);
        document.getElementById('menu-dinamico').innerHTML = '<div class="text-bar-brown text-center py-12">No se pudo cargar el menú dinámico. Por favor, intenta más tarde.</div>';
    }
}

// Función global para renderizar el menú
function renderMenu(cafeteriaItems, promoItems) {
    const container = document.getElementById('menu-dinamico');
    if (!container) return;
    // Parse cafetería
    const cafeteria = cafeteriaItems.map(item => {
        let nombre = (item[0] || '').replace(/^"|"$/g, '').trim();
        let precio = '';
        if ((item[1] && item[2]) && /^\d+$/.test((item[1]||'').replace(/[^\d]/g, '')) && /^\d+$/.test((item[2]||'').replace(/[^\d]/g, ''))) {
            precio = (item[1]||'').replace(/[^\d]/g, '') + (item[2]||'').replace(/[^\d]/g, '');
        } else if (item[1]) {
            precio = (item[1]||'').replace(/^"|"$/g, '').replace(/,/g, '').trim();
        }
        return nombre && precio ? {nombre, precio} : null;
    }).filter(Boolean);
    // Parse promociones (nombre en col 0, precio en col 1)
    const promos = promoItems
        .filter(item => {
            // Filtrar encabezado y filas vacías
            const nombre = (item[0] || '').replace(/^"|"$/g, '').trim().toLowerCase();
            return nombre && nombre !== 'promos';
        })
        .map(item => {
            let nombre = (item[0] || '').replace(/^"|"$/g, '').trim();
            let precio = '';
            if (item[1]) {
                // Mostrar el precio exactamente como viene, solo quitando comillas y espacios
                precio = (item[1]||'').replace(/^"|"$/g, '').trim();
            }
            return nombre && precio ? {nombre, precio} : null;
        })
        .filter(Boolean);

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