# Italo Ramos — Portafolio Profesional

Portafolio web de alto rendimiento con **Dirección Visual Dark Futurista con Neón & Bento Grid Moderno** y físicas de interacción inspiradas en la filosofía de **Emil Kowalski**.

## 🎨 Dirección Visual & Stack
- **Estilo:** Dark Futurista con Neón & Bento Grid Moderno.
- **Paleta:** Fondo `#0A0A0F`, superficies `#12121A`, acentos violeta neón `#7C5CFF` y cian ciberseguridad `#00E5FF`.
- **Tipografía:** 
  - Display: `Space Grotesk` (encabezados de alto impacto).
  - Texto base: `Manrope` (legibilidad técnica y contrastes óptimos).
  - Énfasis: `Instrument Serif` (contrastes editoriales precisos).
  - Fuentes servidas 100% de manera local en `assets/fonts/` (archivos `.woff2` sin peticiones externas).
- **Librerías de Movimiento (Servidas localmente en `assets/vendor/`):**
  - **Lenis 1.3.26:** Scroll suave optimizado.
  - **GSAP 3.13.0 & ScrollTrigger:** Animaciones de entrada escalonadas (*stagger*), línea de tiempo interactiva y contadores numéricos.
  - **Motion DOM (Framer Motion):** Físicas de resorte y gestos interactivos.

## 🚀 Secciones Implementadas
1. **Hero:** Título grande con animación de reveal por palabras, canvas interactivo de malla de partículas cibernéticas conectadas y métricas clave de disponibilidad inmediata.
2. **Sobre mí:** Tarjeta de identidad con monograma iluminado y órbitas SVG rotatorias, biografía técnica y contadores numéricos interactivos.
3. **Proyectos:** Bento grid moderno con tarjetas interactivas de **hover 3D tilt**, vista previa de terminal, chips de stack tecnológico y modal accesible de arquitectura C4:
   - *AI-Powered Security Log Analyzer & Threat Detector*
   - *Fintech Transaction Engine*
   - *Secure Cloud Infra & Linux Hardening*
   - *Tesis de Fin de Carrera (PFC 1 PUCP) — Arquitectura Cloud & IoT Offline*
   - *Plataforma LegalTech "TuDerecho" (EQUIPU PUCP)*
4. **Habilidades:** Marquee infinito neón y tarjetas categorizadas (Cloud & DevOps, Ciberseguridad & Redes, Backend & Datos, Inteligencia Artificial).
5. **Experiencia / Formación:** Línea de tiempo interactiva con barra de progreso reactiva al scroll (PUCP, EQUIPU, IEEE PUCP, Work & Travel USA Lifeguard).
6. **Contacto:** Llamada a la acción, botón magnético para copiar correo instantáneo con feedback visual y formulario nativo con validación `mailto:`.
7. **Footer:** Minimalista con enlaces directos a GitHub, LinkedIn y botón scroll-to-top.

## 🏃 Previsualización Local
No requiere compilación. Abre `index.html` o ejecuta un servidor estático:

```sh
python -m http.server 4174 --directory "c:\Users\italo\Documents\Ciclo 2026-2\Practicas pre\portafolio"
```

Abre `http://localhost:4174/`.

## ♿ Accesibilidad y Rendimiento
- Respeta estrictamente `prefers-reduced-motion` (desactiva canvas de partículas, cursor elástico y simplifica transiciones).
- Cursor magnético y efectos de puntero fino aislados bajo `@media (hover: hover) and (pointer: fine)` para no interferir en dispositivos táctiles.
- Despliegue automatizado en GitHub Pages mediante `.github/workflows/deploy.yml`.
