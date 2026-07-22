const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const toggleLabel = document.querySelector("[data-nav-label]");
const mobileQuery = window.matchMedia("(max-width: 760px)");
let lastFocused = null;

function focusableMenuItems() {
  return nav ? [...nav.querySelectorAll("a[href]")] : [];
}

function setMenu(open, { restoreFocus = false } = {}) {
  if (!nav || !toggle) return;
  const shouldOpen = Boolean(open && mobileQuery.matches);
  nav.classList.toggle("is-open", shouldOpen);
  toggle.setAttribute("aria-expanded", String(shouldOpen));
  if (toggleLabel) toggleLabel.textContent = shouldOpen ? "Close menu" : "Open menu";
  document.body.classList.toggle("menu-open", shouldOpen);

  if (shouldOpen) {
    lastFocused = document.activeElement;
    focusableMenuItems()[0]?.focus();
  } else if (restoreFocus && lastFocused instanceof HTMLElement) {
    lastFocused.focus();
  }
}

toggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  setMenu(toggle.getAttribute("aria-expanded") !== "true", { restoreFocus: true });
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("click", (event) => {
  if (nav?.classList.contains("is-open") && !nav.contains(event.target) && !toggle?.contains(event.target)) setMenu(false, { restoreFocus: true });
});

document.addEventListener("keydown", (event) => {
  if (!nav?.classList.contains("is-open")) return;
  if (event.key === "Escape") { event.preventDefault(); setMenu(false, { restoreFocus: true }); return; }
  if (event.key !== "Tab") return;
  const items = [toggle, ...focusableMenuItems()];
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

mobileQuery.addEventListener("change", () => setMenu(false));

const reveals = document.querySelectorAll(".reveal");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) reveals.forEach((item) => item.classList.add("is-visible"));
else {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.08, rootMargin: "0px 0px -24px" });
  reveals.forEach((item) => observer.observe(item));
}

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
let scrollFrame = null;

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  header?.classList.toggle("is-scrolled", scrollTop > 24);
  if (progress) progress.style.transform = `scaleX(${scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0})`;
  scrollFrame = null;
}

window.addEventListener("scroll", () => {
  if (scrollFrame === null) scrollFrame = window.requestAnimationFrame(updateScrollUI);
}, { passive: true });
updateScrollUI();
