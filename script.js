document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar');
  const links = [...document.querySelectorAll('.navbar a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if (!nav || !sections.length) return;
  const indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  nav.append(indicator);
  nav.classList.add('has-indicator');
  let scheduled = false;
  const update = () => {
    const offset = (nav?.offsetHeight || 72) + 24;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= offset) current = section;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections.at(-1);
    links.forEach(link => {
      const active = link.hash === `#${current?.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
      if (active) {
        const bounds = link.getBoundingClientRect();
        const navBounds = nav.getBoundingClientRect();
        indicator.style.width = `${bounds.width}px`;
        indicator.style.transform = `translate(${bounds.left - navBounds.left}px, ${bounds.bottom - navBounds.top - 2}px)`;
        indicator.classList.add('is-visible');
      }
    });
    scheduled = false;
  };
  const schedule = () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  };
  const resize = () => {
    document.documentElement.style.setProperty('--nav-h', `${nav?.offsetHeight || 72}px`);
    schedule();
  };
  if (nav && 'ResizeObserver' in window) new ResizeObserver(resize).observe(nav);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('pageshow', resize);
  window.addEventListener('load', resize);
  document.fonts?.ready.then(resize);
  resize();
});
