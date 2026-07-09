# Pasemóvil — Sitio web oficial

Sitio estático para **Pasemóvil**, Centro de Enseñanza Automovilística en Medellín, Colombia.
Construido únicamente con **HTML5, CSS3 y JavaScript** (sin frameworks, sin dependencias, sin paso de compilación).

Abre `index.html` en un navegador y funciona. Súbelo a GitHub Pages, Netlify o Vercel tal cual.

---

## ⚠️ Antes de publicar: 4 cosas pendientes

Estas son las únicas tareas que requieren información que solo tú tienes.
Todo lo demás ya está terminado.

| # | Qué | Dónde | Por qué |
|---|-----|-------|---------|
| 1 | **Dirección exacta de la sede** | `index.html` → busca `[Completar dirección exacta]` | Aparece en la sección de contacto |
| 2 | **Insertar Google Maps** | `index.html` → sección `#ubicacion` | Está el contenedor listo; falta pegar el `<iframe>` |
| 3 | **Conectar el formulario** | `index.html` → `<form id="form-contacto" action="#">` | Un sitio estático no puede enviar correos por sí solo (ver abajo) |
| 4 | **Testimonios reales** | `index.html` → sección `#testimonios` | Los actuales están marcados como `[EJEMPLO]` |

Además, **cuando quieras que Google indexe la página**:
- Elimina `<meta name="robots" content="noindex, nofollow">` de `index.html`.
- Borra las líneas `Disallow: /` de `robots.txt`.

---

## Identidad visual

Los colores **no fueron inventados**: se extrajeron por muestreo de píxeles del logo oficial.

| Color | Hex | Origen en el logo |
|-------|-----|-------------------|
| Rojo | `#C03A3B` | Icono de carretera + la palabra «móvil» |
| Verde | `#91C232` | La palabra «Pase» |
| Gris | `#A0A0A0` | Tagline «Formamos conductores conscientes» |

### Nota importante de accesibilidad

El verde de marca `#91C232` tiene un contraste de solo **2.11:1** sobre blanco.
Eso **no cumple** el mínimo WCAG AA (4.5:1) para texto pequeño.

Por eso el sistema de diseño lo trata así:

- El verde de marca se usa como **relleno** (botones, acentos, formas). Nunca como texto pequeño sobre blanco.
- Para texto en verde existe `--verde-texto` (`#4F6B1B`, **6.08:1**).
- Para texto en rojo existe `--rojo-texto` (`#A32F30`, **6.98:1**).

Si cambias un color, revisa el contraste antes. Todos los tokens viven al inicio de `css/style.css`.

**El logo siempre va sobre una placa blanca** (`.marca__placa`). Esto no es capricho: el logo contiene
grises y blancos internos (las líneas de la carretera, el tagline) que desaparecen sobre fondos oscuros.
Es también como se usa en la fachada real y en los vehículos.

### Tipografía

- **Manrope** (700/800) — titulares y elementos de interfaz.
- **Inter** (400/600) — texto corrido.

Ambas se cargan desde Google Fonts con `display=swap`.
Si necesitas alojarlas localmente, la carpeta `assets/fonts/` está lista.

---

## Estructura

```
/index.html
/css/style.css      → tokens, componentes, responsive (21 secciones comentadas)
/js/script.js       → 9 módulos independientes, vanilla JS
/assets/img/        → logo, favicons, fotos optimizadas (.webp + .jpg de respaldo)
/assets/icons/      → vacía (los iconos son SVG en línea)
/assets/fonts/      → vacía (fuentes desde Google Fonts)
/robots.txt
/sitemap.xml
/README.md
```

### ¿Por qué `assets/icons/` está vacía?

Todos los iconos son **SVG en línea** dentro del HTML. Es intencional: cero peticiones de red
adicionales, heredan el color con `currentColor`, y no hay archivos que se puedan perder.
La carpeta se mantiene porque la pediste en la estructura.

---

## Conectar el formulario de contacto

