// ############################
// Animacje i nawigacja:
// ############################

const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// ############################
// Walidacja Formularza:
// ############################

window.addEventListener('DOMContentLoaded', () => {

    // ── OBFUSKACJA KONTAKTU  - chromi przed botami──
    //   const mail = atob('TUTAJ_ZAKODOWANY_EMAIL');
    const tel = atob('KzQ4IDczMS00NTgtNDA3');

    //   const mailEl = document.getElementById('contact-mail');
    //   if (mailEl) {
    //     mailEl.href = 'mailto:' + mail;
    //     document.getElementById('contact-mail-text').textContent = mail;
    //   }

    const telEl = document.getElementById('contact-tel');
    if (telEl) {
        telEl.href = 'tel:' + tel;
        document.getElementById('contact-tel-text').textContent = tel;
    }

    // ── WALIDACJA I WYSYŁKA FORMULARZA ──
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Walidacja pola kontakt — email lub telefon
        const contactVal = document.getElementById('contact').value.trim();
        const errorEl = document.getElementById('contact-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\+\-]{7,15}$/;

        if (!emailRegex.test(contactVal) && !phoneRegex.test(contactVal)) {
            errorEl.textContent = '⚠ Podaj poprawny adres e-mail lub numer telefonu.';
            errorEl.style.display = 'block';
            document.getElementById('contact').focus();
            return;
        } else {
            errorEl.style.display = 'none';
        }

        // Wysyłka przez AJAX
        const btn = form.querySelector('.btn-submit');
        btn.textContent = 'Wysyłanie...';
        btn.disabled = true;

        const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            form.innerHTML = `
        <div style="text-align:center;padding:40px 20px">
          <div style="font-size:2.5rem;margin-bottom:16px">✅</div>
          <p style="font-size:1.1rem;font-weight:600;color:#1a4a2e;margin-bottom:8px">Wiadomość wysłana!</p>
          <p style="color:#6b6550;font-size:14px">Odezwę się najszybciej jak to możliwe — zazwyczaj tego samego dnia.</p>
        </div>`;
        } else {
            btn.textContent = 'Wyślij wiadomość →';
            btn.disabled = false;
            form.insertAdjacentHTML('afterbegin', `
        <p style="color:#c8440a;font-size:13px;margin-bottom:12px">
          ⚠ Coś poszło nie tak. Napisz bezpośrednio na ${mail}
        </p>`);
        }
    });

});