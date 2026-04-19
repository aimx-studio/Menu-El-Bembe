const WS = '573248009246';
let menuActual = null;
let picadaSeleccionada = { tamano: '', precio: 0 };
let pedidoGlobal = [];

// ═══════════════════════════════════
// PRECIOS PIZZA (mitad y mitad)
// ═══════════════════════════════════
const PRECIOS_PIZZA = {
  jamon_queso:                  { pequena:24000, mediana:39000, grande:50000 },
  hawaiana:                     { pequena:28000, mediana:42000, grande:54000 },
  pollo_vegetales:              { pequena:32000, mediana:51000, grande:62000 },
  pollo_champinones:            { pequena:32000, mediana:51000, grande:62000 },
  tocineta_cebolla:             { pequena:34000, mediana:55000, grande:68000 },
  bocadillo_queso:              { pequena:28000, mediana:44000, grande:54000 },
  bocadillo_queso_tocineta:     { pequena:30000, mediana:46000, grande:56000 },
  pollo_tocineta:               { pequena:30000, mediana:48000, grande:60000 },
  queso_champinones:            { pequena:24000, mediana:39000, grande:50000 },
  pollo_jamon_tocineta:         { pequena:28000, mediana:46000, grande:46000 },
  solo_queso:                   { pequena:20000, mediana:31000, grande:42000 },
  peperoni_queso:               { pequena:30000, mediana:48000, grande:60000 },
  queso_pollo:                  { pequena:24000, mediana:39000, grande:50000 },
  queso_jamon_champinones:      { pequena:28000, mediana:43000, grande:54000 },
  queso_tocineta_maiz:          { pequena:32000, mediana:51000, grande:62000 },
  queso_cebolla_pollo_tocineta: { pequena:36000, mediana:55000, grande:68000 },
  queso_salami:                 { pequena:32000, mediana:51000, grande:62000 },
  queso_vegetales:              { pequena:30000, mediana:47000, grande:58000 },
  tocineta_salami_champinones:  { pequena:38000, mediana:59000, grande:74000 },
  jamon_chorizo_tocineta:       { pequena:42000, mediana:61000, grande:79000 },
  queso_jamon_pina_tocineta:    { pequena:34700, mediana:55000, grande:68000 },
};

const PIZZAS_OPTS = `
  <optgroup label="── Página 1 ──">
    <option value="jamon_queso">Jamón y Queso</option>
    <option value="hawaiana">Hawaiana</option>
    <option value="pollo_vegetales">Pollo Vegetales</option>
    <option value="pollo_champinones">Pollo Champiñones</option>
    <option value="tocineta_cebolla">Tocineta y Cebolla Caramelizada</option>
    <option value="bocadillo_queso">Bocadillo y Queso</option>
    <option value="bocadillo_queso_tocineta">Bocadillo, Queso y Tocineta</option>
    <option value="pollo_tocineta">Pollo - Tocineta</option>
    <option value="queso_champinones">Queso Champiñones</option>
    <option value="pollo_jamon_tocineta">Pollo - Jamón - Tocineta</option>
  </optgroup>
  <optgroup label="── Página 2 ──">
    <option value="solo_queso">Solo Queso</option>
    <option value="peperoni_queso">Peperoni y Queso</option>
    <option value="queso_pollo">Queso y Pollo</option>
    <option value="queso_jamon_champinones">Queso, Jamón y Champiñones</option>
    <option value="queso_tocineta_maiz">Queso, Tocineta y Maíz</option>
    <option value="queso_cebolla_pollo_tocineta">Queso, Cebolla Caramelizada, Pollo y Tocineta</option>
    <option value="queso_salami">Queso y Salami</option>
    <option value="queso_vegetales">Queso y Vegetales</option>
    <option value="tocineta_salami_champinones">Tocineta, Salami y Champiñones</option>
    <option value="jamon_chorizo_tocineta">Jamón, Chorizo y Tocineta</option>
    <option value="queso_jamon_pina_tocineta">Queso, Jamón, Piña y Tocineta</option>
  </optgroup>`;

