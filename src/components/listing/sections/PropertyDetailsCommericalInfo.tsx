import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';
import { PropertyFormSchema } from '@/validations/propertySchema';
import { PROPERTY_FORM_CONSTANTS } from '../constants/propertyConstants';

interface PropertyDetailsInfoProps {
  register: UseFormRegister<PropertyFormSchema>;
  errors: FieldErrors<PropertyFormSchema>;
  watch: UseFormWatch<PropertyFormSchema>;
}

export default function PropertyDetailsInfo({ register, errors, watch }: PropertyDetailsInfoProps) {
  const possessionStatus = watch("possessionStatus");
  const propertySubType = watch("propertySubType");
  const locationHub = watch("locationHub");
  const propertyCondition = watch("propertyCondition");

  const getLocationHubOptions = () => {
    const locationHubData = PROPERTY_FORM_CONSTANTS.LOCATION_HUB;
    if (!propertySubType || !["1", "2", "3", "4", "6"].includes(propertySubType)) {
      return [];
    }
    return locationHubData[propertySubType as keyof typeof locationHubData];
  };

  const locationHubOptions = getLocationHubOptions();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Property Details</h3>
      {propertySubType != "5" && <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="possessionStatus">Possession Status</Label>
          <div className="relative">
            <Select
              {...register("possessionStatus")}
              options={[...PROPERTY_FORM_CONSTANTS.POSSESSION_STATUS]}
              placeholder="Select Possesion Status"
              error={!!errors.possessionStatus}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.possessionStatus && (
            <p className="text-red-500 text-sm mt-1">{errors.possessionStatus.message}</p>
          )}
        </div>
      </div>}
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="availableFrom">Available from</Label>
          <Input
            type='date'
            id="availableFrom" 
            {...register("availableFrom")} 
            error={!!errors.availableFrom?.message} 
            hint={errors.availableFrom?.message} 
          />
        </div>
        {possessionStatus === "ready_to_move" && <div className="flex-1">
          <Label htmlFor="age_of_property">Age of Property (in years)</Label>
          <Input
            id="age_of_property" 
            {...register("age_of_property", { valueAsNumber: true })} 
            error={!!errors.age_of_property?.message} 
            hint={errors.age_of_property?.message} 
          />
        </div>}
      </div>
      <div className="flex flex-row flex-wrap gap-3">
      {
        propertySubType && ["1", "4", "5", "6"].includes(propertySubType) &&
        <div className="flex-1">
          <Label htmlFor="zoneType">Zone type</Label>
          <div className="relative">
            <Select
              {...register("zoneType")}
              options={[...PROPERTY_FORM_CONSTANTS.ZONE_TYPES]}
              placeholder="Select Zone Type"
              error={!!errors.zoneType}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.zoneType && (
            <p className="text-red-500 text-sm mt-1">{errors.zoneType.message}</p>
          )}
        </div>
      }
      {propertySubType && locationHubOptions.length > 0 &&<div className="flex-1">
          <Label htmlFor="locationHub">Location Hub</Label>
          <div className="relative">
            <Select
              {...register("locationHub")}
              options={[...locationHubOptions]}
              placeholder="Select Zone Type"
              error={!!errors.locationHub}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.locationHub && (
            <p className="text-red-500 text-sm mt-1">{errors.locationHub.message}</p>
          )}
        </div>
      }
      </div>

      
      {
        locationHub == "others" && 
        <div className="flex flex-row flex-wrap gap-3">
          <div className="flex-1">
            <Label htmlFor="locationHubOther">Others (Location Hub)</Label>
            <Input
              type='text'
              id="locationHubOther" 
              {...register("locationHubOther")} 
              error={!!errors.locationHubOther?.message} 
              hint={errors.locationHubOther?.message} 
            />
          </div>
        </div>
      }

      {propertySubType && ["1"].includes(propertySubType) && 
        <div className="flex flex-row flex-wrap gap-3">
          <div className="flex-1">
            <Label htmlFor="propertyCondition">Property Condition</Label>
            <div className="relative">
              <Select
                {...register("propertyCondition")}
                options={[...PROPERTY_FORM_CONSTANTS.PROPERTY_CONDITION]}
                placeholder="Select property condition"
                error={!!errors.propertyCondition}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.propertyCondition && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyCondition.message}</p>
            )}
          </div>
        </div>
      }
      
      { propertySubType != "5" ? 
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
        :
        <div className="flex flex-row flex-wrap gap-3">
          <div className="flex-1">
            <Label htmlFor="plot_area">Plot Area</Label>
            <Input
              type='number'
              min={1} 
              id="plot_area" 
              {...register("plot_area", { valueAsNumber: true })} 
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
      }
      {((propertySubType && ["1"].includes(propertySubType) && propertyCondition == "ready_to_use") || (propertySubType && ["2", "3", "4", "6"].includes(propertySubType))) &&
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="carpet_area">Carpet Area</Label>
          <Input
            type='number'
            min={1} 
            id="carpet_area" 
            {...register("carpet_area", { valueAsNumber: true })} 
            error={!!errors.carpet_area?.message} 
            hint={errors.carpet_area?.message} 
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="carpet_area_unit">Area Unit</Label>
          <div className="relative">
            <Select
              {...register("carpet_area_unit")}
              options={[...PROPERTY_FORM_CONSTANTS.AREA_UNITS]}
              placeholder="Select Unit"
              error={!!errors.carpet_area_unit}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.carpet_area_unit && (
            <p className="text-red-500 text-sm mt-1">{errors.carpet_area_unit.message}</p>
          )}
        </div>
      </div>}

      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="ownership">Ownership</Label>
          <div className="relative">
            <Select
              {...register("ownership")}
              options={[...PROPERTY_FORM_CONSTANTS.OWNERSHIP]}
              placeholder="Select ownership"
              error={!!errors.ownership}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.ownership && (
            <p className="text-red-500 text-sm mt-1">{errors.ownership.message}</p>
          )}
        </div>
        {propertySubType && ["1"].includes(propertySubType) && propertyCondition == "bare_shell" && <div className="flex-1">
          <Label htmlFor="constructionStatus">Construction Status</Label>
          <div className="relative">
            <Select
              {...register("constructionStatus")}
              options={[...PROPERTY_FORM_CONSTANTS.CONSTRUCTION_STATUS]}
              placeholder="Select construction status"
              error={!!errors.constructionStatus}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.constructionStatus && (
            <p className="text-red-500 text-sm mt-1">{errors.constructionStatus.message}</p>
          )}
        </div>}
      </div>

      {
        propertySubType != "5" && 
        <div className="flex flex-row flex-wrap gap-3">
          <div className="flex-1">
            <Label htmlFor="floor">Total Floors</Label>
            <Input
              id="floor" 
              {...register("floor", { valueAsNumber: true })} 
              error={!!errors.floor?.message} 
              hint={errors.floor?.message} 
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="ownedFloor">Your Floor</Label>
            <Input
              type='text'
              id="ownedFloor" 
              msg="Note: Enter the value of floor comma separated"
              {...register("ownedFloor")} 
              error={!!errors.ownedFloor?.message} 
              hint={errors.ownedFloor?.message} 
            />
          </div>
        </div>
      }
      {propertySubType && ["1"].includes(propertySubType) && propertyCondition == "ready_to_use" && <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="min_number_of_seats">Min. Number of seats</Label>
          <Input
            id="min_number_of_seats" 
            {...register("min_number_of_seats", { valueAsNumber: true })} 
            error={!!errors.min_number_of_seats?.message} 
            hint={errors.min_number_of_seats?.message} 
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="number_of_cabins">Number of Cabins</Label>
          <Input
            id="number_of_cabins" 
            {...register("number_of_cabins", { valueAsNumber: true })} 
            error={!!errors.number_of_cabins?.message} 
            hint={errors.number_of_cabins?.message} 
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="number_of_meeting_rooms">Number of Meeting Rooms</Label>
          <Input
            id="number_of_meeting_rooms" 
            {...register("number_of_meeting_rooms", { valueAsNumber: true })} 
            error={!!errors.number_of_meeting_rooms?.message} 
            hint={errors.number_of_meeting_rooms?.message} 
          />
        </div>
      </div>}
    </div>
  );
}