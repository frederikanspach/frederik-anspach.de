<?php

/** Bereinigt Eingabedaten von gefährlichen Zeichen und Whitespace. */
function sanitize_input(string $data): string
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = strip_tags($data);
    return str_replace(["\r", "\n", "%0a", "%0d"], '', $data);
}

/** Prüft, ob eine E-Mail-Adresse sicher und formal korrekt ist. */
function is_safe_email(string $email): bool
{
    if (preg_match("/(%0A|%0D|\r|\n|Content-Type:|Bcc:|Cc:)/i", $email)) {
        return false;
    }
    return (bool)filter_var($email, FILTER_VALIDATE_EMAIL);
}
