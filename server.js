// Importar dependencias
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// Inicializar Express
const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MariaDB
const db = mysql.createConnection({
  host: "localhost",       // servidor de base de datos
  user: "root",            // tu usuario
  password: "35972108",    // tu contraseña
  database: "fixedhome"    // nombre de tu base de datos
});

// Verificar conexión
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MariaDB:", err);
    return;
  }
  console.log("✅ Conectado a MariaDB");
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Registro de usuario
app.post("/registro/usuario", (req, res) => {
  const { nombre, apellido, documento, foto, direccion, vivienda, ocupacion } = req.body;

  const query = "INSERT INTO usuarios (nombre, apellido, documento, foto, direccion, vivienda, ocupacion) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [nombre, apellido, documento, foto, direccion, vivienda, ocupacion], (err, result) => {
    if (err) {
      console.error("Error en registro usuario:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json({ mensaje: "Usuario registrado correctamente ✅" });
  });
});

// Registro de profesional
app.post("/registro/profesional", (req, res) => {
  const { nombre, apellido, documento, foto, direccion, oficio, telefono, barrios_trabajo } = req.body;

  // Convertir array de barrios a JSON
  const barriosJSON = JSON.stringify(barrios_trabajo || []);

  const query = "INSERT INTO profesionales (nombre, apellido, documento, foto, direccion, oficio, telefono, barrios_trabajo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [nombre, apellido, documento, foto, direccion, oficio, telefono, barriosJSON], (err, result) => {
    if (err) {
      console.error("Error en registro profesional:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json({ mensaje: "Profesional registrado correctamente ✅" });
  });
});

// Obtener todos los profesionales
app.get("/profesionales", (req, res) => {
  const sql = "SELECT * FROM profesionales";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener profesionales:", err);
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
      console.error("Error al obtener profesional:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Profesional no encontrado" });
    }
    res.json(results[0]);
  });
});

// Buscar profesionales por oficio y barrio
app.get("/profesionales/buscar", (req, res) => {
  const { oficio, barrio } = req.query;
  
  let sql = "SELECT * FROM profesionales WHERE 1=1";
  const params = [];
  
  if (oficio) {
    sql += " AND oficio LIKE ?";
    params.push(`%${oficio}%`);
  }
  
  if (barrio) {
    sql += " AND JSON_CONTAINS(barrios_trabajo, ?)";
    params.push(`"${barrio}"`);
  }
  
  sql += " ORDER BY nombre ASC";
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error al buscar profesionales:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
});

// Obtener lista de oficios únicos
app.get("/profesionales/oficios", (req, res) => {
  const sql = "SELECT DISTINCT oficio FROM profesionales ORDER BY oficio ASC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener oficios:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    const oficios = results.map(row => row.oficio);
    res.json(oficios);
  });
});

// Obtener lista de barrios únicos donde trabajan los profesionales
app.get("/profesionales/barrios", (req, res) => {
  const sql = `
    SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(barrios_trabajo, CONCAT('$[', numbers.n, ']'))) as barrio
    FROM profesionales
    CROSS JOIN (
      SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
      UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
      UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14
      UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
    ) numbers
    WHERE JSON_EXTRACT(barrios_trabajo, CONCAT('$[', numbers.n, ']')) IS NOT NULL
    AND JSON_UNQUOTE(JSON_EXTRACT(barrios_trabajo, CONCAT('$[', numbers.n, ']'))) != 'null'
    ORDER BY barrio ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener barrios:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    const barrios = results.map(row => row.barrio).filter(barrio => barrio);
    res.json(barrios);
  });
});

// Login de usuario
app.post("/login/usuario", (req, res) => {
  const { alias, password } = req.body;
  
  if (!alias || !password) {
    return res.status(400).json({ error: "Alias y contraseña son requeridos" });
  }
  
  const sql = "SELECT * FROM usuarios WHERE documento = ? AND nombre = ?";
  // Nota: En un sistema real, deberías usar hash de contraseñas
  // Por simplicidad, usamos el nombre como "contraseña"
  db.query(sql, [alias, password], (err, results) => {
    if (err) {
      console.error("Error en login usuario:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    
    const usuario = results[0];
    res.json({
      id: usuario.id,
      alias: usuario.documento,
      nombre: usuario.nombre,
      tipo: "usuario"
    });
  });
});

// Login de profesional
app.post("/login/profesional", (req, res) => {
  const { alias, password } = req.body;
  
  if (!alias || !password) {
    return res.status(400).json({ error: "Alias y contraseña son requeridos" });
  }
  
  const sql = "SELECT * FROM profesionales WHERE documento = ? AND nombre = ?";
  // Nota: En un sistema real, deberías usar hash de contraseñas
  // Por simplicidad, usamos el nombre como "contraseña"
  db.query(sql, [alias, password], (err, results) => {
    if (err) {
      console.error("Error en login profesional:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    
    const profesional = results[0];
    res.json({
      id: profesional.id,
      alias: profesional.documento,
      nombre: profesional.nombre,
      tipo: "profesional"
    });
  });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
