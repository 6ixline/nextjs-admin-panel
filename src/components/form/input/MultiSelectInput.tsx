import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

export interface Option {
  id: string | number;
  title: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: Option[];
  value?: Option[];
  onChange: (selectedOptions: Option[]) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  maxHeight?: number;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  closeOnSelect?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Select options...",
  searchable = true,
  disabled = false,
  maxHeight = 200,
  className = "",
  error,
  label,
  required = false,
  closeOnSelect = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if option is selected
  const isSelected = useCallback((option: Option) => {
    return value.some(selected => selected.id === option.id);
  }, [value]);

  // Handle option selection
  const handleSelect = useCallback((option: Option) => {
    if (option.disabled) return;

    const isCurrentlySelected = isSelected(option);
    let newValue: Option[];

    if (isCurrentlySelected) {
      newValue = value.filter(selected => selected.id !== option.id);
    } else {
      newValue = [...value, option];
    }

    onChange(newValue);
    
    if (closeOnSelect) {
      setIsOpen(false);
    }
    
    setSearchTerm("");
    setFocusedIndex(-1);
  }, [value, onChange, isSelected, closeOnSelect]);

  // Remove selected option
  const handleRemove = useCallback((optionToRemove: Option, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter(option => option.id !== optionToRemove.id);
    onChange(newValue);
  }, [value, onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      
      case 'Enter':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      
      case 'Backspace':
        if (!searchTerm && value.length > 0) {
          handleRemove(value[value.length - 1], e as any);
        }
        break;
    }
  }, [disabled, isOpen, focusedIndex, filteredOptions, handleSelect, searchTerm, value, handleRemove]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex, isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const baseClasses = `
    relative w-full min-h-[42px] px-3 py-2 bg-white dark:bg-gray-800 border rounded-md shadow-sm
    transition-colors duration-200 cursor-pointer
    ${disabled ? 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500'}
    ${error ? 'border-red-500 focus-within:ring-red-500 dark:border-red-400 dark:focus-within:ring-red-400' : 'border-gray-300 dark:border-gray-600 focus-within:ring-blue-500 dark:focus-within:ring-blue-400'}
    ${isOpen ? 'ring-2 ring-opacity-50' : ''}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div
        ref={containerRef}
        className={baseClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label || "Multi-select input"}
      >
        <div className="flex flex-wrap gap-1 items-center min-h-[26px]">
          {/* Selected options */}
          {value.map((option) => (
            <span
              key={option.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-md"
            >
              <span className="truncate max-w-[150px]">{option.title}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(option, e)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5 transition-colors"
                  aria-label={`Remove ${option.title}`}
                >
                  <X size={14} />
                </button>
              )}
            </span>
          ))}

          {/* Search input or placeholder */}
          <div className="flex-1 flex items-center min-w-[120px]">
            {searchable && isOpen ? (
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Search..."
                disabled={disabled}
              />
            ) : (
              <span className={`text-gray-500 dark:text-gray-400 ${value.length > 0 ? 'hidden sm:block' : ''}`}>
                {value.length === 0 ? placeholder : `${value.length} selected`}
              </span>
            )}
          </div>

          {/* Chevron icon */}
          <ChevronDown
            size={20}
            className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            } ${disabled ? 'opacity-50' : ''}`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg dark:shadow-xl z-50">
            <ul
              ref={listRef}
              className="py-1 overflow-auto"
              style={{ maxHeight: `${maxHeight}px` }}
              role="listbox"
              aria-multiselectable="true"
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-gray-500 dark:text-gray-400 text-center">
                  {searchTerm ? 'No options found' : 'No options available'}
                </li>
              ) : (
                filteredOptions.map((option, index) => {
                  const selected = isSelected(option);
                  const focused = index === focusedIndex;
                  
                  return (
                    <li
                      key={option.id}
                      className={`
                        px-3 py-2 cursor-pointer flex items-center justify-between transition-colors
                        ${focused ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                        ${selected ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200' : 'text-gray-900 dark:text-gray-100'}
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `.trim()}
                      onClick={() => handleSelect(option)}
                      role="option"
                      aria-selected={selected}
                    >
                      <span className="truncate">{option.title}</span>
                      {selected && <Check size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;