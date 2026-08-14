# TASK — Sorteo Norbridge

Registro de tareas y decisiones del proyecto.

---

## Estado actual

**Rediseño a Slot Machine Casino** — ✅ implementado. Portada "FELIZ DÍA MAESTROS" + 2 tambores (premio/ganador) + pantalla de resultados. Estética casino (negro + dorado + luces marquee).

---

## 2026-08-14 — Botón de reset con clave de admin

### Mejora aplicada

| Elemento | Detalle |
|----------|---------|
| **Botón "Reiniciar todo"** | En la pantalla de resultados, con icono RotateCcw. |
| **Modal de confirmación** | Avisa que se borran participantes, premios y resultados (irreversible). |
| **Clave de admin** | El reset pide una clave. Default: `norbridge2026`. Configurable desde la pantalla de configuración (campo "Clave de administrador"). |

### Razón

En un evento en TV con público, el reset accidental es un riesgo real. La doble protección (confirmación + clave) evita borrar todo por error.

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/hooks/useLottery.ts` | `claveAdmin` + `setClaveAdmin` + `verificarClave` (persistido en `sorteo_clave`, default `norbridge2026`) |
| `src/components/ResultsScreen.tsx` | Botón "Reiniciar todo" + modal de confirmación con input de clave |
| `src/components/SetupScreen.tsx` | Campo para cambiar la clave de administrador |
| `src/App.tsx` | Pasa `claveAdmin`/`setClaveAdmin`/`verificarClave`/`borrarTodo` |
| `src/index.css` | Estilos `.btn-danger`, modal de confirmación, campo de clave |

---

## 2026-08-14 — Retoque (feedback del usuario)

### Mejoras aplicadas

| Mejora | Detalle |
|--------|---------|
| **Tambor sin revelar** | Cuando no hay resultado ni giro, el tambor muestra "?" (placeholder) en vez del primer nombre/premio. Evita revelar el contenido antes de sortear. |
| **Modal del ganador** | El ganador aparece en un **modal overlay** centrado (trofeo + premio grande + nombre gigante), ya no abajo. Para apreciar mejor premio y ganador. |
| **Panel de resultados** | Botón lateral que abre un panel con la tabla de ganadores acumulados durante el sorteo. |
| **SVG en vez de emojis** | Instalado `lucide-react`. Reemplazados 🎁🎰🎲📋🏆 por iconos SVG (Gift, Trophy, Dices, Shuffle, ListOrdered, ListChecks, X, Maximize, Settings). |
| **Botón fullscreen** | Se agregó ⛶ (Maximize) en la barra superior del sorteo. |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/components/Reel.tsx` | Placeholder "?" cuando idle sin resultado |
| `src/components/LotteryScreen.tsx` | Modal de ganador + panel de resultados + iconos SVG + fullscreen |
| `src/components/SplashScreen.tsx` | Icono Dices en el botón |
| `src/components/SetupScreen.tsx` | Iconos Shuffle/ListOrdered en el toggle de orden |
| `src/components/ResultsScreen.tsx` | Icono Trophy |
| `src/index.css` | Estilos modal, panel, placeholder, botones con iconos |
| `package.json` | Nueva dependencia `lucide-react` |

---

## 2026-08-14 — Rediseño completo a "Casino" (día del maestro)

### Contexto

El primer MVP (bolillero con matter-js) no convenció en estética ni animaciones. El evento es el **día del maestro**, con **15 premios** a sortear entre los docentes (150-200).

### Investigación de referencias (ejemplos reales)

