'use client';

import React, { useEffect, useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from '@/components/ui/button/Button';
import { EditIcon, PlusIcon } from '@/icons';

import { propertySchema, type PropertyFormSchema } from "@/validations/propertySchema";
import { getProperty } from "@/services/propertyServices";

import { usePropertySubType } from "@/hooks/usePropertyType";
import { useProepertyAmenity } from "@/hooks/usePropertyAmenity";
import { usePropertyForm } from "@/hooks/usePropertyForm";

// Import form sections
import { PropertyBasicInfo, PropertyContactInfo, PropertyLocationInfo, PropertyDetailsInfo, PropertyPricingInfo, PropertyAmenities, PropertyMediaUpload, PropertyStatusInfo, PropertyPlotDetailsInfo, PropertyPGDetails, PropertyDetailsCommericalInfo } from "./sections";
import { PROPERTY_FORM_CONSTANTS } from "./constants/propertyConstants";

export default function ListingForm() {
  const { id } = useParams();
  const router = useRouter();

  const { data: propertySubTypeData, isLoading: isLoadingSubTypes, error: subTypeError } = usePropertySubType();
  const { data: propertyAmenityData } = useProepertyAmenity();

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const prevPropertyTypeRef = useRef<string>("");

  const form = useForm<PropertyFormSchema>({
    resolver: zodResolver(propertySchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      status: "inreview" as const,
      service: "",
      city: 1,
      name: "",
      building_project_society: "",
      furnish_type: "",
      price: 0,
      country_code: "+91",
      mobile: "",
      ownerType: "",
      flat_furnish: [],
      society_furnish: [],
      propertySubType: "",
      pg_for: undefined,
      best_suited_for: undefined,
      pg_name: "",
      total_beds: "",
      meals_available: undefined,
      meal_types: [],
      notice_period: "",
      lock_in_period: "",
      common_areas: [],
      rooms: [],
      possessionStatus: "",
      possessionDate: "",
      carpet_area: 0
    },
  });

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = form;
  const propertyId = Array.isArray(id) ? id[0] : id;

  const {
    state,
    updateState,
    setAmenities,
    setPGData,
    setPGFor,
    setBestSuitedFor,
    setMealType,
    setCommonArea,
    propertySubTypeOptions,
    amenityOptions,
    pgForOptions,
    bestSuitedForOptions,
    mealTypeOptions,
    commonAreaOptions,
    roomTypeOptions,
    handleImageUpload,
    handleDocUpload,
    handleFileRemoval,
    displayImages, 
    displayDocs, 
    onSubmit,
  } = usePropertyForm({
    form,
    propertyId,
    propertySubTypeData,
    propertyAmenityData,
  });

  const selectedPropertyType = watch("propertyType");
  const selectedPropertySubType = watch("propertySubType");
  const selectedService = watch("service");
  const cityData = watch("cityData");

  const plotSubTypes = ["20", "21"];
  const isPlotType = useMemo(() => {
    if (!selectedPropertySubType) return false;
    return plotSubTypes.includes(selectedPropertySubType);
  }, [selectedPropertySubType, plotSubTypes]);

  const isPGService = useMemo(() => {
    return selectedService === "pg";
  }, [selectedService]);

  const loadPropertyData = useCallback(async (propertyId: string) => {
    updateState({ isLoading: true });
    setIsDataLoaded(false);
    
    try {
      const data = await getProperty(propertyId);
      const status = data.status === "inreview" || data.status === "available" || data.status == "unavailable" || data.status == "inactive" || data.status == "rejected" ? data.status : "inreview";

      if (data?.imageData) {
        updateState({ currentExistingImages: data.imageData });
      }

      if (data?.fileData) {
        updateState({ currentExistingDocs: data.fileData });
      }

      reset({
        title: data.title || "",
        propertyType: data.propertyType || "",
        propertySubType: data.propertySubType?.toString() || "",
        service: data.service || "",
        city: data.city || 1,
        locality: data.locality || "",
        cityData: data.cityData,
        building_project_society: data.building_project_society || "",
        age_of_property: data.age_of_property || undefined,
        expected_possession_date: data.expected_possession_date || "",
        location_hub: data.location_hub || "",
        bhk: data.bhk?.toString() || "",
        possessionDate: data.possessionDate || "",
        possessionStatus: data.possessionStatus || "",
        built_up_area: data.built_up_area,
        built_area_unit: data.built_area_unit || "",
        carpet_area: data.carpet_area || 0,
        carpet_area_unit: data.carpet_area_unit || "",
        plot_area: data.plot_area || 0,
        plot_area_unit : data.plot_area_unit || "",
        plot_length: data.plot_length || 0,
        plot_width: data.plot_width || 0,
        floor: data.floor || 0,
        ownedFloor: data.ownedFloor || "",
        furnish_type: data.furnish_type || "",
        ownership: data.ownership || "",
        description: data.description || "",
        price: data.price || 0,
        securityDeposit: data.securityDeposit?.toString() || "",
        availableFrom: data.availableFrom || "",
        ownerId: data.ownerId || 0,
        ownerType: data.ownerType || "",
        country_code: data.country_code || "",
        mobile: data.mobile || "",
        name: data.name || "",
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        metaKeywords: data.metaKeywords || "",
        slug: data.slug || "",
        canonicalUrl: data.canonicalUrl || "",
        status: status,
        owner: data.owner || {id: 0, name: ""},
        flat_furnish: [],
        society_furnish: [],
        pg_for: data.pg_for || undefined,
        best_suited_for: data.best_suited_for || undefined,
        pg_name: data.pg_name || "",
        total_beds: data.total_beds?.toString() || "",
        meals_available: data.meals_available || undefined,
        min_number_of_seats: data.min_number_of_seats || undefined,
        number_of_cabins: data.number_of_cabins || undefined,
        number_of_meeting_rooms: data.number_of_meeting_rooms || undefined,
        isPreleased: data.isPreleased || undefined,
        currentRent: data.currentRent || undefined,
        leaseYears: data.leaseYears || undefined,
        roi: data.roi || undefined,
        meal_types: data.meal_types || [],
        notice_period: data.notice_period?.toString() || "",
        lock_in_period: data.lock_in_period?.toString() || "",
        common_areas: data.common_areas || [],
        rooms: data.rooms || [],
      });

      prevPropertyTypeRef.current = data.propertyType || "";

      if (data.amenities) {
        setAmenities(data);
      }

      if (data.service === 'pg') {
        setPGData(data);
      }

      setIsDataLoaded(true);

    } catch (error) {
      toast.error("Error loading Property.");
    } finally {
      updateState({ isLoading: false });
    }
  }, [reset, updateState, setAmenities, setPGData]);

  useEffect(() => {
    if (propertyId) {
      loadPropertyData(propertyId);
    }
  }, [propertyId, loadPropertyData]);

  useEffect(() => {
    if (isDataLoaded && 
        selectedPropertyType && 
        prevPropertyTypeRef.current !== selectedPropertyType) {
      setValue("propertySubType", "", { shouldValidate: false });
    }
    
    prevPropertyTypeRef.current = selectedPropertyType || "";
  }, [selectedPropertyType, setValue, isDataLoaded]);

  useEffect(() => {
    if (!propertyId) {
      setIsDataLoaded(false);
      prevPropertyTypeRef.current = "";
    }
  }, [propertyId]);

  useEffect(() => {
    if (selectedService !== "pg") {
      setValue("pg_for", undefined);
      setValue("best_suited_for", undefined);
      setValue("pg_name", undefined);
      setValue("total_beds", undefined);
      setValue("meals_available", undefined);
      setValue("meal_types", undefined);
      setValue("notice_period", undefined);
      setValue("lock_in_period", undefined);
      setValue("common_areas", undefined);
      setValue("rooms", undefined);
      updateState({
        selectedPGFor: [],
        selectedBestSuitedFor: [],
        selectedMealTypes: []
      });
    }
  }, [selectedService, setValue, updateState]);

  useEffect(() => {
    if (subTypeError) {
      toast.error("Error loading property sub types");
    }
  }, [subTypeError]);

  useEffect(() => {
    if (selectedPropertyType) {
      const currentService = watch("service");
      const availableServices = PROPERTY_FORM_CONSTANTS.SERVICE_TYPES.getByPropertyType(selectedPropertyType);
      const isCurrentServiceAvailable = availableServices.some(service => service.value === currentService);
      
      if (!isCurrentServiceAvailable && currentService) {
        setValue("service", "", { shouldValidate: false });
      }
    }
  }, [selectedPropertyType, setValue, watch]);

  const isEditMode = Boolean(propertyId);
  const pageTitle = isEditMode ? "Edit Property" : "Add New Property";

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  const handleFormSubmit = handleSubmit(
    (data) => {
      console.log('handleSubmit SUCCESS - Form data received:', data);
      onSubmit(data);
    },
    (errors) => {
      console.log('handleSubmit FAILED - Validation errors:', errors);
      toast.error("Please fix the validation errors before submitting");
    }
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={pageTitle} showNewButton={false} />
      
      <form onSubmit={handleFormSubmit} noValidate>
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-5 xl:py-6 space-y-8">
          
          <PropertyBasicInfo
            register={register}
            watch={watch}
            errors={errors}
            selectedPropertyType={selectedPropertyType}
            propertySubTypeOptions={propertySubTypeOptions}
            isLoadingSubTypes={isLoadingSubTypes}
          />

          <PropertyContactInfo
            register={register}
            errors={errors}
          />

          <PropertyLocationInfo
            register={register}
            errors={errors}
            setValue={setValue}
            cityData={cityData}
            watch={watch}
          />

          {selectedPropertyType == "residential" && selectedPropertySubType && !isPlotType && !isPGService && (
            <>
              <PropertyDetailsInfo
                register={register}
                errors={errors}
              />

              <PropertyAmenities
                propertyFlatAmenityOptions={amenityOptions.flat}
                propertySoceityAmenityOptions={amenityOptions.society}
                selectedFlatFurnish={state.selectedFlatFurnish}
                selectedSoceityFurnish={state.selectedSoceityFurnish}
                onFlatAmenityChange={(value) => 
                  updateState({ selectedFlatFurnish: value })
                }
                onSocietyAmenityChange={(value) => 
                  updateState({ selectedSoceityFurnish: value })
                }
                setValue={setValue}
              />
            </>
          )}

          {selectedPropertyType == "commercial" && (
            <PropertyDetailsCommericalInfo
              register={register}
              errors={errors}
              watch={watch}
            />
          )}

          {selectedPropertySubType && isPlotType && (
            <PropertyPlotDetailsInfo
              register={register}
              errors={errors}
            />
          )}

          {isPGService && (
            <PropertyPGDetails
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              pgForOptions={pgForOptions}
              bestSuitedForOptions={bestSuitedForOptions}
              mealTypeOptions={mealTypeOptions}
              commonAreaOptions={commonAreaOptions}
              roomTypeOptions={roomTypeOptions}
              selectedPGFor={state.selectedPGFor}
              selectedBestSuitedFor={state.selectedBestSuitedFor}
              selectedMealTypesFor={state.selectedMealTypes}
              selectedCommonArea={state.selectedCommonArea}
              onPGForChange={setPGFor}
              onBestSuitedForChange={setBestSuitedFor}
              onMealTypeChange={setMealType}
              onCommonAreaChange={setCommonArea}
            />
          )}

          {!isPGService && (
            <PropertyPricingInfo
              register={register}
              errors={errors}
              watch={watch}
            />
          )}

          <PropertyMediaUpload
            displayImages={displayImages}
            displayDocs={displayDocs}
            onImageUpload={handleImageUpload}
            onDocUpload={handleDocUpload}
            onFileRemove={handleFileRemoval}
          />

          <PropertyStatusInfo
            register={register}
            errors={errors}
          />

          <div className="flex flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="submit" 
              size="sm" 
              variant="primary" 
              startIcon={isEditMode ? <EditIcon /> : <PlusIcon />}
              disabled={state.isLoading}
            >
              {state.isLoading 
                ? (isEditMode ? "Updating..." : "Creating...") 
                : (isEditMode ? "Update Property" : "Create Property")
              }
            </Button>
            
            {!isEditMode && (
              <Button
                type="button"
                onClick={() => {
                  reset();
                  updateState({
                    selectedFlatFurnish: [],
                    selectedSoceityFurnish: [],
                    selectedPGFor: [],
                    selectedBestSuitedFor: [],
                    currentUploadedImages: [],
                    currentExistingImages: [],
                    currentUploadedDocs: [],
                    currentExistingDocs: [],
                    filesToDelete: [],
                  });
                }}
                size="sm"
                variant="primary"
                disabled={state.isLoading}
              >
                Reset Form
              </Button>
            )}

            <Button
              type="button"
              onClick={() => router.push("/listing")}
              size="sm"
              variant="outline"
              disabled={state.isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}