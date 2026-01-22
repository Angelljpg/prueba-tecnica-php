<?php
require '../config/db.php';
header("Content-Type: application/json; charset=UTF-8");

$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    case 'GET': 
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM productos WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } else {
            $stmt = $pdo->query("SELECT * FROM productos");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("INSERT INTO productos (nombre, precio, stock, estatus) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['nombre'], $data['precio'], $data['stock'], 'disponible']);
        echo json_encode(["id" => $pdo->lastInsertId(), "mensaje" => "Producto creado"]);
        break;

    case 'PUT': 
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("UPDATE productos SET nombre=?, precio=?, stock=?, estatus=? WHERE id=?");
        $stmt->execute([$data['nombre'], $data['precio'], $data['stock'], $data['estatus'], $_GET['id']]);
        echo json_encode(["mensaje" => "Producto actualizado"]);
        break;

    case 'DELETE': 
        $stmt = $pdo->prepare("DELETE FROM productos WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        echo json_encode(["mensaje" => "Producto eliminado"]);
        break;
}
?>