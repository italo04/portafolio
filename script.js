/**
 * ITALO RAMOS — PORTAFOLIO PROFESIONAL
 * Animaciones e Interacciones según principios de Emil Kowalski
 * (Lenis + GSAP ScrollTrigger + Magnetic physics + 3D Tilt + Particle Mesh)
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     1. PRELOADER ELEGANTE
     ========================================================================== */
  const preloader = document.getElementById("preloader");
  const preloaderProgress = document.getElementById("preloader-progress");

  if (preloader) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (preloaderProgress) preloaderProgress.style.width = "100%";
        setTimeout(() => {
          preloader.classList.add("fade-out");
        }, 350);
      } else {
        if (preloaderProgress) preloaderProgress.style.width = progress + "%";
      }
    }, 60);
  }

  /* ==========================================================================
     2. HORA LOCAL LIMA (UTC-5)
     ========================================================================== */
  const timeEl = document.getElementById("current-time");
  function updateLimaTime() {
    if (!timeEl) return;
    const now = new Date();
    const options = {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    };
    timeEl.textContent = now.toLocaleTimeString("es-PE", options) + " (LIMA)";
  }
  updateLimaTime();
  setInterval(updateLimaTime, 1000);

  /* ==========================================================================
     3. LENIS SMOOTH SCROLL (Sincronizado con GSAP)
     ========================================================================== */
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95
    });

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ==========================================================================
     4. NAVBAR INTELIGENTE & SCROLL PROGRESS
     ========================================================================== */
  const siteHeader = document.getElementById("site-header");
  const progressBar = document.getElementById("scroll-progress");
  let lastScrollY = 0;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Barra de progreso de scroll
    if (progressBar && maxScroll > 0) {
      const pct = Math.min(100, Math.max(0, (currentScrollY / maxScroll) * 100));
      progressBar.style.width = pct + "%";
    }

    // Navbar hide/show
    if (siteHeader) {
      if (currentScrollY > 80) {
        siteHeader.classList.add("scrolled");
      } else {
        siteHeader.classList.remove("scrolled");
      }

      if (currentScrollY > 250 && currentScrollY > lastScrollY && !document.body.classList.contains("menu-open")) {
        siteHeader.classList.add("hidden");
      } else {
        siteHeader.classList.remove("hidden");
      }
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // Menú móvil
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      mainNav.classList.toggle("mobile-open");
      document.body.classList.toggle("menu-open");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("mobile-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* ==========================================================================
     5. HERO CANVAS — MALLA CIBERNÉTICA DE PARTÍCULAS INTERACTIVAS
     ========================================================================== */
  const canvas = document.getElementById("hero-canvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, radius: 140 };

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Crear partículas
    const particleCount = Math.min(55, Math.floor((width * height) / 20000));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        size: Math.random() * 1.8 + 1,
        color: i % 2 === 0 ? "rgba(0, 229, 255, 0.7)" : "rgba(124, 92, 255, 0.7)"
      });
    }

    let animationId;
    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Actualizar y dibujar partículas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Reacción al mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Conectar con líneas cercanas
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 120) {
            const alpha = 1 - dist2 / 120;
            ctx.strokeStyle = `rgba(124, 92, 255, ${alpha * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(renderCanvas);
    }

    renderCanvas();

    // Pausar si la pestaña está oculta
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        renderCanvas();
      }
    });
  }

  /* ==========================================================================
     6. CUSTOM CURSOR ELÁSTICO & BOTONES MAGNÉTICOS (Emil Kowalski Physics)
     ========================================================================== */
  const cursor = document.getElementById("custom-cursor");
  const cursorDot = document.getElementById("cursor-dot");
  const cursorLabel = document.getElementById("cursor-label");

  if (cursor && cursorDot && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    let mousePos = { x: -100, y: -100 };
    let cursorPos = { x: -100, y: -100 };
    let dotPos = { x: -100, y: -100 };

    window.addEventListener("mousemove", (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    });

    function updateCursor() {
      // Física elástica (Lerp con amortiguación natural)
      cursorPos.x += (mousePos.x - cursorPos.x) * 0.18;
      cursorPos.y += (mousePos.y - cursorPos.y) * 0.18;
      dotPos.x += (mousePos.x - dotPos.x) * 0.65;
      dotPos.y += (mousePos.y - dotPos.y) * 0.65;

      cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) translate(-50%, -50%)`;
      cursorDot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover interactivo en links y botones
    const interactiveEls = document.querySelectorAll("a, button, .project-card, .skill-tag");
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
        if (cursorLabel) {
          if (el.classList.contains("project-card") || el.hasAttribute("data-modal")) {
            cursorLabel.textContent = "VER";
          } else {
            cursorLabel.textContent = "";
          }
        }
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
        if (cursorLabel) cursorLabel.textContent = "";
      });
    });
  }

  // Botones Magnéticos
  const magneticEls = document.querySelectorAll(".magnetic");
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    magneticEls.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        if (typeof gsap !== "undefined") {
          gsap.to(el, {
            x: x * 0.28,
            y: y * 0.28,
            duration: 0.25,
            ease: "power2.out"
          });
        }
      });

      el.addEventListener("mouseleave", () => {
        if (typeof gsap !== "undefined") {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.45,
            ease: "elastic.out(1, 0.4)"
          });
        }
      });
    });
  }

  /* ==========================================================================
     7. BENTO 3D TILT EN TARJETAS DE PROYECTOS
     ========================================================================== */
  const tiltCards = document.querySelectorAll("[data-tilt]");
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Actualizar coordenadas para el glow radial
        card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);

        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4.5;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4.5;

        if (typeof gsap !== "undefined") {
          gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.25,
            ease: "power1.out"
          });
        }
      });

      card.addEventListener("mouseleave", () => {
        if (typeof gsap !== "undefined") {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        }
      });
    });
  }

  /* ==========================================================================
     8. ANIMACIONES GSAP SCROLLTRIGGER (Reveal & Counters)
     ========================================================================== */
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Stagger reveal general
    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Línea de tiempo Spine progress fill
    const spineProgress = document.querySelector(".timeline-progress-fill");
    const timelineContainer = document.querySelector(".timeline-container");
    if (spineProgress && timelineContainer) {
      gsap.to(spineProgress, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: timelineContainer,
          start: "top 70%",
          end: "bottom 80%",
          scrub: true
        }
      });
    }

    // Contadores numéricos en Sobre Mí
    const statCounters = document.querySelectorAll(".stat-number[data-target]");
    statCounters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      ScrollTrigger.create({
        trigger: counter,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            innerText: target,
            duration: 1.4,
            snap: { innerText: 1 },
            ease: "power2.out"
          });
        }
      });
    });
  }

  /* ==========================================================================
     9. FILTRADO DINÁMICO DE PROYECTOS
     ========================================================================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const categories = card.getAttribute("data-category") || "";
        if (filter === "all" || categories.includes(filter)) {
          card.style.display = "flex";
          if (typeof gsap !== "undefined" && !prefersReducedMotion) {
            gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
          }
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ==========================================================================
     10. MODAL NATIVO ACCESIBLE CON DETALLES DE ARQUITECTURA
     ========================================================================== */
  const projectData = {
    "ai-log-analyzer": {
      badge: "DEVSECOPS · MACHINE LEARNING · LINUX",
      title: "AI-Powered Security Log Analyzer & Threat Detector",
      subtitle: "Detección y mitigación autónoma de intrusiones en Linux mediante IA y Machine Learning",
      problem: "Los ataques de fuerza bruta SSH y escaneo de puertos saturan servidores Linux generando gigabytes de registros diarios sin análisis inmediato.",
      solution: "Construcción de un microservicio en FastAPI que procesa /var/log/auth.log en tiempo real. Utiliza Scikit-learn (Isolation Forest) para calcular vectores de anomalía por IP y conecta la API de un LLM para clasificar el incidente y aplicar reglas de mitigación inmediata con iptables.",
      security: [
        "Contenedor Docker multi-etapa ejecutado como usuario non-root.",
        "Auditoría continua de seguridad en el repositorio con Trivy y Bandit (SAST).",
        "Pipeline de CI/CD en GitHub Actions que aborta el build si se detectan vulnerabilidades críticas."
      ],
      github: "https://github.com/italo04"
    },
    "fintech-engine": {
      badge: "BACKEND · CONCURRENCIA · POSTGRESQL",
      title: "Fintech Transaction Engine",
      subtitle: "Motor transaccional de alta concurrencia con garantías ACID absolutas",
      problem: "Ante múltiples solicitudes simultáneas de débito o transferencia, los sistemas financieros pueden sufrir condiciones de carrera (race conditions) y doble gasto.",
      solution: "API REST desarrollada en FastAPI y PostgreSQL que aplica aislamiento de transacciones Serializable, bloqueos a nivel de fila (SELECT FOR UPDATE) y tablas de claves de idempotencia UUID v4.",
      security: [
        "Pruebas de concurrencia automatizadas con Pytest simulando 50 hilos paralelos.",
        "Validación estricta de esquemas con Pydantic v2 para prevenir inyecciones SQL.",
        "Despliegue contenerizado en Docker con variables de entorno protegidas."
      ],
      github: "https://github.com/italo04/fintech-transaction-engine"
    },
    "secure-cloud": {
      badge: "AWS · TERRAFORM · HARDENING LINUX",
      title: "Secure Cloud Infra & Linux Hardening",
      subtitle: "Infraestructura Zero-Trust en AWS con bastionado automatizado de servidores",
      problem: "La exposición accidental de instancias de nube a internet público y configuraciones por defecto de Linux facilitan compromisos masivos.",
      solution: "Diseño e implementación de una VPC segmentada con Terraform: subredes públicas para balanceadores y subredes privadas para aplicaciones sin acceso directo desde internet. Servidor Ubuntu Linux bastionado automáticamente mediante scripts en Bash (Fail2ban, iptables, SSH Hardening).",
      security: [
        "Políticas IAM de mínimo privilegio con roles específicos sin credenciales hardcodeadas.",
        "Security Groups estrictos que bloquean todo tráfico entrante salvo llaves SSH autorizadas.",
        "Rotación automatizada de logs y monitoreo."
      ],
      github: "https://github.com/italo04/secure-cloud-infra"
    },
    "tesis-pucp": {
      badge: "INVESTIGACIÓN PUCP · IOT · CLOUD SECURITY",
      title: "Arquitectura Cloud e IoT con Sincronización Asíncrona Segura",
      subtitle: "Tesis de Grado (PFC 1) para transacciones digitales en zonas sin conectividad",
      problem: "Las poblaciones rurales y zonas con cortes de conectividad no pueden participar en la economía digital por falta de sincronización confiable.",
      solution: "Diseño de un prototipo con microcontrolador ESP32 que almacena transacciones localmente con cifrado AES-256 en memoria no volátil, transmitiéndolas asíncronamente mediante protocolo MQTT sobre TLS hacia servicios Cloud (AWS/Azure) cuando se restablece la señal.",
      security: [
        "Cifrado simétrico AES-256 con claves derivadas por sesión.",
        "Verificación de integridad transaccional mediante firmas HMAC.",
        "Modelo de consistencia eventual basado en el teorema PACELC."
      ],
      github: "https://github.com/italo04"
    },
    "tuderecho": {
      badge: "EQUIPU PUCP · LEGALTECH · SCRUM",
      title: "Plataforma LegalTech 'TuDerecho'",
      subtitle: "Incubación en EQUIPU: interacción cliente-abogado y propuestas profesionales",
      problem: "El acceso a asesoría legal temprana en Perú es lento, informal y carece de canales estructurados para personas y microempresas.",
      solution: "Plataforma web colaborativa que conecta ciudadanos con profesionales del derecho. Participo como desarrollador backend modelando la arquitectura C4 y servicios en FastAPI con PostgreSQL bajo metodología ágil Scrum.",
      security: [
        "Control de accesos basado en roles (RBAC).",
        "Validación y cifrado de consultas legales para salvaguardar la confidencialidad.",
        "Presentación de prototipos técnicos ante mentores de la incubadora EQUIPU."
      ],
      github: "https://github.com/italo04"
    }
  };

  const modal = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalContent = document.getElementById("modal-content");
  let lastActiveElement = null;

  document.querySelectorAll(".modal-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const projectId = btn.getAttribute("data-modal");
      const data = projectData[projectId];

      if (data && modal && modalContent) {
        lastActiveElement = btn;
        modalContent.innerHTML = `
          <span class="modal-badge">${data.badge}</span>
          <h3 id="modal-title">${data.title}</h3>
          <p class="modal-subtitle">${data.subtitle}</p>

          <div class="modal-section">
            <h4>El Desafío de Ingeniería</h4>
            <p>${data.problem}</p>
          </div>

          <div class="modal-section">
            <h4>Arquitectura y Solución Técnica</h4>
            <p>${data.solution}</p>
          </div>

          <div class="modal-section">
            <h4>Decisiones de Seguridad & DevSecOps</h4>
            <ul>
              ${data.security.map((s) => `<li>${s}</li>`).join("")}
            </ul>
          </div>

          <div class="modal-section" style="margin-top: 2rem;">
            <a class="btn btn-primary" href="${data.github}" target="_blank" rel="noopener noreferrer">
              <span>Explorar Código en GitHub</span>
              <svg class="icon"><use href="#icon-arrow" /></svg>
            </a>
          </div>
        `;
        modal.showModal();
        if (lenis) lenis.stop();
      }
    });
  });

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener("click", () => {
      modal.close();
    });

    modal.addEventListener("close", () => {
      if (lenis) lenis.start();
      if (lastActiveElement) lastActiveElement.focus();
    });

    // Cerrar al hacer clic en el backdrop
    modal.addEventListener("click", (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  }

  /* ==========================================================================
     11. COPIADO RÁPIDO DE CORREO CON FEEDBACK
     ========================================================================== */
  const copyBtn = document.getElementById("copy-email-btn");
  const copyText = document.getElementById("copy-text");

  if (copyBtn && copyText) {
    copyBtn.addEventListener("click", async () => {
      const email = "italomijail@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        copyText.textContent = "¡Copiado!";
        copyBtn.style.borderColor = "var(--neon-green)";
        copyBtn.style.color = "var(--neon-green)";

        setTimeout(() => {
          copyText.textContent = "Copiar Correo";
          copyBtn.style.borderColor = "";
          copyBtn.style.color = "";
        }, 2200);
      } catch (err) {
        window.location.href = "mailto:" + email;
      }
    });
  }

  /* ==========================================================================
     12. FORMULARIO DE CONTACTO (Validación y Mailto)
     ========================================================================== */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("contact-name").value.trim();
      const email = document.getElementById("contact-email").value.trim();
      const role = document.getElementById("contact-role").value;
      const message = document.getElementById("contact-message").value.trim();

      if (!name || !email || !message) {
        alert("Por favor, completa los campos obligatorios.");
        return;
      }

      const subject = encodeURIComponent(`[Oportunidad / Contacto] ${role} — ${name}`);
      const body = encodeURIComponent(
        `Hola Italo,\n\nSoy ${name} (${email}).\n\nNos gustaría conversar sobre una oportunidad en: ${role}.\n\nMensaje:\n${message}\n\nSaludos cordiales.`
      );

      window.location.href = `mailto:italomijail@gmail.com?subject=${subject}&body=${body}`;
    });
  }

})();
