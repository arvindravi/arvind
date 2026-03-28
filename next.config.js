const { withPlausibleProxy } = require('next-plausible')
const path = require('path')

module.exports = withPlausibleProxy()({
  eslint: {
    // Prettier formatting issues are pre-existing across many files.
    // Type-checking still runs separately via tsc.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['pbs.twimg.com', 'abs.twimg.com', 'imagedelivery.net'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.join(__dirname, 'src'),
    }
    return config
  },
  async redirects() {
    return [
      {
        source: '/uses',
        destination: '/stack',
        permanent: true,
      },
      {
        source: '/design-details',
        destination: '/app-dissection',
        permanent: true,
      },
      {
        source: '/design-details/:slug',
        destination: '/app-dissection/:slug',
        permanent: true,
      },
      {
        source: '/journal',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/overthought',
        destination: '/writing',
        permanent: true,
      },
      {
        source: '/overthought/:slug',
        destination: '/writing/:slug',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/',
        permanent: true,
      },
      {
        source: '/youtube',
        destination: 'https://www.youtube.com/channel/UC-esBYEUGQ6iK1wmw76f5MA',
        permanent: true,
        basePath: false,
      },
      {
        source: '/twitter',
        destination: 'https://twitter.com/arvindravi_',
        permanent: true,
        basePath: false,
      },
      {
        source: '/github',
        destination: 'https://github.com/arvindravi',
        permanent: true,
        basePath: false,
      },
      {
        source: '/figma',
        destination: 'https://figma.com/@arvindravi',
        permanent: true,
        basePath: false,
      },
    ]
  },
})
