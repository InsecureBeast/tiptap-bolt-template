import { Editor } from '@tiptap/react'
import { streamResponseText, streamText } from './ai.service'
import { getPrompt } from '../prompts/generator.prompt'
import { prompt as checkErrorsPrompt } from '../prompts/check-errors.prompt'
import { prompt as structureTextPromp } from '../prompts/structure-text,prompt'
import { VectorStorageService } from './vector-storage.service'
import { StyleService } from './style.service'

interface AiCommandCallbacks {
  onStart?: () => void
  onFinish?: () => void
  onError?: () => void
}

export class AiCommandsService {
  static async generateText(editor: Editor, callbacks: AiCommandCallbacks) {
    try {
      let tov = undefined;
      const defaultStyle = StyleService.getDefaultStyle();
      if (defaultStyle) {
        tov = defaultStyle.tov;
      }
      const storeId = VectorStorageService.getCurrentVectorStoreId();
      
      await streamResponseText({
        prompt: "Напиши статью для vc",
        systemPrompt: getPrompt(tov || "", storeId || "", "500", "2000", ""),
        editor,
        selection: editor.state.selection,
        storeId: storeId,
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError,
        onStartStreming: () => { 
          const { empty } = editor.state.selection;
          if (empty)
            editor.commands.setContent("");
        },
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

  static async structureTheText(editor: Editor, callbacks: AiCommandCallbacks) {
    try {
      const { empty, from, to } = editor.state.selection;
      const text = empty ? editor.getText() : editor.state.doc.textBetween(from, to);

      await streamText({
        prompt: text,
        systemPrompt: structureTextPromp,
        editor,
        selection: empty ? undefined : { from, to },
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError,
        onStartStreming: () => { 
          if (empty)
            editor.commands.setContent("");
        },
      });
    } catch (error) {
      console.error('Error checking text:', error);
      callbacks.onError?.()
    }
  }
}
