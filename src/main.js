import "./main.scss";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');

  // Toast-Benachrichtigung (deine bewährte Logik)
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Daten sammeln
    const formData = {
      name: document.getElementById("form-name").value.trim(),
      email: document.getElementById("form-email").value.trim(),
      message: document.getElementById("form-message").value.trim(),
      privacy: document.getElementById("form-privacy")?.checked || false,
      pot: document.querySelector('input[name="pot"]').value,
      // csrf_token lassen wir für den ersten Test weg, da statisches HTML
    };

    // Validierung
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Bitte fülle alle Textfelder aus.", "error");
      return;
    }

    // In deinem neuen HTML hast du die Privacy-Abfrage evtl. noch nicht?
    // Falls doch, hier prüfen:
    if (document.getElementById("form-privacy") && !formData.privacy) {
      showToast("Bitte stimme der Datenschutzerklärung zu.", "error");
      return;
    }

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
        showToast("Nachricht erfolgreich gesendet!", "success");
      } else {
        showToast(result.message || "Fehler beim Senden.", "error");
      }
    } catch (error) {
      showToast("Netzwerkfehler. Bitte später versuchen.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Nachricht senden";
    }
  });
});
