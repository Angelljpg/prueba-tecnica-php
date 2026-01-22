// Cargar productos
document.addEventListener('DOMContentLoaded', cargarProductos);

function cargarProductos() {
  const tabla = document.getElementById('tablaProductos');
  
  tabla.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>';
  
  fetch('../Api/Productos.php')
    .then(res => res.json())
    .then(data => {
      tabla.innerHTML = '';
      
      if (!data || data.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay productos</td></tr>';
        return;
      }
      
      data.forEach(p => {
        const fila = document.createElement('tr');
        // Preparamos los datos para enviarlos a la función de editar
        const datosJson = JSON.stringify(p).replace(/"/g, '&quot;');
        
        fila.innerHTML = `
          <td>${p.nombre}</td>
          <td>$${parseFloat(p.precio).toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>
            <span class="badge ${p.estatus === 'activo' || p.estatus === 'disponible' ? 'bg-success' : 'bg-danger'}">
              ${p.estatus}
            </span>
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-warning me-2" onclick="abrirEditor(${datosJson})">
              ✏️
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.id})">
              🗑️
            </button>
          </td>
        `;
        tabla.appendChild(fila);
      });
    })
    .catch(error => console.error('Error:', error));
}

// Borrar
function eliminarProducto(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esto",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`../Api/Productos.php?id=${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
          cargarProductos(); // Recargar la tabla
        });
    }
  });
}

//FUNCIÓN PARA EDITAR (PUT)
function abrirEditor(producto) {
  Swal.fire({
    title: 'Editar Producto',
    html: `
      <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">
      <input id="swal-precio" type="number" class="swal2-input" placeholder="Precio" value="${producto.precio}">
      <input id="swal-stock" type="number" class="swal2-input" placeholder="Stock" value="${producto.stock}">
      <select id="swal-estatus" class="swal2-input">
        <option value="disponible" ${producto.estatus === 'disponible' ? 'selected' : ''}>Disponible</option>
        <option value="agotado" ${producto.estatus === 'agotado' ? 'selected' : ''}>Agotado</option>
      </select>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar Cambios',
    preConfirm: () => {
      return {
        nombre: document.getElementById('swal-nombre').value,
        precio: document.getElementById('swal-precio').value,
        stock: document.getElementById('swal-stock').value,
        estatus: document.getElementById('swal-estatus').value
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      actualizarProducto(producto.id, result.value);
    }
  });
}

function actualizarProducto(id, datos) {
  fetch(`../Api/Productos.php?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    Swal.fire('¡Actualizado!', 'El producto se actualizó correctamente', 'success');
    cargarProductos();
  })
  .catch(err => Swal.fire('Error', 'No se pudo actualizar', 'error'));
}