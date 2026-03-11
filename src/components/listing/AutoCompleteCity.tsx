import { getAllCities } from '@/services/cityServices';
import { City } from '@/validations/propertySchema';
import { useState, useEffect, useRef, forwardRef } from 'react';

// Omit conflicting properties from InputHTMLAttributes and add custom props
interface CityAutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSelect' | 'defaultValue'> {
  onSelect: (city: City | null) => void; // Allow null for clearing
  label?: string;
  error?: boolean;
  hint?: string;
  defaultValue: City | undefined;
}

const CityAutocomplete = forwardRef<HTMLInputElement, CityAutocompleteProps>(
  ({ onSelect, className, label, error, hint, defaultValue, ...inputProps }, ref) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<City[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const fetchCities = async () => {
        if (query.length < 2) {
          setResults([]);
          setShowDropdown(false);
          return;
        }

        try {
          const res = await getAllCities({ search: query, page : 1, limit : 10, sortBy: "name", order: "asc" });
          setResults(res.data);
          if (isFocused && res.data.length > 0) {
            setShowDropdown(true);
          }
        } catch (err) {
          console.error('Error fetching cities:', err);
          setResults([]);
          setShowDropdown(false);
        }
      };

      const timeout = setTimeout(fetchCities, 300); // debounce
      return () => clearTimeout(timeout);
    }, [query, isFocused]);

    useEffect(() => {
      if (defaultValue && !selectedCity) {
        setSelectedCity(defaultValue);
        setQuery(`${defaultValue.name}${defaultValue.state ? `, ${defaultValue.state}` : ''}`);
      }
    }, [defaultValue, selectedCity]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setShowDropdown(false);
          setIsFocused(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (city: City) => {
      setSelectedCity(city);
      onSelect(city);
      setQuery(`${city.name}${city.state ? `, ${city.state}` : ''}`);
      setShowDropdown(false);
      setIsFocused(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      
      // If user clears the input or types something different, clear the selection
      if (newQuery.length === 0 || (selectedCity && newQuery !== `${selectedCity.name}${selectedCity.state ? `, ${selectedCity.state}` : ''}`)) {
        setSelectedCity(null);
        onSelect(null); // Notify parent that selection is cleared
      }
      
      // Clear dropdown if query is too short
      if (newQuery.length < 2) {
        setResults([]);
        setShowDropdown(false);
      }

      // Call original onChange if provided
      if (inputProps.onChange) {
        inputProps.onChange(e);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Show dropdown if we already have results and query is long enough
      if (query.length >= 2 && results.length > 0) {
        setShowDropdown(true);
      }

      // Call original onFocus if provided
      if (inputProps.onFocus) {
        inputProps.onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Small delay to allow click on dropdown items
      setTimeout(() => {
        if (!containerRef.current?.contains(document.activeElement)) {
          setIsFocused(false);
          setShowDropdown(false);
        }
      }, 150);

      // Call original onBlur if provided
      if (inputProps.onBlur) {
        inputProps.onBlur(e);
      }
    };

    // Dropdown styles with dark mode support
    const dropdownStyles = `
      absolute top-full left-0 right-0 mt-1 z-[1000] max-h-[200px] overflow-y-auto
      bg-white dark:bg-gray-800 
      border border-gray-300 dark:border-gray-600 
      rounded-b-lg shadow-lg dark:shadow-xl
    `.trim();

    const dropdownItemStyles = `
      px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0
      text-gray-900 dark:text-gray-100
      hover:bg-gray-50 dark:hover:bg-gray-700
      transition-colors duration-150
    `.trim();

    return (
      <div ref={containerRef} className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          {...inputProps} // Spread all input props
          type="text"
          value={query}
          autoComplete='off'
          className={`
            h-10 w-full rounded-lg border appearance-none px-4 py-2 text-sm transition-colors
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 focus:outline-none
            ${error 
              ? 'border-red-500 dark:border-red-400' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${className || ''}
          `.trim()}
          placeholder={inputProps.placeholder || "Search city..."}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {hint && (
           <p className={`mt-1 text-xs ${error ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
             {hint}
           </p>
        )}

        {showDropdown && results.length > 0 && (
          <ul className={dropdownStyles}>
            {results.map((city) => (
              <li
                key={city.id}
                onClick={() => handleSelect(city)}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                className={dropdownItemStyles}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {city.name}
                  </span>
                  {city.state && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {city.state}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

CityAutocomplete.displayName = 'CityAutocomplete';

export default CityAutocomplete;