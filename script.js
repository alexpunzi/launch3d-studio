const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const toggleLabel = toggle?.querySelector(".sr-only");

function setMenu(open) {
  nav?.classList.toggle("is-open", open);
  toggle?.setAttribute("aria-expanded", String(open));
  if (toggleLabel) toggleLabel.textContent = open ? "Cerrar menú" : "Abrir menú";
  document.body.classList.toggle("menu-open", open);
}

toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { setMenu(false); toggle?.focus(); } });
document.addEventListener("click", (event) => { if (nav?.classList.contains("is-open") && !nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false); });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) reveals.forEach((el) => el.classList.add("is-visible"));
else {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.1, rootMargin: "0px 0px -32px" });
  reveals.forEach((el) => observer.observe(el));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();
