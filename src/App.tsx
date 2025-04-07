import React, { useState } from 'react'
import RichTextEditor from './components/RichTextEditor'

function App() {
  const [content, setContent] = useState<string>('')

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    console.log('Текущее содержимое:', newContent)
  }

  return (
    <div className="h-screen">
      <RichTextEditor 
        onChange={handleContentChange}
        initialContent="<h1>Привет, мир!</h1><p>Это блокнот-редактор.</p>"
      />
    </div>
  )
}

export default App
