import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generateAiResponse } from '../../services/ai.service'
import { prompt as stylePrompt } from '../../prompts/style.prompt'
import LoadingSpinner from '../Spiner'

interface StyleDialogProps {
  isOpen: boolean
  onClose: () => void
  onApply: (styleName: string, styleContent: string) => void
}

export interface SavedStyle {
  name: string
  content: string
  tov?: string
}

export default function StyleDialog({ isOpen, onClose, onApply }: StyleDialogProps) {
  const [styleName, setStyleName] = useState('')
  const [styleContent, setStyleContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const savedStyles = localStorage.getItem('savedStyles')
      if (savedStyles) {
        const styles = JSON.parse(savedStyles) as SavedStyle[]
        if (styles.length > 0) {
          const lastStyle = styles[styles.length - 1]
          setStyleName(lastStyle.name)
          setStyleContent(lastStyle.content)
        }
      }
    }
  }, [isOpen])

  const handleApply = async () => {
    if (!styleName || !styleContent) return

    setIsLoading(true)
    try {
      const tov = await generateAiResponse({
        systemPrompt: stylePrompt,
        prompt: styleContent
      })

      const newStyle = { 
        name: styleName, 
        content: styleContent,
        tov: tov || undefined
      }
      
      const savedStyles = localStorage.getItem('savedStyles')
      const styles = savedStyles ? JSON.parse(savedStyles) as SavedStyle[] : []
      const updatedStyles = [...styles, newStyle]
      localStorage.setItem('savedStyles', JSON.stringify(updatedStyles))
      
      onApply(styleName, styleContent)
      setStyleName('')
      setStyleContent('')
      onClose()
    } catch (error) {
      console.error('Error generating TOV:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between p-4">
            <DialogTitle className="text-lg font-medium text-gray-900">
              Стиль текста
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none 
                       focus:text-violet-500 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="styleName" className="block text-sm font-medium text-gray-700">
                Название стиля
              </label>
              <input
                type="text"
                id="styleName"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                placeholder="Введите название стиля..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         placeholder-gray-400 focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="styleContent" className="block text-sm font-medium text-gray-700">
                Стиль
              </label>
              <textarea
                id="styleContent"
                value={styleContent}
                onChange={(e) => setStyleContent(e.target.value)}
                placeholder="Введите стиль..."
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         placeholder-gray-400 focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={handleApply}
              disabled={!styleName || !styleContent || isLoading}
              className="w-full rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold
                       text-white shadow-sm hover:bg-violet-600 focus:outline-none
                       focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Обработка...</span>
                </>
              ) : (
                'Применить'
              )}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
