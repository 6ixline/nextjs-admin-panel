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

export default function PropertyPlotDetailsInfo({ register, errors }: PropertyDetailsInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Property Details</h3>
      
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="plot_area">Plot Area</Label>
          <Input
              id="plot_area" 
              className="px-2" 
              type="number" 
              {...register("plot_area", { valueAsNumber : true})} 
              error={!!errors.plot_area?.message} 
              hint={errors.plot_area?.message} 
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="plot_area_unit">Area Unit</Label>
          <div className="relative">
            <Select
              {...register("plot_area_unit")}
              options={[...PROPERTY_FORM_CONSTANTS.AREA_UNITS]}
              placeholder="Select Unit"
              error={!!errors.plot_area_unit}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.plot_area_unit && (
            <p className="text-red-500 text-sm mt-1">{errors.plot_area_unit.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="plot_length">Length</Label>
          <Input
              id="plot_length" 
              className="px-2" 
              type="number" 
              {...register("plot_length", { valueAsNumber : true})} 
              error={!!errors.plot_length?.message} 
              hint={errors.plot_length?.message} 
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="plot_width">Width</Label>
          <Input
              id="plot_width" 
              className="px-2" 
              type="number" 
              {...register("plot_width", { valueAsNumber : true})} 
              error={!!errors.plot_width?.message} 
              hint={errors.plot_width?.message} 
          />
        </div>
      </div>
    </div>
  );
}