import { useState } from 'react'
import Editor from './components/Editor'
import { content } from './config/content'

function App() {
  const [currentContent, setCurrentContent] = useState<HTMLDivElement>()

  const handleContentChange = (event: React.FormEvent<HTMLDivElement>) => {
    const newContent = event.currentTarget;
    setCurrentContent(newContent);
    console.log('Текущее содержимое:', newContent);
  }

  return (
    <div className="h-screen">
      <Editor onChange={handleContentChange} initialContent={content} key="editor"/>
    </div>
  )
}

export default App
