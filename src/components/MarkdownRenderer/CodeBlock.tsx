import React from 'react'
// Use the "light" build of react-syntax-highlighter so we pull in only the
// languages we actually need rather than the full grammar bundle (~500KB
// unminified). Each language is async-imported on demand via dynamic register
// calls below.
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
// Import the CJS builds, not the ESM ones. Next.js externalizes these deep
// imports into the server (SSR) bundle, so they get `require()`d at request
// time. The `dist/esm/**` files use `import`, which throws
// "Cannot use import statement outside a module" on the production (Vercel)
// Node runtime and 500s every code-containing detail route. The `dist/cjs/**`
// builds are `require()`-clean and register the identical Prism grammars.
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css'
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import markup from 'react-syntax-highlighter/dist/cjs/languages/prism/markup'
import swift from 'react-syntax-highlighter/dist/cjs/languages/prism/swift'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml'

// Register only the languages we actually use across the site. Unknown
// languages fall through to plain text — the highlighter logs a warning but
// doesn't crash.
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('html', markup)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('markup', markup)
SyntaxHighlighter.registerLanguage('swift', swift)
SyntaxHighlighter.registerLanguage('ts', typescript)
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('yml', yaml)

export function CodeBlock({
  text,
  language,
  ...rest
}: {
  text: string
  language: string
  [key: string]: any
}) {
  return (
    <SyntaxHighlighter
      showLineNumbers={false}
      useInlineStyles={false}
      language={language}
      children={text}
      style={{}}
      wrapLongLines
      {...rest}
    />
  )
}
