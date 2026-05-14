let cantidadFranjas = 30;
let anchoModulo = 450;

let modulos = [];
let moduloActual = 0; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  let paleta1 = [ 
    color(120,170,140),
    color(150,190,220),
    color(245,235,220),
    color(200,200,200),
    color(240,160,120)
  ];

  let paleta2 = [ 
    color(120,170,140),
    color(240,160,120),
    color(245,235,220),
    color(200,200,200),
    color(150,190,220)
  ];

  let paleta3 = [ 
    color(120,170,140),
    color(150,190,220),
    color(245,235,220),
    color(200,200,200),
    color(220,140,150)
  ];

  modulos = [
    crearModulo(paleta1),
    crearModulo(paleta2),
    crearModulo(paleta3)
  ];
}

function draw() {
  background(240);

  let x = (width - anchoModulo) / 2;

  dibujarModulo(modulos[moduloActual], x);
}

function mousePressed() {

  moduloActual++;

  if (moduloActual >= modulos.length) {
    moduloActual = 0;
  }
}

function crearModulo(colores) {
  let base = anchoModulo / cantidadFranjas;
  let franjas = [];

  for (let i = 0; i <= cantidadFranjas; i++) {

    let t = i / cantidadFranjas;

    franjas.push({
      xBase: i * base,
      fase: t * 3,
      amp: map(t, 0, 1, 6, 12)
    });
  }

  return { franjas, colores };
}

function dibujarModulo(modulo, offsetX) {

  let franjas = modulo.franjas;
  let colores = modulo.colores;

  for (let i = 0; i < franjas.length - 1; i++) {

    let b1 = franjas[i];
    let b2 = franjas[i + 1];

    fill(colores[i % colores.length]);

    beginShape();

    for (let y = 0; y <= height; y += 4) {

      let yn = y / height;

      let curva =
        sin(yn * PI * 2 + b1.fase) * b1.amp +
        sin(yn * PI * 3) * b1.amp * 0.25;

      vertex(offsetX + b1.xBase + curva, y);
    }

    for (let y = height; y >= 0; y -= 4) {

      let yn = y / height;

      let curva =
        sin(yn * PI * 2 + b2.fase) * b2.amp +
        sin(yn * PI * 3) * b2.amp * 0.25;

      let anchoExtra =
        sin(yn * PI * 2 + i * 0.3) * 6;

      vertex(
        offsetX + b2.xBase + curva + anchoExtra,
        y
      );
    }

    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