// ═══════════════════════════════════
// HTML DE CADA MENÚ
// ═══════════════════════════════════
const HTML_MENUS = {

  pizzeria: `
    <section class="menu-section">
      <h2 class="section-titulo">Pizza Mitad y Mitad</h2>
      <p class="section-subtitulo">Combina dos sabores · precio de la mitad más costosa</p>
      <div class="mitad-container">
        <div class="mitad-titulo">½ + ½ — Elige tus sabores</div>
        <p class="mitad-nota">El precio corresponde a la mitad más costosa según el tamaño.</p>
        <div class="mitad-fila">
          <div><label>Primera mitad</label>
            <select id="mitad1" onchange="calcularMitad()"><option value="">Elegir sabor</option>${PIZZAS_OPTS}</select>
          </div>
          <div><label>Segunda mitad</label>
            <select id="mitad2" onchange="calcularMitad()"><option value="">Elegir sabor</option>${PIZZAS_OPTS}</select>
          </div>
        </div>
        <div class="mitad-tamano-wrap">
          <p class="mitad-tamano-label">Tamaño</p>
          <select id="mitad-tamano" class="mitad-tamano-sel" onchange="calcularMitad()">
            <option value="">Elegir tamaño</option>
            <option value="pequena">Pequeña 30cm</option>
            <option value="mediana">Mediana 40cm</option>
            <option value="grande">Grande 50cm</option>
          </select>
        </div>
        <div class="mitad-bottom">
          <span class="mitad-precio-display" id="mitad-precio" data-precio="0">$0</span>
          <div class="mitad-cant-wrap">
            <span>Cant.</span>
            <input type="number" id="mitad-cantidad" class="mitad-cant-input" value="0" min="0" onchange="calcularTotal()">
          </div>
        </div>
      </div>
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">Pizzas Enteras</h2>
      <p class="section-subtitulo">Elige tu sabor y tamaño · 30cm · 40cm · 50cm</p>
      <div class="separador">● Página 1 ●</div>
      ${pizzaItem('jamonQueso','Jamón y Queso',24000,44000,54000)}
      ${pizzaItem('hawaiana','Hawaiana',28000,48000,58000)}
      ${pizzaItem('polloVegetales','Pollo Vegetales',28000,48000,58000)}
      ${pizzaItem('polloChampinones','Pollo Champiñones',28000,48000,58000)}
      ${pizzaItem('tocinetaCebolla','Tocineta y Cebolla Caramelizada',30000,50000,60000)}
      ${pizzaItem('bocadilloQueso','Bocadillo y Queso',25000,45000,55000)}
      ${pizzaItem('bocadilloQuesoTocineta','Bocadillo, Queso y Tocineta',30000,50000,60000)}
      ${pizzaItem('polloTocineta','Pollo - Tocineta',30000,50000,60000)}
      ${pizzaItem('jamonChampinones','Jamon y Champiñones',28000,48000,58000)}
      ${pizzaItem('polloJamonTocineta','Pollo - Jamón - Tocineta',28000,48000,58000)}
      <div class="separador">● Página 2 ●</div>
      ${pizzaItem('soloQueso','Solo Queso',20000,40000,50000)}
      ${pizzaItem('peperoniQueso','Peperoni y Queso',30000,50000,60000)}
      ${pizzaItem('quesoPollo','Queso y Pollo',24000,44000,54000)}
      ${pizzaItem('quesoChampinones','Queso y Champiñones',25000,45000,55000)}
      ${pizzaItem('quesoTocinetaMaiz','Queso, Tocineta y Maíz',28000,48000,58000)}
      ${pizzaItem('quesoCebollaPolloTocineta','Queso, Cebolla, Pollo y Tocineta',35000,55000,65000)}
      ${pizzaItem('quesoSalami','Queso y Salami',32000,52000,62000)}
      ${pizzaItem('quesoVegetales','Queso y Vegetales',28000,48000,58000)}
      ${pizzaItem('tocinetaSalamiChamp','Tocineta, Salami y Champiñones',35000,55000,65000)}
      ${pizzaItem('jamonChorizoTocineta','Jamón, Chorizo y Tocineta',35000,55000,65000)}
      ${pizzaItem('quesoJamonPinaTocineta','Queso, Jamón, Piña y Tocineta',30000,50000,60000)}
      ${pagos()}
    </section>`,

  gastrobar: `
    <section class="menu-section">
      <h2 class="section-titulo">Picada de la Casa</h2>
      <p class="section-subtitulo">Papa francesa · cerdo · pollo · res · chorizo · queso · tocineta · maíz</p>
      <div class="picada-container">
        <div class="picada-titulo">Elige tu tamaño</div>
        <p class="picada-desc">Perfecta para compartir</p>
        <div class="picada-opciones">
          <div class="picada-opcion" onclick="seleccionarPicada('pequena',35000,this)">
            <span class="picada-opcion-label">Pequeña</span>
            <span class="picada-opcion-precio">$35.000</span>
            <span class="picada-opcion-porciones">1 persona</span>
          </div>
          <div class="picada-opcion" onclick="seleccionarPicada('mediana',65000,this)">
            <span class="picada-opcion-label">Mediana</span>
            <span class="picada-opcion-precio">$65.000</span>
            <span class="picada-opcion-porciones">2 o 3p</span>
          </div>
          <div class="picada-opcion" onclick="seleccionarPicada('grande',100000,this)">
            <span class="picada-opcion-label">Grande</span>
            <span class="picada-opcion-precio">$100.000</span>
            <span class="picada-opcion-porciones">3 o 4p</span>
          </div>
        </div>
        <div class="picada-bottom">
          <span class="picada-precio-display" id="picada-precio" data-precio="0">$0</span>
          <div class="picada-cant-wrap"><span>Cant.</span>
            <input type="number" id="picada-cantidad" class="picada-cant-input" value="0" min="0" onchange="calcularTotal()">
          </div>
        </div>
      </div>
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">La Parrillada</h2>
      ${item('parrillada','La Parrillada',120000,'Carne de res, pechuga, chorizo, papa francesa, patacón, mazorca, chimicurri y salsas.')}
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">Hamburguesas</h2>
      <p class="section-subtitulo">Pan artesanal · papas a la francesa · salsas artesanales</p>
      ${item('laBembe','Hamburguesa La Bembé',25000,'150g de res, cebolla roja encurtida, pepinillos agridulces, tomate, mozzarella y tocineta ahumada.')}
${item('polloGuarachero','Hamburguesa Pollo Guarachero',27000,'150g de pechuga molida y adobada con especias, cebolla roja encurtida, pepinillos agridulces, tomate, mozzarella y tocineta ahumada.')}
${item('cerdoMontuno','Hamburguesa Cerdo Montuno',27000,'150g de carne molida de cerdo, cebolla roja encurtida, pepinillos agridulces, tomate, mozzarella y tocineta ahumada.')}
${item('laChaucha','Hamburguesa La Chaucha',30000,'150g de res, chorizo mixto, cebolla roja encurtida, pepinillos agridulces, tomate, mozzarella, cheddar y tocineta ahumada.')}
${item('laCriolla','Hamburguesa La Criolla',32000,'150g de res, huevo frito y queso costeño asado, cebolla roja encurtida, pepinillos agridulces, tomate, mozzarella, cheddar y tocineta ahumada.')}
${itemSelect('dobleCarneOmixta','Hamburguesa Doble Carne o Mixta',36000,'300g de carne de res o mixta, cebolla roja encurtida, pepinillos agridulces, tomate, mozzarella, cheddar y tocineta ahumada.',['Doble Res','Mixta Cerdo','Mixta Pollo'],'Tipo')}
${item('laSabrosona','Hamburguesa La Sabrosona',33000,'150g de res, queso costeño dorado, bocadillo artesanal, mozzarella, un toque de parmesano, queso crema y tocineta ahumada.')}
${item('laMambo','Hamburguesa La Mambo',33000,'150g de res jugosa, cebolla encurtida, tomate fresco, tocineta ahumada, doble mozzarella y piña asada caramelizada.')}
${item('laSallita','Hamburguesa La Sallita',20000,'110g de res, cebolla roja encurtida, pepinillos agridulces, tomate, mozzarella y tocineta ahumada.')}
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">Perros</h2>
      ${item('bongo','Perro Bongó',20000,'Salchicha americana, pan súper, chimicurri, tocineta, queso mozzarella, cebolla encurtida y pepinillos dulces.')}
${item('chori','Perro Chori',20000,'Chorizo, pan súper, queso mozzarella, cebolla caramelizada y tocineta.')}
${item('suizo','Perro Suizo',20000,'Salchicha suiza, pan súper, queso mozzarella, cebolla caramelizada y tocineta.')}
${item('sencillo','Perro Sencillo',10000,'Salchicha sencilla, pan sencillo, queso mozzarella y tocineta.')}
${item('criollo','Perro Criollo',15000,'Salchicha parrillera, pan sencillo, chimicurri, pepinillos dulces, queso mozzarella y tocineta.')}
${item('especial','Perro Especial',25000,'Chorizo, pan súper, tocineta y cebolla caramelizada, queso mozzarella, queso costeño y maíz.')}
${item('perroTumbao','Perro Tumbao',30000,'Pan súper a la plancha, pollo, cerdo, carne de res, chorizo, queso mozzarella, queso costeño y tocineta.')}
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">Salchipapas</h2>
      ${item('salchipapaSuiza','Salchipapa Suiza',25000,'Salchicha suiza, salchicha americana, queso mozarella, tocineta, papa francesa y salsas artesanales.')}
      ${item('choripapa','Choripapa',25000,'Chorizo, salchicha americana, queso mozarella, tocineta, papa francesa y salsas artesanales.')}
      ${item('salchipapaSencilla','Salchipapa Sencilla',15000,'Salchicha sencilla, queso mozarella, tocineta, papa francesa y salsas.')}
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">Crocantes</h2>
      ${item('papaCharanga','Papa Charanga',30000,'Fajitas de pollo, cerdo, res y chorizo, queso mozzarella y queso costeño, salsa especial de la casa, coco deshidratado y papas a la francesa.')}
      ${item('desgranadoBugalu','Desgranado Bugalú',30000,'Fajitas de pollo, cerdo, res y chorizo, queso mozzarella y queso costeño, salsa especial de la casa, maíz tierno y chips de plátano.')}
      ${item('patagonAfincao','Patacón Afincao',30000,'Fajitas de pollo, cerdo, res y chorizo, queso mozzarella y queso costeño, salsa especial de la casa, coco deshidratado y patacón crocante picado.')}
      ${item('palitosPollo','Palitos de Pollo con Papa Francesa',20000,'Palitos de pollo apanados acompañados de papa francesa.')}
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">Asados</h2>
      <p class="section-subtitulo">Incluye chorizo · mazorca · papas a la francesa · chimicurri</p>
      ${item('asadoRes','Asado de Res',40000,'Asado de res acompañado de chorizo, mazorca, papas a la francesa y chimicurri.')}
      ${item('asadoPechuga','Asado de Pechuga',35000,'Pechuga a la parrilla acompañada de chorizo, mazorca, papas a la francesa y chimicurri.')}
      ${pagos()}
    </section>`,

  chiringuito: `
    <section class="menu-section">
      <h2 class="section-titulo">Cocteles</h2>
      ${item('cocoloco','Cocoloco',30000,'Vodka, tequila, ron blanco, zumo de limón y base de coco.')}
      ${item('tequilaSunrise','Tequila Sunrise',25000,'Tequila, zumo de naranja y granadina.')}
      ${item('caipiMango','Caipi Mango',25000,'Vodka, limón, mango picado y base de mango.')}
      ${item('mojito','Mojito',25000,'Ron blanco, soda, zumo de limón y hierbabuena.')}
      ${item('mojitoMaracuya','Mojito Maracuyá',25000,'Ron blanco, soda, zumo de limón, base de maracuyá y hierbabuena.')}
      ${item('idilio','Idilio',25000,'Vodka, soda, zumo de limón y base de maracuyá.')}
      ${item('amanzaJuapa','Amanza Juapa',30000,'Vodka, ginebra, tequila, base de corozo y zumo de limón.')}
      ${item('ginLulo','Gin Lulo',25000,'Ginebra, soda, zumo de limón y base de lulo.')}
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">Sodas</h2>
      ${item('sodaSaborizada','Soda Saborizada',15000,'Soda + base frutal + frutas + dulces + perlas + zumo de limón + borde escarchado.')}
      ${item('sodaMichelada','Soda Michelada',12000,'Zumo de limón + soda + frutas + borde escarchado.')}
      ${item('sodaSaborizadaAlcohol','Soda Saborizada con Alcohol',25000,'')}
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">Bebidas</h2>
      ${item('limonadaNatural','Limonada Natural',7000,'')}
      ${item('limonadaCoco','Limonada de Coco',12000,'')}
      ${item('limonadaHierbabuena','Limonada Hierbabuena',8000,'')}
      ${item('limonadaCerezada','Limonada Cerezada',8000,'')}
      ${item('miloFrio','Milo Frío',12000,'')}
      ${item('jugoAgua','Jugo en Agua',8000,'')}
      ${item('jugoLeche','Jugo en Leche',12000,'')}
    </section>

    <section class="menu-section">
      <h2 class="section-titulo">Cervezas</h2>
      ${item('aguilaNegra','Águila Negra',6000,'')}
      ${item('aguilaLight','Águila Light',6000,'')}
      ${item('clubColombia','Club Colombia',7000,'')}
      ${item('coronita','Coronita',8000,'')}
      ${item('vasoMicheladoSencillo','Vaso Michelado Sencillo',3000,'')}
      ${item('vasoMicheladoPremium','Vaso Michelado Premium',6000,'')}
      ${pagos()}
    </section>`
};

