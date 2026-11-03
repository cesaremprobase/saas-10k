---
name: bucle-agentico
description: "Ejecutar features complejas por fases con mapeo de contexto real antes de cada fase. Activar cuando la tarea toca multiples archivos, requiere cambios en BD + codigo + UI coordinados, tiene fases que dependen una de otra, o cuando un PRP fue aprobado y hay que implementarlo."
---

# Modo BLUEPRINT del Bucle Agentico

> "No planifiques lo que no entiendes. Mapea contexto, luego planifica."

El modo BLUEPRINT es para sistemas complejos que requieren construccion por fases con mapeo de contexto just-in-time.

---

## Cuando Usar BLUEPRINT

- La tarea requiere multiples componentes coordinados
- Involucra cambios en DB + codigo + UI
- Tiene fases que dependen una de otra
- Requiere entender contexto antes de implementar
- El sistema final tiene multiples partes integradas

---

## El Flujo BLUEPRINT: 5 Pasos

### PASO 1: DELIMITAR Y DESCOMPONER EN FASES
- Entender el problema FINAL completo
- Romper en FASES ordenadas cronologicamente
- Identificar dependencias entre fases
- NO generar subtareas todavia

### PASO 2: ENTRAR EN FASE N - MAPEAR CONTEXTO
ANTES de generar subtareas, explorar:
- Codebase: Que archivos existen, que patrones se usan, que se puede reutilizar.
- Base de Datos (Supabase): Tablas, estructura, RLS policies.
- Dependencias: Que se construyo en fases anteriores y restricciones.
DESPUES de mapear, generar subtareas especificas.

### PASO 3: EJECUTAR SUBTAREAS DE LA FASE
- Ejecutar una subtarea a la vez.
- Usar MCPs y herramientas segun el juicio tecnico.
- Validar resultado.
- Si hay error -> AUTO-BLINDAJE (paso 3.5).
- Fase completada cuando todas las subtareas estan listas.

### PASO 3.5: AUTO-BLINDAJE (cuando hay errores)
1. ARREGLA el codigo.
2. TESTEA que funcione.
3. DOCUMENTA el aprendizaje (en el PRP actual o en GEMINI.md).
El mismo error NUNCA ocurre dos veces.

### PASO 4: TRANSICIONAR A SIGUIENTE FASE
- Confirmar que la fase actual esta REALMENTE completa.
- Volver a PASO 2 con la siguiente fase. El contexto ahora incluye lo construido.
- Repetir hasta completar todas las fases.

### PASO 5: VALIDACION FINAL
- Testing de punta a punta del sistema completo.
- Confirmar que el problema ORIGINAL esta resuelto.
- Reportar al usuario lo construido.

---

## Principios BLUEPRINT

1. **Fases primero, subtareas despues**: Solo generar subtareas cuando entras a la fase.
2. **Mapeo obligatorio**: Siempre mapear contexto real antes de generar subtareas.
3. **Herramientas con criterio**: Usar herramientas y validaciones cuando el juicio tecnico lo indique.
4. **Validacion por fase**: Confirmar que cada fase esta completa antes de avanzar.
5. **Contexto acumulativo**: Cada fase hereda el contexto de las anteriores.
