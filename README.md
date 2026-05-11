# DnD Character Workshop

## Descripción

DnD Character Workshop es una aplicación web completa para crear, gestionar y personalizar personajes de Dungeons & Dragons (D&D). Esta herramienta permite a los jugadores y Dungeon Masters (DMs) construir personajes detallados, gestionar campañas, crear contenido homebrew y mantener notas organizadas. La aplicación integra datos oficiales de D&D 5e a través de APIs externas y ofrece una experiencia intuitiva con soporte para múltiples idiomas.

## Características Principales

- **Creación de Personajes**: Asistente paso a paso para crear personajes de D&D con todas las reglas oficiales (ediciones 2014 y 2024).
- **Gestión de Campañas**: Organiza personajes por campañas y sesiones.
- **Contenido Homebrew**: Crea y gestiona elementos personalizados como razas, clases, objetos y hechizos.
- **Sistema de Notas**: Mantén notas organizadas para personajes, campañas y sesiones.
- **Autenticación de Usuarios**: Sistema seguro de registro e inicio de sesión.
- **Internacionalización**: Soporte para inglés y español.
- **Integración con API de D&D**: Acceso a datos oficiales de D&D 5e.
- **Interfaz Responsiva**: Diseño moderno con Tailwind CSS.

## Tecnologías Utilizadas

### Frontend

- **React 18** con TypeScript
- **Vite** para el bundling y desarrollo
- **Tailwind CSS** para el styling
- **React Router** para la navegación
- **Zustand** para el estado global
- **React i18next** para internacionalización
- **Axios** para llamadas a la API

### Backend

- **Node.js** con Express.js
- **SQLite** para la base de datos (con migraciones y seeds)
- **JWT** para autenticación
- **bcrypt** para hashing de contraseñas
- **CORS** para manejo de cross-origin requests

### Herramientas de Desarrollo

- **ESLint** para linting
- **PostCSS** para procesamiento de CSS
- **TypeScript** para tipado estático

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación del Frontend

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/dnd-character-workshop.git
   cd dnd-character-workshop
   ```

2. Instala las dependencias del frontend:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Instalación del Backend

1. Navega al directorio del backend:

   ```bash
   cd backend
   ```

2. Instala las dependencias del backend:

   ```bash
   npm install
   ```

3. Configura la base de datos:

   ```bash
   npm run migrate
   npm run seed
   ```

4. Inicia el servidor del backend:
   ```bash
   npm start
   ```

### Configuración de Variables de Entorno

Crea un archivo `.env` en el directorio del backend con las siguientes variables:

```
PORT=3001
JWT_SECRET=tu_secreto_jwt
DATABASE_URL=./db/database.sqlite
```

## Uso

1. Abre tu navegador y ve a `http://localhost:5173` (frontend).
2. Regístrate o inicia sesión.
3. Usa el asistente de creación de personajes para construir tu personaje.
4. Explora las secciones de homebrew, notas y gestión de campañas.

## Estructura del Proyecto

```
dnd-character-workshop/
├── backend/                 # Servidor backend
│   ├── src/
│   │   ├── controllers/     # Controladores de la API
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Definición de rutas
│   │   ├── services/        # Servicios de negocio
│   │   ├── middleware/      # Middleware personalizado
│   │   └── utils/           # Utilidades
│   └── db/                  # Base de datos y migraciones
├── src/                     # Código fuente del frontend
│   ├── app/                 # Componentes principales
│   ├── features/            # Funcionalidades por dominio
│   ├── lib/                 # Librerías y hooks
│   ├── pages/               # Páginas de la aplicación
│   ├── rules/               # Reglas de D&D
│   └── ui/                  # Componentes de UI reutilizables
├── i18n/                    # Archivos de internacionalización
├── public/                  # Archivos estáticos
└── docs/                    # Documentación adicional
```

## Scripts Disponibles

### Frontend

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta ESLint

### Backend

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run migrate` - Ejecuta migraciones de base de datos
- `npm run seed` - Ejecuta seeds de base de datos

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Documentación Adicional

- [Especificación de la API](backend/API_SPECIFICATION.md)
- [Memoria del Proyecto](MEMORIA_PROYECTO_TFG.md)
- [Plan de Empresa](PLAN_DE_EMPRESA_DND.md)
- [Informe de Auditoría de Seguridad](SECURITY_AUDIT_REPORT.md)
