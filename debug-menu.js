// Utilidad para debug: mostrar el array de items tal como lo recibe JS
async function fetchMenuFromSheet() {
    const sheetId = '1wTR_tsoWs9PyoaO7IJ0wM3iEALFoF591AbMxzHYt9KE';
    const gid = '0';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudo obtener el menú');
        const csv = await response.text();
        const rows = csv.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const items = rows.slice(1).filter(r => r.length > 1 && r[0].trim() !== '');
        console.log('DEBUG items:', items); // <-- Esto mostrará los valores crudos
        renderMenu(items);
    } catch (e) {
        document.getElementById('menu-dinamico').innerHTML = '<div class="text-red-600">No se pudo cargar el menú dinámico.</div>';
    }
}

document.addEventListener('DOMContentLoaded', fetchMenuFromSheet);