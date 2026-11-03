---
name: qa
description: "Testing y aseguramiento de calidad con Playwright. Navega la app, valida formularios, interactua con elementos, toma screenshots y confirma que no haya regresiones. Activar cuando el usuario pide testear, verificar, auditar o hacer QA de una feature."
---

# Skill: QA Automatizado y Verificacion

> Ejecutar QA para validar la calidad de la aplicacion y evitar regresiones.

---

## Estrategia de Testing

Playwright permite validar visual y funcionalmente el estado de la aplicacion sin depender de pruebas manuales lentas.

### Prerequisitos
Tener el navegador Chromium instalado:
```bash
npx playwright install chromium
```

---

## Acciones Clave de QA

```bash
# Navegar a una ruta
npx playwright navigate http://localhost:3000

# Capturar pantalla del estado actual
npx playwright screenshot http://localhost:3000 --output screenshot.png

# Interactuar con la interfaz
npx playwright click "text=Sign In"
npx playwright fill "#email" "test@example.com"
```

---

## Flujo de QA en 4 Fases

1. **Pre-flight:** Verificar que el servidor este corriendo (`npm run dev`) y sin errores de compilacion.
2. **Happy Path:** Probar el flujo exitoso principal (ej. registrarse, navegar a dashboard, guardar datos).
3. **Casos Borde:** Probar inputs invalidos, campos vacios, o errores de red.
4. **Reporte:** Confirmar si la prueba paso y, si fallo, aplicar **Auto-Blindaje** (arreglar, probar y documentar).
