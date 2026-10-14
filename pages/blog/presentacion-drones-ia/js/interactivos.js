// Interactivos de la presentación. Sin dependencias: solo DOM y canvas.
(function () {
  "use strict";

  const CFG = window.CONFIG || {};
  const $ = (id) => document.getElementById(id);

  // Al exportar a PDF (?print-pdf) las animaciones se muestran ya terminadas.
  const IMPRESION = /print-pdf/.test(window.location.search);

  // Imágenes en grises embebidas (js/gato_datos.js y js/hoja_gris_datos.js), decodificadas una sola vez.
  // El gato es el ejemplo conductor; la hoja de arroz queda como alternativa.
  const decodificadas = {};
  function imagenGris(nombre) {
    const fuente = window[nombre];
    if (!fuente) return null;
    if (!decodificadas[nombre]) {
      const binario = atob(fuente.b64);
      const pixeles = new Float32Array(fuente.ancho * fuente.alto);
      for (let i = 0; i < pixeles.length; i++) pixeles[i] = binario.charCodeAt(i);
      decodificadas[nombre] = { ancho: fuente.ancho, alto: fuente.alto, pixeles: pixeles };
    }
    return decodificadas[nombre];
  }

  // Suma de los nueve productos de la ventana 3 × 3 centrada en (x, y); en el borde se repite el píxel.
  function ventana3x3(img, k, x, y) {
    let suma = 0;
    for (let m = -1; m <= 1; m++) {
      for (let n = -1; n <= 1; n++) {
        const yy = Math.min(img.alto - 1, Math.max(0, y + m));
        const xx = Math.min(img.ancho - 1, Math.max(0, x + n));
        suma += img.pixeles[yy * img.ancho + xx] * k[(m + 1) * 3 + (n + 1)];
      }
    }
    return suma;
  }

  // Botones «Paso», «Automático» y «Reiniciar» de una animación. avanzar() devuelve false al terminar.
  function reproductor(prefijo, avanzar, reiniciar, ms) {
    const botonAuto = $(prefijo + "-auto");
    let temporizador = null;
    function detener() {
      if (temporizador) clearInterval(temporizador);
      temporizador = null;
      botonAuto.classList.remove("activo");
    }
    function iniciar() {
      detener();
      botonAuto.classList.add("activo");
      temporizador = setInterval(() => {
        if (!avanzar()) detener();
      }, ms);
    }
    $(prefijo + "-paso").addEventListener("click", () => {
      detener();
      avanzar();
    });
    botonAuto.addEventListener("click", () => (temporizador ? detener() : iniciar()));
    $(prefijo + "-reiniciar").addEventListener("click", () => {
      detener();
      reiniciar();
    });
    return { detener: detener, iniciar: iniciar };
  }

  /* ---------- Portada, equipo y enlaces ---------- */

  function textosDeConfig() {
    const lineas = {
      "ponente": CFG.ponente,
      "ponente-titulos": (CFG.ponenteTitulos || []).filter(Boolean).join(" · "),
      "ponente-afiliacion": CFG.ponenteAfiliacion,
      "fecha-evento": CFG.fechaEvento,
      "duracion": CFG.duracion
    };
    Object.keys(lineas).forEach((id) => {
      if (!$(id)) return;
      $(id).textContent = lineas[id] || "";
      $(id).hidden = !lineas[id];
    });
    if ($("asistentes") && Array.isArray(CFG.asistentes) && CFG.asistentes.length) {
      const rotulo = CFG.asistentes.length === 1 ? "Asistente de investigación: " : "Asistentes de investigación: ";
      $("asistentes").textContent = rotulo + CFG.asistentes.join(", ");
    }
  }

  function codigoQr(idCaja, idEnlace, url, archivoConfig) {
    const caja = $(idCaja);
    if (!caja) return;
    if (!url) {
      caja.classList.add("pendiente");
      caja.textContent = "Enlace pendiente: escríbelo en " + archivoConfig;
      return;
    }
    const qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();
    // El QR también es un enlace: con un clic abre la demostración en una pestaña nueva.
    caja.innerHTML = `<a href="${url}" target="_blank" rel="noopener" title="Abrir en una pestaña nueva">` +
      qr.createSvgTag({ cellSize: 6, margin: 1, scalable: true }) + "</a>";
    const enlace = $(idEnlace);
    if (enlace) {
      const a = document.createElement("a");
      a.href = url;
      a.textContent = url.replace(/^https?:\/\//, "");
      a.target = "_blank";
      a.rel = "noopener"; // pestaña nueva: la presentación se queda en su lámina
      enlace.appendChild(a);
    }
  }

  /* ---------- Fotos que coloca el usuario en assets/fotos/ ---------- */

  const EXTENSIONES = ["jpg", "jpeg", "png", "webp"];

  function cargarFoto(figura) {
    const nombre = figura.dataset.foto;
    const pie = figura.querySelector("figcaption");
    const img = new Image();
    let intento = 0;
    img.alt = pie ? pie.textContent.trim() : nombre;
    img.onload = () => figura.insertBefore(img, figura.firstChild);
    img.onerror = () => {
      intento += 1;
      if (intento < EXTENSIONES.length) {
        img.src = "assets/fotos/" + nombre + "." + EXTENSIONES[intento];
        return;
      }
      const hueco = document.createElement("div");
      hueco.className = "foto-falta";
      hueco.innerHTML = "Foto pendiente<code>assets/fotos/" + nombre + ".jpg</code>";
      figura.insertBefore(hueco, figura.firstChild);
    };
    img.src = "assets/fotos/" + nombre + "." + EXTENSIONES[0];
  }

  /* ---------- Imagen = matriz ---------- */

  function rejillasDePixeles(datos, idGris, idNum) {
    const gris = $(idGris);
    const num = $(idNum);
    if (!datos || !gris || !num) return;
    const celdasGris = [];
    const celdasNum = [];
    datos.gris.flat().forEach((v, i) => {
      const a = document.createElement("div");
      a.style.background = "rgb(" + v + "," + v + "," + v + ")";
      const b = document.createElement("div");
      b.textContent = v;
      gris.appendChild(a);
      num.appendChild(b);
      celdasGris.push(a);
      celdasNum.push(b);
      const activar = (si) => {
        a.classList.toggle("activo", si);
        b.classList.toggle("activo", si);
      };
      [a, b].forEach((el) => {
        el.addEventListener("mouseenter", () => activar(true));
        el.addEventListener("mouseleave", () => activar(false));
      });
    });
  }

  /* ---------- Imagen a color = tres matrices ---------- */

  function pixelesColor() {
    const datos = window.GATO_MATRIZ;
    const lectura = $("pixc-lectura");
    const cajas = ["pixc-color", "pixc-r", "pixc-g", "pixc-b"].map($);
    if (!datos || cajas.some((c) => !c)) return;

    const pixeles = datos.rgb.flat();
    const lado = datos.rgb.length;
    const tinta = [
      (p) => "rgb(" + p[0] + "," + p[1] + "," + p[2] + ")",
      (p) => "rgb(" + p[0] + ",0,0)",
      (p) => "rgb(0," + p[1] + ",0)",
      (p) => "rgb(0,0," + p[2] + ")"
    ];
    const celdas = cajas.map((caja, k) =>
      pixeles.map((p) => {
        const d = document.createElement("div");
        d.style.background = tinta[k](p);
        caja.appendChild(d);
        return d;
      })
    );

    let elegido = -1;
    function elegir(i) {
      if (elegido >= 0) celdas.forEach((grupo) => grupo[elegido].classList.remove("activo"));
      elegido = i;
      celdas.forEach((grupo) => grupo[i].classList.add("activo"));
      const p = pixeles[i];
      lectura.innerHTML =
        '<span class="muestra" style="background:' + tinta[0](p) + '"></span> fila ' + (Math.floor(i / lado) + 1) + ", columna " + ((i % lado) + 1) +
        ' &nbsp;→&nbsp; <b class="r">R = ' + p[0] + '</b> &nbsp; <b class="g">G = ' + p[1] + '</b> &nbsp; <b class="b">B = ' + p[2] + "</b>";
    }
    celdas.forEach((grupo) => grupo.forEach((d, i) => d.addEventListener("mouseenter", () => elegir(i))));

    // Al abrir se muestra el píxel más "colorido": aquel cuyos tres canales difieren más.
    let inicial = 0;
    pixeles.forEach((p, i) => {
      const q = pixeles[inicial];
      if (Math.max.apply(null, p) - Math.min.apply(null, p) > Math.max.apply(null, q) - Math.min.apply(null, q)) inicial = i;
    });
    elegir(inicial);
  }

  /* ---------- Tensor RGB: tres planos apilados ---------- */

  function planosRgb() {
    const caja = $("planos-rgb");
    const datos = window.GATO_MATRIZ;
    if (!caja || !datos) return;
    const canales = [
      { nombre: "Azul", idx: 2 },
      { nombre: "Rojo", idx: 0 },
      { nombre: "Verde", idx: 1 }
    ];
    const n = datos.rgb.length;
    canales.forEach((canal, k) => {
      const plano = document.createElement("div");
      plano.className = "plano";
      plano.style.left = k * 54 + "px";
      plano.style.top = k * 48 + "px";
      const lienzo = document.createElement("canvas");
      lienzo.width = n;
      lienzo.height = n;
      const ctx = lienzo.getContext("2d");
      const img = ctx.createImageData(n, n);
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const v = datos.rgb[y][x][canal.idx];
          const p = (y * n + x) * 4;
          img.data[p] = canal.idx === 0 ? v : 0;
          img.data[p + 1] = canal.idx === 1 ? v : 0;
          img.data[p + 2] = canal.idx === 2 ? v : 0;
          img.data[p + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      const etiqueta = document.createElement("span");
      etiqueta.textContent = canal.nombre;
      plano.appendChild(lienzo);
      plano.appendChild(etiqueta);
      caja.appendChild(plano);
    });
  }

  /* ---------- Convolución ---------- */

  const FILTROS = {
    // Impulso unitario (delta de Dirac discreta): el neutro de la convolución, no la matriz identidad.
    "Impulso (δ)": [0, 0, 0, 0, 1, 0, 0, 0, 0],
    "Desenfoque": [1, 1, 1, 1, 1, 1, 1, 1, 1].map((v) => +(v / 9).toFixed(2)),
    "Bordes verticales": [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    "Bordes horizontales": [-1, -2, -1, 0, 0, 0, 1, 2, 1],
    "Realce": [0, -1, 0, -1, 5, -1, 0, -1, 0]
  };

  function convolucion() {
    const lienzoEntrada = $("conv-entrada");
    const lienzoSalida = $("conv-salida");
    const cajaKernel = $("conv-kernel");
    const cajaBotones = $("conv-botones");
    const cajaImagenes = $("conv-imagenes");
    const calculo = $("conv-calculo");
    const IMAGENES = { "Gato": imagenGris("GATO_GRIS"), "Hoja de arroz": imagenGris("HOJA_GRIS") };
    let fuente = IMAGENES["Gato"] || IMAGENES["Hoja de arroz"];
    if (!fuente || !lienzoEntrada || !lienzoSalida) return;

    const ctxEntrada = lienzoEntrada.getContext("2d");
    const ctxSalida = lienzoSalida.getContext("2d");

    function dibujarEntrada() {
      lienzoEntrada.width = lienzoSalida.width = fuente.ancho;
      lienzoEntrada.height = lienzoSalida.height = fuente.alto;
      const img = ctxEntrada.createImageData(fuente.ancho, fuente.alto);
      for (let i = 0; i < fuente.pixeles.length; i++) {
        const v = fuente.pixeles[i];
        img.data.set([v, v, v, 255], i * 4);
      }
      ctxEntrada.putImageData(img, 0, 0);
    }

    const botonesImagen = {};
    if (cajaImagenes) {
      Object.keys(IMAGENES).forEach((nombre) => {
        if (!IMAGENES[nombre]) return;
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "boton";
        boton.textContent = nombre;
        boton.addEventListener("click", () => {
          fuente = IMAGENES[nombre];
          Object.keys(botonesImagen).forEach((n) => botonesImagen[n].classList.toggle("activo", n === nombre));
          dibujarEntrada();
          aplicar();
        });
        cajaImagenes.appendChild(boton);
        botonesImagen[nombre] = boton;
      });
    }

    const entradas = [];
    for (let i = 0; i < 9; i++) {
      const campo = document.createElement("input");
      campo.type = "number";
      campo.step = "0.5";
      campo.setAttribute("aria-label", "Valor " + (i + 1) + " del filtro");
      campo.addEventListener("input", () => {
        marcarBoton(null);
        aplicar();
      });
      // Evita que las flechas del teclado cambien de lámina mientras se edita el filtro.
      campo.addEventListener("keydown", (e) => e.stopPropagation());
      cajaKernel.appendChild(campo);
      entradas.push(campo);
    }

    const botones = {};
    Object.keys(FILTROS).forEach((nombre) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "boton";
      boton.textContent = nombre;
      boton.addEventListener("click", () => {
        FILTROS[nombre].forEach((v, i) => (entradas[i].value = v));
        marcarBoton(nombre);
        aplicar();
      });
      cajaBotones.appendChild(boton);
      botones[nombre] = boton;
    });

    function marcarBoton(nombre) {
      Object.keys(botones).forEach((n) => botones[n].classList.toggle("activo", n === nombre));
    }

    function leerKernel() {
      return entradas.map((c) => parseFloat(c.value) || 0);
    }

    // Un filtro cuya suma es ~0 (detector de bordes) da valores con signo:
    // se muestra su magnitud. En otro caso se muestra el valor recortado a [0, 255].
    function esDetector(k) {
      return Math.abs(k.reduce((a, b) => a + b, 0)) < 0.05;
    }

    function aplicar() {
      const k = leerKernel();
      const detector = esDetector(k);
      const img = ctxSalida.createImageData(fuente.ancho, fuente.alto);
      for (let y = 0; y < fuente.alto; y++) {
        for (let x = 0; x < fuente.ancho; x++) {
          let v = ventana3x3(fuente, k, x, y);
          v = detector ? Math.abs(v) : v;
          v = Math.max(0, Math.min(255, v));
          img.data.set([v, v, v, 255], (y * fuente.ancho + x) * 4);
        }
      }
      ctxSalida.putImageData(img, 0, 0);
    }

    lienzoEntrada.addEventListener("mousemove", (e) => {
      const caja = lienzoEntrada.getBoundingClientRect();
      const x = Math.min(fuente.ancho - 2, Math.max(1, Math.floor(((e.clientX - caja.left) / caja.width) * fuente.ancho)));
      const y = Math.min(fuente.alto - 2, Math.max(1, Math.floor(((e.clientY - caja.top) / caja.height) * fuente.alto)));
      const k = leerKernel();
      const terminos = [];
      for (let m = -1; m <= 1; m++) {
        for (let n = -1; n <= 1; n++) {
          const peso = k[(m + 1) * 3 + (n + 1)];
          if (peso !== 0) terminos.push(fuente.pixeles[(y + m) * fuente.ancho + (x + n)] + "·(" + peso + ")");
        }
      }
      const total = ventana3x3(fuente, k, x, y);
      const cuerpo = terminos.length ? terminos.join(" + ") : "0";
      calculo.innerHTML = cuerpo + " = <b>" + total.toFixed(1) + "</b>";
    });

    dibujarEntrada();
    if (botonesImagen["Gato"]) botonesImagen["Gato"].classList.add("activo");
    botones["Bordes verticales"].click();
  }

  /* ---------- Convolución paso a paso ---------- */

  function convolucionPasoAPaso() {
    const datos = window.GATO_MATRIZ;
    const cajaEntrada = $("cpp-entrada");
    const cajaFiltro = $("cpp-filtro");
    const cajaSalida = $("cpp-salida");
    const calculo = $("cpp-calculo");
    if (!datos || !cajaEntrada || !cajaFiltro || !cajaSalida) return;

    const N = 6;
    const M = N - 2;
    const K = FILTROS["Bordes verticales"];

    // Se usa el bloque 6 × 6 con más contraste de la matriz 12 × 12 de la lámina "imagen = matriz".
    const lado = datos.gris.length;
    let mejor = { varianza: -1, fila: 0, col: 0 };
    for (let f = 0; f + N <= lado; f++) {
      for (let c = 0; c + N <= lado; c++) {
        let suma = 0;
        let suma2 = 0;
        for (let i = 0; i < N; i++) {
          for (let j = 0; j < N; j++) {
            const v = datos.gris[f + i][c + j];
            suma += v;
            suma2 += v * v;
          }
        }
        const varianza = suma2 / (N * N) - Math.pow(suma / (N * N), 2);
        if (varianza > mejor.varianza) mejor = { varianza: varianza, fila: f, col: c };
      }
    }
    const entrada = [];
    for (let i = 0; i < N; i++) entrada.push(datos.gris[mejor.fila + i].slice(mejor.col, mejor.col + N));

    function celda(caja, texto) {
      const d = document.createElement("div");
      d.textContent = texto;
      caja.appendChild(d);
      return d;
    }
    const celdasEntrada = entrada.flat().map((v) => celda(cajaEntrada, v));
    K.forEach((v) => celda(cajaFiltro, v));
    const celdasSalida = [];
    for (let i = 0; i < M * M; i++) celdasSalida.push(celda(cajaSalida, ""));

    function resultado(fila, col) {
      let total = 0;
      const terminos = [];
      for (let m = 0; m < 3; m++) {
        for (let n = 0; n < 3; n++) {
          const peso = K[m * 3 + n];
          total += entrada[fila + m][col + n] * peso;
          if (peso !== 0) terminos.push(entrada[fila + m][col + n] + "·(" + peso + ")");
        }
      }
      return { total: total, terminos: terminos };
    }

    let paso = IMPRESION ? M * M : 0;

    function dibujar() {
      const actual = paso - 1;
      const fila = Math.floor(actual / M);
      const col = actual % M;
      celdasEntrada.forEach((d, i) => {
        const m = Math.floor(i / N) - fila;
        const n = (i % N) - col;
        const dentro = actual >= 0 && m >= 0 && m < 3 && n >= 0 && n < 3;
        d.classList.toggle("vent", dentro);
        if (dentro) d.dataset.peso = "×" + K[m * 3 + n];
        else delete d.dataset.peso;
      });
      celdasSalida.forEach((d, i) => {
        const lleno = i < paso;
        d.textContent = lleno ? resultado(Math.floor(i / M), i % M).total : "";
        d.classList.toggle("vacia", !lleno);
        d.classList.toggle("actual", i === actual);
      });
      if (actual < 0) {
        calculo.textContent = "Pulsa «Paso»: la ventana de 3 × 3 empieza arriba a la izquierda.";
      } else {
        const r = resultado(fila, col);
        calculo.innerHTML = r.terminos.join(" + ") + " = <b>" + r.total + "</b>";
      }
    }

    reproductor(
      "cpp",
      () => {
        if (paso < M * M) paso += 1;
        dibujar();
        return paso < M * M;
      },
      () => {
        paso = 0;
        dibujar();
      },
      650
    );
    dibujar();
  }

  /* ---------- ReLU sobre la respuesta de un filtro ---------- */

  function relu() {
    const lienzo = $("relu-lienzo");
    const boton = $("relu-boton");
    const pie = $("relu-pie");
    const img = imagenGris("GATO_GRIS");
    if (!lienzo || !boton || !img) return;

    const k = FILTROS["Bordes verticales"];
    const respuesta = new Float32Array(img.ancho * img.alto);
    let maximo = 0;
    for (let y = 0; y < img.alto; y++) {
      for (let x = 0; x < img.ancho; x++) {
        const v = ventana3x3(img, k, x, y);
        respuesta[y * img.ancho + x] = v;
        maximo = Math.max(maximo, Math.abs(v));
      }
    }
    // Se satura a la mitad del máximo para que los bordes suaves también se vean.
    const escala = maximo * 0.5 || 1;
    const VERDE = [31, 107, 58];
    const AMBAR = [184, 115, 15];
    const ctx = lienzo.getContext("2d");
    let aplicada = IMPRESION;

    function dibujar() {
      const salida = ctx.createImageData(img.ancho, img.alto);
      for (let i = 0; i < respuesta.length; i++) {
        let v = respuesta[i];
        if (aplicada) v = Math.max(0, v);
        const t = Math.min(1, Math.abs(v) / escala);
        const color = v >= 0 ? VERDE : AMBAR;
        salida.data.set([255 + (color[0] - 255) * t, 255 + (color[1] - 255) * t, 255 + (color[2] - 255) * t, 255], i * 4);
      }
      ctx.putImageData(salida, 0, 0);
      boton.textContent = aplicada ? "Quitar ReLU" : "Aplicar ReLU";
      boton.classList.toggle("activo", aplicada);
      pie.innerHTML = aplicada
        ? "<b>Después de ReLU.</b> Lo negativo quedó en cero; sobrevive solo lo verde."
        : "<b>Salida del filtro de bordes.</b> Verde: positiva. Ámbar: negativa.";
    }

    boton.addEventListener("click", () => {
      aplicada = !aplicada;
      dibujar();
    });
    dibujar();
  }

  /* ---------- Max pooling ---------- */

  function maxPooling() {
    const cajaEntrada = $("pool-entrada");
    const cajaSalida = $("pool-salida");
    const calculo = $("pool-calculo");
    if (!cajaEntrada || !cajaSalida) return;

    // El HTML trae el estado final; de ahí se leen cuadrantes, máximos y resultados.
    const celdas = Array.from(cajaEntrada.children).map((d) => ({
      nodo: d,
      cuadrante: parseInt((d.className.match(/q(\d)/) || [])[1], 10),
      esMaximo: d.classList.contains("max")
    }));
    const salidas = Array.from(cajaSalida.children).map((d) => ({ nodo: d, valor: d.textContent }));
    const TOTAL = salidas.length;
    let paso = IMPRESION ? TOTAL : 0;

    function dibujar() {
      celdas.forEach((c) => {
        c.nodo.classList.toggle("vent", c.cuadrante === paso);
        c.nodo.classList.toggle("max", c.esMaximo && c.cuadrante <= paso);
      });
      salidas.forEach((s, i) => {
        const lleno = i < paso;
        s.nodo.textContent = lleno ? s.valor : "";
        s.nodo.classList.toggle("max", lleno);
        s.nodo.classList.toggle("vacia", !lleno);
        s.nodo.classList.toggle("vent", i === paso - 1);
      });
      if (!calculo) return;
      if (paso === 0) {
        calculo.textContent = "La ventana de 2 × 2 recorre la rejilla sin solaparse.";
      } else {
        const valores = celdas.filter((c) => c.cuadrante === paso).map((c) => c.nodo.textContent);
        calculo.innerHTML = "máx(" + valores.join(", ") + ") = <b>" + salidas[paso - 1].valor + "</b>";
      }
    }

    const control = reproductor(
      "pool",
      () => {
        if (paso < TOTAL) paso += 1;
        dibujar();
        return paso < TOTAL;
      },
      () => {
        paso = 0;
        dibujar();
      },
      900
    );
    dibujar();

    // La animación arranca sola cada vez que se entra en la lámina.
    if (window.Reveal && !IMPRESION) {
      const lamina = cajaEntrada.closest("section");
      window.Reveal.on("slidechanged", (e) => {
        control.detener();
        if (e.currentSlide !== lamina) return;
        paso = 0;
        dibujar();
        control.iniciar();
      });
    }
  }

  /* ---------- Softmax y entropía cruzada ---------- */

  function softmax() {
    const caja = $("sm");
    const cajaClases = $("sm-clases");
    const lectura = $("sm-perdida");
    if (!caja || !cajaClases || !lectura) return;

    const deslizadores = Array.from(caja.querySelectorAll('input[type="range"]'));
    const puntajes = Array.from(caja.querySelectorAll(".z"));
    const barras = Array.from(caja.querySelectorAll(".barra i"));
    const probabilidades = Array.from(caja.querySelectorAll(".p"));
    const botones = Array.from(cajaClases.querySelectorAll("button"));
    let correcta = 0;

    function dibujar() {
      const z = deslizadores.map((d) => parseFloat(d.value));
      const mayor = Math.max.apply(null, z);
      const e = z.map((v) => Math.exp(v - mayor));
      const total = e.reduce((a, b) => a + b, 0);
      const p = e.map((v) => v / total);
      p.forEach((v, i) => {
        puntajes[i].textContent = z[i].toFixed(1);
        barras[i].style.width = (v * 100).toFixed(1) + "%";
        probabilidades[i].textContent = v.toFixed(2);
      });
      botones.forEach((b, i) => b.classList.toggle("activo", i === correcta));
      const perdida = -Math.log(p[correcta]);
      const juicio = perdida < 0.7 ? "Error pequeño" : perdida < 1.5 ? "Error mediano" : "Error grande";
      lectura.classList.toggle("mal", perdida >= 1.5);
      lectura.innerHTML = "L = -ln(" + p[correcta].toFixed(2) + ") = <b>" + perdida.toFixed(2) + "</b><br>" + juicio;
    }

    deslizadores.forEach((d) => {
      d.addEventListener("input", dibujar);
      d.addEventListener("keydown", (e) => e.stopPropagation());
    });
    botones.forEach((b, i) =>
      b.addEventListener("click", () => {
        correcta = i;
        dibujar();
      })
    );
    dibujar();
  }

  /* ---------- Regresión lineal: dos parámetros ---------- */

  function regresionLineal() {
    const svg = $("rl-grafica");
    const deslizM = $("rl-m");
    const deslizB = $("rl-b");
    const lectura = $("rl-lectura");
    if (!svg || !deslizM || !deslizB) return;

    const PUNTOS = [[1, 1.9], [2, 2.3], [3, 3.6], [4, 3.9], [5, 5.4], [6, 5.2], [7, 6.9], [8, 7.1], [9, 8.4], [10, 8.6]];
    const INICIAL = { m: parseFloat(deslizM.value), b: parseFloat(deslizB.value) };

    // Mínimos cuadrados: la recta que hace mínimo el error cuadrático medio.
    const n = PUNTOS.length;
    const mediaX = PUNTOS.reduce((a, p) => a + p[0], 0) / n;
    const mediaY = PUNTOS.reduce((a, p) => a + p[1], 0) / n;
    const mOptima =
      PUNTOS.reduce((a, p) => a + (p[0] - mediaX) * (p[1] - mediaY), 0) / PUNTOS.reduce((a, p) => a + Math.pow(p[0] - mediaX, 2), 0);
    const OPTIMO = { m: mOptima, b: mediaY - mOptima * mediaX };
    const error = (m, b) => PUNTOS.reduce((a, p) => a + Math.pow(p[1] - (m * p[0] + b), 2), 0) / n;

    const MAXIMO = 11;
    const caja = { izq: 50, der: 540, sup: 20, inf: 335 };
    const aX = (x) => caja.izq + (x / MAXIMO) * (caja.der - caja.izq);
    const aY = (y) => caja.inf - (y / MAXIMO) * (caja.inf - caja.sup);
    const NS = "http://www.w3.org/2000/svg";
    function nodo(tipo, atributos, padre) {
      const e = document.createElementNS(NS, tipo);
      Object.keys(atributos).forEach((k) => e.setAttribute(k, atributos[k]));
      (padre || svg).appendChild(e);
      return e;
    }

    const recorte = nodo("clipPath", { id: "rl-recorte" }, nodo("defs", {}));
    nodo("rect", { x: caja.izq, y: caja.sup, width: caja.der - caja.izq, height: caja.inf - caja.sup }, recorte);
    nodo("path", { d: "M" + caja.izq + " " + caja.sup + " V" + caja.inf + " H" + caja.der, fill: "none", stroke: "#55655c", "stroke-width": 1.5 });
    const texto = { "font-family": "Inter, Segoe UI, Arial, sans-serif", "font-size": 17, fill: "#55655c", "text-anchor": "middle" };
    nodo("text", Object.assign({ x: (caja.izq + caja.der) / 2, y: 368 }, texto)).textContent = "x";
    nodo("text", Object.assign({ x: 22, y: (caja.sup + caja.inf) / 2 + 6 }, texto)).textContent = "y";
    const grupo = nodo("g", { "clip-path": "url(#rl-recorte)" });
    const residuos = PUNTOS.map(() => nodo("line", { stroke: "#b8730f", "stroke-width": 2.5 }, grupo));
    const recta = nodo("line", { stroke: "#1f6b3a", "stroke-width": 4, "stroke-linecap": "round" }, grupo);
    PUNTOS.forEach((p) => nodo("circle", { cx: aX(p[0]), cy: aY(p[1]), r: 7, fill: "#1b2a22" }, grupo));

    function dibujar() {
      const m = parseFloat(deslizM.value);
      const b = parseFloat(deslizB.value);
      recta.setAttribute("x1", aX(0));
      recta.setAttribute("y1", aY(b));
      recta.setAttribute("x2", aX(MAXIMO));
      recta.setAttribute("y2", aY(m * MAXIMO + b));
      PUNTOS.forEach((p, i) => {
        residuos[i].setAttribute("x1", aX(p[0]));
        residuos[i].setAttribute("x2", aX(p[0]));
        residuos[i].setAttribute("y1", aY(p[1]));
        residuos[i].setAttribute("y2", aY(m * p[0] + b));
      });
      $("rl-m-valor").textContent = "m = " + m.toFixed(2);
      $("rl-b-valor").textContent = "b = " + b.toFixed(2);
      const e = error(m, b);
      const minimo = error(OPTIMO.m, OPTIMO.b);
      lectura.classList.toggle("mal", e > 1.5);
      lectura.innerHTML = "MSE = " + e.toFixed(3) + (e - minimo < 0.005 ? "<br>es el menor posible" : "<br>el menor posible es " + minimo.toFixed(3));
    }

    function fijar(valores) {
      deslizM.value = valores.m;
      deslizB.value = valores.b;
      dibujar();
    }
    [deslizM, deslizB].forEach((d) => {
      d.addEventListener("input", dibujar);
      d.addEventListener("keydown", (e) => e.stopPropagation());
    });
    $("rl-mejor").addEventListener("click", () => fijar(OPTIMO));
    $("rl-reiniciar").addEventListener("click", () => fijar(INICIAL));
    fijar(IMPRESION ? OPTIMO : INICIAL);
  }

  /* ---------- Sigmoide: dos clases ---------- */

  function sigmoide() {
    const svg = $("sig-grafica");
    const deslizador = $("sig-z");
    if (!svg || !deslizador) return;

    const sigma = (z) => 1 / (1 + Math.exp(-z));
    const LIM = 6;
    const caja = { izq: 50, der: 545, sup: 15, inf: 255 };
    const aX = (z) => caja.izq + ((z + LIM) / (2 * LIM)) * (caja.der - caja.izq);
    const aY = (p) => caja.inf - p * (caja.inf - caja.sup);
    const NS = "http://www.w3.org/2000/svg";
    function nodo(tipo, atributos) {
      const e = document.createElementNS(NS, tipo);
      Object.keys(atributos).forEach((k) => e.setAttribute(k, atributos[k]));
      svg.appendChild(e);
      return e;
    }
    const texto = { "font-family": "Inter, Segoe UI, Arial, sans-serif", "font-size": 16, fill: "#55655c" };
    nodo("line", { x1: caja.izq, y1: aY(0.5), x2: caja.der, y2: aY(0.5), stroke: "#cfc9b8", "stroke-width": 1.5, "stroke-dasharray": "5 5" });
    nodo("path", { d: "M" + caja.izq + " " + caja.sup + " V" + caja.inf + " H" + caja.der, fill: "none", stroke: "#55655c", "stroke-width": 1.5 });
    nodo("line", { x1: aX(0), y1: caja.sup, x2: aX(0), y2: caja.inf, stroke: "#cfc9b8", "stroke-width": 1.5 });
    nodo("text", Object.assign({ x: caja.izq - 8, y: aY(1) + 5, "text-anchor": "end" }, texto)).textContent = "1";
    nodo("text", Object.assign({ x: caja.izq - 8, y: aY(0.5) + 5, "text-anchor": "end" }, texto)).textContent = "0.5";
    nodo("text", Object.assign({ x: caja.izq - 8, y: aY(0) + 5, "text-anchor": "end" }, texto)).textContent = "0";
    nodo("text", Object.assign({ x: (caja.izq + caja.der) / 2, y: 290, "text-anchor": "middle" }, texto)).textContent = "puntaje z";
    let d = "";
    for (let i = 0; i <= 200; i++) {
      const z = -LIM + (i / 200) * 2 * LIM;
      d += (i ? " L" : "M") + aX(z).toFixed(1) + " " + aY(sigma(z)).toFixed(1);
    }
    nodo("path", { d: d, fill: "none", stroke: "#1f6b3a", "stroke-width": 4, "stroke-linejoin": "round" });
    const guiaV = nodo("line", { stroke: "#b8730f", "stroke-width": 2, "stroke-dasharray": "4 4" });
    const guiaH = nodo("line", { stroke: "#b8730f", "stroke-width": 2, "stroke-dasharray": "4 4" });
    const punto = nodo("circle", { r: 10, fill: "#b8730f", stroke: "#fff", "stroke-width": 3 });
    const botonesClase = Array.from(document.querySelectorAll("#sig-clases button"));
    const lectura = $("sig-perdida");
    let esGato = true;

    function dibujar() {
      const z = parseFloat(deslizador.value);
      const p = sigma(z);
      punto.setAttribute("cx", aX(z));
      punto.setAttribute("cy", aY(p));
      [["x1", aX(z)], ["y1", aY(0)], ["x2", aX(z)], ["y2", aY(p)]].forEach((a) => guiaV.setAttribute(a[0], a[1]));
      [["x1", caja.izq], ["y1", aY(p)], ["x2", aX(z)], ["y2", aY(p)]].forEach((a) => guiaH.setAttribute(a[0], a[1]));
      $("sig-z-valor").textContent = "z = " + z.toFixed(1);
      $("sig-p-gato").textContent = p.toFixed(2);
      $("sig-p-perro").textContent = (1 - p).toFixed(2);
      $("sig-barra-gato").style.width = (p * 100).toFixed(1) + "%";
      $("sig-barra-perro").style.width = ((1 - p) * 100).toFixed(1) + "%";
      if (!lectura) return;
      botonesClase.forEach((b, i) => b.classList.toggle("activo", (i === 0) === esGato));
      const correcta = esGato ? p : 1 - p;
      const perdida = -Math.log(correcta);
      const juicio = perdida < 0.7 ? "Error pequeño" : perdida < 1.5 ? "Error mediano" : "Error grande";
      lectura.classList.toggle("mal", perdida >= 1.5);
      lectura.innerHTML = "L = -ln(" + correcta.toFixed(2) + ") = <b>" + perdida.toFixed(2) + "</b><br>" + juicio;
    }
    deslizador.addEventListener("input", dibujar);
    deslizador.addEventListener("keydown", (e) => e.stopPropagation());
    botonesClase.forEach((b, i) =>
      b.addEventListener("click", () => {
        esGato = i === 0;
        dibujar();
      })
    );
    dibujar();
  }

  /* ---------- Descenso del gradiente ---------- */

  function descensoGradiente() {
    const lienzo = $("gd-lienzo");
    if (!lienzo) return;
    const ctx = lienzo.getContext("2d");
    const W = lienzo.width;
    const H = lienzo.height;
    const deslizador = $("gd-eta");
    const etiquetaEta = $("gd-eta-valor");
    const lectura = $("gd-lectura");

    const perdida = (w) => w * w;
    const derivada = (w) => 2 * w;
    const W_INICIAL = -2.6;
    const LIMITE = 3;
    const margen = { izq: 100, der: 40, sup: 40, inf: 100 };

    let w = W_INICIAL;
    let rastro = [w];
    let temporizador = null;

    const aX = (v) => margen.izq + ((v + LIMITE) / (2 * LIMITE)) * (W - margen.izq - margen.der);
    const aY = (v) => H - margen.inf - (v / (LIMITE * LIMITE)) * (H - margen.sup - margen.inf);

    function dibujar() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#cfc9b8";
      ctx.beginPath();
      ctx.moveTo(margen.izq, H - margen.inf);
      ctx.lineTo(W - margen.der, H - margen.inf);
      ctx.moveTo(margen.izq, margen.sup);
      ctx.lineTo(margen.izq, H - margen.inf);
      ctx.stroke();

      ctx.fillStyle = "#55655c";
      ctx.font = "34px Inter, Segoe UI, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("peso w", (W + margen.izq - margen.der) / 2, H - 28);
      ctx.save();
      ctx.translate(36, (H - margen.inf + margen.sup) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("pérdida L(w)", 0, 0);
      ctx.restore();

      ctx.strokeStyle = "#1b2a22";
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const v = -LIMITE + (i / 200) * 2 * LIMITE;
        if (i === 0) ctx.moveTo(aX(v), aY(perdida(v)));
        else ctx.lineTo(aX(v), aY(perdida(v)));
      }
      ctx.stroke();

      const visible = (v) => Math.abs(v) <= LIMITE;
      ctx.strokeStyle = "#b8730f";
      ctx.lineWidth = 3;
      ctx.beginPath();
      rastro.forEach((v, i) => {
        const c = Math.max(-LIMITE, Math.min(LIMITE, v));
        if (i === 0) ctx.moveTo(aX(c), aY(perdida(c)));
        else ctx.lineTo(aX(c), aY(perdida(c)));
      });
      ctx.stroke();
      rastro.forEach((v, i) => {
        if (!visible(v)) return;
        const ultimo = i === rastro.length - 1;
        ctx.beginPath();
        ctx.arc(aX(v), aY(perdida(v)), ultimo ? 16 : 8, 0, Math.PI * 2);
        ctx.fillStyle = ultimo ? "#1f6b3a" : "#b8730f";
        ctx.fill();
        if (ultimo) {
          ctx.lineWidth = 4;
          ctx.strokeStyle = "#fff";
          ctx.stroke();
        }
      });

      const fuera = !visible(w);
      lectura.classList.toggle("mal", fuera);
      lectura.innerHTML = fuera
        ? "paso " + (rastro.length - 1) + "<br>w se salió de la gráfica:<br>el paso es demasiado grande"
        : "paso " + (rastro.length - 1) +
          "<br>w = " + w.toFixed(3) +
          "<br>L(w) = " + perdida(w).toFixed(3) +
          "<br>dL/dw = " + derivada(w).toFixed(3);
    }

    function paso() {
      if (Math.abs(w) > 1e6) return;
      w = w - parseFloat(deslizador.value) * derivada(w);
      rastro.push(w);
      dibujar();
    }

    function detener() {
      if (temporizador) clearInterval(temporizador);
      temporizador = null;
      $("gd-auto").classList.remove("activo");
    }

    function reiniciar() {
      detener();
      w = W_INICIAL;
      rastro = [w];
      dibujar();
    }

    function etiqueta() {
      etiquetaEta.textContent = "η = " + parseFloat(deslizador.value).toFixed(2);
    }

    $("gd-paso").addEventListener("click", () => {
      detener();
      paso();
    });
    $("gd-auto").addEventListener("click", () => {
      if (temporizador) return detener();
      $("gd-auto").classList.add("activo");
      temporizador = setInterval(() => {
        paso();
        if (rastro.length > 40 || Math.abs(w) > LIMITE || Math.abs(derivada(w)) < 1e-3) detener();
      }, 450);
    });
    $("gd-reiniciar").addEventListener("click", reiniciar);
    deslizador.addEventListener("input", () => {
      etiqueta();
      reiniciar();
    });
    deslizador.addEventListener("keydown", (e) => e.stopPropagation());

    etiqueta();
    dibujar();
  }

  /* ---------- Navegación: menú de contenido, franja de temas e índice ---------- */

  function navegacion() {
    const Reveal = window.Reveal;
    const raiz = document.querySelector(".reveal");
    if (!Reveal || !raiz) return;

    // Una entrada por lámina; las verticales heredan el tema de la lámina de la que cuelgan.
    const laminas = [];
    document.querySelectorAll(".reveal .slides > section").forEach((seccion, h) => {
      const hijas = seccion.querySelectorAll(":scope > section");
      const lista = hijas.length ? Array.from(hijas) : [seccion];
      const rotulo = lista[0].querySelector(".bloque");
      const tema = seccion.dataset.bloque || (rotulo ? rotulo.textContent.split("·")[0].trim() : "Inicio");
      lista.forEach((lamina, v) => {
        const titulo = lamina.querySelector("h1, h2");
        laminas.push({ h: h, v: v, tema: tema, titulo: lamina.dataset.titulo || seccion.dataset.titulo || (titulo ? titulo.textContent.trim() : "") });
      });
    });
    const temas = [];
    laminas.forEach((l) => {
      if (!temas.includes(l.tema)) temas.push(l.tema);
    });
    const primera = (tema) => laminas.find((l) => l.tema === tema);

    // Índice: cada tema enlaza con su primera lámina.
    document.querySelectorAll(".indice [data-ir]").forEach((enlace) => {
      const destino = primera(enlace.dataset.ir);
      if (!destino) return;
      enlace.href = "#/" + destino.h;
      enlace.addEventListener("click", (e) => {
        e.preventDefault();
        Reveal.slide(destino.h, 0);
      });
    });
    if (IMPRESION) return;

    // Franja inferior: en qué tema vamos.
    const franja = document.createElement("nav");
    franja.className = "franja-temas";
    franja.setAttribute("aria-label", "Temas de la presentación");
    const botonesTema = temas.filter((t) => t !== "Inicio").map((tema) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = tema;
      b.addEventListener("click", () => Reveal.slide(primera(tema).h, 0));
      franja.appendChild(b);
      return { tema: tema, nodo: b };
    });

    // Botón y panel con todas las láminas.
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "menu-boton";
    // Solo el icono; el nombre queda para lectores de pantalla y como globo al pasar el cursor.
    boton.innerHTML = "<span aria-hidden=\"true\">☰</span>";
    boton.setAttribute("aria-label", "Contenido");
    boton.title = "Contenido (M)";
    boton.setAttribute("aria-expanded", "false");
    const panel = document.createElement("aside");
    panel.className = "menu-panel";
    panel.setAttribute("aria-label", "Contenido de la presentación");
    panel.hidden = true;
    const enlaces = [];
    temas.forEach((tema) => {
      const grupo = document.createElement("div");
      grupo.className = "menu-grupo";
      const cabecera = document.createElement("h4");
      cabecera.textContent = tema;
      grupo.appendChild(cabecera);
      laminas.filter((l) => l.tema === tema).forEach((l) => {
        const a = document.createElement("button");
        a.type = "button";
        a.className = l.v > 0 ? "sub" : "";
        a.textContent = (l.v > 0 ? "↓ " : "") + l.titulo;
        a.addEventListener("click", () => {
          Reveal.slide(l.h, l.v);
          abrir(false);
        });
        grupo.appendChild(a);
        enlaces.push({ lamina: l, nodo: a });
      });
      panel.appendChild(grupo);
    });

    // Cabecera: marca institucional y botón de contenido. La marca no sale en la portada,
    // que ya lleva los logos en grande.
    const cabecera = document.createElement("div");
    cabecera.className = "cabecera";
    const marca = document.createElement("div");
    marca.className = "marca";
    marca.innerHTML =
      '<img src="assets/logo_uasd.png" alt=""><img src="assets/logo_ciencias.png" alt="">' +
      "<span>UASD · Facultad de Ciencias</span>";
    cabecera.appendChild(marca);
    cabecera.appendChild(boton);

    function abrir(si) {
      panel.hidden = !si;
      cabecera.classList.toggle("menu-abierto", si);
      boton.setAttribute("aria-expanded", String(si));
      boton.classList.toggle("activo", si);
      if (si) {
        const actual = panel.querySelector(".actual");
        if (actual) actual.scrollIntoView({ block: "center" });
      }
    }
    boton.addEventListener("click", () => abrir(panel.hidden));
    panel.addEventListener("keydown", (e) => e.stopPropagation());
    // En fase de captura, para que Esc cierre el menú sin abrir además la vista general de Reveal.
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Escape" || panel.hidden) return;
        e.stopPropagation();
        abrir(false);
      },
      true
    );
    document.querySelector(".reveal .slides").addEventListener("click", () => abrir(false));
    Reveal.addKeyBinding({ keyCode: 77, key: "M", description: "Abrir o cerrar el contenido" }, () => abrir(panel.hidden));

    function marcar() {
      const i = Reveal.getIndices();
      const actual = laminas.find((l) => l.h === i.h && l.v === (i.v || 0)) || laminas[0];
      enlaces.forEach((e) => e.nodo.classList.toggle("actual", e.lamina === actual));
      botonesTema.forEach((b) => b.nodo.classList.toggle("actual", b.tema === actual.tema));
      franja.classList.toggle("oculta", actual.tema === "Inicio" && actual.h === 0);
      marca.classList.toggle("oculta", actual.h === 0);
    }
    Reveal.on("slidechanged", marcar);
    Reveal.on("ready", marcar);

    // Botón, franja y contador están fuera de la lámina: se les pasa la misma escala que usa Reveal,
    // para que no queden diminutos en un proyector grande ni enormes en un teléfono.
    function escalar() {
      const escala = Reveal.getScale() || 1;
      raiz.style.setProperty("--escala", escala);
      raiz.style.setProperty("--escala-menu", Math.max(0.9, Math.min(escala, 1.6)));
    }
    Reveal.on("resize", escalar);
    Reveal.on("ready", escalar);
    window.addEventListener("resize", escalar);
    escalar();

    // Aviso para teléfonos en vertical (solo lo muestra el CSS en ese caso).
    const aviso = document.createElement("div");
    aviso.className = "aviso-girar";
    aviso.setAttribute("role", "status");
    aviso.innerHTML = "<span>Gira el teléfono: las láminas se ven mucho más grandes en horizontal.</span>";
    const cerrarAviso = document.createElement("button");
    cerrarAviso.type = "button";
    cerrarAviso.textContent = "Entendido";
    cerrarAviso.addEventListener("click", () => aviso.remove());
    aviso.appendChild(cerrarAviso);
    document.body.appendChild(aviso);

    raiz.appendChild(franja);
    raiz.appendChild(cabecera);
    raiz.appendChild(panel);
    marcar();
  }

  /* ---------- Arranque ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    textosDeConfig();
    document.querySelectorAll("figure[data-foto]").forEach(cargarFoto);
    rejillasDePixeles(window.GATO_MATRIZ, "pix-gris", "pix-num");
    rejillasDePixeles(window.HOJA_MATRIZ, "pix-gris-arroz", "pix-num-arroz");
    pixelesColor();
    planosRgb();
    regresionLineal();
    convolucionPasoAPaso();
    convolucion();
    relu();
    maxPooling();
    softmax();
    sigmoide();
    descensoGradiente();
    codigoQr("qr-explorador", "enlace-explorador", CFG.exploradorUrl, "js/config.js");
    codigoQr("qr-colab", "enlace-colab", CFG.colabUrl, "js/config.js");
    codigoQr("qr-presentacion", "enlace-presentacion", CFG.presentacionUrl, "js/config.js");
    navegacion();
    // En pantallas táctiles Reveal toma un arrastre horizontal como gesto de cambiar de lámina,
    // y eso corta el arrastre de los deslizadores. Esta marca hace que Reveal ignore el gesto
    // cuando empieza sobre un control. Va al final, cuando los controles generados ya existen.
    document
      .querySelectorAll('input[type="range"], input[type="number"], .conv canvas, .pixeles, .rejilla-n')
      .forEach((el) => el.setAttribute("data-prevent-swipe", ""));
  });
})();
