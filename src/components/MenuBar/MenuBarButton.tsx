import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface IMenuBarButtonProps {
  index: number;
  onClick: () => void;
  isActive: boolean;
  title: string;
  icon: LucideIcon;
}

const MenuBarButton: React.FC<IMenuBarButtonProps> = ({ index, onClick, isActive, title, icon: Icon}) => {
  return (
    <button
      key={`${index}`}
      onClick={onClick}
      title={title}
      className={`
      p-2 rounded-md transition-all duration-200 flex items-center justify-center
        ${
          isActive
          ? 'bg-violet-200 '
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
        }
      `}
    >
      <Icon size={16} className={`text-gray-600`}/>
    </button>
  );
};

export default MenuBarButton;