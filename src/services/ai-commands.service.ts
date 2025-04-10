import { Editor } from '@tiptap/react'
import { streamResponseText, streamText } from './ai.service'
import { getPrompt } from '../prompts/generator.prompt'
import { prompt as checkErrorsPrompt } from '../prompts/check-errors.prompt'
import { VectorStorageService } from './vector-storage.service'
import { StyleService } from './style.service'

interface AiCommandCallbacks {
  onStart?: () => void
  onFinish?: () => void
  onError?: () => void
}

export class AiCommandsService {
  static async generateText(editor: Editor, callbacks: AiCommandCallbacks, overrideAll: boolean = true) {
    try {
      callbacks.onStart?.()
      
      let tov = undefined;
      const defaultStyle = StyleService.getDefaultStyle();
      if (defaultStyle) {
        tov = defaultStyle.tov;
      }
      const storeId = VectorStorageService.getCurrentVectorStoreId();
      
      if (overrideAll)
        editor.commands.setContent("");

      await streamResponseText({
        prompt: "Напиши текст для поста в телеграме",
        systemPrompt: getPrompt(tov || "", storeId || "", "", "", ""),
        editor,
        selection: editor.state.selection,
        storeId: storeId,
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
