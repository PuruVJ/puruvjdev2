export const BUILD = {
  // @ts-ignore
  isBrowser: process.browser,
  isDev: process.env.NODE_ENV === "development",
};

export const API_BASE = "";

export const API = {
  getEmos: `${API_BASE}`,
  setEmos: `${API_BASE}`,
};
