---
name: add-login
description: "Inyectar sistema de autenticacion completo con Supabase: login, signup, password reset, perfiles en BD y proteccion de rutas con middleware. Activar cuando el usuario pida agregar login, registro, autenticacion o proteger paginas."
---

# Skill: Autenticacion Completa con Supabase

> Inyecta el sistema de autenticacion production-ready siguiendo la arquitectura Feature-First.

---

## Componentes del Sistema

1. **Rutas en App Router:**
   - `src/app/(auth)/login/page.tsx`: Pantalla de inicio de sesion.
   - `src/app/(auth)/register/page.tsx`: Pantalla de registro de nuevos usuarios.
   - `src/app/auth/callback/route.ts`: Manejador de intercambio de codigo de verificacion / OAuth.

2. **Feature Auth (`src/features/auth/`):**
   - `components/`: Formularios de Login, Register y Reset Password.
   - `services/auth-service.ts`: Metodos `signIn()`, `signUp()`, `signOut()`, `resetPassword()`.
   - `types/auth.types.ts`: Esquemas de validacion con Zod para credenciales.

3. **Proteccion de Sesion:**
   - Controlado automaticamente por `src/middleware.ts` y `src/lib/supabase/middleware.ts`.
   - Rutas publicas: `/`, `/login`, `/register`.
   - Rutas protegidas: `/dashboard/*`.
