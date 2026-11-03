# SaaS Factory V5

Template production-ready y agnóstico de entorno para crear aplicaciones SaaS asistidas por IA. Filosofía Agent-First con despliegue multi-nube (Vercel Serverless o Docker / VPS).

## Que incluye

- Next.js 16 (App Router + Standalone Output) + React 19 + TypeScript
- Supabase (Database + Auth + RLS + Middleware de Sesión)
- Tailwind CSS 3.4 + shadcn/ui + Utilidad `cn()`
- Soporte dual de IA: Claude Code (`.claude/`) y Antigravity IDE (`.agents/`)
- Despliegue universal: `vercel.json` con cabeceras de seguridad y `Dockerfile` multi-stage
- Endpoint de monitoreo y chequeo de salud en `/api/health`
- Playwright CLI para QA automatizado
- AI Templates (Vercel AI SDK v5 + OpenRouter)
- 5 Design Systems listos para usar
- Arquitectura Feature-First (`src/features/`)
- Auto-Blindaje y Clonador limpio en 2 segundos (`crear-proyecto.bat`)

## Quick Start

### 0. Crear un Nuevo Proyecto (Recomendado)

Haz **doble clic** en `crear-proyecto.bat` (o ejecuta `./crear-proyecto.ps1`). Te creará una copia limpia e independiente en segundos, sin copiar archivos pesados (`node_modules` ni `.next`).

Abre esa nueva carpeta en tu editor y continúa con los pasos de abajo.

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Variables de Entorno

```bash
cp .env.example .env.local
# Editar con credenciales de Supabase
```

### 3. MCPs (Opcional)

```bash
cp .claude/example.mcp.json .mcp.json
# Editar con project ref de Supabase
```

### 4. Desarrollar

```bash
npm run dev
# Auto-detecta puerto disponible (3000-3006)
```

## Tech Stack

```yaml
Runtime: Node.js + TypeScript
Framework: Next.js 16 (App Router)
Database: PostgreSQL/Supabase
Styling: Tailwind CSS 3.4
Components: shadcn/ui
State: Zustand
Validation: Zod
AI Engine: Vercel AI SDK v5 + OpenRouter
Testing: Playwright CLI + MCP
Deploy: Vercel
```

## Arquitectura Feature-First

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rutas auth
│   ├── (main)/              # Rutas principales
│   └── layout.tsx
│
├── features/                 # Organizadas por funcionalidad
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── store/
│
└── shared/                   # Codigo reutilizable
    ├── components/
    ├── hooks/
    ├── lib/
    └── types/
```

## Skills (19 total)

### Para el usuario

| Skill | Que hace |
|-------|----------|
| `/new-app` | Entrevista de negocio → BUSINESS_LOGIC.md |
| `/landing` | Landing page de alta conversion |
| `/add-login` | Auth completo (Email + Google OAuth + profiles + RLS) |
| `/bucle-agentico` | Implementar features complejas por fases |
| `/sprint` | Tareas rapidas sin planificacion |
| `/prp` | Planificar features complejas antes de implementar |
| `/ai [template]` | Agregar IA: chat, RAG, vision, tools |
| `/qa` | QA automatizado con Playwright CLI |
| `/primer` | Inicializar contexto del proyecto |
| `/update-sf` | Actualizar a ultima version |
| `/eject-sf` | Remover SaaS Factory (destructivo) |
| `/skill-creator` | Crear nuevos skills |
| `/reverse-engineer` | Deconstrucción técnica e ingeniería inversa con REA |

### Automaticos (Claude los activa segun la tarea)

backend, frontend, supabase-admin, codebase-analyst, vercel-deployer, documentacion, calidad

## AI Templates

Bloques LEGO para construir features de IA con Vercel AI SDK v5 + OpenRouter:

| Template | Que hace |
|----------|----------|
| setup-base | Configuracion inicial |
| chat | Chat streaming con useChat |
| web-search | Busqueda con :online |
| historial | Persistencia en Supabase |
| vision | Analisis de imagenes |
| tools | Funciones/herramientas |
| rag | pgvector + embeddings |
| single-call | generateText() puntual |
| structured-outputs | generateObject() con Zod |
| generative-ui | LLM decide que componente renderizar |

## Design Systems

5 sistemas visuales listos en `.claude/design-systems/`:

- **Liquid Glass** - iOS-like, transparencias
- **Gradient Mesh** - Degradados fluidos
- **Neumorphism** - Soft UI, sombras suaves
- **Bento Grid** - Grids asimetricos
- **Neobrutalism** - Bold, bordes duros

## Comandos

```bash
npm run dev          # Desarrollo (auto-port 3000-3006)
npm run build        # Build produccion
npm run typecheck    # TypeScript check
npm run lint         # ESLint
```

## Deploy a Producción
 
### Opción A: Vercel (Serverless Recomendado)
 
```bash
npm install -g vercel
vercel
```
 
Variables en Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 
### Opción B: VPS / Computadora Virtual (Docker Standalone)

Para desplegar en cualquier máquina virtual (DigitalOcean, Hetzner, AWS, Coolify):

1. Asegúrate de configurar tu `.env.local` con las variables de producción.
2. Inicia el contenedor con un solo comando:
```bash
docker compose up -d --build
```
3. Verifica la salud del contenedor:
```bash
curl http://localhost:3000/api/health
```

---

**SaaS Factory V5** | Agent-First & Multi-Cloud. Construye una vez, despliega donde quieras.
