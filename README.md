# Umma Pets - Catálogo completo (Entrega 8)

Sitio de una tienda de mascotas. En la página **Catálogo completo** se puede buscar productos, filtrarlos por categoría y armar un carrito de compras que se guarda aunque se refresque la página.

## Cómo usar la página

1. **Buscar:** escribí en el buscador y los productos se filtran mientras escribís. Con la tecla `Esc` se borra la búsqueda.
2. **Filtrar:** los botones *Todos*, *Alimentos* y *Accesorios* muestran solo esa categoría.
3. **Agregar al carrito:** botón *Agregar al carrito* en cada producto. Si agregás el mismo producto más de una vez, aparece una sola línea con la cantidad (por ejemplo, "Purina Proplan x2").
4. **Quitar:** el botón ✕ del carrito quita una unidad del producto.
5. **Vaciar carrito:** quita todos los productos.
6. **Finalizar compra:** calcula el total, descuenta el stock y vacía el carrito.

## Qué se agregó en esta entrega (JavaScript)

### 1. Persistencia con `localStorage`
El carrito y el stock se guardan en el navegador con las claves `umma_carrito` y `umma_stock`. Al refrescar la página, los datos se recuperan y no se pierden.

### 2. Sincronización en cada cambio
Cada vez que se agrega o se quita un producto (y también al vaciar o comprar) se hacen siempre tres pasos:

1. Se actualiza el array de JavaScript.
2. Se guarda en `localStorage` con `JSON.stringify` (función `guardarDatos`).
3. Se vuelve a renderizar la vista.

Para leer los datos guardados se usa `JSON.parse` (función `leerStorage`).

### 3. Operadores avanzados
- **Ternario (`? :`):** en `procesarCompra`, para escribir "producto" o "productos" según la cantidad comprada.
- **`??` (valor por defecto):** en `leerStorage` y al cargar el stock, para cuando todavía no hay nada guardado.
- **`?.` (encadenamiento opcional):** en `calcularTotal` y en `renderizarCarrito`, para no romper si un producto guardado ya no existe.

### 4. Destructuring
- En `renderizarProductos`: `({ id, nombre, precio, stock, imagen })`.
- En `renderizarCarrito`: `([nombre, cantidad])`.
- En el evento click: `const { id, dataset, classList } = boton`.

## Reiniciar los datos guardados

Si querés volver al stock y al carrito originales:

1. Abrí la página y apretá `F12` (en Mac: `Cmd + Option + I`).
2. Andá a la pestaña **Application**, y dentro de **Local storage** elegí la dirección de la página.
3. Borrá las claves `umma_stock` y `umma_carrito`.
4. Refrescá la página.