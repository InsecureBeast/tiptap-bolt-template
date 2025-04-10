import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import LoadingSpinner from "../Spiner";

export interface IDropdownItem {
  id: number;
  title: string;
  icon: LucideIcon;
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
}

const MenuBarDropDown: React.FC<IDropDownProps> = ({ 
  items, 
  onSelect, 
  isActive, 
  selectId, 
  title, 
  isChangeSelected, 
  icon: Icon,
  isLoading = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
    setSelectedItem(item);
    onSelect(item);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isChangeSelected)
      return;

    if (selectedItem)
      setSelectedItem(selectedItem);
    else 
      setSelectedItem(items[0]);

  }, [selectId, items]);

  return (
    <div className="" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors 
                  focus:outline-none
                  ${isActive ? "bg-violet-200 text-white" : "bg-white text-gray-700"}`
                }
      >
        { isChangeSelected && selectedItem ? (
          <span className="mr-2">
            <selectedItem.icon size={20} />
          </span>
        ) : (
          <>
            <span className="mr-2">
              {isLoading ? <LoadingSpinner /> : <Icon size={20} />}
            </span>
            {title && <span className="text-sm text-gray-700">{title}</span>}
          </>
        )}

        <ChevronDown size={20} className="text-gray-500 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden w-64">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-2 flex items-center hover:bg-gray-100 transition-colors duration-200 
                ${isChangeSelected && selectedItem?.id === item.id ? "bg-violet-200" : "text-gray-700"}`}
            >
              <span className="mr-2"><item.icon size={16} /></span>
              <span className="text-nowrap">{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuBarDropDown;
