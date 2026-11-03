# BUSINESS_LOGIC.md - TikShip

> Generado por SaaS Factory | Fecha: 2026-10-30

## 1. Problema de Negocio
**Dolor:** Los vendedores de TikTok (Live Commerce y ventas por catálogo) capturan decenas de pedidos diarios por WhatsApp o formularios tras sus transmisiones en vivo. Al finalizar el día, pierden horas transcribiendo manualmente nombres, números de DNI, teléfonos y agencias de destino, provocando errores de digitación en ventanilla de courier y retenciones de paquetes.
**Costo actual:** 3 a 4 horas diarias de trabajo operativo manual nocturno por vendedor y entre un 5% y 10% de envíos devueltos o retrasados por discrepancias en datos de destinatario.

## 2. Solución
**Propuesta de valor:** Un acelerador logístico para TikTok Sellers que transforma mensajes de pedidos de WhatsApp en rótulos térmicos profesionales en PDF y genera el archivo oficial de carga masiva Excel de Shalom en menos de 60 segundos.

**Flujo principal (Happy Path):**
1. **Captura Rápida:** El vendedor pega los datos del pedido (texto de WhatsApp o formulario rápido de pedido).
2. **Normalización & Validación:** El sistema valida DNI/RUC (longitud y formato), teléfono móvil y mapea automáticamente la agencia oficial de **Shalom** destino.
3. **Impresión de Rótulos:** Genera en un clic los rótulos térmicos (10x15 cm o A4) con código de barras y datos claros de remitente/destinatario.
4. **Exportación Masiva Shalom:** Descarga el archivo Excel con el formato exacto de columnas y cabeceras que exige el sistema de carga masiva de Shalom para despachar en ventanilla sin digitar dato por dato.

## 3. Usuario Objetivo
**Rol:** TikTok Sellers / Emprendedores de Live Shopping y E-commerce local.
**Contexto:** Venden productos físicos (ropa, tecnología, cosméticos, accesorios), despachan diariamente lotes de 15 a 100 paquetes y utilizan Shalom como su principal canal de envío nacional por cobertura y costo.

## 4. Arquitectura de Datos

**Input:**
- Texto no estructurado o semi-estructurado de WhatsApp (Nombre, DNI, Teléfono, Ciudad/Agencia Shalom).
- Formulario de entrada rápida de pedidos.
- Configuración de remitente predeterminada del vendedor (DNI/RUC, teléfono, agencia Shalom origen).

**Output:**
- PDF de rótulos de despacho optimizado para impresoras térmicas (10x15 cm) o formato estándar A4.
- Archivo `.xlsx` estructurado con la plantilla oficial de carga masiva de Shalom.
- Historial de despachos y lotes diarios.

**Storage (Supabase tables sugeridas):**
- `profiles`: Datos del vendedor y remitente por defecto (nombre/razón social, documento, teléfono, agencia origen).
- `shalom_agencies`: Catálogo maestro de agencias Shalom en Perú (departamento, provincia, distrito, nombre de agencia, dirección).
- `batches`: Lotes diarios de despacho para agrupar pedidos.
- `orders`: Registro de envíos individuales (destinatario, documento, teléfono, agencia destino, estado: `draft`, `labeled`, `exported`).

## 5. KPI de Éxito
**Métrica principal:** Reducir el tiempo de preparación y rotulado de un lote de 30 pedidos de 2 horas a menos de 5 minutos, con 0% de errores en estructura de carga masiva Shalom.

## 6. Especificación Técnica (Para el Agente)

### Features a Implementar (Feature-First)
```
src/features/
├── auth/                 # Autenticación Supabase (Email/Password)
├── sender-profile/       # Configuración de datos del remitente y agencia de origen
├── orders/               # Ingesta rápida, listado y gestión de pedidos
├── shalom-agencies/      # Búsqueda y autocompletado de agencias Shalom
├── label-generator/      # Motor de generación de rótulos en PDF
└── export-shalom/        # Generador de plantilla Excel para carga masiva
```

### Stack Confirmado
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS 3.4
- **Backend / Database:** Supabase (Auth + PostgreSQL + RLS)
- **Generación PDF:** `@react-pdf/renderer` (renderizado vectorial de etiquetas 10x15)
- **Generación Excel:** `exceljs` (generación de plantilla Shalom compatible)
- **Validación:** Zod
- **Testing:** Playwright CLI

### Próximos Pasos
1. [ ] Crear PRP formal (`prp-tikship-core.md`) para delimitar las fases de implementación
2. [ ] Ejecutar Fase 1: Ingesta rápida de pedidos y normalizador de datos
3. [ ] Ejecutar Fase 2: Motor de rótulos PDF
4. [ ] Ejecutar Fase 3: Exportador de Excel masivo para Shalom

