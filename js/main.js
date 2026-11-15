// ===============================================
// SIMULADOR DE CARRITO - UMMA PETS (catalogo-completo.html)
// ===============================================

// ---------- CLASE ----------
// Define cómo es cada producto de la tienda.
class Producto {
    constructor(id, nombre, categoria, precio, stock, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
    }

    // Informa si hay stock suficiente (devuelve true o false).
    hayStock(cantidad) {
        return this.stock >= cantidad;
    }

    // Modifica el estado del objeto: resta stock al vender.
    vender(cantidad) {
        this.stock = this.stock - cantidad;
    }

    // Devuelve un texto con los datos del producto.
    informar() {
        return this.id + ". " + this.nombre + " - $" + this.precio + " (stock: " + this.stock + ")";
    }
}

// ---------- DATOS ----------
// Array de objetos: nuestra "base de datos".
// IMPORTANTE: precios y stock son de ejemplo.
const productos = [
    new Producto(1, "maintenance criadores", "alimentos", 25000, 10, "comida-perros/maintenance-criadores-perro.JPG"),
    new Producto(2, "pedigree", "alimentos", 22000, 10, "comida-perros/pedigree-adulto-perro.JPG"),
    new Producto(3, "purina proplan", "alimentos", 30000, 8, "comida-perros/purina-proplan-perro.JPG"),
    new Producto(4, "royal canin puppy", "alimentos", 35000, 6, "comida-perros/royalcanin-puppy-perro.JPG"),
    new Producto(5, "catpro", "alimentos", 18000, 10, "comida-gatos/catpro-gato.JPG"),
    new Producto(6, "purina gato", "alimentos", 20000, 10, "comida-gatos/purina-gato.JPG"),
    new Producto(7, "raza gato", "alimentos", 15000, 10, "comida-gatos/raza-gato.JPG"),
    new Producto(8, "whiskas", "alimentos", 19000, 10, "comida-gatos/whiskas-gato.JPG"),
    new Producto(9, "pechera", "accesorios", 8000, 15, "accesorios/pechera-perro.JPG"),
    new Producto(10, "cepillo", "accesorios", 5000, 15, "accesorios/cepillo-pelos.JPG"),
    new Producto(11, "collar universal", "accesorios", 4500, 20, "accesorios/collar-universal.JPG"),
    new Producto(12, "collar gato", "accesorios", 3500, 20, "accesorios/collar-gato.JPG"),
    new Producto(13, "plato basico", "accesorios", 3000, 20, "accesorios/plato-comida-basico.JPG"),
    new Producto(14, "cucha piel premium", "accesorios", 60000, 5, "accesorios/cucha-piel-premium.JPG"),
    new Producto(15, "cucha premium", "accesorios", 55000, 5, "accesorios/cucha-2.JPG"),
    new Producto(16, "ruedita gato", "accesorios", 6000, 12, "accesorios/ruedita-juguete-gato.JPG")
];

// ---------- FUNCIÓN FLECHA ----------
const aplicarDescuento = (total, porcentaje) => total - (total * porcentaje) / 100;

// ---------- PERSISTENCIA (localStorage) ----------
function leerStorage(clave, valorInicial) {
    try {
        return JSON.parse(localStorage.getItem(clave)) ?? valorInicial;
    } catch (error) {
        return valorInicial;
    }
}

// Recupera el stock guardado y se lo asigna a cada producto.
const stockGuardado = leerStorage("umma_stock", {});
productos.forEach(producto => {
    producto.stock = stockGuardado[producto.id] ?? producto.stock;
});

// ---------- PROCESAMIENTO ----------
function buscarProducto(nombre) {
    return productos.find(producto => producto.nombre === nombre);
}

function calcularTotal(carrito) {
    let total = 0;
    for (const nombre of carrito) {
        total += buscarProducto(nombre)?.precio ?? 0;
    }
    return total;
}

function calcularPorcentaje(total) {
    if (total > 100000) {
        return 10;
    } else if (total > 50000) {
        return 5;
    } else {
        return 0;
    }
}

// ===============================================
// PARTE DOM: la tienda se muestra en la página
// ===============================================

