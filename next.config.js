const { withPlausibleProxy } = require('next-plausible')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const path = require('path')

module.exports = withBundleAnalyzer(withPlausibleProxy()({
  eslint: {
    dirs: ['src'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'abs.twimg.com' },
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
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
}))
