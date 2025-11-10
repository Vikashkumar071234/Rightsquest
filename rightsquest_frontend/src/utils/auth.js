export const getAccessToken = () => localStorage.getItem("access");
export const isLoggedIn = () => Boolean(getAccessToken());

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
