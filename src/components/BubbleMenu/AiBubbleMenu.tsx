import { Editor } from '@tiptap/react'
import { 
  Sparkles, 
  Check,
  ListPlus,
  Database,
  WandSparkles
} from 'lucide-react'
import { useState } from 'react'
import MenuBarDropDown, { IDropdownItem } from '../MenuBar/MenuBarDropDown'
import { AiCommandsService } from '../../services/ai-commands.service'

interface AiMenuProps {
  editor: Editor
}

const aiItems: IDropdownItem[] = [
  { id: 1, title: 'Переписать', icon: WandSparkles },
  { 
    id: 2, 
    title: 'Дополнить', 
    icon: ListPlus,
    subItems: [
      { id: 21, title: 'С помощью ИИ', icon: WandSparkles },
      { id: 22, title: 'Из базы знаний', icon: Database },
    ]
  },
  { id: 3, title: 'Проверить на ошибки', icon: Check },
  //{ id: 4, title: 'Структурировать текст', icon: AlignJustify },
]

export default function AiBubbleMenu({ editor }: AiMenuProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAiAction = async (item: IDropdownItem) => {
    if (isLoading) return;

    try {
      setIsLoading(true)
      
      switch (item.id) {
        case 1:
          await AiCommandsService.rewriteText(editor, {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false)
          });
          break
        case 21:
          await AiCommandsService.addText(editor, {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false)
          });
          break
          case 22:
        await AiCommandsService.addText(editor, {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false)
          }, true);
          break
        case 3:
          await AiCommandsService.checkSpelling(editor, {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: () => setIsLoading(false)
          });
          break;
        case 4:
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
      title="AI Помощник"
      isChangeSelected={false}
      icon={Sparkles}
      isLoading={isLoading}
      hasSubMenu={true}
    />
  )
}
