document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  const main = document.querySelector("main");

  if (!nav) return;

  const links = [
    ...nav.querySelectorAll('a[href^="#"]')
  ];

  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter(Boolean);

  if (!sections.length) return;

  const indicator = document.createElement("span");

  indicator.className = "nav-indicator";
  indicator.setAttribute("aria-hidden", "true");

  nav.append(indicator);
  nav.classList.add("has-indicator");

  let scheduled = false;

  function update() {
    const offset = nav.offsetHeight + 24;
    let currentSection = sections[0];

    for (const section of sections) {
      if (section.getBoundingClientRect().top <= offset) {
        currentSection = section;
      }
    }

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;

    if (atBottom) {
      currentSection = sections[sections.length - 1];
    }

    for (const link of links) {
      const active = link.hash === `#${currentSection.id}`;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "location");

        const linkBounds = link.getBoundingClientRect();
        const navBounds = nav.getBoundingClientRect();

        const x = linkBounds.left - navBounds.left;
        const y = linkBounds.bottom - navBounds.top - 2;

        indicator.style.width = `${linkBounds.width}px`;
        indicator.style.transform = `translate(${x}px, ${y}px)`;
        indicator.classList.add("is-visible");
      } else {
        link.removeAttribute("aria-current");
      }
    }

    scheduled = false;
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;
    window.requestAnimationFrame(update);
  }

  function resize() {
    document.documentElement.style.setProperty(
      "--nav-h",
      `${nav.offsetHeight}px`
    );

    schedule();
  }

  if ("ResizeObserver" in window) {
    const navObserver = new ResizeObserver(resize);
    navObserver.observe(nav);

    if (main) {
      const contentObserver = new ResizeObserver(schedule);
      contentObserver.observe(main);
    }
  }

  document.addEventListener("toggle", schedule, true);

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", resize);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("pageshow", resize);
  window.addEventListener("load", resize);

  if (document.fonts) {
    document.fonts.ready.then(resize);
  }

  resize();
});