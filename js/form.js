// js/form.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  const submitButton = form.querySelector('button[type="submit"]');

  if (!form) return;

  const csrfToken = form.getAttribute("data-csrf-token");

  // Eingaben bereinigen (XSS-Schutz)
  const sanitizeInput = (input) => {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML.trim();
  };

  // Toast-Benachrichtigung (immer nur eine sichtbar)
  const showToast = (message, type = "info") => {
    const oldToast = document.querySelector(".toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("visible"), 50);

    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 500);
    }, 5000);
  };

  // Eingaben validieren
  const validateForm = (data) => {
    if (!data.name || !data.email || !data.message) {
      showToast("Bitte fülle alle Textfelder aus.", "error");
      return false;
    }

    const emailRegex = /^[a-z0-9._-]+@[a-z0-9-]+\.[a-z0-9-]+$/i;
    if (!emailRegex.test(data.email)) {
      showToast("Bitte gib eine gültige E-Mail-Adresse ein.", "error");
      return false;
    }

    if (!data.privacy) {
      showToast("Bitte stimme der Datenschutzerklärung zu.", "error");
      return false;
    }

    return true;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: sanitizeInput(document.getElementById("form-name").value),
      email: sanitizeInput(document.getElementById("form-email").value),
      message: sanitizeInput(document.getElementById("form-message").value),
      privacy: document.getElementById("form-privacy").checked,
      csrf_token: csrfToken,
      pot: document.getElementById("pot").value,
    };

    if (!validateForm(formData)) return;

    submitButton.disabled = true;
    submitButton.textContent = "Wird gesendet...";

    try {
      const response = await fetch("/send-email.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        showToast("Nachricht erfolgreich gesendet! Vielen Dank.", "success");
      } else {
        showToast(
          result.message || "Ein unbekannter Fehler ist aufgetreten.",
          "error"
        );
      }
    } catch (error) {
      console.error("Netzwerkfehler beim Senden des Formulars:", error);
      showToast(
        "Ein Netzwerkfehler ist aufgetreten. Bitte später erneut versuchen.",
        "error"
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Nachricht senden";
    }
  });
});
