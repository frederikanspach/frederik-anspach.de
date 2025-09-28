<?php
session_start();
header('Content-Type: application/json');

// ---------------------------------------------------------------------
// 1. Grundkonfiguration
// ---------------------------------------------------------------------
$recipient_email = 'kontakt@frederik-anspach.de';
$subject = 'Kontaktanfrage über frederik-anspach.de';

// CSRF-Token aus Session
$session_token = $_SESSION['csrf_token'] ?? '';

// Nur POST-Anfragen erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode nicht erlaubt.']);
    exit;
}

// JSON-Daten einlesen
$data = json_decode(file_get_contents('php://input'), true);
if (empty($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Fehlende Formulardaten.']);
    exit;
}

// ---------------------------------------------------------------------
// 2. CSRF-Prüfung
// ---------------------------------------------------------------------
$submitted_token = $data['csrf_token'] ?? '';
if (empty($submitted_token) || $submitted_token !== $session_token) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Ungültiger CSRF-Token.']);
    exit;
}

// ---------------------------------------------------------------------
// 3. Rate-Limiting (max. 3 Anfragen pro Minute)
// ---------------------------------------------------------------------
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$time = time();

if (!isset($_SESSION['rate_limit'])) {
    $_SESSION['rate_limit'] = [];
}

if (!isset($_SESSION['rate_limit'][$ip])) {
    $_SESSION['rate_limit'][$ip] = [];
}

// Alte Timestamps entfernen (>60 Sekunden)
$_SESSION['rate_limit'][$ip] = array_filter(
    $_SESSION['rate_limit'][$ip],
    fn($t) => ($time - $t) < 60
);

if (count($_SESSION['rate_limit'][$ip]) >= 3) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Zu viele Anfragen. Bitte warte eine Minute.']);
    exit;
}

// aktuellen Request speichern
$_SESSION['rate_limit'][$ip][] = $time;

// ---------------------------------------------------------------------
// 4. Sicherheitsfunktionen
// ---------------------------------------------------------------------
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = strip_tags($data);
    return str_replace(["\r", "\n", "%0a", "%0d"], '', $data);
}

function is_safe_email($email) {
    if (preg_match("/(%0A|%0D|\r|\n|Content-Type:|Bcc:|Cc:)/i", $email)) {
        return false;
    }
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// ---------------------------------------------------------------------
// 5. Spam-Schutz (Honeypot)
// ---------------------------------------------------------------------
if (!empty($data['pot'] ?? '')) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Spam-Verdacht.']);
    exit;
}

// ---------------------------------------------------------------------
// 6. Daten bereinigen & validieren
// ---------------------------------------------------------------------
$name    = sanitize_input($data['name'] ?? '');
$email   = sanitize_input($data['email'] ?? '');
$message = sanitize_input($data['message'] ?? '');
$privacy = (bool)($data['privacy'] ?? false);

if (empty($name) || empty($email) || empty($message) || !$privacy) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bitte fülle alle Pflichtfelder aus.']);
    exit;
}

if (!is_safe_email($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ungültige E-Mail-Adresse.']);
    exit;
}

if (strlen($message) > 5000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nachricht zu lang (max. 5000 Zeichen).']);
    exit;
}

// ---------------------------------------------------------------------
// 7. E-Mail vorbereiten & senden
// ---------------------------------------------------------------------
$email_content  = "Name: " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "\n";
$email_content .= "E-Mail: " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "\n\n";
$email_content .= "Nachricht:\n" . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . "\n\n";
$email_content .= "Datenschutz zugestimmt: " . ($privacy ? 'Ja' : 'Nein') . "\n";

$encoded_subject = mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");

$headers  = "From: Webseite <kontakt@frederik-anspach.de>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($recipient_email, $encoded_subject, $email_content, $headers)) {
    unset($_SESSION['csrf_token']);
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Nachricht erfolgreich gesendet.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'E-Mail-Versand fehlgeschlagen.']);
}
