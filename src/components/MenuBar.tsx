import React, { useState, useEffect, useRef } from 'react'
import { 
  Bold, Italic, Strikethrough, 
  List, ListOrdered, 
  Highlighter, ChevronDown,
  Type, 
  Heading1, Heading2, Heading3, Heading4
} from 'lucide-react'

interface MenuBarProps {
  editor: any
}

const HeadingLevels = [
  { 
    level: 0, 
    title: 'Paragraph', 
    icon: Type 
  },
  { 
    level: 1, 
    title: 'Heading 1', 
    icon: Heading1 
  },
  { 
    level: 2, 
    title: 'Heading 2', 
    icon: Heading2 
  },
  { 
    level: 3, 
    title: 'Heading 3', 
    icon: Heading3 
  },
  { 
    level: 4, 
    title: 'Heading 4', 
    icon: Heading4 
  }
]

const ListTypes = [
  { 
    type: 'bullet', 
    title: 'Bullet List', 
    icon: List 
  },
  { 
    type: 'ordered', 
    title: 'Ordered List', 
    icon: ListOrdered 
  }
]

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const [openDropdown, setOpenDropdown] = useState<'none' | 'heading' | 'list'>('none')
  const [selectedHeading, setSelectedHeading] = useState(HeadingLevels[0])
  const [selectedList, setSelectedList] = useState(ListTypes[0])

  const headingRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headingRef.current && !headingRef.current.contains(event.target as Node) &&
        listRef.current && !listRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown('none')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!editor) return null

  const handleHeadingSelect = (heading: typeof HeadingLevels[number]) => {
    setSelectedHeading(heading)
    setOpenDropdown('none')
    
    if (heading.level === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level: heading.level }).run()
    }
  }

  const handleListSelect = (list: typeof ListTypes[number]) => {
    setSelectedList(list)
    setOpenDropdown('none')
    
    switch(list.type) {
      case 'bullet':
        editor.chain().focus().toggleBulletList().run()
        break
      case 'ordered':
        editor.chain().focus().toggleOrderedList().run()
        break
    }
  }

  const toggleDropdown = (dropdown: 'heading' | 'list') => {
    setOpenDropdown(prev => prev === dropdown ? 'none' : dropdown)
  }

  const formatItems = [
    { 
      icon: Bold, 
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      title: 'Bold'
    },
    { 
      icon: Italic, 
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      title: 'Italic'
    },
    { 
      icon: Strikethrough, 
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      title: 'Strike'
    },
    { 
      icon: Highlighter, 
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive('highlight'),
      title: 'Highlight'
    }
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
      <div className="flex flex-wrap gap-1 p-1.5 max-w-4xl mx-auto items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Dropdown для заголовков */}
          <div className="relative" ref={headingRef}>
            <button 
              onClick={() => toggleDropdown('heading')}
              className="
                flex items-center p-2 rounded-md 
                hover:bg-gray-100 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            >
              <span className="mr-2 text-sm font-medium text-gray-700 flex items-center">
                <selectedHeading.icon size={16} className="mr-1" />
                {selectedHeading.title}
              </span>
              <ChevronDown 
                size={16} 
                className="text-gray-500 group-hover:text-gray-700 transition-colors" 
              />
            </button>
            
            {openDropdown === 'heading' && (
              <div 
                className="
                  absolute top-full left-0 mt-1 
                  bg-white border border-gray-200 rounded-md shadow-lg 
                  overflow-hidden w-48
                "
              >
                {HeadingLevels.map((heading) => (
                  <button
                    key={heading.level}
                    onClick={() => handleHeadingSelect(heading)}
                    className={`
                      w-full text-left px-4 py-2 flex items-center
                      hover:bg-gray-100 
                      transition-colors duration-200
                      ${selectedHeading.level === heading.level 
                        ? 'bg-blue-50 text-blue-800' 
                        : 'text-gray-700'}
                    `}
                  >
                    <heading.icon size={16} className="mr-2" />
                    {heading.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown для списков */}
          <div className="relative" ref={listRef}>
            <button 
              onClick={() => toggleDropdown('list')}
              className="
                flex items-center p-2 rounded-md 
                hover:bg-gray-100 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            >
              <span className="mr-2 text-sm font-medium text-gray-700 flex items-center">
                <selectedList.icon size={16} className="mr-1" />
                {selectedList.title}
              </span>
              <ChevronDown 
                size={16} 
                className="text-gray-500 group-hover:text-gray-700 transition-colors" 
              />
            </button>
            
            {openDropdown === 'list' && (
              <div 
                className="
                  absolute top-full left-0 mt-1 
                  bg-white border border-gray-200 rounded-md shadow-lg 
                  overflow-hidden w-48
                "
              >
                {ListTypes.map((list) => (
                  <button
                    key={list.type}
                    onClick={() => handleListSelect(list)}
                    className={`
                      w-full text-left px-4 py-2 flex items-center
                      hover:bg-gray-100 
                      transition-colors duration-200
                      ${selectedList.type === list.type 
                        ? 'bg-blue-50 text-blue-800' 
                        : 'text-gray-700'}
                    `}
                  >
                    <list.icon size={16} className="mr-2" />
                    {list.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* Форматирование текста */}
          <div className="flex items-center gap-1">
            {formatItems.map(({ icon: Icon, action, isActive, title }, index) => (
              <button
                key={index}
                onClick={action}
                title={title}
                className={`
                  group relative p-2 rounded-md transition-all duration-200 
                  ${isActive 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'}
                  focus:outline-none focus:ring-2 focus:ring-blue-300
                  active:scale-95
                `}
              >
                <Icon 
                  size={20} 
                  className={`
                    transition-colors duration-200
                    ${isActive 
                      ? 'text-blue-700' 
                      : 'text-gray-600 group-hover:text-gray-900'}
                  `} 
                />
                <span 
                  className="
                    absolute bottom-full left-1/2 -translate-x-1/2 
                    bg-gray-800 text-white text-xs px-2 py-1 rounded 
                    opacity-0 group-hover:opacity-100 
                    transition-opacity duration-200 pointer-events-none
                  "
                >
                  {title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuBar
