import { Editor } from '@tiptap/react';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';

export class HtmlStreamProcessor {
  private _htmlBuffer: string = '';
  private _isEmpty: boolean = false;

  constructor(private editor: Editor) {
    this._isEmpty = this.editor.state.selection.empty;
  }

  /**
   * Updates the editor content from the buffer within a specified range.
   * @param html The HTML content to insert.
   * @param from The starting position in the document.
   * @param to The ending position in the document.
   */
  private updateEditorContent(html: string, from: number): void {
    // Clean the received HTML from unnecessary markers (e.g., markdown blocks with ```html)
    html = html.replace(/```html|```|\*/g, "");

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const slice = ProseMirrorDOMParser
      .fromSchema(this.editor.schema)
      .parseSlice(doc.body);

    let ffrom = 0;
    let to = this.editor.view.state.doc.content.size;
    if (!this._isEmpty) {
      ffrom = from
      to = ffrom + this._htmlBuffer.length;
    }
    
    if (to > this.editor.view.state.doc.content.size)
      to = this.editor.view.state.doc.content.size;

    const transaction = this.editor.view.state.tr
      .replaceRange(ffrom, to, slice);

    this.editor.view.dispatch(transaction);
  }

  /**
   * Inserts an HTML chunk into the editor's content stream. The method appends the provided
   * HTML chunk to an internal buffer and updates the editor content when the stream is complete
   * or the buffer contains valid HTML.
   *
   * @param htmlChunk - The HTML string chunk to be inserted into the editor.
   * @param from - The starting position in the editor's document where the content should be replaced. Defaults to 0.
   * @param to - The ending position in the editor's document where the content should be replaced. Defaults to the document's size.
   * @param isLast - A boolean flag indicating whether this is the last chunk in the stream. If true, the editor content will be updated regardless of the buffer's state.
   */
  public streamInsertHtmlChunk(htmlChunk: string, from: number = 0, isLast: boolean = false): void {
    // Add the new chunk to the buffer
    this._htmlBuffer += htmlChunk;

    // Example simple check: if the stream is complete, or the buffer ends with a closing body tag,
    // update the editor content. In a real case, you can use a more reliable check for HTML validity.
    if (isLast || this._htmlBuffer.trim().endsWith('</body>') || this.isValidHtml(this._htmlBuffer)) {
      this.updateEditorContent(this._htmlBuffer, from);
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
