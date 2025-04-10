import { Editor } from '@tiptap/react'
import { streamText } from './ai.service'
import { getPrompt } from '../prompts/generator.prompt'
import { prompt as checkErrorsPrompt } from '../prompts/check-errors.prompt'
import { SavedStyle } from '../components/StyleDialog/StyleDialog'

interface AiCommandCallbacks {
  onStart?: () => void
  onFinish?: () => void
  onError?: () => void
}

export class AiCommandsService {
  static async generateText(editor: Editor, callbacks: AiCommandCallbacks) {
    try {
      callbacks.onStart?.()

      const savedStyles = localStorage.getItem('savedStyles')
      let tov = undefined;
      if (savedStyles) {
        const styles = JSON.parse(savedStyles) as SavedStyle[]
        if (styles.length > 0) {
          const lastStyle = styles[styles.length - 1];
          tov = lastStyle.tov;
        }
      }

      editor.commands.setContent("");

      await streamText({
        prompt: "Напиши текст для поста в телеграме",
        systemPrompt: getPrompt(tov || "", "", "", "", ""),
        editor,
        selection: editor.state.selection,
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError
      });
    } catch (error) {
      console.error('Error generating text:', error);
      callbacks.onError?.()
    }
  }

  static async checkSpelling(editor: Editor, callbacks: AiCommandCallbacks) {
    try {
      const { empty, from, to } = editor.state.selection;
      const text = empty ? editor.getText() : editor.state.doc.textBetween(from, to);

      await streamText({
        prompt: text,
        systemPrompt: checkErrorsPrompt,
        editor,
        selection: empty ? undefined : { from, to },
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError
      });
    } catch (error) {
      console.error('Error checking text:', error);
      callbacks.onError?.()
    }
  }
}
