---
name: reverse-engineer
description: "Ingeniería inversa y deconstrucción técnica de aplicaciones, APIs, tráfico de red (HAR), bundles JS/Electron y apps móviles con REA. Activar cuando el usuario pida: analiza esta app, cómo funciona este competidor, deconstruye este flujo/API, inspecciona este archivo HAR/bundle JS, o extrae la lógica de un producto existente para replicarla."
---

# Skill: Ingeniería Inversa & Deconstrucción (REA)

> Deconstruir aplicaciones existentes para extraer contratos de datos, flujos de negocio y endpoints sin copiar código ofuscado ni violar fundamentos de arquitectura limpia.

---

## Filosofía: CONCEPTS > CODE

El objetivo de la ingeniería inversa NO es copiar y pegar código sucio u ofuscado.
El objetivo es **COMPRENDER EL MODELO DE NEGOCIO Y LOS CONTRATOS**:
1. Extraer los datos reales (qué entidades existen, qué viaja en el payload).
2. Mapear los endpoints y estados (qué acciones disparan qué cambios).
3. Rediseñar una solución superior y limpia bajo nuestro **Golden Path** (Next.js 16 + Supabase + Zod).

---

## Cuándo Activar Este Skill

- El usuario proporciona un archivo `.har` (captura de tráfico de red del navegador).
- El usuario proporciona un bundle de frontend (`.js`, source maps, Electron).
- El usuario pide analizar cómo un SaaS o competidor implementó una función específica.
- El usuario proporciona un `.apk` o archivo de base de datos (`.sqlite`).

---

## Herramientas: REA (Reverse Engineer Anything)

Este skill se apoya en el servidor MCP `rea` (`rea-agents`):
- Inspección de tráfico web y contratos HTTP/REST.
- Extracción de módulos y source maps en bundles JavaScript.
- Decompilación de APKs/ensamblados y mapeo de rutas IPC.
- Análisis de esquemas SQLite locales.

---

## Flujo de Trabajo Metódico

### Paso 1: Definir el Alcance del Análisis
No analices todo el software a ciegas; enfócate en el valor crítico:
- ¿Qué funcionalidad específica nos interesa deconstruir? (ej. proceso de checkout, motor de matching, flujo de onboarding).
- ¿Cuál es el artefacto de entrada? (ej. `captura.har`, ruta a un archivo JS, dump de base de datos).

### Paso 2: Extracción con REA / Análisis Estructurado
1. Utiliza las herramientas MCP de `rea` para inspeccionar el artefacto.
2. Identifica:
   - **Rutas y métodos HTTP:** URLs, query params, headers de autorización.
   - **Esquemas JSON:** Estructura de payloads enviados y respuestas recibidas.
   - **Proveedores externos:** Pasarelas de pago (Stripe/Paddle), autenticación (Auth0/Supabase), analíticas.

### Paso 3: Traducción al Golden Path (Abstracción Limpia)
Transforma la evidencia extraída en código tipado y validado:
- **Validación con Zod:** Escribe los esquemas de entrada y salida basados en los payloads observados.
- **Modelo de Datos:** Diseña las tablas relacionales para Supabase (PostgreSQL) con sus correspondientes políticas RLS.
- **Separación de Responsabilidades:** Ubica los servicios en `src/features/[feature]/services/` y las acciones en hooks/handlers.

### Paso 4: Transición al Flujo de la Fábrica
- Si es un producto nuevo completo derivado del análisis: Genera `BUSINESS_LOGIC.md` y arranca el ciclo con `/new-app`.
- Si es una funcionalidad puntual: Redacta un PRP formal con `/prp` y luego implementa con `/bucle-agentico`.

---

## Anti-Patrones Estrictos

- **NUNCA** utilices nombres de variables o código ofuscado (`a`, `b`, `_0x12a`). Escribe código declarativo y auto-documentado.
- **NUNCA** guardes credenciales, tokens de sesión o API keys encontradas en las capturas.
- **NUNCA** clones librerías pesadas si una abstracción nativa de Next.js o Supabase resuelve el problema.

