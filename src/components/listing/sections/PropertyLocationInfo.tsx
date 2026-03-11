import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import CityAutocomplete from "@/components/listing/AutoCompleteCity";
import { PropertyFormSchema } from '@/validations/propertySchema';

interface PropertyLocationInfoProps {
  register: UseFormRegister<PropertyFormSchema>;
  watch: UseFormWatch<PropertyFormSchema>;
  errors: FieldErrors<PropertyFormSchema>;
  setValue: UseFormSetValue<PropertyFormSchema>;
  cityData: any;
}

export default function PropertyLocationInfo({ 
  register, 
  errors, 
  setValue, 
  cityData,
  watch 
}: PropertyLocationInfoProps) {
  const service = watch("service");
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location Information</h3>
      
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="city">City</Label>
          <CityAutocomplete 
            onSelect={(city) => {
              if(city){
                setValue("city", city.id);
              }
              setValue("cityData", city ?? undefined, { 
                shouldValidate: true,
                shouldDirty: true
              });
            }} 
            error={!!errors.city} 
            hint={errors.city?.message} 
            id="city" 
            name="city"
            autoComplete='false'
            defaultValue={cityData}
          />
        </div>
        <div className="flex-1">
        <Label htmlFor="locality">Locailty</Label>
          <Input 
            id="locality" 
            {...register("locality")} 
            error={!!errors.locality?.message} 
            hint={errors.locality?.message} 
          />
         
        </div>
      </div>
      {service != "pg" && <div className="flex-1">
        <Label htmlFor="building_project_society">Building/Project/Society</Label>
          <Input 
            id="building_project_society" 
            {...register("building_project_society")} 
            error={!!errors.building_project_society?.message} 
            hint={errors.building_project_society?.message} 
          />
        </div>}
    </div>
  );
}