Un sitio 100% estático **no puede enviar correos**. Necesita un servicio externo.
El botón de WhatsApp, en cambio, ya funciona al 100%.

Mientras `action="#"`, el formulario valida los campos y luego muestra un mensaje que
redirige al usuario a WhatsApp. En cuanto pongas un endpoint real, el envío funciona solo.

**Opción A — Formspree** (la más rápida)
1. Crea una cuenta en formspree.io y un formulario nuevo.
2. En `index.html`, cambia:
   ```html
   <form id="form-contacto" action="https://formspree.io/f/TU_ID" method="POST" novalidate>
   ```

**Opción B — Netlify Forms** (si despliegas en Netlify)
```html
<form id="form-contacto" name="contacto" method="POST" data-netlify="true" novalidate>
  <input type="hidden" name="form-name" value="contacto">
```

**Opción C — Web3Forms** (sin cuenta, con access key)
```html
<form id="form-contacto" action="https://api.web3forms.com/submit" method="POST" novalidate>
  <input type="hidden" name="access_key" value="TU_ACCESS_KEY">
```

---

## Imágenes

Las fotos originales pesaban ~22 MB en total. Se procesaron así:

- Corrección de **orientación EXIF** (varias venían rotadas).
- Versiones **WebP** en 600 / 1200 / 1800 px con `srcset`, para que cada dispositivo baje solo lo necesario.
- Respaldo **JPEG progresivo** para navegadores antiguos.
- Resultado: **~8.8 MB**, y en una carga típica el navegador descarga una fracción de eso.

Todas las imágenes tienen `width`/`height` explícitos (evita saltos de layout, CLS) y `loading="lazy"`
salvo la del hero, que usa `fetchpriority="high"`.

Para reemplazar una foto: pon la nueva en `assets/img/` con el mismo nombre, o actualiza las rutas
en `index.html`. Recuerda actualizar también el `alt`.

---

## Accesibilidad

- HTML semántico (`header`, `main`, `section`, `nav`, `footer`, `article`, `figure`).
- Enlace «Saltar al contenido principal» para lectores de pantalla.
- Foco visible en todos los elementos interactivos (`:focus-visible`).
- Lightbox navegable con teclado (`Esc`, `←`, `→`) y devuelve el foco al cerrar.
- Acordeón con `aria-expanded` / `aria-controls`.
- Formulario con `aria-invalid` y mensajes de error asociados.
- Se respeta `prefers-reduced-motion`: si el usuario lo activa, se desactivan todas las animaciones.
- Contraste verificado (ver sección de identidad visual).

---

## Rendimiento

- Sin frameworks, sin dependencias: el JS pesa unos pocos KB.
- Un solo CSS, un solo JS, ambos con `defer`.
- `preconnect` a Google Fonts.
- Imágenes en WebP con `srcset` + `lazy loading`.
- Listeners de scroll con `requestAnimationFrame` y `{ passive: true }`.
- Sin `localStorage` ni cookies.

---

## Personalización rápida

| Quiero cambiar… | Ve a… |
|---|---|
| Colores | `css/style.css`, bloque `:root` (sección 1) |
| Espaciado / tamaños | `css/style.css`, tokens `--sp-*` y `--t-*` |
| Número de WhatsApp | Busca `573005474181` en `index.html` (aparece 9 veces) |
| Textos | Directamente en `index.html`; está comentado por secciones |
| Horarios | `index.html`, sección `#horarios` |

> El número de WhatsApp usa formato internacional sin `+` ni espacios: `57` (Colombia) + `3005474181`.

---

## Datos de contacto usados

Tomados de la señalización de la sede y de los vehículos en las fotografías aportadas:

- WhatsApp: **300 547 4181**
- Fijo: **604 408 4019**
- Instagram: **@pasemovil**

Si alguno cambió, actualízalo en `index.html` (encabezado, hero, contacto, footer y botón flotante).

---

## Licencia

Código: libre de usar y modificar para Pasemóvil.
Fotografías y logo: propiedad de Pasemóvil.
