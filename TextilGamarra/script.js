const CLAVE = "textil_s4";
const pagina = document.body.dataset.pagina;
let datos = null;

try {
  datos = JSON.parse(sessionStorage.getItem(CLAVE));
} catch {
  sessionStorage.removeItem(CLAVE);
}

const form = document.querySelector("#feria");

if (form) {
  if (datos) {
    for (const campo of ["nombre", "correo", "color", "s", "m", "l", "observaciones"]) {
      form.elements[campo].value = datos[campo] || "";
    }

    form.elements.estampado.checked = datos.estampado;
  }

  form.addEventListener("input", event => {
    const s = Number(form.elements.s.value);
    const m = Number(form.elements.m.value);
    const l = Number(form.elements.l.value);

    const cantidades = [s, m, l];
    let totalPolos = 0;

    for (const cantidad of cantidades) {
      totalPolos = totalPolos + cantidad;
    }

    const subtotal = totalPolos * 18;
    const descuento = totalPolos >= 24 ? Number((subtotal * 0.07).toFixed(2)) : 0;
    const costoEstampado = form.elements.estampado.checked ? totalPolos * 4 : 0;
    const total = subtotal - descuento + costoEstampado;

    document.querySelector("#cotizacion").textContent =
      "Total de polos: " + totalPolos + "\n" +
      "Subtotal prendas: S/ " + subtotal.toFixed(2) + "\n" +
      "Descuento: S/ " + descuento.toFixed(2) + "\n" +
      "Estampado: S/ " + costoEstampado.toFixed(2) + "\n" +
      "Total: S/ " + total.toFixed(2);
  });

  form.dispatchEvent(new Event("input"));

  form.addEventListener("submit", event => {
    event.preventDefault();

    const mensaje = document.querySelector("#mensaje");
    const nombre = form.elements.nombre.value.trim();
    const correo = form.elements.correo.value.trim();
    const color = form.elements.color.value;

    const s = Number(form.elements.s.value);
    const m = Number(form.elements.m.value);
    const l = Number(form.elements.l.value);

    const cantidades = [s, m, l];
    let totalPolos = 0;
    let cantidadesValidas = true;

    for (const cantidad of cantidades) {
      if (!Number.isInteger(cantidad) || cantidad < 0 || cantidad > 200) {
        cantidadesValidas = false;
      }

      totalPolos = totalPolos + cantidad;
    }

    if (!nombre || !correo || !color) {
      mensaje.textContent = "Completa nombre, correo y color.";
      return;
    }

    if (!cantidadesValidas) {
      mensaje.textContent = "Las cantidades deben ser enteras de 0 a 200.";
      return;
    }

    if (totalPolos === 0) {
      mensaje.textContent = "Bloqueo: el total no puede ser cero.";
      return;
    }

    if (totalPolos > 200) {
      mensaje.textContent = "Bloqueo: el total no puede superar 200 polos.";
      return;
    }

    const subtotal = totalPolos * 18;
    const descuento = totalPolos >= 24 ? Number((subtotal * 0.07).toFixed(2)) : 0;
    const costoEstampado = form.elements.estampado.checked ? totalPolos * 4 : 0;
    const total = subtotal - descuento + costoEstampado;

    datos = {
      nombre,
      correo,
      color,
      s,
      m,
      l,
      totalPolos,
      estampado: form.elements.estampado.checked,
      observaciones: form.elements.observaciones.value.trim(),
      subtotal,
      descuento,
      costoEstampado,
      total,
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
      "Correo: " + datos.correo,
      "Color: " + datos.color,
      "Talla S: " + datos.s,
      "Talla M: " + datos.m,
      "Talla L: " + datos.l,
      "Total de unidades: " + datos.totalPolos,
      "Subtotal prendas: S/ " + datos.subtotal.toFixed(2),
      "Descuento: S/ " + datos.descuento.toFixed(2),
      "Estampado: " + (datos.estampado ? "Si" : "No"),
      "Costo estampado: S/ " + datos.costoEstampado.toFixed(2),
      "Total: S/ " + datos.total.toFixed(2),
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