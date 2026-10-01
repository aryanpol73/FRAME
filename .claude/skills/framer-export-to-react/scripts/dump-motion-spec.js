// Temporary helper for Route B. Paste the body of recordMotion() at the top of
// adaptElement(type, props) -- the hook every element of a Framer-runtime page
// passes through -- then load each page, scroll it end to end, and run
//   copy(JSON.stringify(window.__motionSpec, null, 1))
// in the console. Remove it before shipping.
export function recordMotion(type, props) {
  if (!props || typeof window === "undefined") return;
  const keys = Object.keys(props).filter(
    (k) => k.startsWith("__framer__") || ["initial", "animate", "exit", "transition", "variants", "whileHover", "whileTap", "whileInView", "layout", "layoutId"].includes(k),
  );
  if (!keys.length) return;
  const id = props.id || (typeof props.className === "string" ? props.className.split(/\s+/).find((c) => c.startsWith("framer-")) : null) || String(type);
  const spec = (window.__motionSpec ||= {});
  const entry = (spec[id] ||= {});
  for (const k of keys) {
    try { entry[k] = JSON.parse(JSON.stringify(props[k])); } catch { entry[k] = String(props[k]); }
  }
}