// ═══════════════════════════════════
// HELPERS HTML
// ═══════════════════════════════════
function pizzaItem(id, nombre, p, m, g) {
  return `<div class="item">
    <div class="item-linea">
      <label>
        <input type="checkbox" class="check-plato" name="${id}" value="${nombre}"
          onchange="toggleCantidad(this); toggleDescripcion(this)">
        <span class="nombre-plato">${nombre}</span>
      </label>
      <select class="sabor" name="${id}Tamano" onchange="actualizarPrecio(this)">
        <option value="Pequeña" data-precio="${p}">Pequeña 30cm</option>
        <option value="Mediana" data-precio="${m}">Mediana 40cm</option>
        <option value="Grande"  data-precio="${g}">Grande 50cm</option>
      </select>
      <span class="precio">${formatCOP(p)}</span>
      <input type="number" class="cantidad" name="${id}Cantidad"
        data-precio="${p}" value="0" min="0" onchange="calcularTotal()">
    </div>
  </div>`;
}

function item(id, nombre, precio, desc) {
  const descHtml = desc ? `<div class="descripcion">${desc}</div>` : '';
  return `<div class="item">
    <div class="item-linea">
      <label>
        <input type="checkbox" class="check-plato" name="${id}" value="${nombre}"
          onchange="toggleCantidad(this); toggleDescripcion(this)">
        <span class="nombre-plato">${nombre}</span>
      </label>
      <span class="precio">${formatCOP(precio)}</span>
      <input type="number" class="cantidad" name="${id}Cantidad"
        data-precio="${precio}" value="0" min="0" onchange="calcularTotal()">
    </div>
    ${descHtml}
  </div>`;
}

