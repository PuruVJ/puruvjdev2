export const BUILD = {
  // @ts-ignore
  isBrowser: process.browser,
  isDev: process.env.NODE_ENV === "development",
};

export const API_BASE = "/api";

export const API = {
  getEmos: `${API_BASE}/get-emos`,
  setEmos: `${API_BASE}/set-emos`,
};
