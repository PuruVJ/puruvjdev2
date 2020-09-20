import { writable } from "svelte/store";

const theme = writable<"light" | "midday" | "dark">("light");

export { theme };

let initVal = "";
theme.subscribe((val) => {
  // @ts-ignore
  if (!process.browser) return;

  // Don't do anything if its first value
  if (!initVal) {
    initVal = val;
    return;
  }

  const body = document.body;

  // Remove any and all classes
  body.classList.remove("light");
  body.classList.remove("dark");
  body.classList.remove("midday");

  body.classList.add(val);

  localStorage.setItem("theme", val);

  initVal = val;
});