function itemSelect(id, nombre, precio, desc, opciones, placeholder) {
  const opts = opciones.map(o => `<option value="${o}">${o}</option>`).join('');
  return `<div class="item">
    <div class="item-linea">
      <label>
        <input type="checkbox" class="check-plato" name="${id}" value="${nombre}"
          onchange="toggleCantidad(this); toggleDescripcion(this)">
        <span class="nombre-plato">${nombre}</span>
      </label>
      <select class="sabor" name="${id}Tipo" onchange="calcularTotal()">
        ${opts}
      </select>
      <span class="precio">${formatCOP(precio)}</span>
      <input type="number" class="cantidad" name="${id}Cantidad"
        data-precio="${precio}" value="0" min="0" onchange="calcularTotal()">
    </div>
    <div class="descripcion">${desc}</div>
  </div>`;
}

function pagos() {
  return `<div class="pagos-footer">
    <p class="pagos-titulo">Métodos de pago</p>
    <div class="pagos-grid">
      <span class="pago-tag">💵 Efectivo</span>
      <span class="pago-tag">💳 Nequi · 3013446430</span>
      <span class="pago-tag">🏦 Bancolombia · 91284908576</span>
      <span class="pago-tag">🔑 Llave · 0035738855</span>
      <span class="pago-tag">💰 Bold · @bold3014825194</span>
      <span class="pago-tag">💳 Datáfono disponible</span>
    </div>
    <p class="pagos-nota">Envía el comprobante por WhatsApp · Domicilio se cuadra por WhatsApp</p>
  </div>`;
}

