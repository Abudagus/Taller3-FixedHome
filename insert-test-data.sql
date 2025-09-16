-- Script para insertar datos de prueba
USE fixedhome;

-- Insertar datos de prueba en publicaciones
INSERT IGNORE INTO publicaciones (usuario_id, titulo, descripcion, barrio, horarios_disponibles, fotos, estado) VALUES
(1, 'Problema con la instalación eléctrica', 'Necesito un electricista para revisar la instalación de mi casa. Hay problemas con los interruptores y algunas luces no funcionan correctamente.', 'Almagro', 'Lunes a Viernes de 9:00 a 18:00', '["https://via.placeholder.com/300x200/ff6b6b/fff?text=Foto+1", "https://via.placeholder.com/300x200/4ecdc4/fff?text=Foto+2"]', 'activa'),
(1, 'Fuga de agua en el baño', 'Hay una fuga de agua en el baño principal que está causando humedad en la pared.', 'Palermo', 'Fines de semana', '["https://via.placeholder.com/300x200/45b7d1/fff?text=Foto+Fuga"]', 'activa'),
(1, 'Pintura de habitación', 'Necesito pintar una habitación de 3x4 metros. Ya tengo la pintura, solo necesito el servicio.', 'Belgrano', 'Sábados de 9:00 a 17:00', '["https://via.placeholder.com/300x200/96ceb4/fff?text=Habitacion"]', 'activa');

-- Insertar mensajes de prueba
INSERT IGNORE INTO mensajes (publicacion_id, profesional_id, usuario_id, mensaje, presupuesto, estado) VALUES
(1, 1, 1, 'Hola! He revisado tu problema y puedo ayudarte. Mi presupuesto para la revisión y reparación de la instalación eléctrica es el siguiente:', 15000.00, 'enviado'),
(2, 1, 1, 'Buenos días! Puedo solucionar la fuga de agua. Mi presupuesto incluye materiales y mano de obra:', 8000.00, 'enviado');

-- Verificar datos
SELECT 'Publicaciones:' as tipo, COUNT(*) as cantidad FROM publicaciones
UNION ALL
SELECT 'Mensajes:' as tipo, COUNT(*) as cantidad FROM mensajes
UNION ALL
SELECT 'Usuarios:' as tipo, COUNT(*) as cantidad FROM usuarios
UNION ALL
SELECT 'Profesionales:' as tipo, COUNT(*) as cantidad FROM profesionales;

