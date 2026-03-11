import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { PropertyFormSchema } from '@/validations/propertySchema';

interface PropertyContactInfoProps {
  register: UseFormRegister<PropertyFormSchema>;
  errors: FieldErrors<PropertyFormSchema>;
}

export default function PropertyContactInfo({ register, errors }: PropertyContactInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
      
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="name">Contact Person Name</Label>
          <Input 
            id="name" 
            {...register("name")} 
            error={!!errors.name?.message} 
            hint={errors.name?.message} 
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="mobile">Contact Mobile Number</Label>
          <Input 
            id="mobile" 
            {...register("mobile")} 
            error={!!errors.mobile?.message}  
            hint={errors.mobile?.message} 
          />
        </div>
      </div>
    </div>
  );
}