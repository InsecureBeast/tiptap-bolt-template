import { useEffect, useState } from 'react'
import Editor from './components/Editor'
import Onboarding from './components/Onbording/Onbording';

function App() {
  const [currentContent, setCurrentContent] = useState<string>()

  const handleContentChange = async (newContent: string) => {
    localStorage.setItem('currentContent', newContent);
  }

  useEffect(() => {
    // Загрузка контента при инициализации
    const loadContent = () => {
      const storedContent = localStorage.getItem('currentContent');
      if (storedContent) {
        setCurrentContent(storedContent);
      }
    };

    loadContent();

    // Обработчик события для синхронизации между вкладками
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'currentContent') {
        loadContent();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="h-screen">
      <Onboarding />
      <Editor onChange={handleContentChange} content={currentContent} key="editor"/>
    </div>
  )
}

export default App
