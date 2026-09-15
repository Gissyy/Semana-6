const formulario = document.querySelector("#pedido");
const salida = document.querySelector("#resultado");
const mensaje = document.querySelector("#mensaje");
const moneda = n => "S/ " + n.toFixed(2);
formulario.addEventListener("submit", event => {
event.preventDefault();
salida.textContent = "";
mensaje.textContent = "";
const cliente = formulario.elements.cliente.value.trim();
const cantidad = Number(formulario.elements.cantidad.value);
const modalidad = formulario.elements.modalidad.value;
if (!cliente) {
mensaje.textContent = "Escribe un nombre, no solo espacios.";
formulario.elements.cliente.focus();
return;
}
if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100) {
mensaje.textContent = "La cantidad debe ser entera, de 1 a 100.";
return;
}
// Operar en céntimos evita arrastrar decimales monetarios.
const subtotal = cantidad * 850;
const descuento = cantidad >= 15 ? Math.round(subtotal * 0.08) : 0;
const reparto = modalidad === "reparto" ? 400 : 0;
const total = subtotal - descuento + reparto;
salida.textContent = [
"Cliente: " + cliente,
"Paquetes: " + cantidad,
"Subtotal: " + moneda(subtotal / 100),
"Descuento: " + moneda(descuento / 100),
"Reparto: " + moneda(reparto / 100),
"Total: " + moneda(total / 100)
].join("\n");
});
function limpiarSalida() {
salida.textContent = "";
mensaje.textContent = "";
}
formulario.addEventListener("reset", limpiarSalida);
formulario.addEventListener("input", limpiarSalida);