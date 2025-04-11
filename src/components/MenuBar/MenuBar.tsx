import { Editor } from '@tiptap/react'
import { Braces, CornerDownLeft, Minus, Redo, TextQuote, Undo, Palette, UserCircle2 } from 'lucide-react'
import { useState } from 'react'
import MenuButton from '../MenuButton'
import MenuSeparator from '../MenuSeparator'
import { getFormatItems, getHeadingItems, getListItems } from '../Editor/MenuButtonLists'
import StyleDialog from '../StyleDialog/StyleDialog'
import AiMenuBarCommands from './AiMenuBarCommands'
import ProfileDialog from '../ProfileDialog/ProfileDialog'

interface MenuBarProps {
  editor: Editor | null
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="flex items-center justify-start bg-gray-100 p-2 border-b 
                    border-gray-300 shadow-sm sticky top-0 z-10">
        <div className="flex flex-wrap flex-row space-x-1" id="editorToolbar">
          <AiMenuBarCommands editor={editor} />

          <MenuSeparator key="sep1" />

          <MenuButton
            key="undo"
            icon={Undo} 
            onClick={() => editor.chain().focus().undo().run()} 
            isActive={false} 
            index={13}
            tooltip="Undo"
          />

          <MenuButton 
            key="redo"
            icon={Redo} 
            onClick={() => editor.chain().focus().redo().run()} 
            isActive={false} 
            index={14}
            tooltip="Redo"
          />
        
          <MenuSeparator key="sep2" />

          {getHeadingItems(editor).map(({ icon: Icon, onClick, isActive, tooltip }, index) => (
            <MenuButton 
              key={`heading-${index}`}
              icon={Icon} 
              onClick={onClick} 
              isActive={isActive} 
              index={index}
              tooltip={tooltip}
            />
          ))}

          <MenuSeparator key="sep3" />
          
          {getListItems(editor).map(({ icon: Icon, onClick, isActive, tooltip }, index) => (
            <MenuButton 
              key={`list-${index}`}
              icon={Icon} 
              onClick={onClick} 
              isActive={isActive} 
              index={index}
              tooltip={tooltip}
            />
          ))}

          <MenuButton 
            key="code-block"
            icon={Braces} 
            onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
            isActive={editor.isActive('codeBlock')} 
            index={15}
            tooltip='Code block'
          />

          <MenuButton
            key="blockquote"
            icon={TextQuote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            index={16}
            tooltip='Quote' 
          /> 

          <MenuSeparator key="sep4" />
          
          {getFormatItems(editor).map(({ icon: Icon, onClick, isActive, tooltip }, index) => (
            <MenuButton 
              key={`format-${index}`}
              icon={Icon} 
              onClick={onClick} 
              isActive={isActive} 
              index={index}
              tooltip={tooltip}
            />
          ))}

          <MenuSeparator key="sep5" />

          <MenuButton
            key="line"
            icon={Minus} 
            onClick={() => editor.chain().focus().setHorizontalRule().run()} 
            isActive={false} 
            index={17}
            tooltip='Add line'
          />

          <MenuButton
            key="hard-break"
            icon={CornerDownLeft} 
            onClick={() => editor.chain().focus().setHardBreak().run()} 
            isActive={false} 
            index={18}
            tooltip='Add hardbreak'
          />

          <MenuSeparator key="sep6" />

          <MenuButton
            key="style"
            icon={Palette}
            onClick={() => setIsStyleDialogOpen(true)}
            isActive={false}
            index={19}
            tooltip="Стили текста"
          />

          <MenuButton
            key="profile"
            icon={UserCircle2}
            onClick={() => setIsProfileDialogOpen(true)}
            isActive={false}
            index={22}
            tooltip="Профили"
          />
        </div>
      </div>

      <StyleDialog 
        isOpen={isStyleDialogOpen}
        onClose={() => setIsStyleDialogOpen(false)}
        onApply={() => {}}
      />

      <ProfileDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
      />
    </>
  )
}

export default MenuBar
