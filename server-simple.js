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

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos servidos desde: ${path.join(__dirname, 'public')}`);
  console.log(`🔐 Endpoints de login disponibles:`);
  console.log(`   POST /login/profesional`);
  console.log(`   POST /login/usuario`);
});
