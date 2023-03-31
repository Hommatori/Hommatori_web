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
  }
}

module.exports = nextConfig
