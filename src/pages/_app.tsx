import '../styles/custom-styles.css'
import '../styles/prose-styles.css'
import '../styles/dracula.css'

import * as React from 'react'

import { SiteLayout } from '~/components/Layouts'
import { Providers } from '~/components/Providers'
import { TopProgressBar } from '~/components/TopProgressBar'

export default function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <Providers pageProps={pageProps}>
        <SiteLayout>{page}</SiteLayout>
      </Providers>
    ))

  return (
    <>
      <TopProgressBar />
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}
