import { getUser, removeUser } from "./localStorage";
import { navigateTo, ROUTES } from "./navigate";

export const requireClient = (): void => {
  const user = getUser();
  if (!user) {
    navigateTo(ROUTES.LOGIN);
  } else if (user.rol !== "USUARIO") {
    navigateTo(ROUTES.ADMIN);
  }
};

export const requireAdmin = (): void => {
  const user = getUser();
  if (!user) {
    navigateTo(ROUTES.LOGIN);
  } else if (user.rol !== "ADMIN") {
    navigateTo(ROUTES.CLIENT);
  }
};

export const logout = (): void => {
  removeUser();
  navigateTo(ROUTES.LOGIN);
};