// ---------- SELECCIÓN DE ELEMENTOS ----------
const listaProductos = document.querySelector("#lista-productos");
const listaCarrito = document.querySelector("#lista-carrito");
const resumenCarrito = document.querySelector("#resumen-carrito");
const cajaMensaje = document.querySelector("#mensaje");
const botonesFiltro = document.querySelectorAll(".filtro");

// ---------- ESTADO ----------
const carritoWeb = leerStorage("umma_carrito", []); // nombres de los productos del carrito (recuperados del localStorage)
let categoriaActual = "todos"; // filtro de categoría seleccionado
let textoBusqueda = "";        // texto escrito en el buscador
let temporizadorMensaje;       // para ocultar el mensaje después de unos segundos

// ---------- GUARDADO ----------
// Guarda el carrito y el stock actual en el localStorage.
function guardarDatos() {
    const stockPorId = {};
    productos.forEach(producto => {
        stockPorId[producto.id] = producto.stock;
    });
    localStorage.setItem("umma_carrito", JSON.stringify(carritoWeb));
    localStorage.setItem("umma_stock", JSON.stringify(stockPorId));
}

// ---------- FEEDBACK VISUAL ----------
// Muestra un mensaje en la página. tipo puede ser "exito" o "error" (cambia el color).
function mostrarMensaje(texto, tipo) {
    cajaMensaje.textContent = texto;
    cajaMensaje.className = "mensaje mensaje--" + tipo;
    clearTimeout(temporizadorMensaje);
    temporizadorMensaje = setTimeout(() => {
        cajaMensaje.textContent = "";
        cajaMensaje.className = "mensaje";
    }, 3000);
}

// ---------- RENDERIZADO DINÁMICO ----------
function renderizarProductos(lista) {
    if (lista.length === 0) {
        listaProductos.innerHTML = `<p class="vacio">No se encontraron productos.</p>`;
        return;
    }
    listaProductos.innerHTML = lista.map(({ id, nombre, precio, stock, imagen }) => `
        <article class="tarjeta">
            <img src="../img/${imagen}" alt="${nombre}" loading="lazy">
            <h3 class="tarjeta__nombre">${nombre}</h3>
            <p>$${precio.toLocaleString("es-AR")}</p>
            <p class="tarjeta__stock">${stock > 0 ? "Stock: " + stock : "Sin stock"}</p>
            <button class="boton boton--agregar" data-id="${id}" ${stock === 0 ? "disabled" : ""}>Agregar al carrito</button>
        </article>
    `).join("");
}

function renderizarCarrito() {
    if (carritoWeb.length === 0) {
        listaCarrito.innerHTML = `<li class="vacio">Tu carrito está vacío.</li>`;
        resumenCarrito.innerHTML = "";
        return;
    }
    const cantidades = {};
    carritoWeb.forEach(nombre => {
        cantidades[nombre] = (cantidades[nombre] ?? 0) + 1;
    });
    listaCarrito.innerHTML = Object.entries(cantidades).map(([nombre, cantidad]) => `
        <li class="carrito__item">
            <span class="tarjeta__nombre">${nombre}${cantidad > 1 ? " x" + cantidad : ""}</span>
            <span>$${((buscarProducto(nombre)?.precio ?? 0) * cantidad).toLocaleString("es-AR")}</span>
            <button class="carrito__quitar" data-nombre="${nombre}" aria-label="Quitar una unidad de ${nombre}">✕</button>
        </li>
    `).join("");
    const total = calcularTotal(carritoWeb);
    const porcentaje = calcularPorcentaje(total);
    const totalFinal = aplicarDescuento(total, porcentaje);
    resumenCarrito.innerHTML = `
        <p>Subtotal: $${total.toLocaleString("es-AR")}</p>
        <p>Descuento: ${porcentaje}%</p>
        <p class="carrito__total">Total: $${totalFinal.toLocaleString("es-AR")}</p>
    `;
}

function aplicarFiltros() {
    const filtrados = productos.filter(producto =>
        (categoriaActual === "todos" || producto.categoria === categoriaActual) &&
        producto.nombre.includes(textoBusqueda)
    );
    renderizarProductos(filtrados);
}

