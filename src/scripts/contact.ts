interface SendResponse {
  success: boolean;
  message?: string;
}

type ToastType = "info" | "success" | "error";

const _TOAST_DURATION = 5000;

function showToast(message: string, type: ToastType = "info"): void {
  document.querySelector(".toast")?.remove();

  const $toast = document.createElement("div");
  $toast.className = `toast toast--${type}`;
  $toast.setAttribute("role", "status");
  $toast.textContent = message;
  document.body.appendChild($toast);

  requestAnimationFrame(() => $toast.classList.add("is-visible"));
  window.setTimeout(() => {
    $toast.classList.remove("is-visible");
    window.setTimeout(() => $toast.remove(), 400);
  }, _TOAST_DURATION);
}

/** Kontaktformular: Validierung, Versand an send-email.php, Feedback per Toast. */
export function initContactForm(): void {
  const $form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!$form) return;

  const $submit = $form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const $name = $form.querySelector<HTMLInputElement>("#form-name");
  const $email = $form.querySelector<HTMLInputElement>("#form-email");
  const $message = $form.querySelector<HTMLTextAreaElement>("#form-message");
  const $privacy = $form.querySelector<HTMLInputElement>("#form-privacy");
  const $pot = $form.querySelector<HTMLInputElement>("#pot");
  if (!$submit || !$name || !$email || !$message || !$privacy || !$pot) return;

  $form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const _payload = {
      name: $name.value.trim(),
      email: $email.value.trim(),
      message: $message.value.trim(),
      privacy: $privacy.checked,
      pot: $pot.value,
    };

    if (!_payload.name || !_payload.email || !_payload.message) {
      showToast("Bitte alle Felder ausfüllen.", "error");
      return;
    }

    if (!_payload.privacy) {
      showToast("Bitte der Datenschutzerklärung zustimmen.", "error");
      return;
    }

    $submit.disabled = true;
    $submit.textContent = "Wird gesendet...";

    try {
      const _response = await fetch("/send-email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(_payload),
      });

      const _result = (await _response.json()) as SendResponse;

      if (_response.ok && _result.success) {
        $form.reset();
        showToast("Nachricht gesendet. Ich melde mich persönlich.", "success");
      } else {
        showToast(_result.message ?? "Senden fehlgeschlagen. Bitte erneut versuchen.", "error");
      }
    } catch {
      showToast("Keine Verbindung. Bitte später erneut versuchen.", "error");
    } finally {
      $submit.disabled = false;
      $submit.textContent = "Nachricht senden";
    }
  });
}
