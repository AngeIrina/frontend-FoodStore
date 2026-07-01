import type { IUser } from "../types/IUser";

export const saveUser = (user: IUser): void => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const getUser = (): IUser | null => {
  const data = localStorage.getItem("userData");
  if (!data) return null;
  return JSON.parse(data) as IUser;
};

export const removeUser = (): void => {
  localStorage.removeItem("userData");
};
