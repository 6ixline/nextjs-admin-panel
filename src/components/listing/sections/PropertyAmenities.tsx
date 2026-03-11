import React from 'react';
import MultiSelect, { Option } from "@/components/form/input/MultiSelectInput";
import { UseFormSetValue } from 'react-hook-form';
import { PropertyFormSchema } from '@/validations/propertySchema';

interface PropertyAmenitiesProps {
  propertyFlatAmenityOptions: Option[];
  propertySoceityAmenityOptions: Option[];
  selectedFlatFurnish: Option[];
  selectedSoceityFurnish: Option[];
  onFlatAmenityChange: (value: Option[]) => void;
  onSocietyAmenityChange: (value: Option[]) => void;
  setValue: UseFormSetValue<PropertyFormSchema>; // Add this prop
}

export default function PropertyAmenities({ 
  propertyFlatAmenityOptions,
  propertySoceityAmenityOptions,
  selectedFlatFurnish,
  selectedSoceityFurnish,
  onFlatAmenityChange,
  onSocietyAmenityChange,
  setValue
}: PropertyAmenitiesProps) {
  
  const handleFlatAmenityChange = (selectedOptions: Option[]) => {
    // Update the component state
    onFlatAmenityChange(selectedOptions);
    
    // Update form field with just the IDs as numbers
    const ids = selectedOptions.map(option => Number(option.id));
    setValue('flat_furnish', ids);
  };

  const handleSocietyAmenityChange = (selectedOptions: Option[]) => {
    // Update the component state
    onSocietyAmenityChange(selectedOptions);
    
    // Update form field with just the IDs as numbers
    const ids = selectedOptions.map(option => Number(option.id));
    setValue('society_furnish', ids);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Amenities</h3>
      
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <MultiSelect
            label="Flat Amenity"
            options={propertyFlatAmenityOptions}
            value={selectedFlatFurnish}
            onChange={handleFlatAmenityChange}
            placeholder="Select flat amenity..."
            searchable
          />
        </div>
        <div className="flex-1">
          <MultiSelect
            label="Society Amenities"
            options={propertySoceityAmenityOptions}
            value={selectedSoceityFurnish}
            onChange={handleSocietyAmenityChange}
            placeholder="Select society amenities..."
            searchable
          />
        </div>
      </div>
    </div>
  );
}