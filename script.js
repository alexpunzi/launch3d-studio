/* =========================================================
   Launch3D Studio - Interacciones básicas
   Sin dependencias externas.
   ========================================================= */

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const toast = document.querySelector("[data-toast]");
const colorButtons = document.querySelectorAll("[data-color]");
const hotspotButtons = document.querySelectorAll("[data-hotspot]");
const revealElements = document.querySelectorAll(".reveal");

const carColorClasses = ["car-electric", "car-bronze"];

/**
 * Cambia el estado visual del header al hacer scroll.
 */
function updateHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

/**
 * Abre/cierra el menú en móvil.
 */
function toggleNav() {
  if (!nav || !navToggle) return;

  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
}

/**
 * Cierra el menú móvil al navegar.
 */
function closeNav() {
  if (!nav || !navToggle) return;

  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

/**
 * Muestra un mensaje contextual reutilizable.
 */
function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

/**
 * Cambia la muestra visual del coche pseudo-3D.
 */
function setCarColor(color) {
  document.body.classList.remove(...carColorClasses);

  if (color === "electric") {
    document.body.classList.add("car-electric");
    showToast("Muestra visual: azul eléctrico.");
  } else if (color === "bronze") {
    document.body.classList.add("car-bronze");
    showToast("Muestra visual: bronce.");
  } else {
    showToast("Muestra visual: grafito.");
  }

  colorButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.color === color);
  });
}

/**
 * Activa animaciones de entrada cuando una sección entra en viewport.
 */
function initRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

/**
 * Registra listeners principales.
 */
function initEvents() {
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  navToggle?.addEventListener("click", toggleNav);

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setCarColor(button.dataset.color);
    });
  });

  hotspotButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const label = button.dataset.hotspot || "Hotspot";
      showToast(label);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

/**
 * Punto de entrada.
 */
function init() {
  updateHeaderState();
  initRevealObserver();
  initEvents();
}

init();
