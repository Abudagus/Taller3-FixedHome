// Servidor simple para FIXEDHOME
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MariaDB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "35972108",
  database: "fixedhome"
});

// Verificar conexión
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MariaDB:", err);
    console.log("\n🔧 Soluciones:");
    console.log("1. Verifica que MariaDB esté ejecutándose");
    console.log("2. Confirma la contraseña en server-simple.js");
    console.log("3. Ejecuta: npm run test-db");
    return;
  }
  console.log("✅ Conectado a MariaDB");
});

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API de prueba
app.get("/api/test", (req, res) => {
  res.json({ mensaje: "Servidor funcionando 🚀" });
});

// Obtener todos los profesionales
app.get("/profesionales", (req, res) => {
  const sql = "SELECT * FROM profesionales ORDER BY fecha_registro DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener profesionales:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Obtener un profesional por ID
app.get("/profesional/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM profesionales WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener profesional:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Profesional no encontrado" });
    }
    res.json(results[0]);
  });
});

// Obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  const sql = "SELECT * FROM usuarios ORDER BY fecha_registro DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener usuarios:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Login de profesional
app.post("/login/profesional", async (req, res) => {
  console.log("🔐 Login profesional:", req.body);
  
  const { alias, password } = req.body;

  if (!alias || !password) {
    return res.status(400).json({ 
      error: "Alias y contraseña son obligatorios" 
    });
  }

  const sql = "SELECT * FROM profesionales WHERE alias = ?";
  db.query(sql, [alias], async (err, results) => {
    if (err) {
      console.error("❌ Error en login profesional:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Alias o contraseña incorrectos" });
    }

    const profesional = results[0];
    
    // Verificar contraseña (comparación simple)
    if (profesional.password !== password) {
      return res.status(401).json({ error: "Alias o contraseña incorrectos" });
    }

    // Login exitoso
    console.log("✅ Login exitoso profesional:", profesional.alias);
    res.json({
      id: profesional.id,
      nombre: profesional.nombre,
      apellido: profesional.apellido,
      alias: profesional.alias,
      oficio: profesional.oficio,
      mensaje: "Login exitoso"
    });
  });
});

// Login de usuario
app.post("/login/usuario", async (req, res) => {
  console.log("🔐 Login usuario:", req.body);
  
  const { alias, password } = req.body;

  if (!alias || !password) {
    return res.status(400).json({ 
      error: "Alias y contraseña son obligatorios" 
    });
  }

  const sql = "SELECT * FROM usuarios WHERE alias = ?";
  db.query(sql, [alias], async (err, results) => {
    if (err) {
      console.error("❌ Error en login usuario:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Alias o contraseña incorrectos" });
    }

    const usuario = results[0];
    
    // Verificar contraseña (comparación simple)
    if (usuario.password !== password) {
      return res.status(401).json({ error: "Alias o contraseña incorrectos" });
    }

    // Login exitoso
    console.log("✅ Login exitoso usuario:", usuario.alias);
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      alias: usuario.alias,
      ocupacion: usuario.ocupacion,
      mensaje: "Login exitoso"
    });
  });
});

// Registro de profesional
app.post("/registro/profesional", (req, res) => {
  console.log("📝 Registro de profesional:", req.body);
  
  const { nombre, apellido, documento, alias, password, foto, direccion, oficio, telefono } = req.body;

  // Validaciones
  if (!nombre || !apellido || !documento || !alias || !password || !direccion || !oficio || !telefono) {
    return res.status(400).json({ 
      error: "Todos los campos son obligatorios excepto la foto" 
    });
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({ 
      error: "La contraseña debe tener al menos 6 caracteres" 
    });
  }

  // Cambiar 'documento' por 'dni' para que coincida con la tabla
  const query = "INSERT INTO profesionales (nombre, apellido, dni, alias, password, foto, direccion, oficio, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [nombre, apellido, documento, alias, password, foto || "", direccion, oficio, telefono];
  
  console.log("🔍 Ejecutando query:", query);
  console.log("📊 Valores:", values);
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Error en registro:", err);
      
      if (err.code === 'ER_DUP_ENTRY') {
        if (err.message.includes('alias')) {
          return res.status(400).json({ 
            error: "Ya existe un profesional con ese alias" 
          });
        }
        return res.status(400).json({ 
          error: "Ya existe un profesional con ese DNI" 
        });
      }
      
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ 
          error: "Tabla no encontrada. Ejecuta el script SQL para crear la tabla profesionales" 
        });
      }
      
      return res.status(500).json({ 
        error: "Error en el servidor: " + err.message 
      });
    }
    
    console.log("✅ Profesional registrado exitosamente, ID:", result.insertId);
    res.json({ 
      mensaje: "Profesional registrado correctamente ✅",
      id: result.insertId
    });
  });
});

