import Router from 'next/router'
import * as React from 'react'

/*
Thin top progress bar for navigation feedback. Most public routes are now
prefetched static HTML and feel instant, but the auth-only routes
(/settings, /writing/new, /writing/[slug]/edit) and feed routes still go
through the server. This gives every click an immediate visual ack.

Hand-rolled rather than pulling in nprogress — no extra dep, exactly the
look we want, and we can keep it ~50 lines.

UX shape: bar grows quickly to 30%, then crawls toward 80% (approximating
the slow tail of a real load), then snaps to 100% on routeChangeComplete
and fades out.
*/

export function TopProgressBar() {
  const [progress, setProgress] = React.useState(0)
  const [visible, setVisible] = React.useState(false)
  const crawlRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const hideRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    function start() {
      if (hideRef.current) {
        clearTimeout(hideRef.current)
        hideRef.current = null
      }
      setVisible(true)
      setProgress(30)
      if (crawlRef.current) clearInterval(crawlRef.current)
      crawlRef.current = setInterval(() => {
        setProgress((p) => (p < 80 ? p + (80 - p) * 0.08 : p))
      }, 200)
    }

    function done() {
      if (crawlRef.current) {
        clearInterval(crawlRef.current)
        crawlRef.current = null
      }
      setProgress(100)
      hideRef.current = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 250)
    }

    Router.events.on('routeChangeStart', start)
    Router.events.on('routeChangeComplete', done)
    Router.events.on('routeChangeError', done)

    return () => {
      Router.events.off('routeChangeStart', start)
      Router.events.off('routeChangeComplete', done)
      Router.events.off('routeChangeError', done)
      if (crawlRef.current) clearInterval(crawlRef.current)
      if (hideRef.current) clearTimeout(hideRef.current)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]"
      style={{
        opacity: visible ? 1 : 0,
        transition: visible ? 'opacity 150ms ease' : 'opacity 200ms ease 150ms',
      }}
    >
      <div
        className="h-full bg-design-details"
        style={{
          width: `${progress}%`,
          transition:
            progress === 100
              ? 'width 200ms ease-out'
              : 'width 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  )
}
