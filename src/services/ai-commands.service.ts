import { Editor } from '@tiptap/react'
import { streamResponseText, streamText } from './ai.service'
import { getPrompt, getRewritePrompt } from '../prompts/generator.prompt'
import { prompt as checkErrorsPrompt } from '../prompts/check-errors.prompt'
import { prompt as structureTextPromp } from '../prompts/structure-text,prompt'
import { getPrompt as getAddTextPrompt } from '../prompts/add-text.prompt'
import { getProfileAndToV, getSelectionText } from './ai-commands.utils'
import { systemPrompt as adaptionSystemPrompt, telegramStructurePrompt, vcruStructurePrompt } from '../prompts/content-adaption.prompt'

interface AiCommandCallbacks {
  onStart?: () => void
  onFinish?: () => void
  onError?: () => void
}

export class AiCommandsService {

  static async generateText(editor: Editor, callbacks: AiCommandCallbacks, customPrompt?: string) {
    try {
      const ptov = getProfileAndToV();
      const selectionText = getSelectionText(editor);
      
      await streamResponseText({
        prompt: customPrompt || "Напиши тестовый текст для проверки редактора.",
        systemPrompt: getPrompt(ptov.tov, ptov.storeId, "500", "2000", ""),
        editor,
        selection: selectionText,
        storeId: ptov.storeId,
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError,
      });
    } catch (error) {
      console.error('Error generating text:', error);
      callbacks.onError?.()
    }
  }

  static async rewriteText(editor: Editor, callbacks: AiCommandCallbacks) {
    try {
      const ptov = getProfileAndToV();
      const selectionText = getSelectionText(editor);
      
      await streamResponseText({
        prompt: selectionText.text,
        systemPrompt: getRewritePrompt(ptov.tov, ptov.storeId, null),
        editor,
        selection: selectionText,
        storeId: ptov.storeId,
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError,
      });
    } catch (error) {
      console.error('Error generating text:', error);
      callbacks.onError?.()
    }
  }

  static async checkSpelling(editor: Editor, callbacks: AiCommandCallbacks) {
    try {
      const selectionText = getSelectionText(editor);

      await streamText({
        prompt: selectionText.text,
        systemPrompt: checkErrorsPrompt,
        editor,
        selection: selectionText,
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
      const selectionText = getSelectionText(editor);

      await streamText({
        prompt: selectionText.text,
        systemPrompt: structureTextPromp,
        editor,
        selection: selectionText,
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError,
      });
    } catch (error) {
      console.error('Error checking text:', error);
      callbacks.onError?.()
    }
  }

  static async addText(editor: Editor, callbacks: AiCommandCallbacks, withStore: boolean = false): Promise<void> {
    try {
      const ptov = getProfileAndToV();
      const selectionText = getSelectionText(editor);
      
      await streamResponseText({
        prompt: selectionText.text,
        systemPrompt: getAddTextPrompt(ptov.tov, withStore ? ptov.storeId : null),
        editor,
        selection: selectionText,
        storeId: ptov.storeId,
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError,
      });
    } catch (error) {
      console.error('Error generating additional text:', error);
      callbacks.onError?.()
    }
  }

  static async adaptContentVcru(editor: Editor, callbacks: AiCommandCallbacks) {
    try {
      const selectionText = getSelectionText(editor);

      await streamText({
        prompt: `Article Version Rules: ${vcruStructurePrompt}. Input text: ${selectionText.text}`,
        systemPrompt: adaptionSystemPrompt,
        editor,
        selection: selectionText,
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError,
      });
    } catch (error) {
      console.error('Error checking text:', error);
      callbacks.onError?.()
    }
  }

  static async adaptContentTelegram(editor: Editor, callbacks: AiCommandCallbacks) {
    try {
      const selectionText = getSelectionText(editor);

      await streamText({
        prompt: `Post Version Rules: ${telegramStructurePrompt}. Input text: ${selectionText.text}`,
        systemPrompt: adaptionSystemPrompt,
        editor,
        selection: selectionText,
        onStart: callbacks.onStart,
        onFinish: callbacks.onFinish,
        onError: callbacks.onError,
      });
    } catch (error) {
      console.error('Error checking text:', error);
      callbacks.onError?.()
    }
  }
}
