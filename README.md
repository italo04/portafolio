# Italo Ramos — portafolio

Web de una sola página, con dirección editorial, tipografía expresiva y gráficos conceptuales de sistemas. Actualiza el portafolio existente de GitHub Pages.

## Vista previa

No requiere instalación ni compilación. Abre `index.html` o ejecuta un servidor estático desde esta carpeta:

```sh
python -m http.server 4174 --bind 127.0.0.1
```

Abre `http://127.0.0.1:4174/`. Las fuentes y librerías se sirven localmente. La copia de correo depende de Clipboard API y de un contexto seguro (localhost o HTTPS); si no está disponible, se muestra el correo para copiarlo manualmente.

## Archivos

- `index.html`: contenido, navegación, proyectos y formulario.
- `styles.css`: tokens, composición y adaptación a pantallas pequeñas.
- `script.js`: datos de proyectos, filtros, modales, movimiento y contacto.
- `assets/system-object.svg`: ilustración vectorial original de sistemas conectados.
- `assets/fonts/`: Space Grotesk, Manrope e Instrument Serif, servidas localmente.
- `assets/vendor/`: GSAP 3.13.0, ScrollTrigger, Lenis 1.3.26 y Motion DOM de Framer Motion 13.4.6.
- `docs/content-notes.md`: fuentes y límites del contenido profesional.

## Movimiento e interacción

Lenis se sincroniza con el ticker de GSAP. ScrollTrigger controla las entradas y el parallax; Motion DOM se usa para las interacciones de puntero con resortes y el modal. La página no necesita React.

- Reveal del título y entradas al hacer scroll.
- Proyectos con filtros, tilt suave y detalles en un diálogo nativo.
- Botones magnéticos y cursor decorativo, solo para puntero fino.
- Barra de progreso y cabecera que responde al desplazamiento.
- Navegación móvil, cierre con Escape y retorno del foco desde los proyectos.
- `prefers-reduced-motion`, botón de pausa persistente y suspensión del marquee en pestañas ocultas.
- El contenido y los enlaces a repositorios permanecen accesibles sin las librerías de animación.

## Contacto

El formulario valida los campos y prepara un enlace `mailto:` con asunto y cuerpo codificados. **No envía el mensaje desde un servidor.** El visitante completa el envío en su aplicación de correo. No se almacenan los datos del formulario ni se incluyen analíticas.

## Publicación

Se conserva `.github/workflows/deploy.yml`, que publica el directorio estático en GitHub Pages al hacer push a `main`. Esta actualización se prepara localmente; no implica que haya sido publicada.

## Dependencias y licencias

Motion y Lenis conservan sus avisos MIT en `assets/vendor/`. GSAP y ScrollTrigger conservan el aviso de licencia en sus cabeceras; condiciones: https://gsap.com/standard-license/. Las licencias OFL de las fuentes se incluyen en `assets/fonts/`.

Los vídeos de la versión anterior se conservan en `assets/videos/`, pero la nueva web no los descarga ni reproduce.
