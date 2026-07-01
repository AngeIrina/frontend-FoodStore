import "../../../styles/login.css";
import { getUsuarios } from "../../../utils/api";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo, ROUTES } from "../../../utils/navigate";

const form = document.getElementById("loginForm") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = (document.getElementById("email") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const usuarios = await getUsuarios();
  const usuario = usuarios.find((u) => u.mail === email && u.password === password);

  if (!usuario) {
    alert("Email o contraseña incorrectos");
    return;
  }

  const { password: _password, ...usuarioSinPassword } = usuario;
  saveUser(usuarioSinPassword);

  if (usuario.rol === "ADMIN") {
    navigateTo(ROUTES.ADMIN);
  } else {
    navigateTo(ROUTES.CLIENT);
  }
});