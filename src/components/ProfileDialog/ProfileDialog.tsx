import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Link2, Upload, X } from 'lucide-react'
import { useState, useRef } from 'react'
import LoadingSpinner from '../Spiner'

interface ProfileDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileDialog({ isOpen, onClose }: ProfileDialogProps) {
  const [profileName, setProfileName] = useState('')
  const [profileContent, setProfileContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasExistingProfile = false // TODO: implement profile check

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('border-violet-500')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-violet-500')
  }

  const handleDropAreaClick = () => {
    fileInputRef.current?.click()
  }

  const handleApply = async () => {
    if (!profileName || !profileContent) return

    setIsLoading(true)
    try {
      // TODO: implement AI call
      await new Promise(resolve => setTimeout(resolve, 1500)) // Temporary simulation
      onClose()
    } catch (error) {
      console.error('Error processing profile:', error)
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
              {hasExistingProfile ? 'Мой профиль' : 'Новый профиль'}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none 
                       focus:text-violet-500 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Profile Name Input */}
            <div className="space-y-2">
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Название профиля"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         placeholder-gray-400 focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Profile Content */}
            <div className="space-y-2">
              <textarea
                value={profileContent}
                onChange={(e) => setProfileContent(e.target.value)}
                placeholder="Введите свой текст"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         placeholder-gray-400 focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* File Upload Area */}
            <div
              onClick={handleDropAreaClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center
                       transition-colors duration-200 cursor-pointer
                       hover:border-violet-500 hover:bg-violet-50"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <label className="text-sm text-gray-600">
                  Перетащите фото, видео или аудио
                </label>
                <p className="text-xs text-gray-400">
                  Или выберете файлы на компьютере
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />
              </div>
            </div>

            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5
                             text-sm text-gray-700"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(file)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Link Button */}
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-600 
                       bg-gray-100 hover:bg-gray-200 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link2 size={16} />
              <span>Добавить ссылки</span>
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                Soon
              </span>
            </button>
          </div>

          <div className="p-4">
            <button
              onClick={handleApply}
              disabled={!profileName || !profileContent || isLoading}
              className="w-full rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold
                       text-white shadow-sm hover:bg-violet-600 focus:outline-none
                       focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Применить...</span>
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
