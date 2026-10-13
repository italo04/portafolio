# Verificación de esta actualización

## Comprobado

- `node --check script.js`: sintaxis válida.
- `git diff --check`: sin errores de espacios en el diff.
- Parser HTML: 502 elementos, 41 identificadores únicos, etiquetas balanceadas.
- Anclas internas y referencias SVG: destinos existentes.
- Campos del formulario: etiquetas asociadas, validación nativa y límites de longitud.
- Recursos locales del HTML y CSS: existentes; 11 archivos de fuente con firma WOFF2 válida.
- SVG: XML válido.
- Servidor HTTP local: respuesta 200 para la página y sus recursos principales.
- Repositorios de proyectos: existencia pública y estructura revisadas mediante GitHub API.
- Contraste calculado de texto principal: 13.41:1; texto secundario sobre fondo marfil: 4.86:1; texto secundario en bloque verde: 7.14:1.
- La auditoría de contenido no encontró los números de asistentes, SFC ni otros logros descartados que aparecían en la versión anterior.

## Pendiente de comprobación visual

La herramienta de navegador bloqueó el acceso a la pestaña con una restricción de seguridad. No se intentaron métodos alternativos para eludirla. Por ello no se afirma que se hayan completado pruebas visuales, de interacción en navegador, de rendimiento o en dispositivos físicos.

Checklist para la revisión visual:

- Escritorio, tablet, móvil de 375 px y orientación horizontal: sin desbordamiento ni texto recortado.
- Filtros: Todos = 4 proyectos, Arquitectura = 3, Cloud & seguridad = 1.
- Proyectos: apertura, cierre con botón/Escape/fondo y retorno del foco.
- Navegación móvil: menú, anclas y cierre con Escape.
- Formulario: campos vacíos, correo inválido y apertura del borrador en la aplicación de correo; no realiza envío automático.
- Copiar correo: confirmación o alternativa legible si Clipboard API no está disponible.
- Movimiento reducido y pausa: se detienen desplazamiento suave, parallax, tilt, cursor y marquee.
- Teclado: skip link, foco visible, navegación y diálogo nativo.
- Desactivar JavaScript: contenido y enlaces a repositorios disponibles.

No se ha publicado esta actualización en GitHub Pages.
