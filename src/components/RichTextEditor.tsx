import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CharacterCount from '@tiptap/extension-character-count'
import MenuBar from './MenuBar'

interface RichTextEditorProps {
  initialContent?: string
  characterLimit?: number
  onChange?: (content: string) => void
  placeholder?: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  initialContent =  "", 
  characterLimit = 50000,
  onChange,
  placeholder = 'Start writing...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'text-gray-800'
          }
        }
      }),
      Highlight,
      TextStyle,
      Color,
      CharacterCount.configure({ limit: characterLimit }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'tiptap prose focus:outline-none w-full min-h-screen pt-16 pb-16'
      }
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
    }
  })

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f8f9fa]">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-grow overflow-auto" />
      {editor && (
        <div className="fixed bottom-0 left-0 right-0 p-2 bg-gray-100 text-sm text-gray-600 text-center">
          <span>Символов: {editor.storage.characterCount.characters()}/{characterLimit}</span>
          {editor.storage.characterCount.characters() >= characterLimit && (
            <span className="text-red-500 ml-2">Достигнут лимит символов</span>
          )}
        </div>
      )}
    </div>
  )
}

export default RichTextEditor
