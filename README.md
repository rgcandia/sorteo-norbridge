# Sorteo Norbridge 🎰

Sorteo virtual **estilo casino** para eventos institucionales (día del maestro). Una **slot machine de 2 tambores** (premio + ganador) para sortear premios entre los docentes (150-200 participantes), con portada, luces de casino, confetti y pantalla de resultados.

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

Aplicación para sortear premios en un evento (reunión de docentes, día del maestro). El operador:

1. Ve la **portada** "¡FELIZ DÍA MAESTROS!" con lema y botón "¡Que empiecen los juegos!".
2. Carga la lista de participantes y los premios.
3. Sortea de a uno: gira el **tambor de premio**, luego el **tambor de ganador** (dos botones, máximo suspenso).
4. Cada ganador se anuncia en pantalla gigante con confetti y fanfarria.
5. Al agotar los premios, se muestra la **pantalla de resultados** con la tabla completa.

Diseñada para **TV/proyector** (tipografía gigante, fullscreen).

---

## Tecnologías

| Categoría | Tecnología | Uso |
|-----------|------------|-----|
| Framework | React 19 + TypeScript + Vite | App SPA |
| Animaciones | `framer-motion` | Transiciones, entradas, botones |
| Celebración | `canvas-confetti` | Confetti al anunciar ganador |
| Sonido | Web Audio API (nativo) | Chime, fanfarria, tambor, click |
| Persistencia | `localStorage` | Nombres, premios y resultados (sin backend) |
| Deploy | Vercel | Gratis |

**Nota:** se quitó `matter-js` (física del bolillero) en el rediseño — la slot machine usa animación CSS/JS sin motor de física.

---

## Estructura del proyecto

```
sorteo-norbridge/
├── src/
│   ├── data/
│   │   └── seed.ts              # 150 nombres + 20 premios de ejemplo
│   ├── hooks/
│   │   ├── useLottery.ts        # Lógica del sorteo + pools + persistencia
│   │   └── useSound.ts          # Sonidos de casino (Web Audio API)
│   ├── components/
│   │   ├── SplashScreen.tsx     # Portada "FELIZ DÍA MAESTROS" + botón inicio + luces
│   │   ├── Reel.tsx             # Tambor de slot reutilizable con desaceleración
│   │   ├── SetupScreen.tsx      # Carga de nombres + premios + orden (aleatorio/manual)
│   │   ├── LotteryScreen.tsx    # 2 tambores + 2 botones (premio/ganador)
│   │   └── ResultsScreen.tsx    # Tabla final de ganadores
│   ├── App.tsx                  # Router de 4 pantallas
│   ├── main.tsx
│   └── index.css                # Tema casino (negro + navy + dorado + luces)
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
Portada ("¡FELIZ DÍA MAESTROS!")
  └── Botón "¡QUE EMPIECEN LOS JUEGOS!"
          ↓
Configuración
  ├── Cargar participantes (textarea o datos de ejemplo)
  ├── Cargar premios (manual o de ejemplo)
  ├── Elegir orden: aleatorio 🎲 o manual 📋 (reordenar con flechas)
  └── "Empezar sorteo"
          ↓
Sorteo (2 tambores)
  ├── Botón "SORTEAR PREMIO" → gira tambor de premio → se fija
  ├── Botón "SORTEAR GANADOR" → gira tambor de ganador → se fija
  ├── Nombre gigante + confetti + fanfarria
  └── Repetir hasta agotar premios → "Ver resultados"
          ↓
Resultados
  └── Tabla: # / Premio / Ganador (15 ganadores)
```

---

## Funcionamiento técnico

### Tambor (Reel.tsx)

- Un tambor vertical reutilizable (premio o ganador).
- El ganador se elige aleatoriamente **antes** de girar (en `useLottery`).
- La animación cambia items rápidamente (`setTimeout`) con **desaceleración progresiva** (`delay *= 1.09`).
- Al frenar, se fija en el resultado elegido y se dispara el callback.
- **Blur de velocidad** con CSS mientras gira rápido, nítido al frenar.
- La lista de animación siempre incluye el resultado (aunque ya no esté en el pool).

### Lógica del sorteo (useLottery.ts)

- `nombres` (pool de participantes) y `premios` (pool de premios).
- `sortearPremio()`: elige premio (aleatorio o el primero si modo manual), lo quita del pool y lo fija como `premioActual`.
- `sortearGanador()`: elige nombre al azar, lo quita del pool y lo combina con `premioActual` en `resultados[]`.
- Cada ganador se excluye; cada premio se descuenta.
- Persistencia en `localStorage` (claves `sorteo_*`).
- `moverPremio()` para reordenar premios en modo manual.

### Sonido (useSound.ts)

| Función | Sonido |
|---------|--------|
| `playChime()` | Chime suave de entrada a la portada |
| `playOpen()` | Fanfarria de apertura ("¡Que empiecen los juegos!") |
| `startReel()` / `stopReel()` | Ticks de rueda + click de traba al frenar |
| `playWin()` | Fanfarria triunfal de ganador |

Todo sintetizado con Web Audio API, sin assets externos.

---

## Datos de ejemplo

`src/data/seed.ts` contiene:
- **150 nombres** de docentes.
- **20 premios** (Smart TV, tablet, auriculares, cena, etc.).

Se cargan con un clic desde la pantalla de configuración.

---

## Diseño visual (casino)

| Elemento | Valor |
|----------|-------|
| Fondo | Negro `#05060a` + navy con viñeta radial |
| Acento | Dorado `#C6A246` con destellos |
| Luces | Marquee de luces parpadeantes (arriba/abajo) |
| Marco tambor | Gradiente metálico + sombra 3D |
| Tipografía | Georgia serif (títulos/poema) + Inter (UI) |

---

## Investigación previa (decisiones)

- **No existe librería "slot machine de nombres" lista** para el caso (las existentes usan símbolos de frutas). Se implementa **custom** con CSS + framer-motion.
- **Referencias**: `medalhas/MyRaffle` (luces de casino), `IwuchukwuDivine/raffleSpinner` (name roller con desaceleración), `nuxy/react-slot-machine-gen` (tambor 3D).
- **150-200 nombres no caben legibles en un bolillero físico** → se descartó el bolillero inicial (matter-js) por la slot machine.
- **Sin backend**: datos en el cliente + `localStorage`. Deploy gratis en Vercel.

Documentación de tareas y decisiones en `TASK.md`.
