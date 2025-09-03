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
  const { nombre, apellido, documento, foto, direccion, oficio, telefono } = req.body;

  const query = "INSERT INTO profesionales (nombre, apellido, documento, foto, direccion, oficio, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [nombre, apellido, documento, foto, direccion, oficio, telefono], (err, result) => {
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

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
