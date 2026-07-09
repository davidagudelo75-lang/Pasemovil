/* ============================================================
   Pasemóvil — script.js
   ------------------------------------------------------------
   Vanilla JS, sin dependencias. Organizado en módulos
   independientes: si eliminas uno, los demás siguen funcionando.

   Módulos:
     1. Encabezado fijo al hacer scroll
     2. Menú móvil
     3. Revelado al hacer scroll (IntersectionObserver)
     4. Botón flotante de WhatsApp
     5. Galería + lightbox (con teclado)
     6. Carrusel de testimonios
     7. Acordeón de preguntas frecuentes
     8. Validación del formulario
     9. Año dinámico en el pie
   ============================================================ */

(function () {
  'use strict';

  /* Atajos */
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ¿El usuario prefiere menos movimiento? */
  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ========================================================
     1. ENCABEZADO FIJO
     Añade la clase .is-fijo cuando bajamos del hero.
     ======================================================== */
  (function encabezadoFijo() {
    var encabezado = $('#encabezado');
    if (!encabezado) return;

    var ticking = false;

    function actualizar() {
      encabezado.classList.toggle('is-fijo', window.scrollY > 60);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(actualizar);
        ticking = true;
      }
    }, { passive: true });

    actualizar();
  })();


  /* ========================================================
     2. MENÚ MÓVIL
     ======================================================== */
  (function menuMovil() {
    var boton = $('#hamburguesa');
    var nav   = $('#nav');
    if (!boton || !nav) return;

    function cerrar() {
      nav.classList.remove('abierto');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
    }

    function alternar() {
      var abierto = nav.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      // Evita el scroll del fondo mientras el menú está abierto
      document.body.style.overflow = abierto ? 'hidden' : '';
    }

    boton.addEventListener('click', alternar);

    // Cierra al pulsar cualquier enlace del menú
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', cerrar);
    });

    // Cierra con la tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('abierto')) {
        cerrar();
        boton.focus();
      }
    });

    // Si se agranda la ventana, restablece el estado
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) cerrar();
    });
  })();


  /* ========================================================
     3. REVELADO AL HACER SCROLL
     Los elementos .revelar aparecen al entrar en pantalla.
     Si no hay soporte de IntersectionObserver, se muestran
     todos de inmediato (degradación elegante).
     ======================================================== */
  (function revelarAlScroll() {
    var elementos = $$('.revelar');
    if (!elementos.length) return;

    if (menosMovimiento || !('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target); // solo una vez
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elementos.forEach(function (el) { observador.observe(el); });
  })();


  /* ========================================================
     4. BOTÓN FLOTANTE DE WHATSAPP
     Aparece tras bajar un poco, para no tapar el hero.
     ======================================================== */
  (function whatsappFlotante() {
    var wa = $('#wa-flotante');
    if (!wa) return;

    var ticking = false;

    function actualizar() {
      wa.classList.toggle('visible', window.scrollY > 420);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(actualizar);
        ticking = true;
      }
    }, { passive: true });

    actualizar();
  })();


  /* ========================================================
     5. GALERÍA + LIGHTBOX
     Navegable con teclado: Escape cierra, ← → cambian imagen.
     Devuelve el foco al botón de origen al cerrar (accesibilidad).
     ======================================================== */
  (function lightbox() {
    var grid = $('#galeria-grid');
    var caja = $('#lightbox');
    if (!grid || !caja) return;

    var img      = $('#lb-img');
    var contador = $('#lb-contador');
    var btnCerrar = $('#lb-cerrar');
    var btnPrev   = $('#lb-prev');
    var btnNext   = $('#lb-next');

    var items = $$('.galeria__item', grid);
    var indice = 0;
    var ultimoFoco = null;

    function mostrar(i) {
      // Envuelve el índice para que sea circular
      indice = (i + items.length) % items.length;
      var boton = items[indice];
      img.src = boton.dataset.full;
      img.alt = boton.dataset.alt || '';
      contador.textContent = (indice + 1) + ' / ' + items.length;
    }

    function abrir(i) {
      ultimoFoco = document.activeElement;
      mostrar(i);
      caja.classList.add('abierto');
      document.body.style.overflow = 'hidden';
      btnCerrar.focus();
    }

    function cerrar() {
      caja.classList.remove('abierto');
      document.body.style.overflow = '';
      if (ultimoFoco) ultimoFoco.focus();
    }

    items.forEach(function (boton, i) {
      boton.addEventListener('click', function () { abrir(i); });
    });

    btnCerrar.addEventListener('click', cerrar);
    btnPrev.addEventListener('click', function () { mostrar(indice - 1); });
    btnNext.addEventListener('click', function () { mostrar(indice + 1); });

    // Clic en el fondo (no en la imagen ni en los controles) cierra
    caja.addEventListener('click', function (e) {
      if (e.target === caja) cerrar();
    });

    document.addEventListener('keydown', function (e) {
      if (!caja.classList.contains('abierto')) return;
      if (e.key === 'Escape')     cerrar();
      if (e.key === 'ArrowLeft')  mostrar(indice - 1);
      if (e.key === 'ArrowRight') mostrar(indice + 1);
    });
  })();


  /* ========================================================
     6. CARRUSEL DE TESTIMONIOS
     Desplazamiento nativo con scroll-snap; los botones
     solo mueven la pista un "paso".
     ======================================================== */
  (function carrusel() {
    var pista = $('#carrusel-pista');
    var prev  = $('#car-prev');
    var next  = $('#car-next');
    if (!pista || !prev || !next) return;

    function paso() {
      var tarjeta = $('.testimonio', pista);
      if (!tarjeta) return 320;
      // ancho de la tarjeta + separación
      return tarjeta.offsetWidth + 24;
    }

    prev.addEventListener('click', function () {
      pista.scrollBy({ left: -paso(), behavior: menosMovimiento ? 'auto' : 'smooth' });
    });

    next.addEventListener('click', function () {
      pista.scrollBy({ left: paso(), behavior: menosMovimiento ? 'auto' : 'smooth' });
    });

    // Atenúa los botones cuando se llega a un extremo
    function actualizarBotones() {
      var max = pista.scrollWidth - pista.clientWidth - 2;
      prev.style.opacity = pista.scrollLeft <= 2 ? '.4' : '1';
      next.style.opacity = pista.scrollLeft >= max ? '.4' : '1';
    }

    pista.addEventListener('scroll', actualizarBotones, { passive: true });
    window.addEventListener('resize', actualizarBotones);
    actualizarBotones();
  })();


  /* ========================================================
     7. ACORDEÓN DE PREGUNTAS FRECUENTES
     Anima la altura real del panel (height: 0 → scrollHeight),
     y la deja en "auto" al terminar para que sea responsive.
     ======================================================== */
  (function faq() {
    var botones = $$('.faq__boton');
    if (!botones.length) return;

    botones.forEach(function (boton) {
      var panel = document.getElementById(boton.getAttribute('aria-controls'));
      if (!panel) return;

      boton.addEventListener('click', function () {
        var abierto = boton.getAttribute('aria-expanded') === 'true';

        // Cierra los demás paneles (comportamiento de acordeón)
        botones.forEach(function (otro) {
          if (otro === boton) return;
          var otroPanel = document.getElementById(otro.getAttribute('aria-controls'));
          if (otro.getAttribute('aria-expanded') === 'true' && otroPanel) {
            otro.setAttribute('aria-expanded', 'false');
            otroPanel.style.height = otroPanel.scrollHeight + 'px';
            requestAnimationFrame(function () { otroPanel.style.height = '0px'; });
          }
        });

        if (abierto) {
          boton.setAttribute('aria-expanded', 'false');
          panel.style.height = panel.scrollHeight + 'px';
          requestAnimationFrame(function () { panel.style.height = '0px'; });
        } else {
          boton.setAttribute('aria-expanded', 'true');
          panel.style.height = panel.scrollHeight + 'px';
          panel.addEventListener('transitionend', function alFinal() {
            panel.style.height = 'auto'; // permite que crezca si cambia el ancho
            panel.removeEventListener('transitionend', alFinal);
          });
        }
      });
    });
  })();


  /* ========================================================
     8. VALIDACIÓN DEL FORMULARIO
     ------------------------------------------------------------
     IMPORTANTE: esta validación es solo del lado del cliente.
     El envío real necesita un servicio externo (Formspree,
     Netlify Forms, Web3Forms...). Configúralo en el atributo
     `action` del <form> en index.html.
     ======================================================== */
  (function formulario() {
    var form = $('#form-contacto');
    if (!form) return;

    var estado = $('#form-estado');

    /* Reglas por campo: devuelve true si el valor es válido */
    var reglas = {
      nombre:   function (v) { return v.trim().length >= 2; },
      telefono: function (v) { return v.replace(/\D/g, '').length >= 7; },
      correo:   function (v) { return v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, // opcional
      curso:    function (v) { return v !== ''; }
    };

    function contenedorDe(campo) { return campo.closest('.campo'); }

    function validarCampo(campo) {
      var regla = reglas[campo.name];
      if (!regla) return true;

      var valido = regla(campo.value);
      var caja = contenedorDe(campo);
      if (caja) caja.classList.toggle('campo--error', !valido);
      campo.setAttribute('aria-invalid', String(!valido));
      return valido;
    }

    /* Revalida en vivo, pero solo después del primer error */
    Object.keys(reglas).forEach(function (nombre) {
      var campo = form.elements[nombre];
      if (!campo) return;

      campo.addEventListener('blur', function () { validarCampo(campo); });
      campo.addEventListener('input', function () {
        var caja = contenedorDe(campo);
        if (caja && caja.classList.contains('campo--error')) validarCampo(campo);
      });
    });

    form.addEventListener('submit', function (e) {
      var todoBien = true;
      var primerError = null;

      Object.keys(reglas).forEach(function (nombre) {
        var campo = form.elements[nombre];
        if (!campo) return;
        if (!validarCampo(campo)) {
          todoBien = false;
          if (!primerError) primerError = campo;
        }
      });

      if (!todoBien) {
        e.preventDefault();
        estado.className = 'form__estado error';
        estado.textContent = 'Revisa los campos marcados y vuelve a enviar.';
        if (primerError) primerError.focus();
        return;
      }

      /* Si aún no hay un endpoint configurado (action="#"),
         evitamos el envío y guiamos al usuario a WhatsApp. */
      var destino = form.getAttribute('action');
      if (!destino || destino === '#') {
        e.preventDefault();
        estado.className = 'form__estado ok';
        estado.textContent = 'El envío por correo aún no está configurado. Escríbenos por WhatsApp al 300 547 4181 y te respondemos de inmediato.';
        return;
      }

      /* Si hay endpoint, dejamos que el formulario se envíe normalmente. */
      estado.className = 'form__estado ok';
      estado.textContent = 'Enviando…';
    });
  })();


  /* ========================================================
     9. AÑO DINÁMICO EN EL PIE
     ======================================================== */
  (function anio() {
    var el = $('#anio');
    if (el) el.textContent = new Date().getFullYear();
  })();

})();
