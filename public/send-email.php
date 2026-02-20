<?php

session_start();
header('Content-Type: application/json');

require_once 'validation-helper.php';

$recipient_email = 'kontakt@frederik-anspach.de';
$subject = 'Kontaktanfrage über frederik-anspach.de';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode nicht erlaubt.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (empty($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Fehlende Formulardaten.']);
    exit;
}

// Spam-Schutz (Honeypot)
if (!empty($data['pot'] ?? '')) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam-Verdacht.']);
    exit;
}

$name    = sanitize_input((string)($data['name'] ?? ''));
$email   = sanitize_input((string)($data['email'] ?? ''));
$message = sanitize_input((string)($data['message'] ?? ''));
$privacy = (bool)($data['privacy'] ?? false);

if (empty($name) || empty($email) || empty($message) || !$privacy) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Pflichtfelder fehlen.']);
    exit;
}

if (!is_safe_email($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ungültige E-Mail.']);
    exit;
}

// E-Mail Versand Logik
$email_content  = "Name: " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "\n";
$email_content .= "E-Mail: " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "\n\n";
$email_content .= "Nachricht:\n" . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . "\n";

$headers  = "From: Webseite <kontakt@frederik-anspach.de>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($recipient_email, mb_encode_mimeheader($subject), $email_content, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Gesendet!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server-Fehler beim Versand.']);
}
