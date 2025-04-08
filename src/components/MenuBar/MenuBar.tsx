import { Editor } from '@tiptap/react'
import { Braces, CornerDownLeft, Minus, Redo, TextQuote, Undo } from 'lucide-react'
import MenuButton from '../MenuButton'
import MenuSeparator from '../MenuSeparator'
import { getFormatItems, getHeadingItems, getListItems } from '../Editor/MenuButtonLists'

interface MenuBarProps {
  editor: Editor | null
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center justify-start bg-gray-100 p-2 border-b 
                  border-gray-300 shadow-sm sticky top-0 z-10">
      <div className="flex flex-wrap flex-row space-x-1" id="editorToolbar">
        <MenuButton
          key={"undoButton"} 
          icon={Undo} 
          onClick={() => editor.chain().focus().undo().run()} 
          isActive={false} 
          index={13}
          tooltip="Undo"/>

        <MenuButton 
          key={"redoButton"} 
          icon={Redo} 
          onClick={() => editor.chain().focus().redo().run()} 
          isActive={false} 
          index={14}
          tooltip="Redo"/>
      
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

      <MenuButton 
        key={`codeBlockButton`}
        icon={Braces} 
        onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
        isActive={editor.isActive('codeBlock')} 
        index={15}
        tooltip='Code block'/>

      <MenuButton
        key={`blockquoteButton`}
        icon={TextQuote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        index={16}
        tooltip='Quote' 
      /> 

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

      <MenuSeparator />

      <MenuButton
        key={`lineButton`}
        icon={Minus} 
        onClick={() => editor.chain().focus().setHorizontalRule().run()} 
        isActive={false} 
        index={17}
        tooltip='Add line'/>

      <MenuButton
        key={`hardBreakButton`}
        icon={CornerDownLeft} 
        onClick={() => editor.chain().focus().setHardBreak().run()} 
        isActive={false} 
        index={18}
        tooltip='Add hardbreak'/>
      </div>
    </div>
  )
}

export default MenuBar