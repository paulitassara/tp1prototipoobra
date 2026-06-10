# AGENT.md

## Rol

Sos un artista generativo especializado en p5.js y Web Audio API. Trabajás en una obra interactiva inspirada en el Op Art de Bridget Riley. Cuando proponés cambios, los explicás en términos visuales y perceptuales, no solo técnicos. No agregás features que no se pidieron.

## Proyecto

Recreación generativa e interactiva de "Red Dominance" (1977) de Bridget Riley. El canvas muestra 35 franjas verticales de ancho variable que ondulan con funciones seno superpuestas y desfasadas. La obra se controla en vivo por sonido via micrófono: el artista puede cambiar velocidad, dirección, paleta de colores y forma de las franjas usando la voz, chasquidos y otros gestos sonoros.

Archivo único: `index.html` (p5.js en modo instancia + Web Audio API, sin build tools).

## Tecnologías

- p5.js v1.9.4 (cargado desde CDN, modo instancia)
- Web Audio API nativa del browser (AudioContext, AnalyserNode, getUserMedia)
- HTML/CSS/JavaScript — un solo archivo, sin bundlers ni dependencias locales

## Estructura de archivos

```
Obra_de_Arte/
├── index.html   ← todo el código vive acá: estilos, p5, audio
└── AGENT.md     ← este archivo
```

## Parámetros clave del sketch

| Constante    | Valor | Descripción |
|-------------|-------|-------------|
| W, H        | 560 × 920 px | Tamaño del canvas |
| AMP         | 17 | Amplitud de la onda (controla adelgazamiento visual) |
| PHASE_STEP  | 0.40 | Desfase acumulado por franja (genera efecto diagonal) |
| WV, WA, WS  | 11 px | Ancho de franjas de color (verde, azul, salmón) |
| WC          | 18 px | Ancho de franjas crema (fondo) |
| WG          | 21 px | Ancho de franjas gris |
| smoothingTimeConstant | 0.40 | Suavizado FFT — bajo para onsets nítidos |

### Función de onda por franja

```js
sin(prog*π*3.4 + ph + t)*AMP + sin(prog*π*6.8 + ph*1.4 + t*1.55)*(AMP*0.22)
```

`prog` = posición vertical 0→1, `ph` = phase offset acumulado de la franja, `t` = offset*0.05

### Paletas (3 disponibles, ciclo con transición lerp)

- Paleta 0: verde / naranja-salmón / gris / azul
- Paleta 1: verde / azul / gris / salmón (b y d invertidos)
- Paleta 2: verde / malva / gris / turquesa

## Mapa de interacciones

### Teclado (siempre disponible)
| Tecla | Acción |
|-------|--------|
| C | Cambio de paleta (con transición lerp) |
| W | Toggle widen — franjas se ensanchan en el centro |
| I | Invertir dirección del movimiento |
| B | Invertir orden de colores |
| F | Freeze / pausa |
| R | Reset completo a valores iniciales |
| Espacio (hold) | Ralentizar |
| Click (hold) | Acelerar |
| D | Toggle overlay de debug de audio |

### Audio (requiere activar micrófono)
| Sonido | Acción |
|--------|--------|
| Grave dominante (bass > 0.20) | Sube velocidad |
| Agudo sostenido (high > 0.16) | Baja velocidad |
| "AAA!" agudo de golpe (onset + high > bass×2.2) | Cambio de paleta |
| 1 chasquido (onset único, ~0.67s delay) | Invierte dirección |
| Doble-chasquido (<0.33s entre ambos) | Toggle widen |
| SHHH fricativo (shushBand 3–8kHz, >40 frames) | Reset completo |

## Arquitectura del audio

El sistema de audio corre dentro del loop `p.draw()`:

1. `audioTick()` — lee FFT + señal temporal, calcula bandas, detecta onsets por **flujo espectral** (no por RMS-diff), actualiza `tgtSpd`, `widenTgt`, `onsets[]`
2. `tickOnsets()` — evalúa si el onset acumulado en `onsets[]` expiró su ventana de tiempo y dispara la acción correspondiente
3. `applyShush()` — se llama cuando el SHHH termina; si duró >40 frames, resetea

Variables de estado del audio: `bassF`, `highF`, `shushF`, `onsets[]`, `onsetLock`, `colorCooldown`, `rmsSmooth`.

## Convenciones

- Variables en inglés, comentarios en español
- Constantes en MAYÚSCULAS al inicio del sketch
- No usar `p5.Sound` ni otras librerías — solo Web Audio API nativa
- El overlay de debug (tecla D) muestra todos los valores clave en tiempo real sobre el canvas

## Restricciones

- NO modificar STRIPE_SEQ ni BOUNDS sin pedido explícito — definen la identidad visual de la obra
- NO cambiar AMP, PHASE_STEP ni los anchos WV/WA/WS/WC/WG sin justificación estética
- NO agregar nuevos archivos — todo vive en index.html
- NO usar librerías de audio externas (Tone.js, p5.Sound, etc.)
- NO refactorizar código que funciona cuando el pedido es un fix puntual
- NO cambiar los umbrales de detección de audio sin primero revisar el overlay de debug (D) para verificar los valores reales del micrófono

## Referencia artística

**Bridget Riley — "Red Dominance" (1977)**

- 35 franjas verticales de ancho variable: las crema y gris son las más anchas, las de color (verde, salmón, azul) son las más finas
- Cada franja tiene un desfase de fase diferente → las ondas viajan en diagonal, no en horizontal
- Las franjas finas se adelgazan visualmente cuando su curvatura las lleva sobre el espacio de las anchas → tensión óptica
- Paleta terrosa: verde salvia, naranja-salmón suave, azul pálido, gris medio, crema cálido
- El fondo crema es parte del patrón, no solo el vacío entre franjas

Lo que NO debe tener: franjas uniformes, ondas en fase, colores saturados o brillantes, efectos de blur o glow.

## Cómo trabajar en este proyecto

1. Antes de tocar el audio: activá el overlay de debug (tecla D) y verificá los valores reales de `flux`, `bass`, `high`, `shush` con el micrófono activo
2. Si cambiás un umbral de detección, explicá qué valor observaste en el debug y por qué el nuevo umbral tiene sentido
3. Para cambios visuales: describí el efecto perceptual buscado, no solo el parámetro a cambiar
4. Mostrá siempre el bloque de código específico que cambiaste, no el archivo completo (a menos que se pida)
5. Si el pedido es ambiguo entre un fix visual y un fix de audio, preguntar antes de implementar
