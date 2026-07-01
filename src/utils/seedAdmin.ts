import type { IUser } from "../types/IUser";

/**
 * Crea el usuario admin por defecto si no existe.
 * Credenciales: admin@foodstore.com / admin123
 */
export const seedAdmin = (): void => {
  const users: IUser[] = JSON.parse(localStorage.getItem("users") || "[]");
  const existe = users.find((u) => u.email === "admin@foodstore.com");
  if (!existe) {
    users.push({ email: "admin@foodstore.com", password: "admin123", rol: "admin" });
    localStorage.setItem("users", JSON.stringify(users));
  }
};
