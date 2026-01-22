document.getElementById('formProducto').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const data = {
        nombre: document.getElementById('nombre').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value)
    };

    // Validaciones
    if (!data.nombre || data.precio < 0 || data.stock < 0) {
        return Swal.fire('Error', 'Por favor verifica los datos', 'error');
    }

    // Envia alBackend
    fetch('../Api/Productos.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        if (response.mensaje) {
            Swal.fire({
                title: '¡Guardado!',
                text: 'El producto se agregó correctamente',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Agregar otro',
                cancelButtonText: 'Volver al Inicio'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('formProducto').reset();
                } else {
                    window.location.href = 'index.html';
                }
            });
        } else {
            Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Fallo en la conexión', 'error');
    });
});