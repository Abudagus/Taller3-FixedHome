-- =====================================================
-- SCRIPT PARA CREAR LA BASE DE DATOS FIXEDHOME DESDE CERO
-- =====================================================

-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS fixedhome;
USE fixedhome;

-- 2. Crear tabla de profesionales
CREATE TABLE IF NOT EXISTS profesionales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    foto TEXT,
    direccion TEXT NOT NULL,
    oficio VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    foto TEXT,
    direccion TEXT NOT NULL,
    vivienda VARCHAR(100) NOT NULL,
    ocupacion VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Insertar profesionales de ejemplo
INSERT INTO profesionales (nombre, apellido, dni, direccion, oficio, telefono) VALUES
('Juan', 'Pérez', '12345678', 'Calle Principal 123, Ciudad', 'Plomero', '3001234567'),
('María', 'García', '87654321', 'Avenida Central 456, Ciudad', 'Electricista', '3007654321'),
('Carlos', 'López', '11223344', 'Carrera 7 #15-30, Ciudad', 'Carpintero', '3001122334'),
('Ana', 'Martínez', '55667788', 'Calle 45 #12-34, Ciudad', 'Pintora', '3005566778'),
('Roberto', 'Hernández', '99887766', 'Avenida 68 #45-67, Ciudad', 'Albañil', '3009988776');

-- 5. Verificar que todo se creó correctamente
SHOW TABLES;
DESCRIBE profesionales;
DESCRIBE usuarios;

-- 6. Mostrar los profesionales insertados
SELECT * FROM profesionales;

-- 7. Contar cuántos profesionales hay
SELECT COUNT(*) as total_profesionales FROM profesionales;



