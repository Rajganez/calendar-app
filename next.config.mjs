/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React Strict Mode for better debugging and catching potential issues
    reactStrictMode: true,
  
    // Disable page caching for development to ensure fresh updates are always loaded
    onDemandEntries: {
      // Set to a high value for dev, so it clears old entries sooner
      maxInactiveAge: 25 * 1000, // 25 seconds
      pagesBufferLength: 2, // Keeps a small number of pages in buffer
    },
  
    // Custom webpack configuration (optional)
    webpack: (config, { isServer }) => {
      // Customizations to the webpack config if needed
      if (!isServer) {
        // Clear cache for the client-side build
        config.cache = false;
      }
      return config;
    },
  
    // Control how much console output you see while building
    devIndicators: {
      autoPrerender: false,
    },
  
    // Caching headers configuration (adjust if needed for production)
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, must-revalidate', // Ensure no cache in dev mode
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  