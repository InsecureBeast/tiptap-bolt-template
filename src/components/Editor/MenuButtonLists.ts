import { Editor } from '@tiptap/react'
import { AlignLeft, Bold, Code, Eraser, 
         Heading1, Heading2, Heading3, Heading4, 
         Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { IMenuButtonProps } from "../MenuButton";

export function getHeadingItems(editor: Editor | null): IMenuButtonProps[] {
  if (! editor)
    return [];

  return [
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
}

export function getFormatItems(editor: Editor | null): IMenuButtonProps[] {
  if (!editor)
    return [];

  return [
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
}

export function getListItems(editor: Editor): IMenuButtonProps[] {
  if (!editor)
    return [];
  return [
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
}