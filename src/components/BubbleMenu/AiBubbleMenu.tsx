import { Editor } from '@tiptap/react'
import { 
  Sparkles, 
  MessageSquare,
  Languages
} from 'lucide-react'
import { useState } from 'react'
import MenuBarDropDown, { IDropdownItem } from '../MenuBar/MenuBarDropDown'

interface AiMenuProps {
  editor: Editor
}

const aiItems: IDropdownItem[] = [
  { id: 1, title: 'Improve', icon: Sparkles },
  { id: 2, title: 'Summarize', icon: MessageSquare },
  { id: 3, title: 'Translate', icon: Languages },
]

export default function AiBubbleMenu({ editor }: AiMenuProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAiAction = async (item: IDropdownItem) => {
    try {
      setIsLoading(true)
      
      const { empty } = editor.state.selection;
      const { from, to } = editor.state.selection

      // TODO  add spiner
      // if (!empty) {
      //   editor.chain()
      //         .focus()
      //         .setTextSelection({ from, to })
      //         .insertContent('<span class="loading-text absolute">обработка...</span>')
      //         .run();
      // }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      let aiResponse = ''
      switch (item.id) {
        case 1:
          aiResponse = 'Улучшенный текст...'
          break
        case 2:
          aiResponse = 'Краткое содержание...'
          break
        case 3:
          aiResponse = 'Перевод...'
          break
        default:
          aiResponse = 'Обработанный текст...'
      }
      
      editor.chain()
        .focus()
        .setTextSelection({ from, to })
        .insertContent(aiResponse)
        .run()
        
    } catch (error) {
      console.error('Error processing AI request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MenuBarDropDown
      items={aiItems}
      isActive={isLoading}
      selectId={1}
      onSelect={handleAiAction}
      title="Ask AI"
      isChangeSelected={false}
      icon={Sparkles}
    />
  )
}
