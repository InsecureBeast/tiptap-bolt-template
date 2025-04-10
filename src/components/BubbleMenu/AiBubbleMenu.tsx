import { Editor } from '@tiptap/react'
import { 
  Sparkles, 
  Check,
  AlignJustify
} from 'lucide-react'
import { useState } from 'react'
import MenuBarDropDown, { IDropdownItem } from '../MenuBar/MenuBarDropDown'
import { AiCommandsService } from '../../services/ai-commands.service'

interface AiMenuProps {
  editor: Editor
}

const aiItems: IDropdownItem[] = [
  { id: 1, title: 'Переписать', icon: Sparkles },
  { id: 2, title: 'Проверить на ошибки', icon: Check },
  { id: 3, title: 'Структурировать текст', icon: AlignJustify },
]

export default function AiBubbleMenu({ editor }: AiMenuProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAiAction = async (item: IDropdownItem) => {
    if (isLoading) return;

    try {
      setIsLoading(true)
      
      switch (item.id) {
        case 1:
          await AiCommandsService.generateText(editor, {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false)
          });
          break
        case 2:
          await AiCommandsService.checkSpelling(editor, {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false)
          });
          break
        case 3:
          await AiCommandsService.structureTheText(editor, {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false)
          });
          break
        default:
          console.warn('Unknown AI action:', item.id);
      }
    } catch (error) {
      console.error('Error processing AI request:', error)
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
      isLoading={isLoading}
    />
  )
}
