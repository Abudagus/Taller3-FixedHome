// Función para cargar profesionales desde la base de datos
async function cargarProfesionales() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const container = document.getElementById('profesionales-container');

  try {
    // Mostrar loading
    loading.style.display = 'block';
    error.style.display = 'none';
    container.innerHTML = '';

    // Hacer petición a la API
    const response = await fetch('http://localhost:3000/profesionales');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const profesionales = await response.json();
    
    // Ocultar loading
    loading.style.display = 'none';
    
    if (profesionales.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <div class="alert alert-info">
            <i class="bi bi-info-circle-fill"></i>
            No hay profesionales registrados aún.
          </div>
        </div>
      `;
      return;
    }

    // Mostrar profesionales
    mostrarProfesionales(profesionales);

  } catch (err) {
    console.error('Error al cargar profesionales:', err);
    loading.style.display = 'none';
    error.style.display = 'block';
  }
}

// Función para mostrar los profesionales en tarjetas
function mostrarProfesionales(profesionales) {
  const container = document.getElementById('profesionales-container');
  
  const html = profesionales.map(profesional => `
    <div class="col-12 col-md-6 col-lg-4 mb-4">
      <div class="card card-profile h-100">
        <div class="card-body text-center">
          <div class="mb-3">
            <img src="${profesional.foto || 'https://via.placeholder.com/100x100/666/fff?text=Sin+Foto'}" 
                 alt="Foto de ${profesional.nombre}" 
                 class="profesional-img mb-3">
          </div>
          <h5 class="card-title">${profesional.nombre} ${profesional.apellido}</h5>
          <p class="card-text">
            <strong>Oficio:</strong> ${profesional.oficio}<br>
            <strong>Dirección:</strong> ${profesional.direccion}<br>
            <strong>Teléfono:</strong> ${profesional.telefono || 'No disponible'}
          </p>
          <button class="btn btn-outline-primary btn-sm" onclick="contactarProfesional(${profesional.id})">
            <i class="bi bi-telephone-fill"></i> Contactar
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

// Función para contactar a un profesional
function contactarProfesional(id) {
  alert(`Función de contacto para el profesional ID: ${id}\nEsta funcionalidad se puede implementar más adelante.`);
}

// Función para abrir modal (mantenida por compatibilidad)
function abrirModal() {
  document.getElementById("modal").style.display = "block";
}

// Función para cerrar modal (mantenida por compatibilidad)
function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

// Cerrar el modal al hacer clic afuera
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Cargar profesionales cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
  cargarProfesionales();
  
  // Recargar profesionales cada 30 segundos (opcional)
  setInterval(cargarProfesionales, 30000);
});
  