-- =====================================================
-- SCRIPT PARA REPARAR PROBLEMAS EN LA BASE DE DATOS
-- =====================================================
--
-- 📋 DESCRIPCIÓN:
-- Este archivo está diseñado para REPARAR problemas específicos en una base de datos
-- que ya existe. NO crea la base de datos desde cero.
--
-- 🎯 CUÁNDO USARLO:
-- - Cuando tienes errores en la estructura de las tablas
-- - Problemas con AUTO_INCREMENT en la columna 'id'
-- - Cuando las tablas existen pero no funcionan correctamente
-- - Para diagnosticar problemas en la base de datos existente
--
-- ⚠️  IMPORTANTE:
-- - Solo ejecuta este script si ya tienes la base de datos 'fixedhome'
-- - NO lo uses para la primera configuración
-- - Es un script de MANTENIMIENTO, no de configuración inicial
--
-- 🔧 PROBLEMAS QUE REPARA:
-- - Columna 'id' sin AUTO_INCREMENT
-- - Estructura de tablas corrupta
-- - Falta de datos de ejemplo
--
-- 🚀 CÓMO EJECUTARLO EN HEIDIS:
-- 1. Asegúrate de que la base de datos 'fixedhome' ya existe
-- 2. Conéctate a tu servidor MySQL/MariaDB
-- 3. Abre este archivo en HeidiSQL
-- 4. Ejecuta todo el script (F9)
--
-- =====================================================

-- Script para reparar la tabla profesionales
USE fixedhome;

-- Verificar si la tabla existe
SHOW TABLES LIKE 'profesionales';

-- Reparar la columna id para que sea AUTO_INCREMENT
ALTER TABLE profesionales MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY;

-- Verificar la estructura corregida
DESCRIBE profesionales;

-- Insertar datos de ejemplo si la tabla está vacía
INSERT INTO profesionales (nombre, apellido, dni, direccion, oficio, telefono) VALUES
('Juan', 'Pérez', '12345678', 'Calle Principal 123, Ciudad', 'Plomero', '3001234567'),
('María', 'García', '87654321', 'Avenida Central 456, Ciudad', 'Electricista', '3007654321'),
('Carlos', 'López', '11223344', 'Carrera 7 #15-30, Ciudad', 'Carpintero', '3001122334')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Verificar que se insertaron los datos
SELECT * FROM profesionales;
