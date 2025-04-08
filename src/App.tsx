import { useEffect, useState } from 'react'
import Editor from './components/Editor'
import Onboarding from './components/Onbording/Onbording';

function App() {
  const [currentContent, setCurrentContent] = useState<string>()

  const handleContentChange = async (event: React.FormEvent<HTMLDivElement>) => {
    const newContent = event.currentTarget.innerHTML;
    setCurrentContent(newContent);
    console.log('Текущее содержимое:', newContent);

    try {
      const response = await fetch('/data.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newContent })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
    }
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
      <Onboarding />
      <Editor onChange={handleContentChange} content={currentContent} key="editor"/>
    </div>
  )
}

export default App
