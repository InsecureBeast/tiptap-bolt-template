import { Editor } from '@tiptap/react';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';

export class HtmlStreamProcessor {
  private htmlBuffer: string = '';

  constructor(private editor: Editor) {}

  /**
   * Updates the editor content from the buffer.
   */
  private updateEditorContent(html: string): void {
    // Clean the received HTML from unnecessary markers (e.g., markdown blocks with ```html)
    html = html.replace("```html", "").replace("```", "");

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const slice = ProseMirrorDOMParser
      .fromSchema(this.editor.schema)
      .parseSlice(doc.body);

    const transaction = this.editor.view.state.tr
      .replaceRange(0, this.editor.view.state.doc.content.size, slice);

    this.editor.view.dispatch(transaction);
  }

  /**
   * Processes incoming chunks of HTML.
   * @param htmlChunk New chunk of HTML
   * @param isLast Indicates whether this chunk is the last one (i.e., the stream is complete)
   */
  public streamInsertHtmlChunk(htmlChunk: string, isLast: boolean = false): void {
    // Add the new chunk to the buffer
    this.htmlBuffer += htmlChunk;

    // Example simple check: if the stream is complete, or the buffer ends with a closing body tag,
    // update the editor content. In a real case, you can use a more reliable check for HTML validity.
    if (isLast || this.htmlBuffer.trim().endsWith('</body>') || this.isValidHtml(this.htmlBuffer)) {
      this.updateEditorContent(this.htmlBuffer);
      // Optionally reset the buffer or leave it for subsequent updates
      // this.htmlBuffer = '';
    }
  }

  /**
   * Simple function to check the validity of HTML.
   * Here you can implement your own logic – for example, checking if all open tags are closed.
   */
  private isValidHtml(html: string): boolean {
    // Simple check: try parsing the HTML through DOMParser.
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, 'text/html');
    // If the <parsererror> tag is present, the HTML is invalid
    return !parsedDoc.querySelector('parsererror');
  }
}

// Example usage:
// const processor = new HtmlStreamProcessor(editor);
// processor.streamInsertHtmlChunk(receivedChunk, false);
// processor.streamInsertHtmlChunk(lastChunk, true);