// ═══════════════════════════════════
// NAVEGACIÓN
// ═══════════════════════════════════
const EMOJIS = { pizzeria: '🍕 La Pizzería', gastrobar: '🍔 El Bembé Gastro Bar', chiringuito: '🍹 El Chiringuito' };

function abrirMenu(tipo) {
  menuActual = tipo;
  document.getElementById('portada').style.display = 'none';
  const mc = document.getElementById('menu-container');
  mc.style.display = 'flex';
  mc.style.flexDirection = 'column';

  const logos = {
    pizzeria:    'logopizzeria.jpg',
    gastrobar:   'logoelbembe.jpg',
    chiringuito: 'logochiringito.jpg'
  };

  const headerInfo = document.getElementById('header-nombre');
  headerInfo.innerHTML = `<img src="${logos[tipo]}" alt="${EMOJIS[tipo]}" style="height:36px; object-fit:contain;">`;

  limpiarMenuActual();
  document.getElementById('menu-body').innerHTML = HTML_MENUS[tipo];
  restaurarPedidoGlobal();
  calcularTotal();
  window.scrollTo(0, 0);
}

function volverPortada() {
  document.getElementById('portada').style.display = '';
  document.getElementById('menu-container').style.display = 'none';
  menuActual = null;
  window.scrollTo(0, 0);
}

