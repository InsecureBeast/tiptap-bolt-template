import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import MenuBar from "./MenuBar/MenuBar"
import { FormEventHandler } from "react";

export default ({ onChange, initialContent }: { onChange: FormEventHandler<HTMLDivElement>; initialContent: string }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
  })

  return (
    <>
      <MenuBar editor={editor} key="menubar"/>
      <EditorContent editor={editor} onChange={onChange} />
    </>
  )
}