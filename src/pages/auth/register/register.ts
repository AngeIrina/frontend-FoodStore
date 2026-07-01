import "../../../styles/register.css";
import { getUsuarios } from "../../../utils/api";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo, ROUTES } from "../../../utils/navigate";

const form = document.querySelector("#registerForm") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = (document.getElementById("nombre") as HTMLInputElement).value.trim();
  const email = (document.getElementById("email") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value;

  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  const usuarios = await getUsuarios();
  const existe = usuarios.some((u) => u.mail === email);

  if (existe) {
    alert("Ya existe un usuario registrado con ese mail");
    return;
  }

  const nuevoId = Math.max(0, ...usuarios.map((u) => u.id)) + 1;
  const nuevoUsuario = {
    id: nuevoId,
    nombre,
    apellido: "",
    mail: email,
    celular: "",
    rol: "USUARIO" as const,
  };

  saveUser(nuevoUsuario);
  alert("Usuario registrado correctamente");
  navigateTo(ROUTES.CLIENT);
});