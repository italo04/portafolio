# Italo Ramos — Portafolio Profesional (Acid Brutal Edition)

Portafolio web de alto rendimiento transformado bajo la estética **Acid Brutalism / Swiss Cyber-Poster (2026 Edition)**, combinando tipografía monumental de madera/póster, colores de alto contraste neón sobre carbón mate, metadatos técnicos en monospace y físicas de interacción inspiradas en **Emil Kowalski**.

## 🎨 Dirección Visual & Acid Brutalism
- **Estilo:** Acid Brutalism / Swiss Poster Cyber-Brutalist.
- **Paleta:**
  - Fondo: Carbón mate `#0C0D0E` con textura sutil de grano de papel overlay.
  - Acento Eléctrico: Acid Lime Green `#9DFF00` (alto impacto, fluorescente).
  - Texto Tiza / Off-White: `#E5E5DD` (póster vintage / editorial).
  - Tarjetas Kraft Paper: `#D4D4C8` con bordes nítidos y tipografía de tinta negra `#101114`.
  - Divisores: Hairlines técnicos `#26292E`.
- **Tipografía:**
  - Display Monumental: `Bebas Neue` / `Anton` (títulos condensados colosales).
  - Monospace Técnico: `Space Mono` (coordenadas, tags, IDs y métricas de ingeniería).
  - Texto base: `Space Grotesk` y `Manrope` (legibilidad técnica y contrastes óptimos).
- **Librerías de Movimiento (Servidas localmente en `assets/vendor/`):**
  - **Lenis 1.3.26:** Scroll suave desacoplado.
  - **GSAP 3.13.0 & ScrollTrigger:** Animaciones de entrada escalonadas (*stagger*) y seguimiento de scroll.
  - **Motion DOM:** Físicas de resorte y gestos magnéticos.

## 🚀 Arquitectura de Secciones (Póster Modular)
1. **Top Technical Bar:** Coordenadas de Lima, Perú (UTC-5 en vivo), wireframe 3D globe y monitor de estado online.
2. **Hero Poster Split:**
   - Columna izquierda con tipografía colosal `ITALO RAMOS` en chalk white y acid green, más subline con flecha técnica.
   - Columna derecha con badge circular Acid Green (`ID: IR/2026/09`), monograma gráfico con franja glitch/barcode y tarjeta kraft `INTRODUCTION` con flecha doblada `↘`.
3. **Selected Projects (Izquierda):**
   - Números de esténcil con rayas y ecualizadores `01`, `02`, `03`, `04` en Acid Green.
   - Previews de terminal interactivos con status dots.
   - Modales accesibles con arquitectura C4, diagramas y decisiones de ingeniería.
4. **Process Notes (Derecha):**
   - 5 pasos de ingeniería con glifos wireframe: Research (planos apilados), Architecture (retícula 8 rayos), Hardening (órbitas Zero-Trust), Automation (globo CI/CD) y Deliver & SRE (engranaje/sunburst).
5. **Bottom Bento Row (3 Columnas):**
   - **Skills Matrix:** Heatmap / ecualizador interactivo de píxeles con niveles de Basic a Expert para AWS, Docker, Python, Linux, PostgreSQL, DevSecOps y Terraform.
   - **Acid Quote:** *"SECURITY IS ARCHITECTURE MADE VISIBLE."* con globo wireframe y cruces.
   - **Tools Kraft Box:** Lista de herramientas clave y asterisco brutalista de 8 puntas.
6. **Trayectoria & Formación:** Tabla técnica unicolumna (PUCP 9.º ciclo, EQUIPU LegalTech, IEEE PUCP y Work & Travel USA).
7. **Footer Hero (Big Finish):**
   - Tipografía colosal `LET'S BUILD ↗ SOMETHING REAL.`
   - Metadatos de contacto y redes directas.
   - Caja de advertencia de peligro (Hazard) con franjas diagonales negras/acid green: `WORK TOGETHER ↗`.
   - Botón interactivo de copiado de correo de un solo clic con feedback de terminal.
   - Ticker inferior de créditos y estado.

## 🏃 Previsualización Local
No requiere compilación:
```sh
python -m http.server 3000 --directory "c:\Users\italo\Documents\Ciclo 2026-2\Practicas pre\portafolio"
```
Abre `http://localhost:3000/`.

## ♿ Accesibilidad y Rendimiento
- Respeta estrictamente `prefers-reduced-motion` desactivando animaciones continuas.
- Puntero fino y físicas magnéticas aisladas bajo `@media (pointer: fine)`.
- Despliegue automatizado en GitHub Pages mediante `.github/workflows/deploy.yml`.
