import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X, Star, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generateAiResponse } from '../../services/ai.service'
import { prompt as stylePrompt } from '../../prompts/style.prompt'
import LoadingSpinner from '../Spiner'
import { StyleService, SavedStyle } from '../../services/style.service'

interface StyleDialogProps {
  isOpen: boolean
  onClose: () => void
  onApply: (styleName: string, styleContent: string) => void
}

export default function StyleDialog({ isOpen, onClose, onApply }: StyleDialogProps) {
  const [styleName, setStyleName] = useState('')
  const [styleContent, setStyleContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [savedStyles, setSavedStyles] = useState<SavedStyle[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if there are existing styles
  const hasExistingStyle = savedStyles.length > 0

  // Load styles from localStorage when dialog opens
  useEffect(() => {
    if (isOpen) {
      const styles = StyleService.getSavedStyles()
      setSavedStyles(styles)

      // If there are styles, load the most recent or default one
      const defaultStyle = StyleService.getDefaultStyle()
      if (defaultStyle) {
        setStyleName(defaultStyle.name)
        setStyleContent(defaultStyle.content)
      } else {
        // If no styles, set default values
        setDefaultStyle()
      }
    }
  }, [isOpen])

  // Set default style if no styles exist
  const setDefaultStyle = () => {
    const defaultStyle = {
      name: '',
      content: ''
    }
    
    setStyleName(defaultStyle.name)
    setStyleContent(defaultStyle.content)
  }

  const handleSetDefaultStyle = (styleName: string) => {
    StyleService.setDefaultStyle(styleName)
    // Refresh styles to update default status
    setSavedStyles(StyleService.getSavedStyles())
  }

  const handleDeleteStyle = (styleName: string) => {
    // If style is default, confirm deletion
    const styleToDelete = savedStyles.find(s => s.name === styleName)
    if (styleToDelete?.isDefault) {
      setConfirmDelete(styleName)
      return
    }

    // Perform deletion
    StyleService.deleteStyle(styleName)
    
    // Ensure a default style exists
    StyleService.ensureDefaultStyle()

    // Refresh styles
    const updatedStyles = StyleService.getSavedStyles()
    setSavedStyles(updatedStyles)

    // Load the new default style
    const newDefaultStyle = StyleService.getDefaultStyle()
    if (newDefaultStyle) {
      setStyleName(newDefaultStyle.name)
      setStyleContent(newDefaultStyle.content)
    }
  }

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      StyleService.deleteStyle(confirmDelete)
      
      // Ensure a default style exists
      StyleService.ensureDefaultStyle()

      // Refresh styles
      const updatedStyles = StyleService.getSavedStyles()
      setSavedStyles(updatedStyles)

      // Load the new default style
      const newDefaultStyle = StyleService.getDefaultStyle()
      if (newDefaultStyle) {
        setStyleName(newDefaultStyle.name)
        setStyleContent(newDefaultStyle.content)
      }

      // Reset confirm delete state
      setConfirmDelete(null)
    }
  }

  const handleApply = async () => {
    // Validate inputs
    if (!styleName) {
      setError('Пожалуйста, введите название стиля')
      return
    }

    // Check if style content exists
    if (!styleContent.trim()) {
      setError('Введите текст для определения стиля')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const tov = await generateAiResponse({
        systemPrompt: stylePrompt,
        prompt: styleContent
      })

      // Save style data
      StyleService.saveStyle(
        styleName, 
        styleContent,
        tov || undefined
      )

      // Refresh saved styles
      const updatedStyles = StyleService.getSavedStyles()
      setSavedStyles(updatedStyles)

      // Call onApply with style details
      onApply(styleName, styleContent)

      // Reset form and close dialog
      setStyleName('')
      setStyleContent('')
      onClose()
    } catch (error) {
      console.error('Error generating TOV:', error)
      setError('Произошла ошибка при обработке стиля')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white shadow-xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4">
            <DialogTitle className="text-lg font-medium text-gray-900">
              {hasExistingStyle ? 'Мой стиль' : 'Новый стиль'}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none 
                       focus:text-violet-500 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="px-4 pb-2">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}

          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Style Name Input */}
            <div className="space-y-2">
              <input
                type="text"
                value={styleName}
                onChange={(e) => {
                  setStyleName(e.target.value)
                  setError(null)
                }}
                placeholder="Введите название стиля..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         placeholder-gray-400 focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Style Content */}
            <div className="space-y-2">
              <textarea
                value={styleContent}
                onChange={(e) => {
                  setStyleContent(e.target.value)
                  setError(null)
                }}
                placeholder="Введите текст для определения стиля..."
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         placeholder-gray-400 focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Existing Styles Section */}
            {savedStyles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Существующие стили:
                </label>
                <div className="flex flex-wrap gap-2">
                  {savedStyles.map((style, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 bg-gray-100 hover:bg-violet-100 
                                 rounded-md px-3 py-1.5 text-sm text-gray-700 transition-colors"
                    >
                      <button
                        onClick={() => {
                          setStyleName(style.name)
                          setStyleContent(style.content)
                        }}
                        className="flex-grow text-left"
                      >
                        {style.name}
                      </button>
                      <button
                        onClick={() => handleSetDefaultStyle(style.name)}
                        className={`
                          ${style.isDefault ? 'text-yellow-500' : 'text-gray-400'}
                          hover:text-yellow-600 transition-colors
                        `}
                        title="Установить стиль по умолчанию"
                      >
                        <Star size={16} fill={style.isDefault ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => handleDeleteStyle(style.name)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Удалить стиль"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

          {/* Confirm Delete Modal */}
          {confirmDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">Удаление стиля по умолчанию</h2>
                <p className="mb-4">
                  Вы собираетесь удалить стиль по умолчанию. Это приведет к установке 
                  другого стиля по умолчанию. Продолжить?
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
