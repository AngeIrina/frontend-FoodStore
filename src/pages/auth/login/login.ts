import "../../../styles/login.css";
import type { IUser } from "../../../types/IUser";
import { saveUser } from "../../../utils/localStorage";
import { navigateTo, ROUTES } from "../../../utils/navigate";
import { seedAdmin } from "../../../utils/seedAdmin";

seedAdmin();

const form = document.getElementById("loginForm") as HTMLFormElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const rolSeleccionado = (document.getElementById("rol") as HTMLSelectElement).value;

  const users: IUser[] = JSON.parse(localStorage.getItem("users") || "[]");

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Usuario o contraseña incorrectos");
    return;
  }

  if (user.rol !== rolSeleccionado) {
    alert("Rol incorrecto para este usuario");
    return;
  }

  saveUser(user);

  if (user.rol === "admin") {
    navigateTo(ROUTES.ADMIN);
  } else {
    navigateTo(ROUTES.CLIENT);
  }
});