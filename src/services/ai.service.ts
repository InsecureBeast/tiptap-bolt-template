import { openai } from '../config/openai'
import { Editor } from '@tiptap/react'

interface StreamTextOptions {
  prompt: string
  systemPrompt: string
  editor: Editor
  selection: { from: number; to: number } | undefined
  onStart?: () => void
  onFinish?: () => void
  onError?: (error: Error) => void
}

export async function streamText({
  prompt,
  systemPrompt,
  editor,
  selection,
  onStart,
  onFinish,
  onError
}: StreamTextOptions) {
  try {
    onStart?.()

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: true,
    })

    let accumulatedText = ''
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      accumulatedText += content
      
      if (selection)
        editor.chain()
          .focus()
          .setTextSelection(selection)
          .insertContent(accumulatedText, { updateSelection: true})
          .run()
      else 
      editor.chain()
            .focus()
            .insertContent(accumulatedText, { updateSelection: true})
            .run()
    }

    onFinish?.()
  } catch (error) {
    console.error('Error processing AI request:', error)
    if (selection)
      editor.chain()
        .focus()
        .setTextSelection(selection)
        .insertContent('Ошибка при обработке запроса')
        .run()
    else
      editor.commands.setContent('Ошибка при обработке запроса')
    
    onError?.(error as Error)
  }
}

interface GenerateAiResponseOptions {
  prompt: string;
  systemPrompt: string;
}

export async function generateAiResponse(options: GenerateAiResponseOptions): Promise<string | null>  {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: options.systemPrompt
      },
      {
        role: 'user',
        content: options.prompt
      }
    ],
  });

  return response.choices[0].message.content;
}
