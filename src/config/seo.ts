export const baseUrl =
  process.env.NODE_ENV === 'production' ? 'https://arvindravi.com' : ''
export const baseEmail = 'arvind.ravi@icloud.com'

export const defaultSEO = {
  title: 'Arvind Ravi',
  description:
    'Software Engineer, writer, amateur photographer, living in London.',
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
