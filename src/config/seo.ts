export const baseUrl =
  process.env.NODE_ENV === 'production' ? 'https://brianlovin.com' : ''
export const baseEmail = 'hi@brianlovin.com'

export const defaultSEO = {
  title: 'Arvind Ravi',
  description:
    'Product designer, podcaster, and writer, living in San Francisco.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    site_name: 'Arvind Ravi',
    images: [
      {
        url: `${baseUrl}/static/og/default.png`,
        alt: 'Arvind Ravi',
      },
    ],
  },
  twitter: {
    handle: '@arvindravi_',
    site: '@arvindravi_',
    cardType: 'summary_large_image',
  },
}

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function extendSEO(options: SEOProps) {
  const images = options.image
    ? [{ url: `${baseUrl}/static/${options.image}` }]
    : defaultSEO.openGraph.images

  return {
    ...defaultSEO,
    ...options,
    url: `${baseUrl}/${options.url}`,
    openGraph: {
      ...defaultSEO.openGraph,
      images,
      url: `${baseUrl}/${options.url}`,
    },
  }
}
