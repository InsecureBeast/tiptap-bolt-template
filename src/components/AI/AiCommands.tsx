import { Editor } from '@tiptap/react'
import { AlignJustify, Check, FileText } from 'lucide-react'
import { useState } from 'react'
import MenuButton from '../MenuButton'
import { AiCommandsService } from '../../services/ai-commands.service'

interface AiCommandsProps {
  editor: Editor
}

export default function AiCommands({ editor }: AiCommandsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isStructuring, setIsStructuring] = useState(false)

  const handleGenerateText = async () => {
    if (isGenerating) 
      return;
    
    await AiCommandsService.generateText(editor, {
      onStart: () => setIsGenerating(true),
      onFinish: () => setIsGenerating(false),
      onError: () => setIsGenerating(false)
    });
  }

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

  return (
    <div className="flex items-center gap-1">
      <MenuButton
        key="generate"
        icon={FileText}
        onClick={handleGenerateText}
        isActive={isGenerating}
        isLoading={isGenerating}
        index={20}
        tooltip=""
        title="Сгенерировать текст"
      />

      <MenuButton
        key="spell-check"
        icon={Check}
        onClick={handleSpellCheck}
        isActive={isChecking}
        isLoading={isChecking}
        index={21}
        tooltip="Проверить правописание"
      />

      <MenuButton
        key="structure-text"
        icon={AlignJustify}
        onClick={handleStructureText}
        isActive={isStructuring}
        isLoading={isStructuring}
        index={22}
        tooltip="Структурировать текст"
      />
    </div>
  )
}