| Referencia | Qué aporta |
|------------|-----------|
| [medalhas/MyRaffle](https://github.com/medalhas/MyRaffle) — [demo](https://myraffle-149da.web.app) | Slot machine React + TS con **luces de casino parpadeantes**, gradiente metálico, animación 3s |
| [IwuchukwuDivine/raffleSpinner](https://github.com/IwuchukwuDivine/raffleSpinner) | "Slot-machine **name** roller" con **desaceleración** + confetti + dark stage-ready UI (React Native) |
| [nuxy/react-slot-machine-gen](https://github.com/nuxy/react-slot-machine-gen) | Tambor 3D (cilindro), pero usa símbolos, no nombres |

Conclusión: el patrón moderno es **tambor de nombres con desaceleración + luces casino + confetti + fondo oscuro de escenario**. Se implementa **custom** (CSS + framer-motion) para control total de la estética navy + dorado.

### Decisiones del usuario

| Decisión | Elección |
|----------|----------|
| Título de portada | **"FELIZ DÍA MAESTROS"** |
| Lema | Poema emotivo + "Gracias por enseñarnos a volar" |
| Estética | **Casino moderno** (dorado + negro + luces marquee) |
| Flujo | **3 pantallas**: Portada → Sorteo → Resultados |
| Sorteo | **2 tambores**: uno de PREMIO y otro de GANADOR |
| Control | **2 botones separados** (premio / ganador) para mayor suspenso |
| Orden de premios | **Manual Y aleatorio** (toggle) |
| Cierre | Pantalla de **resultado total** (15 ganadores + premios) |

### Arquitectura nueva

| Componente | Rol |
|-----------|-----|
| `SplashScreen.tsx` | Portada: título + lema + botón "¡QUE EMPIECEN LOS JUEGOS!" + luces |
| `Reel.tsx` | Tambor de slot reutilizable (premio/ganador) con desaceleración |
| `LotteryScreen.tsx` | 2 tambores + 2 botones (SORTEAR PREMIO / SORTEAR GANADOR) |
| `ResultsScreen.tsx` | Tabla final de resultados |
| `SetupScreen.tsx` | Carga de nombres + premios + toggle de orden (aleatorio/manual) |
| `useLottery.ts` | Pools separados (`premiosRestantes`, `nombresRestantes`) + `resultados[]` |
| `useSound.ts` | Sonidos casino: chime, apertura, rueda, click traba, fanfarria |

**Eliminado:** `BallMachine.tsx` (bolillero con matter-js) y la dependencia `matter-js`.

### Lógica del tambor (Reel)

- El ganador se elige aleatoriamente al iniciar el giro (en `useLottery`).
- El tambor cambia items rápido (setTimeout) con **desaceleración progresiva** (`delay *= 1.08`).
- Al frenar, se fija en el resultado elegido.
- Blur de velocidad con CSS mientras gira rápido.

---

## 2026-08-14 — Creación del proyecto (MVP bolillero, deprecado)

## 2026-08-14 — Creación del proyecto

### Investigación previa

| Pregunta | Resultado |
|----------|-----------|
| ¿Hay librería "bolillero de sorteo" lista? | ❌ No. La búsqueda en npm ("lottery bingo ball machine") no arroja resultados útiles. Se arma con piezas. |
| ¿Motor de física para las pelotas? | `matter-js` (MIT, 227K descargas/semana, demo "Ball Pool" = bolillero exacto). |
| ¿Celebración? | `canvas-confetti` (ISC, 8.3M descargas/semana). |
| ¿Transiciones UI? | `framer-motion` (ya usado en portal-norbridge). |
| ¿Sonido? | Web Audio API nativo (ya usado en admisiones-norbridge). |

### Decisiones tomadas (con el usuario)

| Decisión | Elección |
|----------|----------|
| Estilo visual | **Bolillero físico + nombre en grande** (no ruleta, no tambor) |
| Carga de nombres | **Pegar texto** (textarea), no CSV/Excel |
| Premios | **Varios, cargables manualmente**, sorteados aleatoriamente |
| Pantalla destino | **TV/Proyector** (fullscreen, tipografía gigante) |
| Stack | React 19 + TS + Vite, deploy Vercel gratis, sin backend |

### Construido

- [x] Scaffolding Vite + React + TS
- [x] Dependencias: `matter-js`, `canvas-confetti`, `framer-motion` + tipos
- [x] `seed.ts`: 150 nombres + 20 premios de ejemplo
- [x] `useLottery.ts`: lógica del sorteo + persistencia localStorage
- [x] `useSound.ts`: sonidos (tambor + fanfarria)
- [x] `BallMachine.tsx`: bolillero con física Matter.js
- [x] `SetupScreen.tsx`: carga de nombres + premios
- [x] `LotteryScreen.tsx`: GIRAR + ganador gigante + confetti + historial
- [x] `App.tsx`: router de pantallas
- [x] `index.css`: tema navy + dorado, responsive
- [x] Build verificado (`tsc -b && vite build`)
- [x] Dev server levantado en red (puerto 5175)

---

## Claves técnicas (lecciones)

- **Las pelotas son decorativas**: 150-200 nombres no caben legibles en pelotas físicas. El nombre se elige de la lista y se muestra en grande. Cantidad de pelotas = `min(90, max(40, nombres.length))`.
- **Contenedor circular en Matter.js**: no hay superficie cóncava nativa; se usan 20 paredes rectangulares estáticas formando un polígono aproximado.
- **Render manual**: se dibuja con canvas propio (no el renderer de Matter.js) para control del estilo (cristal, brillo, gradientes).
- **"Aire"**: fuerzas aleatorias por frame (`Body.applyForce`) solo cuando `girando === true`.
- **Autoplay de audio**: el `AudioContext` arranca suspendido; se resume en la primera interacción del usuario (botón GIRAR).

---

## Pendientes / ideas futuras

- [ ] Botón "Reiniciar sorteo" (limpiar ganadores) en la pantalla de sorteo
- [ ] Sonido más realista de bolillas (ruido blanco filtrado en vez de ticks)
- [ ] Animación de "extracción" de una pelota específica hacia arriba
- [ ] Exportar ganadores a CSV/PDF
- [ ] Modo "sorteo múltiple" (sortear N ganadores de una vez)
- [ ] Mostrar el logo del colegio en el bolillero
- [ ] Persistir en la nube (si se necesitara compartir entre dispositivos)
- [ ] Test con la cantidad real de participantes (rendimiento de Matter.js con 90 pelotas)

---

## Commits

| Commit | Descripción |
|--------|-------------|
| *(inicial)* | Proyecto completo: bolillero físico + sorteo + ganador + confetti + sonido + historial |
