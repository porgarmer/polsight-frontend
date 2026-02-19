'use client'

import Markdown from 'react-markdown'

export default function HomePage() {
  const markdownText = `
  # React Markdown Example

  Some text
  - Some other text
  ## Subtitle
  This has **bold** and *italic*.`;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900">Insight (placeholder)</h3>
      
      <div className="prose prose-gray max-w-none">
        <Markdown>{markdownText}</Markdown>
      </div>
    </div>
  )
}