import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import { useState } from 'react'

interface StyleDialogProps {
  isOpen: boolean
  onClose: () => void
  onApply: (styleName: string, styleContent: string) => void
}

export default function StyleDialog({ isOpen, onClose, onApply }: StyleDialogProps) {
  const [styleName, setStyleName] = useState('')
  const [styleContent, setStyleContent] = useState('')

  const handleApply = () => {
    onApply(styleName, styleContent)
    setStyleName('')
    setStyleContent('')
    onClose()
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
              className="w-full rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold
                       text-white shadow-sm hover:bg-violet-600 focus:outline-none
                       focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              Применить
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
