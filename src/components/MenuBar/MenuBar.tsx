import { Editor } from '@tiptap/react'
import { AlignLeft, Bold, Braces, Code, CornerDownLeft, 
  Eraser, Heading1, Heading2, Heading3, Heading4, Italic, List, ListOrdered, 
  Minus, Redo, Strikethrough, TextQuote, Undo 
} from 'lucide-react'
import MenuBarButton, { IMenuBarButtonProps } from './MenuBarButton'
import MenuBarSeparator from './MenuBarSeparator'


interface MenuBarProps {
  editor: Editor | null
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null
  }

  const formatItems: IMenuBarButtonProps[] = [
    {
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      title: 'Bold',
      index: 0
    },
    { 
      icon: Italic, 
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      title: 'Italic',
      index: 1
    },
    { 
      icon: Strikethrough, 
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      title: 'Strike',
      index: 2
    },
    // { 
    //   icon: Highlighter, 
    //   onClick: () => editor.chain().focus().toggleHighlight().run(),
    //   isActive: editor.isActive('highlight'),
    //   title: 'Highlight',
    //   index: 3 
    // },
    { 
      icon: Code, 
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      title: 'Code',
      index: 4
    },
    { 
      icon: Eraser, 
      onClick: () => editor.chain().focus().unsetAllMarks().run(),
      isActive: false,
      title: 'Clear Formatting',
      index: 5
    }
  ];

  const headingItems: IMenuBarButtonProps[] = [
    { 
      icon: AlignLeft, 
      onClick:  () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
      title: 'Paragraph',
      index: 6
    },
    { 
      icon: Heading1, 
      onClick:  () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      title: 'Heading 1',
      index: 7
    },
    { 
      icon: Heading2, 
      onClick:  () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      title: 'Heading 2',
      index: 8
    },
    { 
      icon: Heading3, 
      onClick:  () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      title: 'Heading 3',
      index: 9
    },
    { 
      icon: Heading4, 
      onClick:  () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: editor.isActive('heading', { level: 4 }),
      title: 'Heading 4',
      index: 10
    }
  ];

  const listItems: IMenuBarButtonProps[] = [
    { 
      icon: List, 
      onClick:  () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      title: 'Bullet list',
      index: 11
    },
    { 
      icon: ListOrdered, 
      onClick:  () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      title: 'Ordered list',
      index: 12 
    },
  ];


  return (
    <div className="flex items-center justify-start bg-gray-100 p-2 border-b border-gray-300 shadow-sm sticky top-0 z-10">
      <div className="flex space-x-1 overflow-x-auto">
        <MenuBarButton 
          icon={Undo} 
          onClick={() => editor.chain().focus().undo().run()} 
          isActive={false} 
          index={13}
          title="Undo"/>

        <MenuBarButton 
          icon={Redo} 
          onClick={() => editor.chain().focus().redo().run()} 
          isActive={false} 
          index={14}
          title="Redo"/>
      
      <MenuBarSeparator />

      {headingItems.map(({ icon: Icon, onClick, isActive, title }, index) => (
        <MenuBarButton 
          icon={Icon} 
          onClick={onClick} 
          isActive={isActive} 
          index={index}
          title={title}/>
      ))}

      <MenuBarSeparator />
      
      {listItems.map(({ icon: Icon, onClick, isActive, title }, index) => (
        <MenuBarButton 
          icon={Icon} 
          onClick={onClick} 
          isActive={isActive} 
          index={index}
          title={title}/>
      ))}

      <MenuBarButton 
          icon={Braces} 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
          isActive={editor.isActive('codeBlock')} 
          index={15}
          title='Code block'/>
      <MenuBarButton
          icon={TextQuote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          index={16}
          title='Quote' 
      /> 

      <MenuBarSeparator />
      
      {formatItems.map(({ icon: Icon, onClick, isActive, title }, index) => (
        <MenuBarButton 
          icon={Icon} 
          onClick={onClick} 
          isActive={isActive} 
          index={index}
          title={title}/>
      ))}

      <MenuBarSeparator />

      <MenuBarButton
        icon={Minus} 
        onClick={() => editor.chain().focus().setHorizontalRule().run()} 
        isActive={false} 
        index={17}
        title='Add line'/>

      <MenuBarButton
        icon={CornerDownLeft} 
        onClick={() => editor.chain().focus().setHardBreak().run()} 
        isActive={false} 
        index={18}
        title='Add hardbreake'/>
      </div>
    </div>
  )
}

export default MenuBar