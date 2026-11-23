// Radha Madhav Aqua – small, dependency-free interactions
(() => {
  const WHATSAPP_NUMBER = "917853034678"; // country code + number, no "+"

  // Header background on scroll
  const header = document.querySelector(".header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

  // Reveal-on-scroll
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-visible"));
  }

  // Enquiry form -> pre-filled WhatsApp message (no backend needed)
  const form = document.getElementById("orderForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach((f) => {
      const bad = !f.checkValidity();
      f.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.textContent = "Please enter your name and a valid phone number.";
      return;
    }
    const raw = new FormData(form);
    // Clean user input: drop control characters, trim, cap length
    const clean = (k, max) => String(raw.get(k) || "").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, " ").trim().slice(0, max);
    const d = { get: (k) => clean(k, { name: 60, phone: 15, product: 40, qty: 40, message: 500 }[k] || 100) };
    const lines = [
      "Hello Radha Madhav Aqua,",
      "",
      `Name: ${d.get("name")}`,
      `Phone: ${d.get("phone")}`,
      `Product: ${d.get("product")}`,
      d.get("qty") ? `Quantity: ${d.get("qty")}` : "",
      d.get("message") ? `Message: ${d.get("message")}` : "",
    ].filter((l, i) => l !== "" || i === 1);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
    note.textContent = "Opening WhatsApp… just tap send!";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Motion ---------------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;

  // Split hero headline into words for the staggered rise
  document.querySelectorAll(".split").forEach((el) => {
    let i = 0;
    const wrap = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
            const w = document.createElement("span");
            w.className = "word";
            w.setAttribute("aria-hidden", "true");
            const inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--i", i++);
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          wrap(child);
        }
      });
    };
    wrap(el);
  });

  // Stagger reveal of siblings in grids
  document.querySelectorAll(".product-grid, .why-grid, .steps").forEach((grid) => {
    grid.querySelectorAll(":scope > .reveal").forEach((el, idx) => el.style.setProperty("--d", `${idx * 90}ms`));
  });

  // Count-up numbers when they scroll into view
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        const el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || "";
        if (reduceMotion) { el.textContent = end + suffix; return; }
        const dur = 1400, t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = "0" + suffix;
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => co.observe(c));
  }

  // Scroll progress bar + process timeline fill
  const bar = document.getElementById("scrollProgress");
  const steps = document.getElementById("steps");
  const fill = document.getElementById("stepsFill");
  const stepEls = steps ? [...steps.querySelectorAll(".step")] : [];
  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;

    if (steps) {
      const r = steps.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top hits 85% of viewport, 1 when its bottom reaches 55%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
      fill.style.transform = `scaleX(${p})`;
      const active = Math.round(p * stepEls.length);
      stepEls.forEach((s, idx) => s.classList.toggle("is-active", idx < active));
    }
    ticking = false;
  };
  update();
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);

  if (!canHover || reduceMotion) return;

  // Hero bottle follows the mouse slightly
  const hero = document.querySelector(".hero");
  const bottle = document.querySelector(".hero__bottle");
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    bottle.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5) * 2);
    bottle.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5) * 2);
  });
  hero.addEventListener("mouseleave", () => {
    bottle.style.setProperty("--px", 0);
    bottle.style.setProperty("--py", 0);
  });

  // 3D tilt on cards
  document.querySelectorAll(".product, .why-card, .step").forEach((card) => {
    card.classList.add("tilt");
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
})();