// ═══════════════════════════════════
// FUNCIONES CORE
// ═══════════════════════════════════
function toggleCantidad(checkbox) {
  const linea = checkbox.closest('.item-linea');
  const cantidad = linea.querySelector('.cantidad');
  const select = linea.querySelector('.sabor');
  if (checkbox.checked) {
    cantidad.classList.add('visible'); cantidad.value = 1;
    if (select) select.classList.add('visible');
  } else {
    cantidad.classList.remove('visible'); cantidad.value = 0;
    if (select) select.classList.remove('visible');
  }
  calcularTotal();
}

function toggleDescripcion(checkbox) {
  const item = checkbox.closest('.item');
  const desc = item?.querySelector('.descripcion');
  if (desc) desc.style.display = checkbox.checked ? 'block' : 'none';
}

function toggleMenu() {}

function actualizarPrecio(select) {
  const linea = select.closest('.item-linea');
  const precioSpan = linea.querySelector('.precio');
  const cantInput = linea.querySelector('.cantidad');
  const opt = select.options[select.selectedIndex];
  if (opt?.dataset.precio) {
    const p = parseInt(opt.dataset.precio);
    precioSpan.textContent = formatCOP(p);
    cantInput.dataset.precio = p;
  }
  calcularTotal();
}

function calcularMitad() {
  const m1 = document.getElementById('mitad1')?.value;
  const m2 = document.getElementById('mitad2')?.value;
  const tam = document.getElementById('mitad-tamano')?.value;
  const display = document.getElementById('mitad-precio');
  const cantEl = document.getElementById('mitad-cantidad');
  if (!display) return;

  if (!tam) {
    display.textContent = '$0';
    display.dataset.precio = 0;
    if (cantEl) cantEl.value = 0;
    calcularTotal();
    return;
  }
  const p1 = (m1 && PRECIOS_PIZZA[m1]) ? PRECIOS_PIZZA[m1][tam] : 0;
  const p2 = (m2 && PRECIOS_PIZZA[m2]) ? PRECIOS_PIZZA[m2][tam] : 0;
  const precio = Math.max(p1, p2);

  display.textContent = precio > 0 ? formatCOP(precio) : '$0';
  display.dataset.precio = precio;

  // Si hay precio calculado y la cantidad está en 0, pasar a 1
  if (precio > 0 && cantEl && parseInt(cantEl.value) === 0) {
    cantEl.value = 1;
  }

  calcularTotal();
}

function seleccionarPicada(tamano, precio, el) {
  const yaSeleccionada = el.classList.contains('seleccionada');

  document.querySelectorAll('.picada-opcion').forEach(o => o.classList.remove('seleccionada'));

  const display = document.getElementById('picada-precio');
  const cantEl = document.getElementById('picada-cantidad');

  if (yaSeleccionada) {
    // Si ya estaba seleccionada, deseleccionar
    picadaSeleccionada = { tamano: '', precio: 0 };
    display.textContent = '$0';
    display.dataset.precio = 0;
    cantEl.value = 0;
  } else {
    // Seleccionar y poner cantidad en 1
    el.classList.add('seleccionada');
    picadaSeleccionada = { tamano, precio };
    display.textContent = formatCOP(precio);
    display.dataset.precio = precio;
    cantEl.value = 1;
  }

  calcularTotal();
}

