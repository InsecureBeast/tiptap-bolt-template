import { Editor } from '@tiptap/react'
import { Braces, CornerDownLeft, Minus, Redo, TextQuote, Undo, Palette, FileText } from 'lucide-react'
import { useState } from 'react'
import MenuButton from '../MenuButton'
import MenuSeparator from '../MenuSeparator'
import { getFormatItems, getHeadingItems, getListItems } from '../Editor/MenuButtonLists'
import StyleDialog, { SavedStyle } from '../StyleDialog/StyleDialog'
import { getPrompt } from '../../prompts/generator.prompt'
import { streamText } from '../../services/ai.service'

interface MenuBarProps {
  editor: Editor | null
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!editor) {
    return null
  }

  const handleGenerateText = async () => {
    if (isGenerating) 
      return;
    
    setIsGenerating(true);

    const savedStyles = localStorage.getItem('savedStyles')
    let tov = undefined;
    if (savedStyles) {
      const styles = JSON.parse(savedStyles) as SavedStyle[]
      if (styles.length > 0) {
        const lastStyle = styles[styles.length - 1];
        tov = lastStyle.tov;
      }
    }

    try {
      // remove all content before
      editor.commands.setContent("");

      await streamText({
        prompt: "Напиши текст для поста в телеграме",
        systemPrompt: getPrompt(tov || "", "", "", "", ""),
        editor,
        selection: editor.state.selection,
        onStart: () => setIsGenerating(true),
        onFinish: () => setIsGenerating(false),
        onError: () => setIsGenerating(false)
      });
    } catch (error) {
      console.error('Error generating text:', error);
      setIsGenerating(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-start bg-gray-100 p-2 border-b 
                    border-gray-300 shadow-sm sticky top-0 z-10">
        <div className="flex flex-wrap flex-row space-x-1" id="editorToolbar">
          <MenuButton
            key="generateButton"
            icon={FileText}
            onClick={handleGenerateText}
            isActive={isGenerating}
            index={20}
            tooltip=""
            title="Сгенерировать текст"
          />

          <MenuSeparator />

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

          <MenuSeparator />

          <MenuButton
            key="styleButton"
            icon={Palette}
            onClick={() => setIsStyleDialogOpen(true)}
            isActive={false}
            index={19}
            tooltip="Стили текста"
          />
        </div>
      </div>

      <StyleDialog 
        isOpen={isStyleDialogOpen}
        onClose={() => setIsStyleDialogOpen(false)}
        onApply={() => {}}
      />
    </>
  )
}

export default MenuBar
