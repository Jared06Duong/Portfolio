document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar");
  const navHeight = nav ? nav.offsetHeight : 0;

  const navLinks = Array.from(document.querySelectorAll('.navbar a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll("section[id]"));

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
      window.scrollTo({ top: y, behavior: "smooth" });

      history.pushState(null, "", href);
    });
  });

  const linkById = new Map(navLinks.map((a) => [a.getAttribute("href")?.slice(1), a]));

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.remove("active"));
    const link = linkById.get(id);
    if (link) link.classList.add("active");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActive(visible.target.id);
    },
    {
      root: null,
      rootMargin: `-${navHeight + 20}px 0px -60% 0px`,
      threshold: [0.1, 0.2, 0.35, 0.5, 0.75]
    }
  );

  sections.forEach((s) => observer.observe(s));
});
