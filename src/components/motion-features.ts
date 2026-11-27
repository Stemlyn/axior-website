// framer-motion's animation features, split out so they load after the page has painted.
// Imported lazily by <LazyMotion> in Providers.tsx; components render with the lightweight `m`.
import { domMax } from "framer-motion";

export default domMax;
