import { BubbleMenu, Editor } from '@tiptap/react'
import { 
  Sparkles, 
  Braces,
  TextQuote
} from 'lucide-react'
import { useState } from 'react'
import { getFormatItems, getHeadingItems, getListItems } from '../Editor/MenuButtonLists'
import MenuButton from '../MenuButton'
import MenuSeparator from '../MenuSeparator'

interface EditorBubbleMenuProps {
  editor: Editor | null
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAiAction = async (action: string) => {
    const selectedText = editor.state.selection.content().content.firstChild?.text
    if (!selectedText) return

    try {
      let aiResponse = ''
      switch (action) {
        case 'improve':
          aiResponse = 'Улучшенный текст...'
          break
        case 'summarize':
          aiResponse = 'Краткое содержание...'
          break
        case 'translate':
          aiResponse = 'Перевод...'
          break
        default:
          aiResponse = 'Обработанный текст...'
      }
      
      editor.chain()
        .focus()
        .insertContent(aiResponse)
        .run()
        
    } catch (error) {
      console.error('Error processing AI request:', error)
    }
  }

  if (!editor)
    return null;

  return (
    <BubbleMenu 
      editor={editor}
      tippyOptions={{ 
        duration: 100,
        placement: 'top',
        hideOnClick: false,
      }}
      shouldShow={({ editor }) => {
        const { selection } = editor.state
        return !selection.empty && !isOpen
      }}
    >
      <div className="flex items-center gap-0.5 px-1.5 py-1 bg-white rounded-lg shadow-lg border">
        {/* AI Actions */}
        <MenuButton 
          key={`aibutton`} 
          icon={Sparkles} 
          onClick={() => handleAiAction('improve')} 
          isActive={false} 
          index={0}
          title='Improve text'
          tooltip=''
        />

        <MenuSeparator />
        
        {getHeadingItems(editor).map(({ icon: Icon, onClick, isActive, tooltip }, index) => (
        <MenuButton 
          key={`headingButton${index}`} 
          icon={Icon} 
          onClick={onClick} 
          isActive={isActive} 
          index={index}
          tooltip={tooltip}/>
        ))}

        <MenuSeparator />
        
        {getListItems(editor).map(({ icon: Icon, onClick, isActive, tooltip }, index) => (
          <MenuButton 
            key={`listButton${index}`}
            icon={Icon} 
            onClick={onClick} 
            isActive={isActive} 
            index={index}
            tooltip={tooltip}/>
        ))}
      </div>
    </BubbleMenu>
  )
}