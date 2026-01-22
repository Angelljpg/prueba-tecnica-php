<?php
require '../config/db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

try {
    $pdo->beginTransaction();

    // nos ayuda a calcular el total de la venta
    $total = 0;
    foreach ($data['productos'] as $p) {
        $total += $p['precio'] * $p['cantidad'];
    }

    // nos registra la venta
    $stmtVenta = $pdo->prepare("INSERT INTO ventas (total) VALUES (?)");
    $stmtVenta->execute([$total]);
    $ventaId = $pdo->lastInsertId();

    // procesa los productos que tenemos en el inventario
    foreach ($data['productos'] as $p) {

        // un validor de la mercancia 
        $stmtValidar = $pdo->prepare("SELECT stock FROM productos WHERE id = ?");
        $stmtValidar->execute([$p['id']]);
        $producto = $stmtValidar->fetch(PDO::FETCH_ASSOC);

        if (!$producto || $producto['stock'] < $p['cantidad']) {
            throw new Exception("Stock insuficiente para el producto ID: " . $p['id']);
        }

        // se regustra la venta
        $subtotal = $p['precio'] * $p['cantidad'];
        $stmtDetalle = $pdo->prepare(
            "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, subtotal)
             VALUES (?, ?, ?, ?)"
        );
        $stmtDetalle->execute([$ventaId, $p['id'], $p['cantidad'], $subtotal]);

        // se Actaliza el stock 
        $stmtUpdate = $pdo->prepare(
            "UPDATE productos
             SET stock = stock - ?,
                 estatus = IF(stock - ? <= 0, 'agotado', 'disponible')
             WHERE id = ?"
        );
        $stmtUpdate->execute([$p['cantidad'], $p['cantidad'], $p['id']]);
    }

    //con esto podemos confirmar los vambios 
    $pdo->commit();

    echo json_encode([
        "success" => true,
        "mensaje" => "Venta registrada correctamente"
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
