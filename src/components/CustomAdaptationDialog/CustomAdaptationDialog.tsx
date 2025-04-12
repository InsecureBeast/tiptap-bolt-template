import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { X, Edit, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AdaptationRulesService, AdaptationRule } from '../../services/adaptation-rules.service'

interface CustomAdaptationDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (rule: AdaptationRule) => void
}

export default function CustomAdaptationDialog({ 
  isOpen, 
  onClose, 
  onCreate 
}: CustomAdaptationDialogProps) {
  const [ruleName, setRuleName] = useState('')
  const [adaptationRules, setAdaptationRules] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [savedRules, setSavedRules] = useState<AdaptationRule[]>([])
  const [selectedRule, setSelectedRule] = useState<AdaptationRule | null>(null)

  useEffect(() => {
    if (isOpen) {
      const rules = AdaptationRulesService.getAdaptationRules()
      setSavedRules(rules)

      // Всегда сбрасываем поля при открытии
      setRuleName('')
      setAdaptationRules('')
      setSelectedRule(null)
    }
  }, [isOpen])

  const handleCreate = () => {
    if (!ruleName.trim()) {
      setError('Пожалуйста, введите название правил')
      return
    }

    if (!adaptationRules.trim()) {
      setError('Пожалуйста, введите правила адаптации')
      return
    }

    if (adaptationRules.length > 10000) {
      setError('Максимальная длина правил - 10 000 символов')
      return
    }

    const result = selectedRule 
      ? AdaptationRulesService.updateAdaptationRule(selectedRule.id, ruleName, adaptationRules)
      : AdaptationRulesService.saveAdaptationRule(ruleName, adaptationRules)

    if (result) {
      onCreate(result)
      setRuleName('')
      setAdaptationRules('')
      setSelectedRule(null)
      setError(null)
      setSavedRules(AdaptationRulesService.getAdaptationRules())
    } else {
      setError('Достигнут лимит правил (максимум 5)')
    }
  }

  const handleRuleSelect = (rule: AdaptationRule) => {
    setSelectedRule(rule)
    setRuleName(rule.name)
    setAdaptationRules(rule.rules)
  }

  const handleResetSelection = () => {
    setSelectedRule(null)
    setRuleName('')
    setAdaptationRules('')
  }

  const handleDeleteRule = (id: string) => {
    AdaptationRulesService.deleteAdaptationRule(id)
    setSavedRules(AdaptationRulesService.getAdaptationRules())
    
    if (selectedRule?.id === id) {
      setSelectedRule(null)
      setRuleName('')
      setAdaptationRules('')
    }
  }

  // Определяем заголовок диалога динамически
  const dialogTitle = selectedRule 
    ? `Редактирование правил: ${selectedRule.name}` 
    : 'Создание правил адаптации'

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white shadow-xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4">
            <DialogTitle className="text-lg font-medium text-gray-900">
              {dialogTitle}
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
            {/* Rule Name Input */}
            <div className="space-y-2">
              <input
                type="text"
                value={ruleName}
                onChange={(e) => {
                  setRuleName(e.target.value)
                  setError(null)
                }}
                placeholder="Название правил адаптации"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm 
                         placeholder-gray-400 focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Rule Content */}
            <div className="space-y-2">
              <textarea
                value={adaptationRules}
                onChange={(e) => {
                  setAdaptationRules(e.target.value)
                  setError(null)
                }}
                placeholder="Вставь сюда правила написания и оформления текста на площадке"
                rows={6}
                maxLength={10000}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                         placeholder-gray-400 focus:border-violet-500 focus:outline-none
                         focus:ring-1 focus:ring-violet-500"
              />
              <div className="text-xs text-gray-500 text-right">
                {adaptationRules.length} / 10 000
              </div>
            </div>

            {/* Existing Rules Section */}
            {savedRules.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Существующие правила:
                </label>
                <div className="flex flex-wrap gap-2">
                  {savedRules.map((rule) => (
                    <div 
                      key={rule.id} 
                      className={`flex items-center gap-2 
                        ${selectedRule?.id === rule.id 
                          ? 'bg-violet-200' 
                          : 'bg-gray-100 hover:bg-violet-100'} 
                        rounded-md px-3 py-1.5 text-sm text-gray-700 transition-colors`}
                    >
                      <button
                        onClick={() => handleRuleSelect(rule)}
                        className="flex-grow text-left"
                      >
                        {rule.name}
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Удалить правила"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex space-x-2">
            {selectedRule && (
              <button
                onClick={handleResetSelection}
                className="flex-grow rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold
                         text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none
                         focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Отменить выбор
              </button>
            )}
            <button
              onClick={handleCreate}
              disabled={!ruleName.trim() || !adaptationRules.trim()}
              className="flex-grow rounded-md bg-violet-500 px-3 py-2 text-sm font-semibold
                       text-white shadow-sm hover:bg-violet-600 focus:outline-none
                       focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedRule ? 'Обновить правила' : 'Создать правила'}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
