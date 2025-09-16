# INSTRUCCIONES PARA ARREGLAR LAS PUBLICACIONES

## Problemas identificados y soluciones:

### 1. **Base de datos no actualizada**
- **Problema**: La tabla `mensajes` no existe
- **Solución**: Ejecutar el script completo de base de datos

### 2. **Servidor necesita reinicio**
- **Problema**: Los cambios en el código no se reflejan
- **Solución**: Reiniciar el servidor

## Pasos para arreglar todo:

### Paso 1: Actualizar la base de datos
```bash
mysql -u root -p < database_setup.sql
```

### Paso 2: Insertar datos de prueba
```bash
mysql -u root -p < insert-test-data.sql
```

### Paso 3: Reiniciar el servidor
```bash
# Detener el servidor actual (Ctrl+C)
npm run start-simple
```

### Paso 4: Probar la funcionalidad

#### Como Usuario:
1. Ve a `http://localhost:3000/login.html`
2. Inicia sesión con: alias `juanp`, password `123456`
3. Haz clic en "Mis Publicaciones" en el sidebar
4. Deberías ver las publicaciones con fotos

#### Como Profesional:
1. Ve a `http://localhost:3000/login.html`
2. Inicia sesión con: alias `mariag`, password `123456`
3. Haz clic en "Ver Publicaciones" en el sidebar
4. Deberías ver las publicaciones con fotos

## Cambios implementados:

### ✅ **Fotos en publicaciones del usuario**
- Las fotos ahora se muestran como miniaturas de 100x100px
- Son clickeables para ampliarlas

### ✅ **Publicaciones más centrales**
- La sección "Mis Publicaciones" se movió arriba en la página
- Ya no aparece al final

### ✅ **Fotos en publicaciones del profesional**
- Se muestran hasta 3 fotos como miniaturas de 80x80px
- Si hay más de 3, muestra "+X más"

### ✅ **Fotos en modal de detalles**
- Todas las fotos se muestran en el modal de detalles
- Son clickeables para ver en tamaño completo

### ✅ **Modal para ampliar imágenes**
- Modal dedicado para ver fotos en tamaño completo
- Disponible en ambos perfiles

## Archivos modificados:
- `perfil-usuario.html` - Agregadas fotos y mejorada navegación
- `perfil-profesional.html` - Agregadas fotos en lista y modal
- `database_setup.sql` - Agregada tabla mensajes
- `server-simple.js` - Agregados endpoints para mensajes

## Si sigue sin funcionar:
1. Verifica que el servidor esté corriendo en puerto 3000
2. Verifica que la base de datos tenga las tablas correctas
3. Abre las herramientas de desarrollador (F12) y revisa la consola
4. Verifica que no haya errores de JavaScript

