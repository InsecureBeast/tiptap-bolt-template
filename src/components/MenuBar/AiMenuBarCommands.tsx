import { Editor } from '@tiptap/react'
import { AlignJustify, Asterisk, Brackets, Check, Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import MenuButton from '../MenuButton'
import { AiCommandsService } from '../../services/ai-commands.service'
import MenuBarDropDown, { IDropdownItem } from './MenuBarDropDown'

interface AiCommandsProps {
  editor: Editor,
  onAIQueryToggle: () => void
}

export default function AiMenuBarCommands({ editor, onAIQueryToggle }: AiCommandsProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [isStructuring, setIsStructuring] = useState(false)
  const [isAdapting, setIsAdapting] = useState(false)

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
    { id: 1, title: 'Телеграм', icon: Send },
    { id: 2, title: 'vc.ru', icon: Asterisk },
  ];

  const handleAdaptTextAction = async (item: IDropdownItem) => {
    if (isAdapting) 
      return;

    try {
      setIsAdapting(true)
      
      switch (item.id) {
        case 1:
          await AiCommandsService.adaptContentTelegram(editor, {
            onStart: () => setIsAdapting(true),
            onFinish: () => setIsAdapting(false),
            onError: () => setIsAdapting(false)
          });
          break
        case 2:
          await AiCommandsService.adaptContentVcru(editor, {
            onStart: () => setIsAdapting(true),
            onFinish: () => setIsAdapting(false),
            onError: () => setIsAdapting(false)
          });
          break
        default:
          console.warn('Unknown AI action:', item.id);
      }
    } catch (error) {
      console.error('Error processing AI request:', error)
      setIsAdapting(false)
    }
  };

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
    </div>
  )
}
