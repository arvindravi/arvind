import React from 'react'
// Use the "light" build of react-syntax-highlighter so we pull in only the
// languages we actually need rather than the full grammar bundle (~500KB
// unminified). Each language is async-imported on demand via dynamic register
// calls below.
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'

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
