# 🛒 Prueba Técnica – Sistema de Productos y Ventas (PHP + JS)

Este proyecto fue desarrollado como **prueba técnica**, con el objetivo de demostrar el uso de **PHP y MySQL en el backend** y **JavaScript en el frontend**, consumiendo datos de forma dinámica sin recargar la página.

El sistema permite **gestionar productos**, **registrar ventas** y **consultar el historial**, aplicando validaciones de stock y buenas prácticas como el uso de transacciones en base de datos.

---

## 🧰 Tecnologías utilizadas

* PHP (PDO)
* MySQL
* JavaScript (Fetch API)
* HTML5 y CSS3
* Servidor local con XAMPP

---

## 📂 Estructura del proyecto

```
PRUEBA-TECNICA/
│
├── Api/
│   ├── Productos.php
│   ├── ventas.php
│   └── historial.php
│
├── config/
│   └── db.php
│
├── database/
│   └── database.sql
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── productos.js
│   │   ├── ventas.js
│   │   └── nuevo_producto.js
│   │
│   ├── index.html
│   ├── ventas.html
│   ├── historial.html
│   └── nuevo_producto.html
│
└── README.md
```

---

## 🗄️ Base de datos

El script de la base de datos se encuentra en:

```
database/database.sql
```

Incluye:

* Tabla de **productos**
* Tabla de **ventas**
* Tabla de **detalle de ventas**
* Datos de prueba listos para usar

---

## ⚙️ Funcionalidades principales

### 📦 Productos

* Listado dinámico de productos
* Alta de nuevos productos
* Actualización automática del estatus según el stock
* Consumo de datos desde PHP usando Fetch API

### 🧾 Ventas

* Registro de ventas con uno o varios productos
* Validación de stock antes de realizar la venta
* Descuento automático de stock
* Actualización de estatus a *agotado* cuando el stock llega a 0
* Uso de transacciones para evitar inconsistencias

### 📊 Historial

* Consulta del historial de ventas
* Visualización de los productos vendidos por cada venta

---

## 🚀 Cómo ejecutar el proyecto

1. Instalar **XAMPP**
2. Iniciar **Apache** y **MySQL**
3. Copiar el proyecto en:

   ```
   htdocs/PRUEBA-TECNICA
   ```
4. Importar el archivo `database.sql` en phpMyAdmin
5. Abrir en el navegador:

   ```
   http://localhost/PRUEBA-TECNICA/public/index.html
   ```

---

## 🔗 Endpoints utilizados

* **Productos**

  ```
  GET /Api/Productos.php
  ```

* **Registrar venta**

  ```
  POST /Api/ventas.php
  ```

* **Historial**

  ```
  GET /Api/historial.php
  ```

---

## ✅ Buenas prácticas aplicadas

* Uso de PDO para conexión segura a MySQL
* Respuestas en formato JSON
* Validación de stock en backend
* Separación de frontend y backend
* Código organizado por carpetas

---

## 👤 Autor

**Angel Axel Herrera Sánchez**
Desarrollador Jr. enfocado en Frontend y Backend de este pequeño
Proyecto realizado con fines de evaluación técnica y aprendizaje.

---

## 📝 Notas finales

Este proyecto puede escalarse fácilmente agregando:

* Autenticación de usuarios
* Edición y eliminación de productos
* Mejora visual con Bootstrap o SweetAlert
* Despliegue en servidor remoto

