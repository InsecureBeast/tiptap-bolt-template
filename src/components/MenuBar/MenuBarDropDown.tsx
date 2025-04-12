import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import LoadingSpinner from "../Spiner";

export interface IDropdownItem {
  id: string;
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
  icon: LucideIcon;
  isChangeSelected?: boolean;
  isLoading?: boolean;
  hasSubMenu?: boolean;
  isDisabled?: boolean;
}

const MenuBarDropDown: React.FC<IDropDownProps> = ({ 
  items, 
  onSelect, 
  isActive, 
  selectId, 
  title, 
  icon: Icon,
  isChangeSelected = true,
  isLoading = false,
  hasSubMenu = false,
  isDisabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
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
        disabled={isDisabled}
        className={`flex items-center  p-2 rounded-md transition-all duration-200 justify-center disabled:opacity-50 disabled:cursor-not-allowed
                  ${isActive ? "bg-violet-200" : "bg-transparent text-gray-700 hover:bg-gray-200 active:bg-gray-300"}`}
      >
        <span className="mr-2">
          {isLoading ? (
            <LoadingSpinner />
          ) : isChangeSelected && selectedItem ? (
            <selectedItem.icon size={20} />
          ) : (
            <Icon size={20} />
          )}
        </span>
        {isChangeSelected && selectedItem ? (
          <span className="text-sm text-gray-700 text-nowrap">{selectedItem.title}</span>
        ) : (
          title && <span className="text-sm text-gray-700 text-nowrap">{title}</span>
        )}
        <ChevronDown size={20} className="text-gray-500 ml-2" />
      </button>
      
      {/* Dropdown */}
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
