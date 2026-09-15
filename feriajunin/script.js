const CLAVE = "feria_s4";
const pagina = document.body.dataset.pagina;
let datos = null;

try {
  datos = JSON.parse(sessionStorage.getItem(CLAVE));
} catch {
  sessionStorage.removeItem(CLAVE);
}

const form = document.querySelector("#feria");

if (form) {
  // Restaurar los campos al regresar a editar.
  if (datos) {
    for (const campo of ["nombre", "dni", "correo", "distrito",
      "observaciones"]) {
      form.elements[campo].value = datos[campo] || "";
    }

    form.querySelectorAll('[name="productos"]').forEach(c => {
      c.checked = (datos.productos || []).includes(c.value);
    });
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const mensaje = document.querySelector("#mensaje");
    const nombre = form.elements.nombre.value.trim();

    const productos = Array.from(
      form.querySelectorAll('[name="productos"]:checked'),
      c => c.value
    );

    if (!nombre || productos.length === 0) {
      mensaje.textContent = "Escribe tu nombre y elige un producto.";
      return;
    }

    datos = {
      nombre,
      dni: form.elements.dni.value,
      correo: form.elements.correo.value.trim(),
      distrito: form.elements.distrito.value,
      productos,
      observaciones: form.elements.observaciones.value.trim(),
      estado: "borrador"
    };

    sessionStorage.setItem(CLAVE, JSON.stringify(datos));
    location.href = "confirmar.html";
  });

} else if (pagina === "confirmar" || pagina === "resumen") {
  if (!datos) {
    location.replace("index.html");
  } else if (pagina === "resumen" && datos.estado !== "confirmado") {
    location.replace("confirmar.html");
  } else {
    document.querySelector("#detalle").textContent = [
      "Nombre: " + datos.nombre,
      "DNI de prueba: " + datos.dni,
      "Correo: " + datos.correo,
      "Distrito: " + datos.distrito,
      "Productos: " + datos.productos.join(", "),
      "Observaciones: " + (datos.observaciones || "Sin observaciones"),
      "Estado: " + datos.estado
    ].join("\n");

    if (pagina === "confirmar") {
      document.querySelector("#confirmar").addEventListener("click", () => {
        datos.estado = "confirmado";
        sessionStorage.setItem(CLAVE, JSON.stringify(datos));
        location.href = "resumen.html";
      });
    } else {
      document.querySelector("#nuevo").addEventListener("click", () => {
        sessionStorage.removeItem(CLAVE);
        location.href = "index.html";
      });
    }
  }
}