import { Tool } from 'openai/resources/responses/responses.mjs'
import { openai } from '../config/openai'
import { Editor } from '@tiptap/react'

interface StreamTextOptions {
  prompt: string
  systemPrompt: string
  editor: Editor
  selection: { from: number; to: number } | undefined
  storeId?: string | null,
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

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';

      if (selection) {
      editor.chain()
        .focus()
        .insertContent(content, { updateSelection: true })
        .run()
      } else {
      editor.chain()
        .focus()
        .insertContent(content, { updateSelection: true })
        .run()
      }

      // Add a small delay to simulate rendering before processing the next chunk
      await new Promise(resolve => setTimeout(resolve, 5))
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

export async function streamResponseText({
  prompt,
  systemPrompt,
  editor,
  selection,
  storeId,
  onStart,
  onFinish,
  onError
}: StreamTextOptions) {
  try {
    onStart?.()

    let tools: Tool[] = []
    if (storeId) {
      tools.push({
        "type": "file_search",
        "vector_store_ids": [storeId],
        "max_num_results": 20
      })
    }

    const stream = await openai.responses.create({
      model:"gpt-4o",
      input: prompt,
      instructions: systemPrompt,
      tools: tools,
      temperature: 0.7,
      max_output_tokens: 4000,
      stream: true
    })

    for await (const chunk of stream) {
      const content = 'delta' in chunk ? chunk.delta : '';
      if (selection) {
      editor.chain()
        .focus()
        .insertContent(content, { updateSelection: true })
        .run()
      } else {
      editor.chain()
        .focus()
        .insertContent(content, { updateSelection: true })
        .run()
      }

      // Add a small delay to simulate rendering before processing the next chunk
      await new Promise(resolve => setTimeout(resolve, 5))
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
