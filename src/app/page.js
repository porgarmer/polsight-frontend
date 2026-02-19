import Markdown from 'react-markdown';
import dedent from 'dedent';

export default function HomePage() {
  const markdownText = `
    # Title
    
    - Item 1
    - Item 2
    
    **bold works**`; // removes leading whitespace from each line

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900">Insight (placeholder)</h3>
      <Markdown>{markdownText}</Markdown>
    </div>
  )
}