function calcularTotal() {
  let total = 0;

  // 🔹 Actualizamos pedidoGlobal con los items seleccionados del menú actual
  // NO borramos los pedidos de otros menús
  const itemsActuales = [];

  // Platos normales
  document.querySelectorAll('.check-plato').forEach(chk => {
    const linea = chk.closest('.item-linea');
    const nombre = chk.value;
    const cant = parseInt(linea.querySelector('.cantidad')?.value) || 0;
    const precio = parseInt(linea.querySelector('.cantidad')?.dataset.precio) || 0;
    const sel = linea.querySelector('.sabor');
    const opcion = sel?.value ? ` (${sel.value})` : '';

    if (cant > 0) {
      itemsActuales.push({
        menu: menuActual,
        nombre: opcion ? `${nombre}${opcion}` : nombre,
        cant,
        precio
      });
    }
  });

  // Mitad y mitad
  const mitadEl = document.getElementById('mitad-precio');
  const mitadCantEl = document.getElementById('mitad-cantidad');
  if (mitadEl && mitadCantEl) {
    const m1 = document.getElementById('mitad1')?.options[document.getElementById('mitad1').selectedIndex]?.text || '';
    const m2 = document.getElementById('mitad2')?.options[document.getElementById('mitad2').selectedIndex]?.text || '';
    const tam = document.getElementById('mitad-tamano')?.options[document.getElementById('mitad-tamano').selectedIndex]?.text || '';
    const precio = parseInt(mitadEl.dataset.precio) || 0;
    const cant = parseInt(mitadCantEl.value) || 0;

    if (cant > 0 && precio > 0) {
      itemsActuales.push({
        menu: menuActual,
        nombre: `Pizza ½ ${m1} & ½ ${m2} (${tam})`,
        cant,
        precio
      });
    }
  }

  // Picadas
  const picadaEl = document.getElementById('picada-precio');
  const picadaCantEl = document.getElementById('picada-cantidad');
  if (picadaEl && picadaCantEl) {
    const cant = parseInt(picadaCantEl.value) || 0;
    const precio = parseInt(picadaEl.dataset.precio) || 0;
    if (cant > 0 && precio > 0) {
      const labels = { pequena:'Pequeña', mediana:'Mediana', grande:'Grande' };
      itemsActuales.push({
        menu: menuActual,
        nombre: `Picada (${labels[picadaSeleccionada.tamano] || ''})`,
        cant,
        precio
      });
    }
  }

  // 🔹 Reemplazamos en pedidoGlobal los items del menú actual
  pedidoGlobal = pedidoGlobal.filter(i => i.menu !== menuActual).concat(itemsActuales);

  // 🔹 Sumamos todo el pedidoGlobal
  pedidoGlobal.forEach(i => {
    total += i.precio * i.cant;
  });

  // 🔹 Actualiza la barra total
  const totalDisplay = document.getElementById('total-display');
  if (totalDisplay) totalDisplay.textContent = `$${total.toLocaleString()}`;

  // Mostrar u ocultar barra
  if (pedidoGlobal.length > 0) {
    document.getElementById('total-bar').classList.add('visible');
  } else {
    document.getElementById('total-bar').classList.remove('visible');
  }
}

function limpiarPedido() {
  document.querySelectorAll('.check-plato:checked').forEach(chk => {
    chk.checked = false; toggleCantidad(chk); toggleDescripcion(chk);
  });
  document.querySelectorAll('.sabor').forEach(s => { s.value = ''; s.classList.remove('visible'); });
  const ids = ['mitad1','mitad2','mitad-tamano'];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  ['mitad-precio','picada-precio'].forEach(id => { const el = document.getElementById(id); if (el) { el.textContent = '$0'; el.dataset.precio = 0; } });
  ['mitad-cantidad','picada-cantidad'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 0; });
  document.querySelectorAll('.picada-opcion').forEach(o => o.classList.remove('seleccionada'));
  picadaSeleccionada = { tamano: '', precio: 0 };
  calcularTotal();
}

