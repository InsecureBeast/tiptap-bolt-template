import { useEffect, useState } from 'react'
import Editor from './components/Editor'

function App() {
  const [currentContent, setCurrentContent] = useState<HTMLDivElement>()

  const handleContentChange = (event: React.FormEvent<HTMLDivElement>) => {
    const newContent = event.currentTarget;
    setCurrentContent(newContent);
    console.log('Текущее содержимое:', newContent);
  }

  useEffect(() => {
    // Initial load of content
    const loadContent = async () => {
      try {
        const response = await fetch('../public/data.json');
        const data = await response.json();
        setCurrentContent(data.content);
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();

    // Poll for changes every 2 seconds
    const interval = setInterval(loadContent, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen">
      <Editor onChange={handleContentChange} content={currentContent} key="editor"/>
    </div>
  )
}

export default App
