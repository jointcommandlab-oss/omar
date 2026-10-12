/** Feature flags. Flip to true only once real subscription checks exist. */
export const IS_SUBSCRIBER = false;

/** True only under `vite dev`. Typed locally because the project has no vite/client types. */
export const IS_DEV = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
