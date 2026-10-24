# El Tribunal de la Tinta

Blog literario responsive, en español, con estética editorial en crema, vino tinto y marrón. Está hecho con HTML, CSS y JavaScript sencillo, sin frameworks.

## Publicarlo en GitHub Pages
1. Descarga y descomprime el ZIP. **Sube el contenido de esta carpeta**, no el archivo ZIP, a la raíz de un repositorio de GitHub. Debes ver `index.html`, `css/`, `js/`, `images/` y `.github/` directamente en el repositorio.
2. Haz el repositorio **público**.
3. En **Settings → Pages**, elige **Deploy from a branch**, selecciona `main` y `/(root)`, y guarda.
4. Espera a que GitHub Pages publique el enlace.

## Comentarios públicos y reseñas comunitarias
El sitio usa GitHub para evitar una base de datos o servidor propio:
- **Comentarios:** se cargan con Utterances. En el repositorio, activa **Issues** e instala la app de Utterances desde https://github.com/apps/utterances. Autoriza el repositorio público. La configuración del blog detecta automáticamente el repositorio de GitHub Pages.
- **Reseñas de lectores:** el formulario prepara una publicación pública en GitHub Issues. La persona debe iniciar sesión y confirmar la publicación. El archivo `.github/ISSUE_TEMPLATE/review.yml` añade la etiqueta `reseña-comunidad`; las reseñas con esa etiqueta aparecen en la página Comunidad.
- Los comentarios y reseñas serán públicos, por lo que no deben incluir datos privados.

## Antes de entregar
1. En `sobre-mi.html`, personaliza tu presentación, añade tu foto y reemplaza los enlaces de ejemplo por tus redes reales.
2. Revisa las reseñas de ejemplo en `resenas.html` para que reflejen tus opiniones reales.
3. Revisa las fechas del `calendario.html`.
4. Las imágenes ambientales y las fuentes usan servicios externos, por lo que necesitan conexión a internet.

## Estructura
- `index.html`: portada.
- `articulos.html`: índice de artículos.
- `articulo-criada.html`: artículo principal sobre *El cuento de la criada*.
- `resenas.html`: reseñas literarias.
- `comunidad.html`: formulario y reseñas públicas de lectores.
- `sobre-mi.html`: presentación personal.
- `calendario.html`: calendario editorial.
- `css/styles.css`: diseño responsive.
- `js/main.js`: menú, reseñas públicas y comentarios.
