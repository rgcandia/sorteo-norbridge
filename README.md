# Sorteo Norbridge 🎰

Sorteo virtual con **bolillero físico** para eventos institucionales. Emula una esfera de cristal con pelotas de colores girando por física real, para sortear premios entre los docentes (150-200 participantes).

---

## Índice

1. [Descripción](#descripción)
2. [Tecnologías](#tecnologías)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Cómo ejecutar](#cómo-ejecutar)
5. [Flujo de uso](#flujo-de-uso)
6. [Funcionamiento técnico](#funcionamiento-técnico)
7. [Datos de ejemplo](#datos-de-ejemplo)

---

## Descripción

Aplicación para sortear premios en un evento (reunión de docentes, fiesta, etc.). El operador:

1. Carga la lista de participantes (pegando texto o usando los datos de ejemplo).
2. Carga la lista de premios (manual o de ejemplo).
3. Inicia el sorteo: un **bolillero** con pelotas de colores gira, se extrae un ganador aleatorio y un premio aleatorio, y se anuncia en pantalla gigante con confetti y sonido.
4. Los ganadores se excluyen de sorteos siguientes y quedan en el historial.

Diseñada para **TV/proyector** (tipografía gigante, fullscreen).

---

## Tecnologías

| Categoría | Tecnología | Uso |
|-----------|------------|-----|
| Framework | React 19 + TypeScript + Vite | App SPA |
| Física | `matter-js` | Motor de física 2D del bolillero (pelotas chocando, "aire") |
| Celebración | `canvas-confetti` | Confetti al anunciar ganador |
| Animaciones | `framer-motion` | Transiciones (ganador, overlays) |
| Sonido | Web Audio API (nativo) | Tambor (agitación) + fanfarria (ganador) |
| Persistencia | `localStorage` | Nombres, premios y ganadores (sin backend) |
| Deploy | Vercel | Gratis |

---

## Estructura del proyecto

```
sorteo-norbridge/
├── src/
│   ├── data/
│   │   └── seed.ts              # 150 nombres + 20 premios de ejemplo
│   ├── hooks/
│   │   ├── useLottery.ts        # Lógica del sorteo + persistencia localStorage
│   │   └── useSound.ts          # Sonidos (Web Audio API)
│   ├── components/
│   │   ├── BallMachine.tsx      # Bolillero con física Matter.js (canvas)
│   │   ├── SetupScreen.tsx      # Pantalla de carga (nombres + premios)
│   │   └── LotteryScreen.tsx    # Pantalla del sorteo (GIRAR + ganador + confetti)
│   ├── App.tsx                  # Router de pantallas (setup ↔ lottery)
│   ├── main.tsx
│   └── index.css                # Tema navy + dorado, tipografía TV
├── index.html
├── package.json
└── vite.config.ts
```

---

## Cómo ejecutar

```bash
npm install
npm run dev        # desarrollo (http://localhost:5173)
npm run build      # build de producción
npm run preview    # previsualizar build
```

Deploy en Vercel: `npm run build` (SPA estática, sin backend).

---

## Flujo de uso

```
Pantalla de carga
  ├── Textarea: pegar participantes (uno por línea o separados por coma)
  ├── Botón "Cargar 150 nombres de ejemplo"
  ├── Lista de premios: agregar/eliminar manual o "Cargar 20 premios de ejemplo"
  └── Botón "Empezar sorteo"
          ↓
Pantalla de sorteo (fullscreen TV)
  ├── Bolillero: esfera de cristal + pelotas de colores
  ├── Botón "GIRAR"
  ├── Animación: agitación ~3s → desaceleración → extracción
  ├── Ganador en GIGANTE + premio + confetti + fanfarria
  ├── Botón "Siguiente premio"
  └── Historial de ganadores (botón lateral)
```

---

## Funcionamiento técnico

### Bolillero (`BallMachine.tsx`)

- **Motor**: Matter.js (`Engine`, `World`, `Bodies`).
- **Contenedor**: esfera aproximada con 20 paredes rectangulares estáticas dispuestas en círculo.
- **Pelotas**: `cantPelotas` cuerpos circulares de colores (paleta de 10), con `restitution: 0.7`.
- **"Aire"**: cuando `girando` es true, se aplican fuerzas aleatorias por frame (`Body.applyForce`) simulando el aire que agita las pelotas.
- **Render**: canvas 2D propio (no el renderer de Matter.js) para control total del estilo: esfera de cristal con gradiente radial, brillo, pelotas con sombra y soporte metálico.
- **Cantidad de pelotas**: se ajusta al número de participantes (`Math.min(90, Math.max(40, nombres.length))`). Las pelotas son decorativas — el nombre se elige de la lista, no de la pelota (200 nombres no caben legibles en pelotas físicas).

### Lógica del sorteo (`useLottery.ts`)

- `nombres`, `premios`, `ganadores` se persisten en `localStorage` (claves `sorteo_nombres`, `sorteo_premios`, `sorteo_ganadores`).
- `sortear()`: elige nombre y premio al azar (Math.random), los quita del pool y agrega al historial.
- Los ganadores se excluyen automáticamente de sorteos siguientes.
- `cargarNombres(texto)`: parsea por saltos de línea, comas o punto y coma.

### Sonido (`useSound.ts`)

- `startShuffle()`/`stopShuffle()`: tick rápido (500-1100 Hz aleatorio) mientras el bolillero agita.
- `playWin()`: fanfarria ascendente (C-E-G-C-E) al anunciar ganador.
- `resume()`: reactiva el `AudioContext` en la primera interacción (política de autoplay).

### Pantallas (`App.tsx`)

- `pantalla === 'setup'` (o sin nombres) → `SetupScreen`.
- Con nombres → `LotteryScreen`.
- Fullscreen con la Fullscreen API (botón ⛶).

---

## Datos de ejemplo

`src/data/seed.ts` contiene:
- **150 nombres** de docentes (apellidos argentinos variados).
- **20 premios** (desde Smart TV y tablet hasta canasta navideña y día de spa).

Se cargan con un clic desde la pantalla de carga ("Cargar 150 nombres de ejemplo" / "Cargar 20 premios de ejemplo").

---

## Diseño visual

| Elemento | Valor |
|----------|-------|
| Fondo | `#04102a` (navy oscuro) con gradiente radial |
| Acento | `#C6A246` (dorado) |
| Tipografía | Inter (sans) + nombre del ganador en gigante |
| Paleta pelotas | 10 colores vibrantes (rojo, naranja, amarillo, verde, cyan, azul, violeta, etc.) |

---

## Investigación previa (decisiones)

- **No existe librería "bolillero de sorteo" lista** en npm — se arma con `matter-js` (física) + `canvas-confetti` (celebración).
- **150-200 nombres no caben legibles en pelotas físicas** → las pelotas son de colores decorativas y el nombre se muestra en grande al extraer.
- **Sin backend**: los datos se cargan en el cliente y se persisten en `localStorage`. Deploy gratis en Vercel.

Documentación de tareas y decisiones en `TASK.md`.
