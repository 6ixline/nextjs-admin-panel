import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';
import { PropertyFormSchema } from '@/validations/propertySchema';
import { PROPERTY_FORM_CONSTANTS } from '../constants/propertyConstants';

interface PropertyDetailsInfoProps {
  register: UseFormRegister<PropertyFormSchema>;
  errors: FieldErrors<PropertyFormSchema>;
}

export default function PropertyDetailsInfo({ register, errors }: PropertyDetailsInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Property Details</h3>
      
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="bhk">BHK</Label>
          <div className="relative">
            <Select
              {...register("bhk")}
              options={[...PROPERTY_FORM_CONSTANTS.BHK_OPTIONS]}
              placeholder="Select BHK"
              error={!!errors.bhk}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.bhk && (
            <p className="text-red-500 text-sm mt-1">{errors.bhk.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="built_up_area">Built Up Area</Label>
          <Input
            type='number'
            min={1} 
            id="built_up_area" 
            {...register("built_up_area", { valueAsNumber: true })} 
            error={!!errors.built_up_area?.message} 
            hint={errors.built_up_area?.message} 
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="built_area_unit">Area Unit</Label>
          <div className="relative">
            <Select
              {...register("built_area_unit")}
              options={[...PROPERTY_FORM_CONSTANTS.AREA_UNITS]}
              placeholder="Select Unit"
              error={!!errors.built_area_unit}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.built_area_unit && (
            <p className="text-red-500 text-sm mt-1">{errors.built_area_unit.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="furnish_type">Furnish Type</Label>
          <div className="relative">
            <Select
              {...register("furnish_type")}
              options={[...PROPERTY_FORM_CONSTANTS.FURNISH_TYPES]}
              placeholder="Select Furnish Type"
              error={!!errors.furnish_type}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.furnish_type && (
            <p className="text-red-500 text-sm mt-1">{errors.furnish_type.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}