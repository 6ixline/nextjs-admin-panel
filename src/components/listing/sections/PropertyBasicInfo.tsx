import React, { useMemo } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import Input from '@/components/form/input/InputField';
import { ChevronDownIcon } from '@/icons';
import { PropertyFormSchema } from '@/validations/propertySchema';
import { PROPERTY_FORM_CONSTANTS } from '../constants/propertyConstants';
import TextArea from '@/components/form/input/TextArea';

interface PropertyBasicInfoProps {
  register: UseFormRegister<PropertyFormSchema>;
  errors: FieldErrors<PropertyFormSchema>;
  selectedPropertyType: string;
  propertySubTypeOptions: Array<{ value: string; label: string }>;
  isLoadingSubTypes: boolean;
  watch: UseFormWatch<PropertyFormSchema>;
}

export default function PropertyBasicInfo({ 
  register, 
  errors, 
  selectedPropertyType, 
  propertySubTypeOptions, 
  isLoadingSubTypes,
  watch 
}: PropertyBasicInfoProps) {
  const service = watch("service");
  const serviceTypeOptions = useMemo(() => {
    return PROPERTY_FORM_CONSTANTS.SERVICE_TYPES.getByPropertyType(selectedPropertyType);
  }, [selectedPropertyType]);

 

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
      
      {/* Property Title */}
      <div className="space-y-4">
        <div className="w-full">
          <Label htmlFor="title">Property Title *</Label>
          <Input
            {...register("title")}
            type="text"
            placeholder="Enter property title"
            error={!!errors.title}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
      </div>

      {/* Property Type Selection */}
      <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
          <Label htmlFor="ownertype">Owner Type *</Label>
          <div className="relative">
            <Select
              {...register("ownerType")}
              options={[...PROPERTY_FORM_CONSTANTS.OWNER_TYPES]}
              placeholder="Select Owner Type"
              error={!!errors.ownerType}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.ownerType && (
            <p className="text-red-500 text-sm mt-1">{errors.ownerType.message}</p>
          )}
        </div>

        <div className="flex-1">
          <Label>Property Type *</Label>
          <div className="relative">
            <Select
              {...register("propertyType")}
              options={[...PROPERTY_FORM_CONSTANTS.PROPERTY_TYPES]}
              placeholder="Select Property Type"
              error={!!errors.propertyType}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.propertyType && (
            <p className="text-red-500 text-sm mt-1">{errors.propertyType.message}</p>
          )}
        </div>

        <div className="flex-1">
          <Label>Service Type *</Label>
          <div className="relative">
            <Select
              {...register("service")}
              options={serviceTypeOptions}
              placeholder="Select Service Type"
              error={!!errors.service}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
              <ChevronDownIcon />
            </span>
          </div>
          {errors.service && (
            <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
          )}
        </div>
      </div>

      {
        service != "pg" && <div className="flex flex-row flex-wrap gap-3">
        <div className="flex-1">
            <Label htmlFor="propertySubType">Property Sub Type *</Label>
            <div className="relative">
              <Select
                {...register("propertySubType")}
                options={propertySubTypeOptions}
                placeholder={
                  !selectedPropertyType 
                    ? "Select Property Type first" 
                    : isLoadingSubTypes 
                      ? "Loading..." 
                      : "Select Property Sub Type"
                }
                error={!!errors.propertySubType}
                disabled={!selectedPropertyType || isLoadingSubTypes}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.propertySubType && (
              <p className="text-red-500 text-sm mt-1">{errors.propertySubType.message}</p>
            )}
          </div>
        </div>
      }

      {/* Property Description */}
      <div className="space-y-4">
        <div className="w-full">
          <Label htmlFor="description">Property Description</Label>
          <TextArea
            {...register("description")}
            rows={4}
            placeholder="Enter detailed property description"
            error={!!errors.description}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* SEO Meta Information */}
      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">SEO Meta Information</h4>
        
        <div className="space-y-4">
          <div className="w-full">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              {...register("metaTitle")}
              type="text"
              placeholder="Enter SEO meta title (recommended: 50-60 characters)"
              error={!!errors.metaTitle}
            />
            {errors.metaTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.metaTitle.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Optimal length: 50-60 characters. This will appear as the clickable headline in search results.
            </p>
          </div>

          <div className="w-full">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <TextArea
              {...register("metaDescription")}
              rows={3}
              placeholder="Enter SEO meta description (recommended: 150-160 characters)"
              error={!!errors.metaDescription}
            />
            {errors.metaDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.metaDescription.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Optimal length: 150-160 characters. This will appear as the description snippet in search results.
            </p>
          </div>

          <div className="w-full">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input
              {...register("metaKeywords")}
              type="text"
              placeholder="Enter keywords separated by commas (e.g., apartment, rent, mumbai, 2bhk)"
              error={!!errors.metaKeywords}
            />
            {errors.metaKeywords && (
              <p className="text-red-500 text-sm mt-1">{errors.metaKeywords.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Enter relevant keywords separated by commas. Focus on location, property type, and key features.
            </p>
          </div>

          <div className="flex flex-row flex-wrap gap-3">
            <div className="flex-1">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                {...register("slug")}
                type="text"
                placeholder="property-url-slug"
                error={!!errors.slug}
              />
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly version of the title. Use lowercase letters, numbers, and hyphens only.
              </p>
            </div>

            <div className="flex-1">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                {...register("canonicalUrl")}
                type="url"
                placeholder="https://example.com/properties/property-name"
                error={!!errors.canonicalUrl}
              />
              {errors.canonicalUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.canonicalUrl.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Optional: Specify the canonical URL to avoid duplicate content issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}