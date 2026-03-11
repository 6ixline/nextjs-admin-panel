import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';
import { PropertyFormSchema } from '@/validations/propertySchema';
import { PROPERTY_FORM_CONSTANTS } from '../constants/propertyConstants';

interface PropertyStatusInfoProps {
  register: UseFormRegister<PropertyFormSchema>;
  errors: FieldErrors<PropertyFormSchema>;
}

export default function PropertyStatusInfo({ register, errors }: PropertyStatusInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status</h3>
      
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="status">Property Status</Label>
          <div className="relative">
            <Select
              {...register("status")}
              options={[...PROPERTY_FORM_CONSTANTS.STATUS_OPTIONS]}
              placeholder="Select Status"
              error={!!errors.status}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}