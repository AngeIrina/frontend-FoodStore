import type { UsuarioSesion } from "../types/IUser";

export const saveUser = (user: UsuarioSesion): void => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const getUser = (): UsuarioSesion | null => {
  const data = localStorage.getItem("userData");
  if (!data) return null;
  return JSON.parse(data) as UsuarioSesion;
};

export const removeUser = (): void => {
  localStorage.removeItem("userData");
};