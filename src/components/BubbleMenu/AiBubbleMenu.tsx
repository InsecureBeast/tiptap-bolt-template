import { Editor } from '@tiptap/react'
import { 
  Sparkles, 
  MessageSquare,
  Languages
} from 'lucide-react'
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
  const handleAiAction = async (item: IDropdownItem) => {
    const selectedText = editor?.state.selection.content().content.firstChild?.text
    if (!selectedText) return

    try {
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
      
      editor?.chain()
        .focus()
        .insertContent(aiResponse)
        .run()
        
    } catch (error) {
      console.error('Error processing AI request:', error)
    }
  }

  return (
    <MenuBarDropDown
      items={aiItems}
      isActive={false}
      selectId={1}
      onSelect={handleAiAction}
      title="Ask AI"
      isChangeSelected={false}
      icon={Sparkles}
    />
  )
}