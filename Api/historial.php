<?php
require '../config/db.php';
header("Content-Type: application/json");

// Si se pide inforcmación de una venta 
if (isset($_GET['id'])) {
    $stmt = $pdo->prepare("
        SELECT p.nombre, dv.cantidad, dv.subtotal, p.precio 
        FROM detalle_ventas dv
        JOIN productos p ON dv.producto_id = p.id
        WHERE dv.venta_id = ?
    ");
    $stmt->execute([$_GET['id']]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
// Si no se completa se regresa a la lista
else {
    $stmt = $pdo->query("SELECT * FROM ventas ORDER BY fecha DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
?>