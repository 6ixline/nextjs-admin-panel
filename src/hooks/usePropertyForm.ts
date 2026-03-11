import { useState, useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { uploadSingleFile } from "@/services/fileUploadServices";
import { createProperty, updateProperty } from "@/services/propertyServices";
import { PropertyFormSchema } from "@/validations/propertySchema";
import { FileUploadData, ExistingFile } from "@/types/fileTypes";
import { 
  transformFormDataToPayload,
  separateAmenitiesByCategory,
  formatPropertySubTypeOptions,
  formatAmenityOptions 
} from '@/components/listing/utils/propertyFormHelpers';
import { Option } from '@/components/form/input/MultiSelectInput';

interface UsePropertyFormProps {
  form: UseFormReturn<PropertyFormSchema>;
  propertyId?: string;
  propertySubTypeData?: any;
  propertyAmenityData?: any;
}

export const usePropertyForm = ({ 
  form, 
  propertyId, 
  propertySubTypeData, 
  propertyAmenityData 
}: UsePropertyFormProps) => {
  const router = useRouter();
  const [state, setState] = useState({
    isLoading: false,
    selectedFlatFurnish: [] as Option[],
    selectedSoceityFurnish: [] as Option[],
    selectedPGFor: [] as Option[],
    selectedMealTypes: [] as Option[],
    selectedBestSuitedFor: [] as Option[],
    selectedCommonArea: [] as Option[],
    currentUploadedImages: [] as FileUploadData[],
    currentExistingImages: [] as (File | ExistingFile)[],
    currentUploadedDocs: [] as FileUploadData[],
    currentExistingDocs: [] as (File | ExistingFile)[],
    filesToDelete: [] as string[],
  });

  const selectedPropertyType = form.watch("propertyType");

  // Memoized options
  const propertySubTypeOptions = useMemo(() => 
    formatPropertySubTypeOptions(propertySubTypeData, selectedPropertyType),
    [propertySubTypeData, selectedPropertyType]
  );

  const amenityOptions = useMemo(() => ({
    flat: formatAmenityOptions(propertyAmenityData, 'flat_amenity'),
    society: formatAmenityOptions(propertyAmenityData, 'society_amenity'),
  }), [propertyAmenityData]);

  // PG-specific options
  const pgForOptions: Option[] = useMemo(() => [
    { id: "boys", title: "Boys" },
    { id: "girls", title: "Girls" }
  ], []);

  const bestSuitedForOptions: Option[] = useMemo(() => [
    { id: "students", title: "Students" },
    { id: "professionals", title: "Professionals" }
  ], []);

  const mealTypeOptions: Option[] = useMemo(() => [
    { id: "breakfast", title: "Breakfast" },
    { id: "lunch", title: "Lunch" },
    { id: "dinner", title: "Dinner" }
  ], []);

  const commonAreaOptions: Option[] = useMemo(() => [
    { id: "living_room", title: "Living Room" },
    { id: "kitchen", title: "Kitchen" },
    { id: "dining_hall", title: "Dining Hall" },
    { id: "study_room", title: "Study Room" },
    { id: "breakout_room", title: "Breakout Room" }
  ], []);

  const roomTypeOptions = useMemo(() => [
    { value: "", label: "Select Room Type" },
    { value: "private", label: "Private Room" },
    { value: "double", label: "Double Sharing" },
    { value: "triple", label: "Triple Sharing" },
    { value: "3plus", label: "3+ Sharing" }
  ], []);

  // Helper function to get all current file IDs
  const getCurrentFileIds = useCallback((fileType: 'image' | 'doc'): number[] => {
    const uploadedFiles = fileType === 'image' ? state.currentUploadedImages : state.currentUploadedDocs;
    const existingFiles = fileType === 'image' ? state.currentExistingImages : state.currentExistingDocs;
    
    const uploadedIds = uploadedFiles
      .map(file => file.id)
      .filter((id): id is NonNullable<typeof id> => id !== undefined)
      .map(id => typeof id === 'string' ? parseInt(id, 10) : id)
      .filter((id): id is number => typeof id === 'number' && !isNaN(id));
    
    const existingIds = existingFiles
      .filter((file): file is ExistingFile => 'fileid' in file)
      .map(file => file.fileid)
      .filter((id): id is NonNullable<typeof id> => id !== undefined)
      .map(id => typeof id === 'string' ? parseInt(id, 10) : id)
      .filter((id): id is number => typeof id === 'number' && !isNaN(id));
    
    return [...uploadedIds, ...existingIds];
  }, [state.currentUploadedImages, state.currentExistingImages, state.currentUploadedDocs, state.currentExistingDocs]);

  // File upload handlers with proper error handling
  const handleImageUpload = useCallback(async (files: File[]) => {
    try {
      const currentImageCount = state.currentUploadedImages.length + state.currentExistingImages.length;

      if (!Array.isArray(files) || files.length === 0) {
        return;
      }

      if (currentImageCount + files.length > 10) {
        toast.error("Maximum 10 Images allowed");
        return;
      }

      const uploadPromises = files.map(file => {
        const uploadData = {
          ownerType: 'property' as const,
          ownerid: undefined,
          file,
          type: 'property_pic' as const,
        };

        return uploadSingleFile(uploadData)
          .then(response => ({
            file,
            response,
            success: true,
          }))
          .catch(error => ({
            file,
            response: null,
            success: false,
            error,
          }));
      });

      const responses = await Promise.all(uploadPromises);
      
      // Separate successful and failed uploads
      const successfulUploads = responses.filter(result => result.success && result.response?.success);
      const failedUploads = responses.filter(result => !result.success || !result.response?.success);

      // Only add successfully uploaded files to state
      if (successfulUploads.length > 0) {
        const uploadedFiles = successfulUploads.map(({ file, response }) => ({
          file,
          id: response!.data.id,
        }));

        setState(prev => ({
          ...prev,
          currentUploadedImages: [...prev.currentUploadedImages, ...uploadedFiles],
        }));
      }

      // Show appropriate feedback
      if (failedUploads.length > 0 && successfulUploads.length > 0) {
        toast.warning(
          `${successfulUploads.length} image(s) uploaded successfully, ${failedUploads.length} failed`
        );
      } else if (failedUploads.length > 0) {
        toast.error("Error! Failed to upload images");
      } else if (successfulUploads.length > 0) {
        toast.success(`${successfulUploads.length} image(s) uploaded successfully`);
      }
    } catch (err) {
      toast.error("Error! while uploading images");
    }
  }, [state.currentUploadedImages.length, state.currentExistingImages.length]);

  const handleDocUpload = useCallback(async (files: File[]) => {
    try {
      const currentDocCount = state.currentUploadedDocs.length + state.currentExistingDocs.length;

      if (!Array.isArray(files) || files.length === 0) {
        return;
      }

      if (currentDocCount + files.length > 5) {
        toast.error("Maximum 5 documents allowed");
        return;
      }

      const uploadPromises = files.map(file => {
        const uploadData = {
          ownerType: 'property' as const,
          ownerid: undefined,
          file,
          type: 'property_doc' as const,
        };

        return uploadSingleFile(uploadData)
          .then(response => ({
            file,
            response,
            success: true,
          }))
          .catch(error => ({
            file,
            response: null,
            success: false,
            error,
          }));
      });

      const responses = await Promise.all(uploadPromises);
      
      // Separate successful and failed uploads
      const successfulUploads = responses.filter(result => result.success && result.response?.success);
      const failedUploads = responses.filter(result => !result.success || !result.response?.success);

      // Only add successfully uploaded files to state
      if (successfulUploads.length > 0) {
        const uploadedFiles = successfulUploads.map(({ file, response }) => ({
          file,
          id: response!.data.id,
        }));

        setState(prev => ({
          ...prev,
          currentUploadedDocs: [...prev.currentUploadedDocs, ...uploadedFiles],
        }));
      }

      // Show appropriate feedback
      if (failedUploads.length > 0 && successfulUploads.length > 0) {
        toast.warning(
          `${successfulUploads.length} document(s) uploaded successfully, ${failedUploads.length} failed`
        );
      } else if (failedUploads.length > 0) {
        toast.error("Error! Failed to upload documents");
      } else if (successfulUploads.length > 0) {
        toast.success(`${successfulUploads.length} document(s) uploaded successfully`);
      }
    } catch (err) {
      toast.error("Error! while uploading documents");
    }
  }, [state.currentUploadedDocs.length, state.currentExistingDocs.length]);

  // Compute display files for FileInput component
  const displayImages = useMemo(() => {
    const existingImages = state.currentExistingImages;
    const uploadedImages = state.currentUploadedImages.map(img => img.file);
    return [...existingImages, ...uploadedImages];
  }, [state.currentExistingImages, state.currentUploadedImages]);

  const displayDocs = useMemo(() => {
    const existingDocs = state.currentExistingDocs;
    const uploadedDocs = state.currentUploadedDocs.map(doc => doc.file);
    return [...existingDocs, ...uploadedDocs];
  }, [state.currentExistingDocs, state.currentUploadedDocs]);

  const handleFileRemoval = useCallback((fileId: string | undefined, fileName: string) => {
    const numericId = fileId !== undefined ? Number(fileId) : undefined;

    setState(prev => ({
      ...prev,
      // Newly uploaded images: remove by id (if present) OR by underlying File.name
      currentUploadedImages: prev.currentUploadedImages.filter(img => {
        const byId =
          numericId !== undefined
            ? img.id !== numericId
            : true;
        const byName = img.file.name !== fileName;
        return byId && byName;
      }),
      // Existing images from backend
      currentExistingImages: prev.currentExistingImages.filter(img => {
        if ("fileid" in img) {
          return (img as ExistingFile).fileid !== fileId;
        }
        return img.name !== fileName;
      }),
      // Newly uploaded docs
      currentUploadedDocs: prev.currentUploadedDocs.filter(doc => {
        const byId =
          numericId !== undefined
            ? doc.id !== numericId
            : true;
        const byName = doc.file.name !== fileName;
        return byId && byName;
      }),
      // Existing docs from backend
      currentExistingDocs: prev.currentExistingDocs.filter(doc => {
        if ("fileid" in doc) {
          return (doc as ExistingFile).fileid !== fileId;
        }
        return doc.name !== fileName;
      }),
      // Track deleted backend files only when we have an id
      filesToDelete: fileId ? [...prev.filesToDelete, fileId] : prev.filesToDelete
    }));
  }, []);

  // Enhanced transform function to handle PG data
  const transformFormDataToPayloadWithPG = useCallback((data: PropertyFormSchema, isEdit: boolean) => {
    const basePayload = transformFormDataToPayload(data, isEdit);
    
    // Add PG-specific transformations if service is 'pg'
    if (data.service === 'pg') {
      return {
        ...basePayload,
        // Convert string values to numbers for numeric fields
        total_beds: data.total_beds ? 
          (typeof data.total_beds === 'string' ? parseInt(data.total_beds, 10) : data.total_beds) : 
          undefined,
        notice_period: data.notice_period ? 
          (typeof data.notice_period === 'string' ? parseInt(data.notice_period, 10) : data.notice_period) : 
          undefined,
        lock_in_period: data.lock_in_period ? 
          (typeof data.lock_in_period === 'string' ? parseInt(data.lock_in_period, 10) : data.lock_in_period) : 
          undefined,
        
        // Transform rooms array - convert rent and security_deposit to numbers
        rooms: data.rooms?.map(room => ({
          ...room,
          rent: typeof room.rent === 'string' ? parseInt(room.rent, 10) : room.rent,
          security_deposit: typeof room.security_deposit === 'string' ? parseInt(room.security_deposit, 10) : room.security_deposit,
        })) || [],
      };
    }
    
    return basePayload;
  }, []);

  // Form submission
  const onSubmit = useCallback(async (data: PropertyFormSchema) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const propertyImageId = getCurrentFileIds('image');
      const propertyDocId = getCurrentFileIds('doc');

      const payload = {
        ...transformFormDataToPayloadWithPG(data, Boolean(propertyId)),
        propertyImageId,
        propertyDocId
      };

      if (propertyId) {
        const response = await updateProperty(propertyId, payload);
        toast.success(response.message);
      } else {
        const response = await createProperty(payload);
        toast.success(response.message);
      }

      if(payload.status == "inreview" || payload.status == 'rejected'){
        router.push("/listing/review");
      }else{
        router.push("/listing");
      }
      
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message;
      toast.error(`${message}`);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [propertyId, router, getCurrentFileIds, transformFormDataToPayloadWithPG]);

  // Update state functions
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setAmenities = useCallback((data: any) => {
    const { flatAmenities, societyAmenities } = separateAmenitiesByCategory(data.amenities);
    
    updateState({
      selectedFlatFurnish: flatAmenities,
      selectedSoceityFurnish: societyAmenities,
    });
  
    const flatIds = flatAmenities.map((amenity: Option) => Number(amenity.id));
    const societyIds = societyAmenities.map((amenity: Option) => Number(amenity.id));
    
    form.setValue('flat_furnish', flatIds);
    form.setValue('society_furnish', societyIds);
  }, [updateState, form]);

  // PG-specific state setters
  const setPGFor = useCallback((selectedOptions: Option[]) => {
    updateState({ selectedPGFor: selectedOptions });
    const values = selectedOptions.map(option => option.id as string);
    form.setValue('pg_for', values as ("boys" | "girls")[], { shouldValidate: true });
  }, [updateState, form]);

  const setBestSuitedFor = useCallback((selectedOptions: Option[]) => {
    updateState({ selectedBestSuitedFor: selectedOptions });
    const values = selectedOptions.map(option => option.id as string);
    form.setValue('best_suited_for', values as ("students" | "professionals")[], { shouldValidate: true });
  }, [updateState, form]);

  const setMealType = useCallback((selectedOptions: Option[]) => {
    updateState({ selectedMealTypes: selectedOptions });
    const values = selectedOptions.map(option => option.id as string);
    form.setValue('meal_types', values as ("breakfast" | "lunch" | "dinner")[], { shouldValidate: true });
  }, [updateState, form]);

  const setCommonArea = useCallback((selectedOptions: Option[]) => {
    updateState({ selectedCommonArea: selectedOptions });
    const values = selectedOptions.map(option => option.id as string);
    form.setValue('common_areas', values as ("living_room" | "kitchen" | "dining_hall" | "study_room" | "breakout_room")[], { shouldValidate: true });
  }, [updateState, form]);

  // Function to set PG data when loading existing property
  const setPGData = useCallback((data: any) => {
    if (data.service === 'pg') {
      // Set PG-specific data with proper state updates
      if (data.pg_for) {
        const pgForOptions = data.pg_for.map((val: string) => ({ 
          id: val, 
          title: val.charAt(0).toUpperCase() + val.slice(1) 
        }));
        updateState({ selectedPGFor: pgForOptions });
        form.setValue('pg_for', data.pg_for);
      }
      
      if (data.best_suited_for) {
        const bestSuitedOptions = data.best_suited_for.map((val: string) => ({ 
          id: val, 
          title: val.charAt(0).toUpperCase() + val.slice(1) 
        }));
        updateState({ selectedBestSuitedFor: bestSuitedOptions });
        form.setValue('best_suited_for', data.best_suited_for);
      }

      if (data.meal_types) {
        const mealTypesOptions = data.meal_types.map((val: string) => ({ 
          id: val, 
          title: val.charAt(0).toUpperCase() + val.slice(1) 
        }));
        updateState({ selectedMealTypes: mealTypesOptions });
        form.setValue('meal_types', data.meal_types);
      }

      if (data.common_areas) {
        const commonAreasOptions = data.common_areas.map((val: string) => ({ 
          id: val, 
          title: val.charAt(0).toUpperCase() + val.slice(1) 
        }));
        updateState({ selectedCommonArea: commonAreasOptions });
        form.setValue('common_areas', data.common_areas);
      }
      
      // Set other PG fields
      if (data.pg_name) form.setValue('pg_name', data.pg_name);
      if (data.total_beds !== undefined) form.setValue('total_beds', data.total_beds.toString());
      if (data.meals_available) form.setValue('meals_available', data.meals_available);
      if (data.meal_types) form.setValue('meal_types', data.meal_types);
      if (data.notice_period !== undefined) form.setValue('notice_period', data.notice_period.toString());
      if (data.lock_in_period !== undefined) form.setValue('lock_in_period', data.lock_in_period.toString());
      if (data.common_areas) form.setValue('common_areas', data.common_areas);
      if (data.rooms) {
        // Ensure room data is properly formatted
        const formattedRooms = data.rooms.map((room: any) => ({
          ...room,
          rent: room.rent.toString(),
          security_deposit: room.security_deposit.toString(),
        }));
        form.setValue('rooms', formattedRooms);
      }
    }
  }, [form, updateState]);

  return {
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
    displayImages,
    displayDocs,
    handleImageUpload,
    handleDocUpload,
    handleFileRemoval,
    onSubmit,
    getCurrentFileIds,
  };
}