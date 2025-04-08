import { BubbleMenu, Editor } from '@tiptap/react'
import { useState } from 'react'
import { getFormatItems, getHeadingItems, getListItems } from '../Editor/MenuButtonLists'
import MenuButton from '../MenuButton'
import MenuSeparator from '../MenuSeparator'
import AiBubbleMenu from './AiBubbleMenu'

interface EditorBubbleMenuProps {
  editor: Editor | null
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!editor)
    return null

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
      className="flex items-center gap-0.5 px-1.5 py-1 bg-white rounded-lg shadow-lg border max-w-none"
    >
      <AiBubbleMenu editor={editor} />

      <MenuSeparator />
        
      {getHeadingItems(editor).map(({ icon: Icon, onClick, isActive, tooltip }, index) => (
        <MenuButton 
          key={`headingButton${index}`} 
          icon={Icon} 
          onClick={onClick} 
          isActive={isActive} 
          index={index}
          tooltip={tooltip}
        />
      ))}

      <MenuSeparator />
        
      {getListItems(editor).map(({ icon: Icon, onClick, isActive, tooltip }, index) => (
        <MenuButton 
          key={`listButton${index}`}
          icon={Icon} 
          onClick={onClick} 
          isActive={isActive} 
          index={index}
          tooltip={tooltip}
        />
      ))}

      <MenuSeparator />

      {getFormatItems(editor).map(({ icon: Icon, onClick, isActive, tooltip }, index) => (
        <MenuButton 
          key={`formatButton${index}`}
          icon={Icon} 
          onClick={onClick} 
          isActive={isActive} 
          index={index}
          tooltip={tooltip}/>
      ))}
    </BubbleMenu>
  )
}