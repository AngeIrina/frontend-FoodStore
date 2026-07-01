import { navigateTo, ROUTES } from "./utils/navigate";
import { getUser } from "./utils/localStorage";
import { seedAdmin } from "./utils/seedAdmin";

// Crear admin por defecto si no existe
seedAdmin();

const user = getUser();

if (!user) {
  navigateTo(ROUTES.LOGIN);
} else if (user.rol === "admin") {
  navigateTo(ROUTES.ADMIN);
} else {
  navigateTo(ROUTES.CLIENT);
}

