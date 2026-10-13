/* Progressive enhancement: content and repository links don't depend on animation libraries. */
(() => {
  "use strict";
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const mobile = window.matchMedia("(max-width: 600px)");
  const header = $(".site-header");
  const menu = $(".main-nav");
  const menuButton = $(".menu-toggle");
  const motionButton = $(".motion-toggle");
  const dialog = $("#project-dialog");
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  let userPaused = false;
  try {
    userPaused = localStorage.getItem("italo-motion-paused") === "true";
  } catch {
    /* Storage is optional. */
  }
  let lenis = null;
  let motionContext = null;
  let ticker = null;
  let lastScroll = 0;
  let toastTimer;
  let lastDialogTrigger;
  let dialogAnimation;
  const pointerAnimations = new Map();
  let counterTweens = [];
  const motionAllowed = () => !reduced.matches && !userPaused;
  const pointerAllowed = () =>
    motionAllowed() &&
    finePointer.matches &&
    !root.classList.contains("keyboard-nav");
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  // Decorative icons should not be announced twice beside their text labels.
  $$('svg:not([role="img"])').forEach((svg) =>
    svg.setAttribute("aria-hidden", "true"),
  );

  const setMenu = (open, keyboard = false) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", open);
    header.classList.remove("is-hidden");
    if (open && motionAllowed() && !keyboard && gsap) {
      gsap.fromTo(
        menu,
        { opacity: 0, y: -8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      );
    }
  };
  menuButton.addEventListener("click", (event) =>
    setMenu(
      menuButton.getAttribute("aria-expanded") !== "true",
      event.detail === 0,
    ),
  );
  mobile.addEventListener("change", () => setMenu(false));
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target) && menu.classList.contains("is-open"))
      setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (["Tab", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      root.classList.add("keyboard-nav");
      header.classList.remove("is-hidden");
    }
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false, true);
      menuButton.focus();
    }
  });
  document.addEventListener(
    "pointerdown",
    () => root.classList.remove("keyboard-nav"),
    { passive: true },
  );

  $$('a[href^="#"]').forEach((anchor) =>
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      const keyboard = event.detail === 0;
      setMenu(false, keyboard);
      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - 96,
      );
      if (lenis && !keyboard) lenis.scrollTo(top, { duration: 0.9 });
      else window.scrollTo({ top, behavior: "instant" });
      history.pushState(null, "", href);
      if (keyboard) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          { once: true },
        );
      }
    }),
  );

  // Only enhancement state is animated; native scrolling remains the source of truth.
  let scrollFrame = false;
  function updateScroll() {
    const y = window.scrollY;
    const max = root.scrollHeight - window.innerHeight;
    $(".scroll-progress").style.transform =
      `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (Math.abs(y - lastScroll) > 7) {
      const hide =
        y > lastScroll &&
        y > 350 &&
        !menu.classList.contains("is-open") &&
        !root.classList.contains("keyboard-nav");
      header.classList.toggle("is-hidden", hide);
      lastScroll = y;
    }
    scrollFrame = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) {
        scrollFrame = true;
        requestAnimationFrame(updateScroll);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScroll, { passive: true });
  updateScroll();
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          $$(".main-nav a").forEach((link) => {
            if (link.hash === `#${entry.target.id}`)
              link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    $$("main > section").forEach((section) => sectionObserver.observe(section));
  }
  const clockFormatter = new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const updateClock = () => {
    $("#lima-time").textContent = clockFormatter.format(new Date());
  };
  updateClock();
  setInterval(updateClock, 60_000);

  // Project descriptions summarize public repository content, not production claims.
  const projects = {
    cloud: {
      category: "CLOUD & CIBERSEGURIDAD",
      title: "Secure Cloud Infrastructure",
      summary:
        "Un proyecto de infraestructura en AWS que reúne aprovisionamiento con Terraform, hardening de Linux y detección de intentos de acceso.",
      details: [
        "Red y permisos: configuración de VPC, security groups e identidades IAM mediante Terraform.",
        "Seguridad del host: scripts de Bash para hardening y un detector de eventos de autenticación en Python.",
        "El repositorio incluye configuración de infraestructura y pruebas para el detector.",
      ],
      stack: ["AWS", "Terraform", "Linux", "Python", "Bash"],
      note: "Exploración técnica. La vista previa es un esquema conceptual, no un panel de infraestructura en producción.",
      url: "https://github.com/italo04/secure-cloud-infra",
    },
    layerforge: {
      category: "ARQUITECTURA · PROYECTO ACADÉMICO PUCP",
      title: "LayerForge",
      summary:
        "Sistema distribuido para gestionar impresoras 3D y órdenes de impresión, desarrollado en el contexto del curso de Arquitectura de Software y Sistemas Distribuidos.",
      details: [
        "API Gateway y Service Discovery para centralizar el acceso y localizar los servicios.",
        "Servicios de catálogo y órdenes con responsabilidades y datos separados.",
        "Comunicación con OpenFeign para validar las características de una impresora antes de registrar un trabajo.",
      ],
      stack: [
        "Java",
        "Spring Boot",
        "Spring Cloud",
        "Eureka",
        "OpenFeign",
        "H2",
      ],
      note: "Laboratorio académico. La vista previa representa los componentes del sistema.",
      url: "https://github.com/italo04/layerforge-microservices",
    },
    fintech: {
      category: "ARQUITECTURA DE SOFTWARE & DATOS",
      title: "Fintech Transaction Engine",
      summary:
        "Motor de transferencias financieras para explorar cómo preservar la consistencia de datos cuando se procesan operaciones concurrentes o solicitudes repetidas.",
      details: [
        "Separación en capas de API, servicios, repositorios y modelos de datos.",
        "Claves de idempotencia y bloqueos de filas para coordinar las transferencias.",
        "Contabilidad de doble partida con registros de débito y crédito por operación.",
      ],
      stack: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Docker"],
      note: "Proyecto técnico de portafolio. No se presentan métricas de rendimiento ni disponibilidad de producción.",
      url: "https://github.com/italo04/fintech-transaction-engine",
    },
    tuderecho: {
      category: "LEGALTECH · EQUIPU",
      title: "TuDerecho",
      summary:
        "Participo como desarrollador en una plataforma orientada a abogados, que facilita su interacción con clientes y con otros profesionales.",
      details: [
        "La plataforma aborda la relación cliente–abogado.",
        "La colaboración abogado–abogado se organiza mediante propuestas internas.",
        "Mi participación actual se desarrolla dentro del proyecto de EQUIPU.",
      ],
      stack: ["EQUIPU", "Desarrollo colaborativo", "En desarrollo"],
      note: "Proyecto en curso. Para conocer más sobre mi participación, conversemos.",
      url: null,
    },
  };
  function openProject(key, trigger, keyboard) {
    const project = projects[key];
    if (!project) return;
    lastDialogTrigger = trigger;
    $("#dialog-category").textContent = project.category;
    $("#dialog-title").textContent = project.title;
    $("#dialog-summary").textContent = project.summary;
    $("#dialog-note").textContent = project.note;
    $("#dialog-details").replaceChildren(
      ...project.details.map((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
      }),
    );
    $("#dialog-stack").replaceChildren(
      ...project.stack.map((text) => {
        const span = document.createElement("span");
        span.textContent = text;
        return span;
      }),
    );
    const link = $("#dialog-link");
    link.hidden = !project.url;
    if (project.url) link.href = project.url;
    else link.removeAttribute("href");
    lenis?.stop();
    dialog.showModal();
    dialog.scrollTop = 0;
    if (motionAllowed() && !keyboard && window.Motion) {
      dialogAnimation?.stop();
      dialogAnimation = window.Motion.animate(
        dialog,
        {
          opacity: [0, 1],
          transform: ["translateY(12px) scale(.98)", "translateY(0) scale(1)"],
        },
        { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
      );
    }
  }
  function closeProject(keyboard = false) {
    if (!dialog.open) return;
    dialogAnimation?.stop();
    const finish = () => {
      dialog.close();
      dialog.style.removeProperty("opacity");
      dialog.style.removeProperty("transform");
    };
    if (motionAllowed() && !keyboard && window.Motion) {
      dialogAnimation = window.Motion.animate(
        dialog,
        { opacity: 0, transform: "translateY(6px) scale(.99)" },
        { duration: 0.14, ease: [0.23, 1, 0.32, 1] },
      );
      dialogAnimation.then(finish);
    } else finish();
  }
  $$("[data-project]").forEach((button) =>
    button.addEventListener("click", (event) =>
      openProject(button.dataset.project, button, event.detail === 0),
    ),
  );
  $(".dialog-close").addEventListener("click", (event) =>
    closeProject(event.detail === 0),
  );
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProject(true);
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      closeProject();
  });
  dialog.addEventListener("close", () => {
    lenis?.start();
    lastDialogTrigger?.focus({ preventScroll: true });
  });

  $$("[data-filter]").forEach((button) =>
    button.addEventListener("click", (event) => {
      const category = button.dataset.filter;
      $$("[data-filter]").forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      $(".project-grid").classList.toggle("is-filtered", category !== "all");
      let count = 0;
      $$(".project-card").forEach((card) => {
        gsap?.killTweensOf(card);
        card.hidden = category !== "all" && card.dataset.category !== category;
        card.style.opacity = "1";
        card.style.transform = "none";
        card.style.visibility = "visible";
        if (!card.hidden) count++;
      });
      if (motionAllowed() && event.detail !== 0 && gsap) {
        gsap.fromTo(
          ".project-card:not([hidden])",
          { opacity: 0.2, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
            stagger: 0.04,
            ease: "power3.out",
            clearProps: "transform",
          },
        );
      }
      $("#filter-status").textContent =
        `${count} ${count === 1 ? "proyecto visible" : "proyectos visibles"}.`;
      ScrollTrigger?.refresh();
      lenis?.resize();
      updateScroll();
    }),
  );
  const focusCopy = {
    cloud: "Infraestructura con la seguridad desde el diseño.",
    devsecops: "Automatización y seguridad a lo largo del desarrollo.",
    iot: "Del dispositivo al sistema: conectar el mundo físico.",
  };
  $$("[data-focus]").forEach((button) =>
    button.addEventListener("click", (event) => {
      $$("[data-focus]").forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      const caption = $("#focus-caption");
      caption.textContent = focusCopy[button.dataset.focus];
      if (motionAllowed() && event.detail !== 0 && window.Motion) {
        window.Motion.animate(
          caption,
          { opacity: [0, 1], transform: ["translateY(4px)", "translateY(0)"] },
          { duration: 0.2 },
        );
      }
    }),
  );

  function toast(message) {
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").classList.add("is-visible");
    toastTimer = setTimeout(
      () => $("#toast").classList.remove("is-visible"),
      3200,
    );
  }
  $(".copy-email").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText("italomijail@gmail.com");
      toast("Correo copiado");
    } catch {
      toast("Puedes copiarlo aquí: italomijail@gmail.com");
    }
  });
  $("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#contact-name").value.trim();
    const email = $("#contact-email").value.trim();
    const message = $("#contact-message").value.trim();
    if (!name || !message) {
      $("#form-status").textContent =
        "Completa tu nombre y el mensaje antes de continuar.";
      (!name ? $("#contact-name") : $("#contact-message")).focus();
      return;
    }
    const subject = `Contacto desde el portafolio — ${name}`;
    const body = `Hola Italo,\n\n${message}\n\n${name}\n${email}`;
    const mailto = `mailto:italomijail@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    $("#form-status").textContent =
      "Mensaje preparado. Completa el envío en tu aplicación de correo. Si no se abre, escríbeme a italomijail@gmail.com.";
    window.location.href = mailto;
  });

  // Springs are reserved for pointer-driven decoration, and stop when motion is paused.
  function springTo(element, transform) {
    if (!window.Motion) {
      element.style.transform = transform;
      return;
    }
    pointerAnimations.get(element)?.stop();
    const animation = window.Motion.animate(
      element,
      { transform },
      { type: "spring", duration: 0.4, bounce: 0.12 },
    );
    pointerAnimations.set(element, animation);
  }
  $$(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (!pointerAllowed()) return;
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.14;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.14;
      springTo(button, `translate(${x}px, ${y}px)`);
    });
    button.addEventListener("pointerleave", () => {
      if (motionAllowed()) springTo(button, "translate(0px, 0px)");
      else button.style.transform = "";
    });
  });
  $$("[data-tilt]").forEach((element) => {
    const target =
      element.dataset.tilt === "hero" ? $(".system-object", element) : element;
    element.addEventListener("pointermove", (event) => {
      if (!pointerAllowed()) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      springTo(
        target,
        `perspective(1100px) rotateX(${-y * 6}deg) rotateY(${x * 7}deg)`,
      );
    });
    element.addEventListener("pointerleave", () => {
      if (motionAllowed())
        springTo(target, "perspective(1100px) rotateX(0deg) rotateY(0deg)");
      else target.style.transform = "";
    });
  });
  const cursor = $(".cursor-follower");
  let cursorFrame = 0;
  let cursorPoint = { x: 0, y: 0, active: false };
  document.addEventListener(
    "pointermove",
    (event) => {
      if (!pointerAllowed() || dialog.open) {
        cursor.style.opacity = "0";
        return;
      }
      cursorPoint = {
        x: event.clientX,
        y: event.clientY,
        active: !!event.target.closest(".project-preview"),
      };
      if (cursorFrame) return;
      cursorFrame = requestAnimationFrame(() => {
        cursor.style.opacity = "1";
        cursor.classList.toggle("is-active", cursorPoint.active);
        springTo(
          cursor,
          `translate(${cursorPoint.x}px, ${cursorPoint.y}px) scale(${cursorPoint.active ? 1.8 : 1})`,
        );
        cursorFrame = 0;
      });
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => {
    cursor.style.opacity = "0";
  });

  function setupMotion(initial = false) {
    counterTweens.forEach((tween) => tween.kill());
    counterTweens = [];
    $$("[data-count]").forEach((element) => {
      element.textContent = element.dataset.count;
    });
    motionContext?.revert();
    motionContext = null;
    if (ticker && gsap) gsap.ticker.remove(ticker);
    ticker = null;
    lenis?.destroy();
    lenis = null;
    pointerAnimations.forEach((animation) => animation.stop());
    pointerAnimations.clear();
    $$(".magnetic, [data-tilt], .system-object, .cursor-follower").forEach(
      (element) => {
        element.style.transform = "";
      },
    );
    cursor.style.opacity = "0";
    const enabled = motionAllowed();
    $(".marquee-track").style.animationPlayState =
      enabled && !document.hidden ? "running" : "paused";
    root.dataset.motion = enabled ? "active" : "paused";
    motionButton.setAttribute("aria-pressed", String(!enabled));
    motionButton.textContent = reduced.matches
      ? "Movimiento reducido · sistema"
      : enabled
        ? "Pausar animaciones  Ⅱ"
        : "Activar animaciones  ↗";
    motionButton.disabled = reduced.matches;
    if (!enabled || !gsap || !ScrollTrigger) return;
    if (window.Lenis) {
      lenis = new window.Lenis({
        duration: 1,
        smoothWheel: true,
        syncTouch: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }
    motionContext = gsap.context(() => {
      if (initial && window.scrollY < 80) {
        gsap.fromTo(
          ".hero-word",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.075,
            delay: 0.24,
            ease: "power4.out",
            clearProps: "transform,opacity",
          },
        );
        gsap.fromTo(
          "[data-hero]",
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.065,
            delay: 0.42,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
        );
      }
      $$(".reveal").forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.9)
          return;
        gsap.fromTo(
          element,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          },
        );
      });
      if (finePointer.matches)
        gsap.to(".scene-grid", {
          y: 35,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      $$("[data-count]").forEach((element) => {
        if (element.dataset.counted || element.getBoundingClientRect().top < 0)
          return;
        ScrollTrigger.create({
          trigger: element,
          start: "top 92%",
          once: true,
          onEnter: () => {
            element.dataset.counted = "true";
            const value = { n: 0 };
            counterTweens.push(
              gsap.to(value, {
                n: Number(element.dataset.count),
                duration: 0.75,
                ease: "power2.out",
                onUpdate: () => {
                  element.textContent = String(Math.round(value.n));
                },
                onComplete: () => {
                  element.textContent = element.dataset.count;
                },
              }),
            );
          },
        });
      });
    });
    ScrollTrigger.refresh();
  }
  motionButton.addEventListener("click", () => {
    userPaused = !userPaused;
    try {
      localStorage.setItem("italo-motion-paused", String(userPaused));
    } catch {
      /* Nonessential preference. */
    }
    setupMotion();
    $$("[data-count]").forEach((element) => {
      element.textContent = element.dataset.count;
    });
  });
  reduced.addEventListener("change", () => {
    setupMotion();
    $$("[data-count]").forEach((element) => {
      element.textContent = element.dataset.count;
    });
  });
  finePointer.addEventListener("change", () => setupMotion());
  setupMotion(true);
  document.fonts?.ready.then(() => ScrollTrigger?.refresh());
  // Pause ambient animation in background tabs, without changing the saved preference.
  document.addEventListener("visibilitychange", () => {
    $(".marquee-track").style.animationPlayState =
      document.hidden || !motionAllowed() ? "paused" : "running";
    if (document.hidden) lenis?.stop();
    else if (!dialog.open) lenis?.start();
  });
})();
