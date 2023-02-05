import React, { useEffect, useRef } from 'react'
import hljs from 'highlight.js'
import {marked} from 'marked';

const RichText = ({ content }) => {
  const codeRef = useRef(null)
  marked.setOptions({
    highlight: (code, language) => {
      const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
      return hljs.highlight(validLanguage, code).value;
    }
  });

  useEffect(() => {
    const codeTags = codeRef.current.getElementsByTagName('code')
    Array.from(codeTags).forEach((tag) => hljs.highlightBlock(tag))
  }, [])

  return (
    <div
      ref={codeRef}
      dangerouslySetInnerHTML={{ __html: marked(content) }}
    />
  )
}

export default RichText
