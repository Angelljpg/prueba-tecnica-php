let carrito = [];
let productosDisponibles = [];


document.addEventListener('DOMContentLoaded', () => {
    cargarSelectProductos();
});

function cargarSelectProductos() {
    fetch('../Api/Productos.php')
        .then(res => res.json())
        .then(data => {
            productosDisponibles = data;
            const select = document.getElementById('selectProducto');
            select.innerHTML = '';
            
           
            data.forEach(p => {
                if (p.stock > 0 && p.estatus !== 'agotado') {
                    select.innerHTML += `<option value="${p.id}">${p.nombre} - $${p.precio} (Disp: ${p.stock})</option>`;
                }
            });
            
            if(select.innerHTML === '') {
                 select.innerHTML = '<option>No hay productos disponibles</option>';
            }
        });
}

function agregarAlCarrito() {
    const idProducto = document.getElementById('selectProducto').value;
    const cantidad = parseInt(document.getElementById('inputCantidad').value);
    


    
    const productoInfo = productosDisponibles.find(p => p.id == idProducto);

    if (!productoInfo) return Swal.fire('Error', 'Selecciona un producto válido', 'error');
    

    if (cantidad > productoInfo.stock) {
        return Swal.fire('Stock Insuficiente', `Solo quedan ${productoInfo.stock} unidades de ${productoInfo.nombre}`, 'warning');
    }

    const existe = carrito.find(item => item.id == idProducto);
    
    if (existe) {
        if (existe.cantidad + cantidad > productoInfo.stock) {
            return Swal.fire('Tope Alcanzado', 'No puedes agregar más de lo que hay en stock', 'warning');
        }
        existe.cantidad += cantidad;
    } else {
        carrito.push({
            id: idProducto,
            nombre: productoInfo.nombre,
            precio: parseFloat(productoInfo.precio),
            cantidad: cantidad
        });
    }

    renderizarCarrito();
}

function renderizarCarrito() {
    const tabla = document.getElementById('tablaCarrito');
    const totalSpan = document.getElementById('totalVenta');
    tabla.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        tabla.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">X</button></td>
            </tr>
        `;
    });

    totalSpan.innerText = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    renderizarCarrito();
}

function finalizarVenta() {
    if (carrito.length === 0) return Swal.fire('Carrito vacío', 'Agrega productos antes de vender', 'warning');

    fetch('../Api/ventas.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productos: carrito })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Swal.fire('¡Venta Exitosa!', 'Inventario actualizado correctamente', 'success').then(() => {
                carrito = [];
                renderizarCarrito();
                cargarSelectProductos(); // Recargar stocks en el select para que se actualicen
            });
        } else {
            Swal.fire('Error', data.error || 'Ocurrió un error al procesar la venta', 'error');
        }
    })
    .catch(err => console.error(err));
}