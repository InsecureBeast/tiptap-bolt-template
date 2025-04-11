import React, { useState } from 'react'
import { SendHorizontal, X } from 'lucide-react'
import { Editor } from '@tiptap/react'
import { AiCommandsService } from '../services/ai-commands.service'
import LoadingSpinner from './Spiner'

interface AIQueryInputProps {
  editor: Editor | null
  onClose: () => void
}

export default function AIQueryInput({ editor, onClose }: AIQueryInputProps) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendQuery = async () => {
    if (!editor || !query.trim()) return

    try {
      setIsLoading(true)
      await AiCommandsService.generateText(editor, {
        onStart: () => setIsLoading(true),
        onFinish: () => {
          setIsLoading(false)
          setQuery('')
        },
        onError: () => setIsLoading(false)
      }, query)  // Передаем запрос как дополнительный параметр
    } catch (error) {
      console.error('Error sending AI query:', error)
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendQuery()
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 flex items-center p-2">
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-gray-100 rounded-full mr-2"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <textarea 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите запрос для ИИ..."
          className="flex-grow resize-none h-20 p-2 rounded-md border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-violet-500 
                     text-sm transition-all duration-200"
          rows={3}
        />

        <div className="flex flex-col ml-2">
          <button 
            onClick={handleSendQuery}
            disabled={!query.trim() || isLoading}
            className="p-2 bg-violet-500 text-white rounded-full 
                       hover:bg-violet-600 disabled:opacity-50 
                       flex items-center justify-center mb-2"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <SendHorizontal size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
