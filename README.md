# Todo App - Express.js & MongoDB

Este proyecto es una aplicación de tareas desarrollada utilizando **Express.js** como framework backend y **MongoDB** como base de datos. Además, el frontend está integrado directamente como vistas en el directorio `views`, utilizando EJS como motor de plantillas.

## **Características**
- CRUD completo para gestionar tareas.
- Gestión de usuarios con inicio de sesión y registro.
- Autenticación mediante tokens (JWT).
- Integración de vistas frontend utilizando **EJS**.
- Método de agregación de MongoDB para análisis de datos.
- Implementación de filtros dinámicos para tareas.
- Uso de HTMX para interacciones dinámicas en el frontend.

---

## **Estructura del Proyecto**
```plaintext
.
├── assets/                # Archivos estáticos (CSS, JS, imágenes)
├── config/                # Configuraciones de base de datos y servidor
│   ├── config.js
│   ├── mongoConnection.js
├── controllers/           # Controladores para manejar lógica de negocio
│   ├── TasksController.js
│   └── UserController.js
├── models/                # Modelos de MongoDB
│   ├── Task.js
│   └── User.js
├── routes/                # Rutas de la API
│   ├── TasksRouter.js
│   └── UserRouter.js
├── views/                 # Vistas frontend (EJS)
│   ├── index.ejs
│   ├── partials/
│   │   ├── login.ejs
│   │   ├── register.ejs
├── .env                   # Variables de entorno
├── app.js                 # Archivo principal de la aplicación
└── package.json           # Dependencias y scripts del proyecto