// ═══════════════════════════════════
// MODAL Y WHATSAPP
// ═══════════════════════════════════
function abrirModal() {
  let total = 0;
  const emoji = { pizzeria:'🍕', gastrobar:'🍔', chiringuito:'🍹' };

  const itemsEl = document.getElementById('modal-items');
  const totalEl = document.getElementById('modal-total');

  if (pedidoGlobal.length === 0) {
    itemsEl.innerHTML = '<p style="color:var(--gris);font-style:italic;">No hay productos seleccionados.</p>';
    totalEl.innerHTML = '';
  } else {
    itemsEl.innerHTML = pedidoGlobal.map((item, idx) => {
      const sub = item.precio * item.cant;
      total += sub;
      return `
        <div class="modal-item">
          <span class="modal-item-nombre">${item.nombre}</span>
          <div class="modal-item-controles">
            <button class="modal-btn-cant" onclick="cambiarCantModal(${idx}, -1)">−</button>
            <span class="modal-item-cant">${item.cant}</span>
            <button class="modal-btn-cant" onclick="cambiarCantModal(${idx}, 1)">+</button>
            <span class="modal-item-precio">${formatCOP(sub)}</span>
          </div>
        </div>`;
    }).join('');

    totalEl.innerHTML = `
      <p class="modal-total-label">TOTAL A PAGAR</p>
      <p class="modal-total-valor">$${total.toLocaleString('es-CO')}</p>`;
  }

  document.getElementById('modal-titulo').textContent = `Tu pedido ${emoji[menuActual] || '📋'}`;
  document.getElementById('modal-pedido').classList.add('abierto');
}

function cerrarModal() {
  document.getElementById('modal-pedido').classList.remove('abierto');
}

function cambiarCantModal(idx, delta) {
  if (!pedidoGlobal[idx]) return;
  pedidoGlobal[idx].cant += delta;
  if (pedidoGlobal[idx].cant <= 0) {
    pedidoGlobal.splice(idx, 1);
  }
  // Actualizar solo la barra de total sin recalcular desde el DOM
  let total = 0;
  pedidoGlobal.forEach(i => total += i.precio * i.cant);
  const totalDisplay = document.getElementById('total-display');
  if (totalDisplay) totalDisplay.textContent = '$' + total.toLocaleString('es-CO');
  if (pedidoGlobal.length > 0) {
    document.getElementById('total-bar').classList.add('visible');
  } else {
    document.getElementById('total-bar').classList.remove('visible');
  }
  abrirModal();
}

document.getElementById('modal-pedido').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});

// ═══════════════════════════════════
// UTILS
// ═══════════════════════════════════
function formatCOP(n) {
  return '$' + n.toLocaleString('es-CO');
}

document.addEventListener("change", function(e) {

  // ENTREGA
  if (e.target.id === "tipoEntrega") {
    const tipo = e.target.value;

    document.getElementById("direccionField").style.display =
      (tipo === "domicilio") ? "block" : "none";

    document.getElementById("mesaField").style.display =
      (tipo === "comer") ? "block" : "none";
  }

  // PAGO
if (e.target.id === "tipoPago") {
  const tipo = e.target.value;

  const info = document.getElementById("infoPago");
  const texto = document.getElementById("textoPago");

  info.style.display = tipo ? "block" : "none";

  let mensaje = "";

if (tipo === "Nequi") {
  mensaje = `💳 Nequi: 3013446430<br>Envía el comprobante por WhatsApp.`;
}

if (tipo === "Bancolombia") {
  mensaje = `🏦 Bancolombia: 91284908576<br>Envía el comprobante por WhatsApp.`;
}

if (tipo === "Llave") {
  mensaje = `🔑 Llave: 0035738855<br>Envía el comprobante por WhatsApp.`;
}

if (tipo === "Bold") {
  mensaje = `💰 Llave Bold: @bold3014825194<br>Envía el comprobante por WhatsApp.`;
}

if (tipo === "Efectivo") {
  mensaje = `💵 Paga en efectivo.<br>Indica el valor del billete.`;
}

if (tipo === "Datáfono") {
  mensaje = `💳 Datáfono portátil disponible al momento de la entrega.`;
}

  texto.innerHTML = mensaje;

  document.getElementById("efectivoField").style.display =
    (tipo === "Efectivo") ? "block" : "none";
}

});

function actualizarPrecio(select) {
  const linea = select.closest('.item-linea');
  const precioSpan = linea.querySelector('.precio');
  const cantInput = linea.querySelector('.cantidad');
  const opt = select.options[select.selectedIndex];

  if (opt?.dataset.precio) {
    const p = parseInt(opt.dataset.precio);
    if (precioSpan) precioSpan.textContent = formatCOP(p);
    cantInput.dataset.precio = p;
  }
  calcularTotal();
}

function limpiarMenuActual() {
  const menuBody = document.getElementById('menu-body');
  if (menuBody) menuBody.innerHTML = '';
}