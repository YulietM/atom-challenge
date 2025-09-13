# Task Manager Frontend - Angular

Aplicación frontend para gestión de tareas desarrollada con Angular 17.3.6 y Angular Material. Implementa un sistema completo de autenticación y CRUD de tareas con diseño moderno y responsive.

## 🚀 Características Principales

- **Autenticación simplificada**: Login solo con email, auto-creación de usuarios
- **Gestión de tareas**: Crear, editar, eliminar y marcar como completadas
- **Diseño moderno**: Angular Material con tema personalizado naranja/azul
- **Responsive**: Optimizado para dispositivos móviles y desktop
- **Arquitectura limpia**: Servicios, guards, interceptors y manejo de estados
- **TypeScript**: Tipado estricto para mayor robustez

## 🎨 Tema Visual

- **Primario**: Naranja (#ff6600) 
- **Acento**: Azul (#448aff)
- **Diseño**: Material Design con elementos glassmorphism
- **Tipografía**: Inter font family

## 🏗️ Arquitectura

```
src/app/
├── core/                 # Servicios centrales
│   ├── guards/          # Guards de autenticación
│   ├── interceptors/    # Interceptors HTTP
│   └── services/        # AuthService, TaskService
├── features/            # Componentes de funcionalidades
│   ├── auth/           # Login component
│   └── tasks/          # Task management
├── shared/             # Modelos y utilidades compartidas
│   └── models/         # Interfaces TypeScript
└── assets/            # Recursos estáticos
```

## 📋 Funcionalidades

### Autenticación
- Login con solo email
- Auto-creación de usuarios nuevos
- Persistencia de sesión en localStorage
- Guards para rutas protegidas

### Gestión de Tareas
- Lista de tareas con estado (completadas/pendientes)
- Crear nuevas tareas con título y descripción
- Editar tareas existentes
- Eliminar tareas
- Marcar/desmarcar como completada
- Ordenamiento automático (pendientes primero)

## 🛠️ Tecnologías

- **Angular 17.3.6**: Framework principal
- **Angular Material**: UI Components
- **RxJS**: Programación reactiva
- **TypeScript**: Tipado estático
- **SCSS**: Estilos avanzados

## 📦 Dependencias Principales

- `@angular/material`: UI components
- `@angular/cdk`: Component Dev Kit
- `rxjs`: Reactive Extensions
- `typescript`: Lenguaje de desarrollo

## 🔗 Integración Backend

Se conecta al backend Firebase Functions mediante:
- **API Base**: `http://localhost:3000/api`
- **Endpoints**:
  - `POST /users/login-or-create`: Autenticación
  - `GET /tasks?userId=:id`: Obtener tareas
  - `POST /tasks`: Crear tarea
  - `PUT /tasks/:id`: Actualizar tarea
  - `DELETE /tasks/:id`: Eliminar tarea

## 🎯 Decisiones de Diseño

1. **Autenticación simplificada**: Solo email para UX más fluida
2. **Estado reactivo**: BehaviorSubject para sincronización automática
3. **Componentes standalone**: Mejor tree-shaking y modularidad
4. **Guards funcionales**: Protección de rutas moderna
5. **Interceptors globales**: Manejo centralizado de errores
6. **Tipado estricto**: Interfaces para todos los modelos de datos

## 🚦 Estados de la Aplicación

- **No autenticado**: Muestra pantalla de login
- **Autenticado**: Acceso a gestión de tareas
- **Loading**: Spinners durante operaciones async
- **Error**: Mensajes informativos para el usuario

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
