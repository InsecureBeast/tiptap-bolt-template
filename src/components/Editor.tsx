import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import MenuBar from "./MenuBar/MenuBar"
import { FormEventHandler } from "react";
import Placeholder from "@tiptap/extension-placeholder";

export default ({ onChange, content }: { onChange: FormEventHandler<HTMLDivElement>; content: string | undefined }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        // Use a placeholder:
        placeholder: 'Напишите свой текст здесь...'
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
    </>
  )
}