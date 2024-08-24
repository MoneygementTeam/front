export const setSession = (session) => {
  localStorage.setItem("session", JSON.stringify(session));
};

export const getSession = () => {
  return localStorage.getItem("session");
};
