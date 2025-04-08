import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import MenuBar from "./MenuBar/MenuBar"
import { FormEventHandler } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

export default ({ onChange, content }: { onChange: FormEventHandler<HTMLDivElement>; content: string | undefined }) => {
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
        spellcheck: 'false',
      },
    },
  }, [content])

  return (
    <>
      <MenuBar editor={editor} key="menubar" />
      <EditorContent editor={editor} onInput={(event) => {
        if (onChange)
          onChange(event);
        }
      }
      />
      <div className="p-2 text-sm text-gray-500 border-t">
        {editor?.storage.characterCount.characters()} символов
      </div>
    </>
  )
}