import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import MenuBar from "./MenuBar/MenuBar"
import { useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import EditorBubbleMenu from "./BubbleMenu/BubbleMenu";
import AIQueryInput from "./AIQueryInput";

export default ({ onChange, content }: { 
  onChange: (text: string) => void | undefined ; 
  content: string | undefined }) => {
  const [showAIQueryInput, setShowAIQueryInput] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        // Use a placeholder:
        placeholder: 'Напишите свой текст здесь...'
      }),
      CharacterCount.configure({
        limit: 50000,
      })
    ],
    content: content,
    editorProps: {
      attributes: {
        spellcheck: 'true',
      },
    },
    onTransaction: ({ editor }) => {
      onChange?.(editor.getHTML());
    }
  }, [content])

  return (
    <>
      <MenuBar editor={editor} onAIQueryToggle={() => setShowAIQueryInput(true)} key="menubar" />
      <EditorBubbleMenu editor={editor} key="editormenu" />
      <EditorContent editor={editor} />
      <div className="p-2 text-sm text-gray-500 border-t">
        {editor?.storage.characterCount.characters()} символов
      </div>

      {showAIQueryInput && (
        <AIQueryInput 
          editor={editor} 
          onClose={() => setShowAIQueryInput(false)} 
        />
      )}
    </>
  )
}