// ---------- ACCIONES DEL CARRITO ----------
// Cada acción sigue los mismos 3 pasos: 1) actualizar el array, 2) guardar en localStorage, 3) renderizar.
function agregarAlCarritoWeb(id) {
    const producto = productos.find(item => item.id === id);
    const unidadesEnCarrito = carritoWeb.filter(nombre => nombre === producto.nombre).length;
    if (producto.hayStock(unidadesEnCarrito + 1)) {
        carritoWeb.push(producto.nombre);   // 1) actualizar el array
        guardarDatos();                     // 2) guardar
        renderizarCarrito();                // 3) renderizar
        mostrarMensaje("Agregaste " + producto.nombre + " al carrito.", "exito");
    } else {
        mostrarMensaje("No hay más stock de " + producto.nombre + ".", "error");
    }
}

function quitarDelCarritoWeb(nombre) {
    const indice = carritoWeb.indexOf(nombre);
    carritoWeb.splice(indice, 1);
    guardarDatos();
    renderizarCarrito();
    mostrarMensaje("Quitaste " + nombre + " del carrito.", "exito");
}

function vaciarCarritoWeb() {
    if (carritoWeb.length === 0) {
        mostrarMensaje("El carrito ya está vacío.", "error");
        return;
    }
    while (carritoWeb.length > 0) {
        carritoWeb.pop();
    }
    guardarDatos();
    renderizarCarrito();
    mostrarMensaje("Vaciaste el carrito.", "exito");
}

// Función que se ejecuta al hacer click en "Finalizar compra".
function comprarWeb() {
    try {
        procesarCompra();
    } catch (error) {
        mostrarMensaje("Error al finalizar la compra: " + error.message, "error");
    }
}

// Hace la compra: calcula el total, descuenta stock y vacía el carrito.
function procesarCompra() {
    if (carritoWeb.length === 0) {
        mostrarMensaje("Agregá productos antes de comprar.", "error");
        return;
    }
    const total = calcularTotal(carritoWeb);
    const totalFinal = aplicarDescuento(total, calcularPorcentaje(total));
    const cantidad = carritoWeb.length;
    const textoCantidad = cantidad === 1 ? "producto" : "productos";

    carritoWeb.forEach(nombre => buscarProducto(nombre)?.vender(1));
    while (carritoWeb.length > 0) {
        carritoWeb.pop();
    }
    guardarDatos();
    renderizarCarrito();
    aplicarFiltros();
    resumenCarrito.innerHTML = `
        <p class="carrito__total">¡Compra realizada!</p>
        <p>Total pagado: $${totalFinal.toLocaleString("es-AR")}</p>
    `;
    mostrarMensaje("¡Compra realizada! " + cantidad + " " + textoCantidad + ". Total pagado: $" + totalFinal.toLocaleString("es-AR"), "exito");
}

// ---------- EVENTOS ----------
document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button");
    if (boton === null) {
        return;
    }
    const { id, dataset, classList } = boton;

    if (classList.contains("boton--agregar")) {
        agregarAlCarritoWeb(parseInt(dataset.id));
    } else if (classList.contains("carrito__quitar")) {
        quitarDelCarritoWeb(dataset.nombre);
    } else if (classList.contains("filtro")) {
        categoriaActual = dataset.categoria;
        botonesFiltro.forEach(otro => otro.classList.remove("filtro--activo"));
        classList.add("filtro--activo");
        aplicarFiltros();
    } else if (id === "boton-comprar") {
        comprarWeb();
    } else if (id === "boton-vaciar") {
        vaciarCarritoWeb();
    }
});

document.addEventListener("input", (evento) => {
    if (evento.target.id === "buscador") {
        textoBusqueda = evento.target.value.trim().toLowerCase();
        aplicarFiltros();
    }
});

document.addEventListener("keydown", (evento) => {
    if (evento.target.id === "buscador" && evento.key === "Escape") {
        evento.target.value = "";
        textoBusqueda = "";
        aplicarFiltros();
    }
});

// ---------- INICIO ----------
aplicarFiltros();
renderizarCarrito();