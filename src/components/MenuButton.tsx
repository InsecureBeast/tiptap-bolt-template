import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface IMenuButtonProps {
  index: number;
  onClick: () => void;
  isActive: boolean;
  icon: LucideIcon;
  tooltip: string;
  title?: string;
}

const MenuButton: React.FC<IMenuButtonProps> = ({ index, onClick, isActive, title, icon: Icon, tooltip}) => {
  return (
    <button
      key={`${index}`}
      onClick={onClick}
      title={tooltip}
      className={`
      p-2 rounded-md transition-all duration-200 flex items-center justify-center
        ${
          isActive
          ? 'bg-violet-200 '
          : 'bg-transparent text-gray-700 hover:bg-gray-200 active:bg-gray-300'
        }
      `}
    >
      <Icon size={20} className={`text-gray-600`}/>
      {title && <span className='text-nowrap text-sm ms-1'>{title}</span>}
    </button>
  );
};

export default MenuButton;