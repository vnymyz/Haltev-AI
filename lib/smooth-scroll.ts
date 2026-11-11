import type Lenis from "lenis";

// The Lenis instance (landing page only), so other components can scroll through it.
let instance: Lenis | null = null;
export const getLenis = () => instance;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
