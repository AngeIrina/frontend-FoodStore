export const ROUTES = {
  LOGIN: "/src/pages/auth/login/login.html",
  REGISTER: "/src/pages/auth/register/register.html",
  CLIENT: "/src/pages/client/client.html",
  ADMIN: "/src/pages/admin/home/home.html",
} as const;

export const navigateTo = (url: string): void => {
  window.location.href = url;
};
