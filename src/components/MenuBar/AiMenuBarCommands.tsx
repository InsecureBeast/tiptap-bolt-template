import { Editor } from '@tiptap/react'
import { AlignJustify, Brackets, Check, Plus, Send, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import MenuButton from '../MenuButton'
import { AiCommandsService } from '../../services/ai-commands.service'
import MenuBarDropDown, { IDropdownItem } from './MenuBarDropDown'
import CustomAdaptationDialog from '../CustomAdaptationDialog/CustomAdaptationDialog'
import { AdaptationRule, AdaptationRulesService } from '../../services/adaptation-rules.service'

interface AiCommandsProps {
  editor: Editor,
  onAIQueryToggle: () => void
}

export default function AiMenuBarCommands({ editor, onAIQueryToggle }: AiCommandsProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [isStructuring, setIsStructuring] = useState(false)
  const [isAdapting, setIsAdapting] = useState(false)
  const [isCustomAdaptationDialogOpen, setIsCustomAdaptationDialogOpen] = useState(false)
  const [savedAdaptationRules, setSavedAdaptationRules] = useState<AdaptationRule[]>([])

  useEffect(() => {
    const rules = AdaptationRulesService.getAdaptationRules()
    setSavedAdaptationRules(rules)
  }, [])

  const handleSpellCheck = async () => {
    if (isChecking) 
      return;
    
    await AiCommandsService.checkSpelling(editor, {
      onStart: () => setIsChecking(true),
      onFinish: () => setIsChecking(false),
      onError: () => setIsChecking(false)
    });
  }

  const handleStructureText = async () => {
    if (isStructuring) 
      return;
    
    await AiCommandsService.structureTheText(editor, {
      onStart: () => setIsStructuring(true),
      onFinish: () => setIsStructuring(false),
      onError: () => setIsStructuring(false)
    });
  }

  const adaptItems: IDropdownItem[] = [
    { id: "telegram", title: 'Телеграм', icon: Send },
    { id: "vc", title: 'vc.ru', icon: Brackets },
    ...savedAdaptationRules.map(rule => ({
      id: `${rule.id}`,
      title: rule.name,
      icon: Brackets
    })),
    { 
      id: 'create_rule', 
      title: 'Создать правила', 
      icon: Plus 
    }
  ];

  const handleAdaptTextAction = async (item: IDropdownItem) => {
    if (isAdapting) 
      return;

    try {
      setIsAdapting(true)
      
      switch (item.id) {
        case "telegram":
          await AiCommandsService.adaptContentTelegram(editor, {
            onStart: () => setIsAdapting(true),
            onFinish: () => setIsAdapting(false),
            onError: () => setIsAdapting(false)
          });
          break
        case "vc":
          await AiCommandsService.adaptContentVcru(editor, {
            onStart: () => setIsAdapting(true),
            onFinish: () => setIsAdapting(false),
            onError: () => setIsAdapting(false)
          });
          break
          case 'create_rule':
            setIsCustomAdaptationDialogOpen(true)
            setIsAdapting(false)
            break
          default:
            const rule = savedAdaptationRules.find(r => r.id === item.id)
            if (rule) {
              await AiCommandsService.adaptContentCustom(editor, rule.rules, {
                onStart: () => setIsAdapting(true),
                onFinish: () => setIsAdapting(false),
                onError: () => setIsAdapting(false)
              })
            }
            break
      }
    } catch (error) {
      console.error('Error processing AI request:', error)
      setIsAdapting(false)
    }
  };

  const handleCustomAdaptationCreate = (rule: AdaptationRule) => {
    const rules = AdaptationRulesService.getAdaptationRules()
    setSavedAdaptationRules(rules)
    setIsCustomAdaptationDialogOpen(false)
  }

  return (
    <div className="flex items-center gap-1">
      <MenuButton
        key="ai-query"
        icon={Sparkles}
        onClick={onAIQueryToggle}
        isActive={false}
        index={20}
        tooltip="AI Запрос"
      />

      <MenuButton
        key="spell-check"
        icon={Check}
        onClick={handleSpellCheck}
        isActive={isChecking}
        isLoading={isChecking}
        disabled={editor.getText().length == 0}
        index={21}
        tooltip="Проверить на ошибки"
      />

      <MenuButton
        key="structure-text"
        icon={AlignJustify}
        onClick={handleStructureText}
        isActive={isStructuring}
        isLoading={isStructuring}
        disabled={!editor.state.selection.empty || editor.getText().length == 0}
        index={22}
        tooltip="Структурировать текст"
      />

      <MenuBarDropDown
        items={adaptItems}
        isActive={isAdapting}
        selectId={1}
        onSelect={handleAdaptTextAction}
        title="Адаптация текста"
        isChangeSelected={false}
        icon={Brackets}
        isLoading={isAdapting}
        hasSubMenu={false}
        isDisabled={!editor.state.selection.empty || editor.getText().length == 0}
      />

      <CustomAdaptationDialog 
        isOpen={isCustomAdaptationDialogOpen}
        onClose={() => setIsCustomAdaptationDialogOpen(false)}
        onCreate={handleCustomAdaptationCreate}
      />
    </div>
  )
}
