# Atom Back Challenge - Task Management API

API RESTful desarrollada con Express.js, TypeScript y Firebase para gestión de tareas y usuarios, implementando arquitectura limpia y principios SOLID.

## 🚀 Características

- **Framework**: Express.js + TypeScript
- **Base de datos**: Firebase Firestore
- **Hosting**: Firebase Cloud Functions
- **Arquitectura**: Clean Architecture (Hexagonal)
- **Patrones**: Repository, Dependency Injection, Error Handling
- **Seguridad**: CORS, Helmet, Validaciones
- **Testing**: Jest con cobertura completa

## 📋 Endpoints

### Tasks
- `GET /api/tasks` - Obtener todas las tareas
- `GET /api/tasks/:id` - Obtener tarea por ID
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Users
- `GET /api/users/email/:email` - Buscar usuario por email
- `POST /api/users` - Crear nuevo usuario

### Health Check
- `GET /health` - Estado de la API

## 🏗️ Arquitectura

```
src/
├── domain/                     # Entidades y contratos
│   ├── Task.ts
│   ├── User.ts
│   └── repositories/
├── application/                # Casos de uso y servicios
│   ├── services/
│   └── errors/
└── infrastructure/            # Implementaciones y frameworks
    ├── repositories/
    ├── routes/
    └── middlewares/
```

## 🛠️ Desarrollo

### Prerrequisitos
- Node.js 22+
- Firebase CLI
- npm

### Instalación
```bash
cd functions
npm install
```

### Scripts Disponibles
```bash
npm run build          # Compilar TypeScript
npm run build:watch    # Compilar en modo watch
npm run lint           # Ejecutar ESLint
npm run serve          # Servidor local con emuladores
npm run test           # Ejecutar pruebas
npm run test:watch     # Pruebas en modo watch
npm run test:coverage  # Cobertura de pruebas
npm run deploy         # Desplegar a Firebase
```

### Desarrollo Local
```bash
npm run serve
# La API estará disponible en: http://localhost:5001/atom-back-challenge/us-central1/api
```

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm run test

# Pruebas con cobertura
npm run test:coverage

# Pruebas en modo watch
npm run test:watch
```

## 📁 Estructura del Proyecto

- **Domain Layer**: Entidades de negocio y interfaces de repositorios
- **Application Layer**: Servicios con lógica de negocio y validaciones
- **Infrastructure Layer**: Implementaciones de repositorios, rutas y middlewares

## 🔒 Seguridad

- CORS configurado por entorno
- Helmet para headers de seguridad
- Validación de entrada de datos
- Manejo seguro de errores
- Límites de tamaño de payload

## 🚀 Despliegue

```bash
npm run deploy
```

La API se desplegará en Firebase Cloud Functions.

## 📝 Ejemplos de Uso

### Crear una tarea
```bash
curl -X POST https://your-firebase-project.cloudfunctions.net/api/api/tasks \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Nueva tarea",
    "description": "Descripción de la tarea"
  }'
```

### Crear un usuario
```bash
curl -X POST https://your-firebase-project.cloudfunctions.net/api/api/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo"
  }'
```