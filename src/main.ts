import { navigateTo, ROUTES } from "./utils/navigate";
import { getUser } from "./utils/localStorage";

const user = getUser();

if (!user) {
  navigateTo(ROUTES.LOGIN);
} else if (user.rol === "ADMIN") {
  navigateTo(ROUTES.ADMIN);
} else {
  navigateTo(ROUTES.CLIENT);
}