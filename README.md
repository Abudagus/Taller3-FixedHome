# FIXEDHOME - Plataforma de Profesionales

## Descripción
Plataforma web para conectar usuarios con profesionales de diferentes oficios.

## Requisitos Previos
- Node.js (versión 14 o superior)
- MariaDB o MySQL
- Navegador web moderno

## Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar la base de datos
1. Abre tu cliente de MariaDB/MySQL
2. Ejecuta el archivo `database_setup.sql` para crear las tablas y datos de ejemplo
3. Verifica que la base de datos `fixedhome` se haya creado correctamente

### 3. Configurar credenciales de base de datos
Edita el archivo `server.js` y actualiza las credenciales de conexión:
```javascript
const db = mysql.createConnection({
  host: "localhost",       // tu servidor de base de datos
  user: "root",            // tu usuario de MariaDB
  password: "tu_password", // tu contraseña de MariaDB
  database: "fixedhome"    // nombre de tu base de datos
});
```

### 4. Ejecutar el servidor
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## Estructura del Proyecto
```
MI WEB/
├── public/                 # Archivos del frontend
│   ├── index.html         # Página principal
│   ├── main.js            # JavaScript principal
│   ├── styles.css         # Estilos CSS
│   └── ...                # Otros archivos HTML
├── server.js              # Servidor backend
├── database_setup.sql     # Script de configuración de BD
└── package.json           # Dependencias del proyecto
```

## Funcionalidades

### Frontend
- ✅ Página principal con sidebar
- ✅ Visualización de profesionales en tarjetas
- ✅ Modales de login para usuarios y profesionales
- ✅ Enlaces a páginas de registro
- ✅ Diseño responsive con Bootstrap

### Backend
- ✅ API REST para profesionales
- ✅ Conexión a MariaDB
- ✅ Endpoints para registro de usuarios y profesionales
- ✅ Servidor de archivos estáticos

## API Endpoints

### GET /profesionales
Obtiene todos los profesionales registrados

### POST /registro/profesional
Registra un nuevo profesional

### POST /registro/usuario
Registra un nuevo usuario

## Solución de Problemas

### Error de conexión a la base de datos
1. Verifica que MariaDB esté ejecutándose
2. Confirma las credenciales en `server.js`
3. Asegúrate de que la base de datos `fixedhome` exista

### No se muestran los profesionales
1. Verifica que el servidor esté ejecutándose en el puerto 3000
2. Abre la consola del navegador para ver errores
3. Confirma que la tabla `profesionales` tenga datos

### Error CORS
El servidor ya tiene configurado CORS para permitir peticiones desde el frontend.

## Próximos Pasos
- [ ] Implementar autenticación de usuarios
- [ ] Agregar sistema de calificaciones
- [ ] Implementar chat entre usuarios y profesionales
- [ ] Agregar filtros de búsqueda por oficio
- [ ] Sistema de pagos

## Soporte
Si tienes problemas, verifica:
1. La consola del navegador para errores JavaScript
2. Los logs del servidor para errores del backend
3. La conexión a la base de datos

