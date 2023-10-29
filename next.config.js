/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    const TerserPlugin = require('terser-webpack-plugin');
    return {
      ...config,
      optimization: {
        ...config.optimization,
        // Using TerserPlugin created by Next.js breaks the editor, so we create a custom one.
        // About the error: https://github.com/TypeCellOS/BlockNote/issues/292
        // TerserPlugin Option reference: https://github.com/vercel/next.js/blob/5f9d2c55ca3ca3bd6a01cf60ced69d3dd2c64bf4/packages/next/src/build/webpack-config.ts#L1151
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
              },
              output: {
                ecma: 5,
                safari10: true,
                comments: false,
                ascii_only: true,
              },
              mangle: {
                safari10: true,
              },
            },
          }),
          config.optimization.minimizer[1],
        ],
      },
    };
  },
};

module.exports = nextConfig;


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "dlwocks31-personal",
    project: "emobridge",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
