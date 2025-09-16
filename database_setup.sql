-- FIXEDHOME - Esquema base para MariaDB (idempotente)
-- Crea la base de datos, tablas y datos mínimos de ejemplo
-- Compatible con el backend en `server.js` y `server-simple.js`

-- 1) Crear BD si no existe
CREATE DATABASE IF NOT EXISTS fixedhome
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fixedhome;

-- 2) Tablas
-- Nota: Se incluyen ambas columnas `dni` y `documento` para compatibilidad
--       con ambos servidores (uno usa `dni` y el otro `documento`).

-- 2.1) Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(20) NULL,
  documento VARCHAR(20) NULL,
  alias VARCHAR(50) NULL,
  password VARCHAR(255) NULL,
  foto TEXT NULL,
  direccion VARCHAR(255) NOT NULL,
  vivienda VARCHAR(100) NOT NULL,
  ocupacion VARCHAR(100) NOT NULL,
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_dni (dni),
  UNIQUE KEY uq_usuarios_documento (documento),
  UNIQUE KEY uq_usuarios_alias (alias)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.2) Tabla profesionales
CREATE TABLE IF NOT EXISTS profesionales (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(20) NULL,
  documento VARCHAR(20) NULL,
  alias VARCHAR(50) NULL,
  password VARCHAR(255) NULL,
  foto TEXT NULL,
  direccion VARCHAR(255) NOT NULL,
  oficio VARCHAR(100) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  barrios_trabajo JSON NULL,
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_profesionales_dni (dni),
  UNIQUE KEY uq_profesionales_documento (documento),
  UNIQUE KEY uq_profesionales_alias (alias),
  KEY idx_profesionales_oficio (oficio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.3) Tabla publicaciones (problemas publicados por usuarios)
CREATE TABLE IF NOT EXISTS publicaciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  barrio VARCHAR(100) NOT NULL,
  horarios_disponibles TEXT NULL,
  fotos JSON NULL,
  estado ENUM('activa', 'en_proceso', 'resuelta', 'cancelada') DEFAULT 'activa',
  fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_publicaciones_usuario (usuario_id),
  KEY idx_publicaciones_barrio (barrio),
  KEY idx_publicaciones_estado (estado),
  KEY idx_publicaciones_fecha (fecha_publicacion),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2.4) Tabla mensajes (comunicación entre profesionales y usuarios)
CREATE TABLE IF NOT EXISTS mensajes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  publicacion_id INT UNSIGNED NOT NULL,
  profesional_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NOT NULL,
  mensaje TEXT NOT NULL,
  presupuesto DECIMAL(10,2) NULL,
  estado ENUM('enviado', 'leido', 'aceptado', 'rechazado') DEFAULT 'enviado',
  fecha_envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_lectura DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_mensajes_publicacion (publicacion_id),
  KEY idx_mensajes_profesional (profesional_id),
  KEY idx_mensajes_usuario (usuario_id),
  KEY idx_mensajes_fecha (fecha_envio),
  FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (profesional_id) REFERENCES profesionales(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Datos mínimos (seed)
-- Solo insertar si las tablas están vacías
INSERT INTO usuarios (nombre, apellido, dni, alias, password, foto, direccion, vivienda, ocupacion)
SELECT 'Juan', 'Pérez', '12345678', 'juanp', '123456', '', 'Calle Falsa 123', 'Casa', 'Empleado'
WHERE NOT EXISTS (SELECT 1 FROM usuarios LIMIT 1);

INSERT INTO profesionales (nombre, apellido, dni, alias, password, foto, direccion, oficio, telefono, barrios_trabajo)
SELECT 'María', 'García', '87654321', 'mariag', '123456', '', 'Av. Siempre Viva 742', 'Electricista', '11-5555-5555', JSON_ARRAY('Almagro','Caballito')
WHERE NOT EXISTS (SELECT 1 FROM profesionales LIMIT 1);

-- Datos de ejemplo para publicaciones
INSERT INTO publicaciones (usuario_id, titulo, descripcion, barrio, horarios_disponibles, fotos, estado)
SELECT 1, 'Problema con la instalación eléctrica', 'Necesito un electricista para revisar la instalación de mi casa. Hay problemas con los interruptores y algunas luces no funcionan correctamente.', 'Almagro', 'Lunes a Viernes de 9:00 a 18:00', JSON_ARRAY('foto1.jpg', 'foto2.jpg'), 'activa'
WHERE NOT EXISTS (SELECT 1 FROM publicaciones LIMIT 1);

-- Datos de ejemplo para mensajes
INSERT INTO mensajes (publicacion_id, profesional_id, usuario_id, mensaje, presupuesto, estado)
SELECT 1, 1, 1, 'Hola! He revisado tu problema y puedo ayudarte. Mi presupuesto para la revisión y reparación de la instalación eléctrica es el siguiente:', 15000.00, 'enviado'
WHERE NOT EXISTS (SELECT 1 FROM mensajes LIMIT 1);

-- 4) Vistas de apoyo (opcional)
-- Exponen un valor de "documento_preferido" usando `dni` si existe, caso contrario `documento`.
CREATE OR REPLACE VIEW v_usuarios AS
SELECT 
  id, nombre, apellido,
  COALESCE(dni, documento) AS documento_preferido,
  alias, password, foto, direccion, vivienda, ocupacion, fecha_registro
FROM usuarios;

CREATE OR REPLACE VIEW v_profesionales AS
SELECT 
  id, nombre, apellido,
  COALESCE(dni, documento) AS documento_preferido,
  alias, password, foto, direccion, oficio, telefono, barrios_trabajo, fecha_registro
FROM profesionales;

-- 5) Comprobaciones rápidas
-- SHOW TABLES;
-- DESCRIBE usuarios;
-- DESCRIBE profesionales;
-- SELECT * FROM usuarios LIMIT 5;
-- SELECT * FROM profesionales LIMIT 5;

-- 6) Notas
-- - `server.js` usa columnas `documento` y `barrios_trabajo (JSON)` y no usa `alias/password` en registro.
-- - `server-simple.js` usa `dni`, `alias` y `password`. Por eso se incluyen todas para compatibilidad.
-- - `barrios_trabajo` es JSON para poder usar JSON_CONTAINS/JSON_EXTRACT en MariaDB.
