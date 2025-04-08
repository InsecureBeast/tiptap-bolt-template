import { useState } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';

const steps = [
  {
    target: '.tiptap',
    content: `Напишите сюда черновик или идею…"`,
    disableBeacon: true,
  },
  {
    target: '#editorToolbar',
    content: 'Добавьте текст, оформите списки, заголовки или ссылки.',
  },
  
];

export default function Onboarding() {
  const [run, setRun] = useState(true);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#8b5cf6',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          textColor: '#374151',
        },
        tooltip: {
          padding: '20px',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        buttonNext: {
          backgroundColor: '#8b5cf6',
          fontSize: '14px',
          padding: '8px 16px',
          borderRadius: '6px',
          color: '#ffffff',
          fontWeight: '500'
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: '8px',
          fontSize: '14px',
          padding: '8px 16px',
          fontWeight: '500'
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: '14px',
          fontWeight: '500'
        },
        buttonClose: {
          color: '#6b7280',
          fontSize: '14px',
          fontWeight: '500'
        }
      }}
      locale={{
        back: 'Назад',
        close: 'Закрыть',
        last: 'Завершить',
        next: 'Далее',
        skip: 'Пропустить',
        nextLabelWithProgress: 'Далее (Шаг {step} из {steps})'
      }}
    />
  );
}