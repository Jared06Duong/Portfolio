document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  const links = [...document.querySelectorAll('.navbar a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  const updateHeight = () => {
    document.documentElement.style.setProperty("--nav-h", `${nav?.offsetHeight || 72}px`);
  };
  updateHeight();
  if (nav && "ResizeObserver" in window) new ResizeObserver(updateHeight).observe(nav);
  const updateActive = () => {
    const offset = (nav?.offsetHeight || 72) + 48;
    let current = sections[0]?.id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= offset) current = section.id;
    });
    links.forEach(link => {
      const active = link.hash === `#${current}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  let scheduled = false;
  window.addEventListener("scroll", () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => { updateActive(); scheduled = false; });
    }
  }, { passive: true });
  window.addEventListener("resize", updateActive);
  links.forEach(link => link.addEventListener("click", event => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    updateHeight();
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.pushState(null, "", link.hash);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }));
  updateActive();
});
