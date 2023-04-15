/** @type {import('next').NextConfig} */
const nextConfig = {  
  reactStrictMode: true,
  i18n: {
    // locales supported by the site
    locales: ["fi", "en"],
    // default locale used when non-locale paths are used
    defaultLocale: "fi",
    // disable automatic locale detection
    localeDetection: false,
  },
  async rewrites() { // 
    return [
      {
        source: '/hommatori_favicon.ico',
        destination: '/hommatori_favicon.ico'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/ad/hommatori_favicon.ico', // if header param is missing from ad/adid/header, it somehow tries to direct here..
        destination: '/hommatori_favicon.ico', // however we want a redirect to where the favicon icon actually is
        permanent: true
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**raw.githubusercontent.com**',
      },
    ],
  }
}

module.exports = nextConfig