// Registro de usuario
app.post("/registro/usuario", (req, res) => {
  console.log("📝 Registro de usuario:", req.body);
  
  const { nombre, apellido, dni, alias, password, foto, direccion, vivienda, ocupacion } = req.body;

  // Validaciones
  if (!nombre || !apellido || !dni || !alias || !password || !direccion || !vivienda || !ocupacion) {
    return res.status(400).json({ 
      error: "Todos los campos son obligatorios excepto la foto" 
    });
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({ 
      error: "La contraseña debe tener al menos 6 caracteres" 
    });
  }

  const query = "INSERT INTO usuarios (nombre, apellido, dni, alias, password, foto, direccion, vivienda, ocupacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [nombre, apellido, dni, alias, password, foto || "", direccion, vivienda, ocupacion];
  
  console.log("🔍 Ejecutando query:", query);
  console.log("📊 Valores:", values);
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Error en registro usuario:", err);
      
      if (err.code === 'ER_DUP_ENTRY') {
        if (err.message.includes('alias')) {
          return res.status(400).json({ 
            error: "Ya existe un usuario con ese alias" 
          });
        }
        return res.status(400).json({ 
          error: "Ya existe un usuario con ese DNI" 
        });
      }
      
      if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ 
          error: "Tabla no encontrada. Ejecuta el script SQL para crear la tabla usuarios" 
        });
      }
      
      return res.status(500).json({ 
        error: "Error en el servidor: " + err.message 
      });
      }
    
    console.log("✅ Usuario registrado exitosamente, ID:", result.insertId);
    res.json({ 
      mensaje: "Usuario registrado correctamente ✅",
      id: result.insertId
    });
  });
});

// ===== ENDPOINTS PARA PUBLICACIONES =====

