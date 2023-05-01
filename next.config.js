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
  async redirects() {
    return [
      {
        source: '/ad/:path*/hommatori_favicon.ico',
        destination: '/hommatori_favicon.ico',
        permanent: true,
      },
      {
        source: '/account/:path*/hommatori_favicon.ico',
        destination: '/hommatori_favicon.ico',
        permanent: true,
      }      
    ]
  },
  images: {
    domains: [
      'raw.githubusercontent.com',
      'hommatorisuomi.blob.core.windows.net',
      'images.blob.core.windows.net'
    ],
  },
  output:"standalone",
}

module.exports = nextConfig
