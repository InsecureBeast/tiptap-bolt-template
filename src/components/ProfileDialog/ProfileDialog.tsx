import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Link2, Upload, X, Star, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import LoadingSpinner from '../Spiner'
import { VectorStorageService, ProfileData } from '../../services/vector-storage.service'

export default function ProfileDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [profileName, setProfileName] = useState('')
  const [profileContent, setProfileContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [savedProfiles, setSavedProfiles] = useState<ProfileData[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Check if there are existing profiles
  const hasExistingProfile = savedProfiles.length > 0

  // Load profiles from localStorage when dialog opens
  useEffect(() => {
    if (isOpen) {
      const profiles = VectorStorageService.getSavedProfiles()
      setSavedProfiles(profiles)

      // If there are profiles, load the most recent or default one
      const defaultProfile = VectorStorageService.getDefaultProfile()
      if (defaultProfile) {
        setProfileName(defaultProfile.name)
        setProfileContent(defaultProfile.content)
      } else {
        // If no profiles, set default values
        setDefaultProfile()
      }
    }
  }, [isOpen])

  // Set default profile if no profiles exist
  const setDefaultProfile = () => {
    const defaultProfile = {
      name: 'Мой первый профиль',
      content: 'Введите описание вашего профиля здесь...'
    }
    
    setProfileName(defaultProfile.name)
    setProfileContent(defaultProfile.content)
  }

  const handleSetDefaultProfile = (profileName: string) => {
    VectorStorageService.setDefaultProfile(profileName)
    // Refresh profiles to update default status
    setSavedProfiles(VectorStorageService.getSavedProfiles())
  }

  const handleDeleteProfile = (profileName: string) => {
    // If only one profile exists, prevent deletion
    if (savedProfiles.length <= 1) {
      setError('Невозможно удалить последний профиль')
      return
    }

    // If profile is default, confirm deletion
    const profileToDelete = savedProfiles.find(p => p.name === profileName)
    if (profileToDelete?.isDefault) {
      setConfirmDelete(profileName)
      return
    }

    // Perform deletion
    VectorStorageService.deleteProfile(profileName)
    
    // Ensure a default profile exists
    VectorStorageService.ensureDefaultProfile()

    // Refresh profiles
    const updatedProfiles = VectorStorageService.getSavedProfiles()
    setSavedProfiles(updatedProfiles)

    // Load the new default profile
    const newDefaultProfile = VectorStorageService.getDefaultProfile()
    if (newDefaultProfile) {
      setProfileName(newDefaultProfile.name)
      setProfileContent(newDefaultProfile.content)
    }
  }

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      VectorStorageService.deleteProfile(confirmDelete)
      
      // Ensure a default profile exists
      VectorStorageService.ensureDefaultProfile()

      // Refresh profiles
      const updatedProfiles = VectorStorageService.getSavedProfiles()
      setSavedProfiles(updatedProfiles)

      // Load the new default profile
      const newDefaultProfile = VectorStorageService.getDefaultProfile()
      if (newDefaultProfile) {
        setProfileName(newDefaultProfile.name)
        setProfileContent(newDefaultProfile.content)
      }

      // Reset confirm delete state
      setConfirmDelete(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(prev => [...prev, ...droppedFiles])
    setError(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...selectedFiles])
      setError(null)
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
    // Validate inputs
    if (!profileName) {
      setError('Пожалуйста, введите название профиля')
      return
    }

    // Check if there are files or profile content
    if (files.length === 0 && !profileContent.trim()) {
      setError('Добавьте файлы или введите описание профиля')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create vector store
      const vectorStoreId = await VectorStorageService.createVectorStore(
        files, 
        profileContent
      )

      if (!vectorStoreId) {
        throw new Error('Не удалось создать векторное хранилище')
      }

      // Save profile data
      VectorStorageService.saveProfileData(
        profileName, 
        profileContent, 
        vectorStoreId
      )

      // Refresh saved profiles
      const updatedProfiles = VectorStorageService.getSavedProfiles()
      setSavedProfiles(updatedProfiles)

      // Reset form and close dialog
      setProfileName('')
      setProfileContent('')
      setFiles([])
      onClose()
    } catch (error) {
      console.error('Error processing profile:', error)
      setError(error instanceof Error 
        ? error.message 
        : 'Произошла ошибка при обработке профиля'
      )
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

          {error && (
            <div className="px-4 pb-2">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          )}

          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Profile Name Input */}
            <div className="space-y-2">
              <input
                type="text"
                value={profileName}
                onChange={(e) => {
                  setProfileName(e.target.value)
                  setError(null)
                }}
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
                onChange={(e) => {
                  setProfileContent(e.target.value)
                  setError(null)
                }}
                placeholder="Введите описание профиля"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         placeholder-gray-400 focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Existing Profiles Section */}
            {savedProfiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Существующие профили:
                </label>
                <div className="flex flex-wrap gap-2">
                  {savedProfiles.map((profile, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 bg-gray-100 hover:bg-violet-100 
                                 rounded-md px-3 py-1.5 text-sm text-gray-700 transition-colors"
                    >
                      <button
                        onClick={() => {
                          setProfileName(profile.name)
                          setProfileContent(profile.content)
                        }}
                        className="flex-grow text-left"
                      >
                        {profile.name}
                      </button>
                      <button
                        onClick={() => handleSetDefaultProfile(profile.name)}
                        className={`
                          ${profile.isDefault ? 'text-yellow-500' : 'text-gray-400'}
                          hover:text-yellow-600 transition-colors
                        `}
                        title="Установить профиль по умолчанию"
                      >
                        <Star size={16} fill={profile.isDefault ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => handleDeleteProfile(profile.name)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Удалить профиль"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              disabled={!profileName || (!files.length && !profileContent.trim()) || isLoading}
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

          {/* Confirm Delete Modal */}
          {confirmDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">Удаление профиля по умолчанию</h2>
                <p className="mb-4">
                  Вы собираетесь удалить профиль по умолчанию. Это приведет к установке 
                  другого профиля по умолчанию. Продолжить?
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
