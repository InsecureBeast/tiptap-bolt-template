import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";

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
}

const MenuBarDropDown: React.FC<IDropDownProps> = ({ items, onSelect, isActive, selectId }) => {
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
    console.log("Selected item changed:", selectedItem);
    console.log("Select ID changed:", selectId);
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
                  focus:outline-none focus:ring-2 focus:ring-blue-300
                  ${isActive ? "bg-blue-500 text-white" : "bg-white text-gray-700"}`
                }
      >
        {selectedItem ? (
          <span className="mr-2">
            <selectedItem.icon size={16} />
          </span>
        ) : (
          <span className="mr-2 text-sm font-medium text-gray-700"></span>
        )}
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden w-48">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-2 flex items-center hover:bg-gray-100 transition-colors duration-200 
                ${selectedItem?.id === item.id ? "bg-blue-50 text-blue-800" : "text-gray-700"}`}
            >
              <span className="mr-2">
                <item.icon size={16} />
              </span>
              {item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuBarDropDown;



// import { ChevronDown } from "lucide-react";
// import { useRef, useState } from "react";

// interface HeadingDropdownProps {
//   openDropdown: 'none' | 'heading' | 'list'
//   toggleDropdown: (dropdown: 'heading' | 'list') => void
//   selectedHeading: { level: number; title: string; icon: React.ComponentType }
//   HeadingLevels: { level: number; title: string; icon: React.ComponentType }[]
//   handleHeadingSelect: (heading: { level: number; title: string; icon: React.ComponentType }) => void
// }

// const HeadingDropdown: React.FC<HeadingDropdownProps> = ({
//   openDropdown,
//   HeadingLevels,
// }) => {
//   const headingRef = useRef<HTMLDivElement>(null)

//   const [selectedHeading, setSelectedHeading] = useState(HeadingLevels[0])

//   return (
//     <div className="relative" ref={headingRef}>
//       <button
//         onClick={() => toggleDropdown('heading')}
//         className="
//           flex items-center p-2 rounded-md 
//           hover:bg-gray-100 transition-colors
//           focus:outline-none focus:ring-2 focus:ring-blue-300
//         "
//       >
//         <span className="mr-2 text-sm font-medium text-gray-700 flex items-center">
//           <selectedHeading.icon size={16} className="mr-1" />
//         </span>
//         <ChevronDown
//           size={16}
//           className="text-gray-500 group-hover:text-gray-700 transition-colors"
//         />
//       </button>

//       {openDropdown === 'heading' && (
//         <div
//           className="
//             absolute top-full left-0 mt-1 
//             bg-white border border-gray-200 rounded-md shadow-lg 
//             overflow-hidden w-48
//           "
//         >
//           {HeadingLevels.map((heading) => (
//             <button
//               key={heading.level}
//               onClick={() => handleHeadingSelect(heading)}
//               className={`
//                 w-full text-left px-4 py-2 flex items-center
//                 hover:bg-gray-100 
//                 transition-colors duration-200
//                 ${selectedHeading.level === heading.level 
//                   ? 'bg-blue-50 text-blue-800' 
//                   : 'text-gray-700'}
//               `}
//             >
//               <heading.icon size={16} className="mr-2" />
//               {heading.title}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   )

//   const handleHeadingSelect = (heading: typeof HeadingLevels[number]) => {
//     setSelectedHeading(heading)
//     setOpenDropdown('none')
    
//     if (heading.level === 0) {
//       editor.chain().focus().setParagraph().run()
//     } else {
//       editor.chain().focus().toggleHeading({ level: heading.level }).run()
//     }
//   }

//   const toggleDropdown = (dropdown: 'heading' | 'list') => {
//     setOpenDropdown(prev => prev === dropdown ? 'none' : dropdown)
//   }
// }

// export default HeadingDropdown