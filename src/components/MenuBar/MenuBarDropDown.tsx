import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import LoadingSpinner from "../Spiner";

export interface IDropdownItem {
  id: number;
  title: string;
  icon: LucideIcon;
  subItems?: IDropdownItem[];
}

interface IDropDownProps {
  items: IDropdownItem[];
  isActive: boolean;
  selectId: any;
  onSelect: (item: IDropdownItem) => void;
  title: string | undefined;
  isChangeSelected: boolean;
  icon: LucideIcon;
  isLoading?: boolean;
  hasSubMenu?: boolean;
}

const MenuBarDropDown: React.FC<IDropDownProps> = ({ 
  items, 
  onSelect, 
  isActive, 
  selectId, 
  title, 
  isChangeSelected, 
  icon: Icon,
  isLoading = false,
  hasSubMenu = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<IDropdownItem | null>(() => {
    if (selectId) {
      const preselectedItem = items.find((item) => {
        if (typeof selectId === "object" && "level" in selectId) {
          return item.id === selectId.level;
        }
        return item.id === selectId;
      });
      return preselectedItem || null;
    }
    return null;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (item: IDropdownItem) => {
    if (item.subItems) {
      // If item has subitems, open submenu
      setActiveSubMenu(item.id);
    } else {
      // If no subitems, select the item
      setSelectedItem(item);
      onSelect(item);
      setIsOpen(false);
    }
  }

  const handleSubItemSelect = (subItem: IDropdownItem) => {
    setSelectedItem(subItem);
    onSelect(subItem);
    setIsOpen(false);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setActiveSubMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors 
                  focus:outline-none
                  ${isActive ? "bg-violet-200 text-white" : "bg-white text-gray-700"}`
                }
      >
        <span className="mr-2">
          {isLoading ? <LoadingSpinner /> : <Icon size={20} />}
        </span>
        {title && <span className="text-sm text-gray-700 text-nowrap">{title}</span>}
        <ChevronDown size={20} className="text-gray-500 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-64 z-50">
          {items.map((item) => (
            <div 
              key={item.id}
              className="relative group"
            >
              <button
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 
                  ${activeSubMenu === item.id ? "bg-violet-50" : "text-gray-700"}`}
                onMouseEnter={() => hasSubMenu && setActiveSubMenu(item.id)}
              >
                <div className="flex items-center">
                  <span className="mr-2"><item.icon size={16} /></span>
                  <span className="text-nowrap">{item.title}</span>
                </div>
                {item.subItems && <ChevronRight size={16} className="text-gray-400" />}
              </button>

              {/* Submenu */}
              {hasSubMenu && item.subItems && (
                <div 
                  className={`
                    absolute top-0 left-full bg-white border border-gray-200 
                    rounded-md shadow-lg overflow-hidden w-64 z-50
                    ${activeSubMenu === item.id ? 'block' : 'hidden'}
                    group-hover:block
                  `}
                >
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleSubItemSelect(subItem)}
                      className="w-full text-left px-4 py-2 flex items-center hover:bg-gray-100 transition-colors duration-200 text-gray-700"
                    >
                      <span className="mr-2"><subItem.icon size={16} /></span>
                      <span className="text-nowrap">{subItem.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuBarDropDown;
