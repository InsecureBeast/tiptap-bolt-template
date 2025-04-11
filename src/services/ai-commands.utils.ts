import { Editor } from '@tiptap/react'
import { StyleService } from "./style.service";
import { VectorStorageService } from "./vector-storage.service";

export interface ProfileAndTov {
  tov: string | undefined;
  storeId: string | null;
}

export function getProfileAndToV(): ProfileAndTov {
  const result: ProfileAndTov = {
    tov: undefined,
    storeId: null
  }; 

  const defaultStyle = StyleService.getDefaultStyle();
  if (defaultStyle) {
    result.tov = defaultStyle.tov;
  }
  result.storeId = VectorStorageService.getCurrentVectorStoreId();
  return result;
}

export interface ISelectionText {
  empty: boolean;
  from: number;
  to: number;
  text: string;
}

export function getSelectionText(editor: Editor): ISelectionText {
  const { empty, from, to } = editor.state.selection;
  const text = empty ? editor.getText() : editor.state.doc.textBetween(from, to);
  return { 
    empty,
    from,
    to,
    text
  }
}