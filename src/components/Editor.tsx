import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import MenuBar from "./MenuBar/MenuBar"
import { FormEventHandler } from "react";

export default ({ onChange, content }: { onChange: FormEventHandler<HTMLDivElement>; content: HTMLElement | undefined }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
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
      <MenuBar editor={editor} key="menubar"/>
      <EditorContent editor={editor} onChange={onChange} />
    </>
  )
}