# 🎮 Connect Four AI

**Connect Four AI** es una versión web del clásico juego **Conecta 4**, desarrollada con **HTML, CSS, JavaScript y Tailwind CSS**.
El juego permite enfrentarse contra un bot con distintos niveles de dificultad, incluyendo un modo avanzado basado en inteligencia artificial clásica mediante **Minimax con poda alfa-beta**.

---

## 🧠 Características principales

* 🎲 Juego de Conecta 4 en modo un jugador.
* 🤖 Bot con diferentes niveles de dificultad:

  * **Fácil:** movimientos básicos.
  * **Medio:** análisis moderado del tablero.
  * **Extremo:** IA basada en Minimax con poda alfa-beta.
* 💾 Sistema de récords usando `localStorage`.
* 🎨 Interfaz moderna creada con Tailwind CSS.
* 📱 Diseño responsive adaptable a diferentes pantallas.
* 🧩 Código organizado por carpetas.
* ⚡ No requiere backend.

---

## 🕹️ ¿Cómo se juega?

El objetivo es conectar **cuatro fichas del mismo color** antes que el bot.

Puedes ganar formando una línea de cuatro fichas en cualquiera de estas direcciones:

* Horizontal
* Vertical
* Diagonal ascendente
* Diagonal descendente

El jugador coloca una ficha haciendo clic sobre la columna deseada. Después de cada movimiento, el bot realiza automáticamente su jugada.

---

## 🤖 Inteligencia Artificial del bot

El juego cuenta con un bot controlado por IA clásica.

### Dificultades

| Dificultad | Descripción                                                            |
| ---------- | ---------------------------------------------------------------------- |
| Fácil      | Realiza movimientos simples y bloqueos básicos.                        |
| Medio      | Evalúa el tablero con mayor profundidad.                               |
| Extremo    | Usa Minimax con poda alfa-beta para tomar decisiones más estratégicas. |

### Modo extremo

El modo extremo utiliza el algoritmo **Minimax**, una técnica de búsqueda usada en juegos por turnos.
Este algoritmo simula posibles movimientos futuros tanto del jugador como del bot, evaluando cuál es la mejor decisión posible.

Para mejorar el rendimiento, se aplica **poda alfa-beta**, lo que permite descartar ramas del árbol de decisiones que no afectan el resultado final.

La evaluación del tablero considera:

* Control del centro.
* Oportunidades de conectar 2, 3 o 4 fichas.
* Bloqueo de amenazas del jugador.
* Posibles victorias futuras.
* Prevención de jugadas peligrosas.

---

## 🛠️ Tecnologías utilizadas

* **HTML5**
* **CSS3**
* **JavaScript**
* **Tailwind CSS**
* **Canvas API**
* **LocalStorage**

---

## ⚙️ Cómo ejecutar el proyecto

### Opción recomendada: Live Server

1. Clona este repositorio:

```bash
git clone https://github.com/Ivan2729i/Connect-four-AI.git
```

2. Entra a la carpeta del proyecto:

```bash
cd Connect-four-AI
```

3. Abre el proyecto en Visual Studio Code.

4. Da clic derecho sobre `index.html`.

5. Selecciona:

```txt
Open with Live Server
```

---

## 👨‍💻 Autor

Desarrollado por **Iván**.

Repositorio:
[Connect Four AI](https://github.com/Ivan2729i/Connect-four-AI)

---

## 📄 Licencia

Este proyecto puede usarse con fines educativos y de aprendizaje.
