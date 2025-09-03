// Script de prueba para verificar la conexión a la base de datos
const mysql = require("mysql2");

console.log("🧪 Probando conexión a la base de datos...");

// Conexión a MariaDB (misma configuración que server.js)
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
    console.log("\n🔧 Posibles soluciones:");
    console.log("1. Verifica que MariaDB esté ejecutándose");
    console.log("2. Confirma que la contraseña sea correcta");
    console.log("3. Asegúrate de que la base de datos 'fixedhome' exista");
    return;
  }
  
  console.log("✅ Conectado a MariaDB exitosamente");
  
  // Verificar que la base de datos existe
  db.query("SHOW DATABASES LIKE 'fixedhome'", (err, results) => {
    if (err) {
      console.error("❌ Error al verificar base de datos:", err);
      return;
    }
    
    if (results.length === 0) {
      console.log("❌ La base de datos 'fixedhome' no existe");
      console.log("🔧 Ejecuta el archivo database_setup.sql para crearla");
      return;
    }
    
    console.log("✅ Base de datos 'fixedhome' encontrada");
    
    // Verificar que la tabla profesionales existe
    db.query("SHOW TABLES LIKE 'profesionales'", (err, results) => {
      if (err) {
        console.error("❌ Error al verificar tabla:", err);
        return;
      }
      
      if (results.length === 0) {
        console.log("❌ La tabla 'profesionales' no existe");
        console.log("🔧 Ejecuta el archivo database_setup.sql para crearla");
        return;
      }
      
      console.log("✅ Tabla 'profesionales' encontrada");
      
      // Verificar que hay datos en la tabla
      db.query("SELECT COUNT(*) as total FROM profesionales", (err, results) => {
        if (err) {
          console.error("❌ Error al contar profesionales:", err);
          return;
        }
        
        const total = results[0].total;
        console.log(`✅ La tabla tiene ${total} profesionales registrados`);
        
        if (total === 0) {
          console.log("🔧 Ejecuta el archivo database_setup.sql para insertar datos de ejemplo");
        }
        
        // Mostrar algunos profesionales de ejemplo
        db.query("SELECT * FROM profesionales LIMIT 3", (err, results) => {
          if (err) {
            console.error("❌ Error al obtener profesionales:", err);
            return;
          }
          
          console.log("\n📋 Primeros 3 profesionales:");
          results.forEach((prof, index) => {
            console.log(`${index + 1}. ${prof.nombre} ${prof.apellido} - ${prof.oficio}`);
          });
          
          console.log("\n🎉 ¡Base de datos configurada correctamente!");
          db.end();
        });
      });
    });
  });
});

