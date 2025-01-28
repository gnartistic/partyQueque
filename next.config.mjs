// next.config.js

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  transpilePackages: ["geist"],
  trailingSlash: false,
  output: "standalone",

      async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/[...nextauth]",
      },
    ];
  },

};

export default config;
