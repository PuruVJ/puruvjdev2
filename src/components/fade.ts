import { sineIn } from "svelte/easing";

let duration = 150;
let delay = duration;

let delayZero = 0;

export const fadeIn = (_) => ({
  duration,
  delay,
  easing: sineIn,
  css: (t) => `opacity: ${t}`,
});
export const fadeOut = (_) => ({
  duration,
  delayZero,
  easing: sineIn,
  css: (t) => `opacity: ${t}`,
});
