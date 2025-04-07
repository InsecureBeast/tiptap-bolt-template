import React from 'react'
import { 
  Bold, Italic, Strikethrough, 
  List, ListOrdered, 
  Heading1, Heading2, 
  Highlighter 
} from 'lucide-react'

interface MenuBarProps {
  editor: any
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) return null

  const menuItems = [
    { 
      icon: Bold, 
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      title: 'Жирный'
    },
    { 
      icon: Italic, 
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      title: 'Курсив'
    },
    { 
      icon: Strikethrough, 
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      title: 'Зачеркнутый'
    },
    { 
      icon: Heading1, 
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      title: 'Заголовок 1'
    },
    { 
      icon: Heading2, 
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      title: 'Заголовок 2'
    },
    { 
      icon: List, 
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      title: 'Маркированный список'
    },
    { 
      icon: ListOrdered, 
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      title: 'Нумерованный список'
    },
    { 
      icon: Highlighter, 
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive('highlight'),
      title: 'Подсветка'
    }
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex flex-wrap gap-1 p-2 max-w-4xl mx-auto">
        {menuItems.map(({ icon: Icon, action, isActive, title }, index) => (
          <button
            key={index}
            onClick={action}
            title={title}
            className={`
              p-2 rounded transition-colors duration-200 
              ${isActive 
                ? 'bg-blue-200 text-blue-800' 
                : 'hover:bg-gray-200 text-gray-700'}
              focus:outline-none focus:ring-2 focus:ring-blue-300
            `}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default MenuBar
