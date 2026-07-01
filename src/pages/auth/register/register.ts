import "../../../styles/register.css";
import type { IUser } from "../../../types/IUser";

const form = document.querySelector("#registerForm") as HTMLFormElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const users: IUser[] = JSON.parse(localStorage.getItem("users") || "[]");

  const existe = users.find(u => u.email === email);

  if (existe) {
    alert("El usuario ya existe");
    return;
  }

  // crear usuario (siempre client)
  const newUser: IUser = {
    email,
    password,
    rol: "client"
  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  alert("Usuario registrado correctamente");

  form.reset();
});