// Obtener todas las publicaciones
app.get("/publicaciones", (req, res) => {
  const sql = "SELECT p.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido FROM publicaciones p JOIN usuarios u ON p.usuario_id = u.id ORDER BY p.fecha_publicacion DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener publicaciones:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Obtener publicaciones de un usuario específico
app.get("/publicaciones/usuario/:usuarioId", (req, res) => {
  const { usuarioId } = req.params;
  const sql = "SELECT * FROM publicaciones WHERE usuario_id = ? ORDER BY fecha_publicacion DESC";
  db.query(sql, [usuarioId], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener publicaciones del usuario:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Obtener una publicación específica
app.get("/publicaciones/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT p.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido FROM publicaciones p JOIN usuarios u ON p.usuario_id = u.id WHERE p.id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener publicación:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }
    res.json(results[0]);
  });
});

// Crear nueva publicación
app.post("/publicaciones", (req, res) => {
  console.log("📝 Creando nueva publicación:", req.body);
  
  const { usuario_id, titulo, descripcion, barrio, horarios_disponibles, fotos } = req.body;

  // Validaciones
  if (!usuario_id || !titulo || !descripcion || !barrio) {
    return res.status(400).json({ 
      error: "Los campos usuario_id, titulo, descripcion y barrio son obligatorios" 
    });
  }

  // Validar que el usuario existe
  const checkUserSql = "SELECT id FROM usuarios WHERE id = ?";
  db.query(checkUserSql, [usuario_id], (err, userResults) => {
    if (err) {
      console.error("❌ Error al verificar usuario:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    
    if (userResults.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Crear la publicación
    const insertSql = "INSERT INTO publicaciones (usuario_id, titulo, descripcion, barrio, horarios_disponibles, fotos) VALUES (?, ?, ?, ?, ?, ?)";
    const fotosJson = fotos ? JSON.stringify(fotos) : null;
    const values = [usuario_id, titulo, descripcion, barrio, horarios_disponibles, fotosJson];
    
    console.log("🔍 Ejecutando query:", insertSql);
    console.log("📊 Valores:", values);
    
    db.query(insertSql, values, (err, result) => {
      if (err) {
        console.error("❌ Error al crear publicación:", err);
        
        if (err.code === 'ER_NO_SUCH_TABLE') {
          return res.status(500).json({ 
            error: "Tabla no encontrada. Ejecuta el script SQL para crear la tabla publicaciones" 
          });
        }
        
        return res.status(500).json({ 
          error: "Error en el servidor: " + err.message 
        });
      }
      
      console.log("✅ Publicación creada exitosamente, ID:", result.insertId);
      res.json({ 
        mensaje: "Publicación creada correctamente ✅",
        id: result.insertId
      });
    });
  });
});

// Actualizar publicación
app.put("/publicaciones/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, barrio, horarios_disponibles, fotos, estado } = req.body;
  
  console.log("📝 Actualizando publicación:", id, req.body);
  
  // Validaciones
  if (!titulo || !descripcion || !barrio) {
    return res.status(400).json({ 
      error: "Los campos titulo, descripcion y barrio son obligatorios" 
    });
  }

  const updateSql = "UPDATE publicaciones SET titulo = ?, descripcion = ?, barrio = ?, horarios_disponibles = ?, fotos = ?, estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?";
  const fotosJson = fotos ? JSON.stringify(fotos) : null;
  const values = [titulo, descripcion, barrio, horarios_disponibles, fotosJson, estado || 'activa', id];
  
  db.query(updateSql, values, (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar publicación:", err);
      return res.status(500).json({ error: "Error en el servidor: " + err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }
    
    console.log("✅ Publicación actualizada exitosamente");
    res.json({ mensaje: "Publicación actualizada correctamente ✅" });
  });
});

// Eliminar publicación
app.delete("/publicaciones/:id", (req, res) => {
  const { id } = req.params;
  
  console.log("🗑️ Eliminando publicación:", id);
  
  const deleteSql = "DELETE FROM publicaciones WHERE id = ?";
  
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar publicación:", err);
      return res.status(500).json({ error: "Error en el servidor: " + err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }
    
    console.log("✅ Publicación eliminada exitosamente");
    res.json({ mensaje: "Publicación eliminada correctamente ✅" });
  });
});

// Buscar publicaciones por barrio
app.get("/publicaciones/buscar", (req, res) => {
  const { barrio, estado } = req.query;
  
  let sql = "SELECT p.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido FROM publicaciones p JOIN usuarios u ON p.usuario_id = u.id WHERE 1=1";
  const params = [];
  
  if (barrio) {
    sql += " AND p.barrio = ?";
    params.push(barrio);
  }
  
  if (estado) {
    sql += " AND p.estado = ?";
    params.push(estado);
  }
  
  sql += " ORDER BY p.fecha_publicacion DESC";
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ Error al buscar publicaciones:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// ===== ENDPOINTS PARA MENSAJES =====

// Obtener todos los mensajes
app.get("/mensajes", (req, res) => {
  const sql = `
    SELECT m.*, 
           p.nombre as profesional_nombre, p.apellido as profesional_apellido, p.oficio as profesional_oficio,
           u.nombre as usuario_nombre, u.apellido as usuario_apellido,
           pub.titulo as publicacion_titulo
    FROM mensajes m 
    JOIN profesionales p ON m.profesional_id = p.id 
    JOIN usuarios u ON m.usuario_id = u.id 
    JOIN publicaciones pub ON m.publicacion_id = pub.id 
    ORDER BY m.fecha_envio DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener mensajes:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Obtener mensajes de una publicación específica
app.get("/mensajes/publicacion/:publicacionId", (req, res) => {
  const { publicacionId } = req.params;
  const sql = `
    SELECT m.*, 
           p.nombre as profesional_nombre, p.apellido as profesional_apellido, p.oficio as profesional_oficio,
           p.telefono as profesional_telefono
    FROM mensajes m 
    JOIN profesionales p ON m.profesional_id = p.id 
    WHERE m.publicacion_id = ? 
    ORDER BY m.fecha_envio DESC
  `;
  db.query(sql, [publicacionId], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener mensajes de la publicación:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Obtener mensajes de un usuario específico
app.get("/mensajes/usuario/:usuarioId", (req, res) => {
  const { usuarioId } = req.params;
  const sql = `
    SELECT m.*, 
           p.nombre as profesional_nombre, p.apellido as profesional_apellido, p.oficio as profesional_oficio,
           pub.titulo as publicacion_titulo, pub.barrio as publicacion_barrio
    FROM mensajes m 
    JOIN profesionales p ON m.profesional_id = p.id 
    JOIN publicaciones pub ON m.publicacion_id = pub.id 
    WHERE m.usuario_id = ? 
    ORDER BY m.fecha_envio DESC
  `;
  db.query(sql, [usuarioId], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener mensajes del usuario:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Obtener mensajes de un profesional específico
app.get("/mensajes/profesional/:profesionalId", (req, res) => {
  const { profesionalId } = req.params;
  const sql = `
    SELECT m.*, 
           u.nombre as usuario_nombre, u.apellido as usuario_apellido,
           pub.titulo as publicacion_titulo, pub.barrio as publicacion_barrio
    FROM mensajes m 
    JOIN usuarios u ON m.usuario_id = u.id 
    JOIN publicaciones pub ON m.publicacion_id = pub.id 
    WHERE m.profesional_id = ? 
    ORDER BY m.fecha_envio DESC
  `;
  db.query(sql, [profesionalId], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener mensajes del profesional:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Crear nuevo mensaje
app.post("/mensajes", (req, res) => {
  console.log("📝 Creando nuevo mensaje:", req.body);
  
  const { publicacion_id, profesional_id, usuario_id, mensaje, presupuesto } = req.body;

  // Validaciones
  if (!publicacion_id || !profesional_id || !usuario_id || !mensaje) {
    return res.status(400).json({ 
      error: "Los campos publicacion_id, profesional_id, usuario_id y mensaje son obligatorios" 
    });
  }

  // Validar que la publicación existe
  const checkPublicacionSql = "SELECT id FROM publicaciones WHERE id = ?";
  db.query(checkPublicacionSql, [publicacion_id], (err, pubResults) => {
    if (err) {
      console.error("❌ Error al verificar publicación:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    
    if (pubResults.length === 0) {
      return res.status(400).json({ error: "Publicación no encontrada" });
    }

    // Validar que el profesional existe
    const checkProfesionalSql = "SELECT id FROM profesionales WHERE id = ?";
    db.query(checkProfesionalSql, [profesional_id], (err, profResults) => {
      if (err) {
        console.error("❌ Error al verificar profesional:", err);
        return res.status(500).json({ error: "Error en el servidor" });
      }
      
      if (profResults.length === 0) {
        return res.status(400).json({ error: "Profesional no encontrado" });
      }

      // Validar que el usuario existe
      const checkUsuarioSql = "SELECT id FROM usuarios WHERE id = ?";
      db.query(checkUsuarioSql, [usuario_id], (err, userResults) => {
        if (err) {
          console.error("❌ Error al verificar usuario:", err);
          return res.status(500).json({ error: "Error en el servidor" });
        }
        
        if (userResults.length === 0) {
          return res.status(400).json({ error: "Usuario no encontrado" });
        }

        // Crear el mensaje
        const insertSql = "INSERT INTO mensajes (publicacion_id, profesional_id, usuario_id, mensaje, presupuesto) VALUES (?, ?, ?, ?, ?)";
        const values = [publicacion_id, profesional_id, usuario_id, mensaje, presupuesto || null];
        
        console.log("🔍 Ejecutando query:", insertSql);
        console.log("📊 Valores:", values);
        
        db.query(insertSql, values, (err, result) => {
          if (err) {
            console.error("❌ Error al crear mensaje:", err);
            
            if (err.code === 'ER_NO_SUCH_TABLE') {
              return res.status(500).json({ 
                error: "Tabla no encontrada. Ejecuta el script SQL para crear la tabla mensajes" 
              });
            }
            
            return res.status(500).json({ 
              error: "Error en el servidor: " + err.message 
            });
          }
          
          console.log("✅ Mensaje creado exitosamente, ID:", result.insertId);
          res.json({ 
            mensaje: "Mensaje enviado correctamente ✅",
            id: result.insertId
          });
        });
      });
    });
  });
});

// Marcar mensaje como leído
app.put("/mensajes/:id/leer", (req, res) => {
  const { id } = req.params;
  
  console.log("👁️ Marcando mensaje como leído:", id);
  
  const updateSql = "UPDATE mensajes SET estado = 'leido', fecha_lectura = CURRENT_TIMESTAMP WHERE id = ?";
  
  db.query(updateSql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al marcar mensaje como leído:", err);
      return res.status(500).json({ error: "Error en el servidor: " + err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }
    
    console.log("✅ Mensaje marcado como leído exitosamente");
    res.json({ mensaje: "Mensaje marcado como leído ✅" });
  });
});

// Actualizar estado del mensaje (aceptar/rechazar presupuesto)
app.put("/mensajes/:id/estado", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  
  console.log("📝 Actualizando estado del mensaje:", id, estado);
  
  // Validar estado
  if (!['aceptado', 'rechazado'].includes(estado)) {
    return res.status(400).json({ error: "Estado debe ser 'aceptado' o 'rechazado'" });
  }
  
  const updateSql = "UPDATE mensajes SET estado = ? WHERE id = ?";
  
  db.query(updateSql, [estado, id], (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar estado del mensaje:", err);
      return res.status(500).json({ error: "Error en el servidor: " + err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }
    
    console.log("✅ Estado del mensaje actualizado exitosamente");
    res.json({ mensaje: `Mensaje ${estado} correctamente ✅` });
  });
});

// Eliminar mensaje
app.delete("/mensajes/:id", (req, res) => {
  const { id } = req.params;
  
  console.log("🗑️ Eliminando mensaje:", id);
  
  const deleteSql = "DELETE FROM mensajes WHERE id = ?";
  
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar mensaje:", err);
      return res.status(500).json({ error: "Error en el servidor: " + err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }
    
    console.log("✅ Mensaje eliminado exitosamente");
    res.json({ mensaje: "Mensaje eliminado correctamente ✅" });
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos servidos desde: ${path.join(__dirname, 'public')}`);
  console.log(`🔐 Endpoints de login disponibles:`);
  console.log(`   POST /login/profesional`);
  console.log(`   POST /login/usuario`);
  console.log(`📝 Endpoints de publicaciones disponibles:`);
  console.log(`   GET /publicaciones`);
  console.log(`   GET /publicaciones/usuario/:id`);
  console.log(`   GET /publicaciones/:id`);
  console.log(`   POST /publicaciones`);
  console.log(`   PUT /publicaciones/:id`);
  console.log(`   DELETE /publicaciones/:id`);
  console.log(`   GET /publicaciones/buscar?barrio=X&estado=Y`);
  console.log(`💬 Endpoints de mensajes disponibles:`);
  console.log(`   GET /mensajes`);
  console.log(`   GET /mensajes/publicacion/:id`);
  console.log(`   GET /mensajes/usuario/:id`);
  console.log(`   GET /mensajes/profesional/:id`);
  console.log(`   POST /mensajes`);
  console.log(`   PUT /mensajes/:id/leer`);
  console.log(`   PUT /mensajes/:id/estado`);
  console.log(`   DELETE /mensajes/:id`);
});
