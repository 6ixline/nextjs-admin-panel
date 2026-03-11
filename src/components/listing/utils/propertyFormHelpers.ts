import { PropertyFormSchema } from "@/validations/propertySchema";
import { PropertyRequest } from "@/types/propertyTypes";

/**
 * Transforms form data to API payload for property creation/update
*/
export const transformFormDataToPayload = (
  data: PropertyFormSchema,
  isUpdate = false
): PropertyRequest => {
  return {
    title: data.title,
    description: data.description,
    ownerId: data.owner?.id,
    ownerType: data.ownerType,
    furnish_type: data.furnish_type,
    flat_furnish: data.flat_furnish,
    society_furnish: data.society_furnish,
    propertyType: data.propertyType,
    service: data.service,
    country_code: data.country_code,
    mobile: data.mobile,
    propertySubType: data.propertySubType,
    name: data.name,
    city: data.city,
    locality: data.locality,
    building_project_society: data.building_project_society,
    bhk: data.bhk,
    securityDeposit: data.securityDeposit,
    availableFrom: data.availableFrom,
    built_up_area: data.built_up_area,
    built_area_unit: data.built_area_unit,
    plot_area: data.plot_area,
    plot_area_unit: data.plot_area_unit,
    plot_length: data.plot_length,
    plot_width: data.plot_width,
    price: data.price,
    pg_name: data.pg_name,
    pg_for: data.pg_for,
    total_beds: data.total_beds,
    meals_available: data.meals_available,
    notice_period: data.notice_period,
    lock_in_period: data.lock_in_period,
    best_suited_for: data.best_suited_for,
    meal_types: data.meal_types,
    common_areas: data.common_areas,
    rooms: data.rooms,
    possessionStatus: data.possessionStatus,
    possessionDate: data.possessionDate,
    age_of_property: data.age_of_property,
    carpet_area: data.carpet_area,
    carpet_area_unit: data.carpet_area_unit,
    zoneType: data.zoneType,
    locationHub: data.locationHub,
    locationHubOther: data.locationHubOther,
    propertyCondition: data.propertyCondition,
    constructionStatus: data.constructionStatus,
    floor: data.floor,
    ownedFloor: data.ownedFloor,
    min_number_of_seats: data.min_number_of_seats,
    number_of_cabins: data.number_of_cabins,
    number_of_meeting_rooms: data.number_of_meeting_rooms,
    isPreleased: data.isPreleased,
    currentRent: data.currentRent,
    leaseYears: data.leaseYears,
    roi: data.roi,
    propertyImageId: data.propertyImageId,
    propertyDocId: data.propertyDocId,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    metaKeywords: data.metaKeywords,
    slug: data.slug,
    canonicalUrl: data.canonicalUrl,
    status: data.status
  };
};

/**
 * Separates amenities by category
*/
export const separateAmenitiesByCategory = (amenities: any[]) => {
  if (!amenities) return { flatAmenities: [], societyAmenities: [] };

  const societyAmenities = amenities
    .filter(item => item.category === 'society_amenity')
    .map(({ id, title }) => ({ id: id.toString(), title }));
  
  const flatAmenities = amenities
    .filter(item => item.category === 'flat_amenity')
    .map(({ id, title }) => ({ id: id.toString(), title }));

  return { flatAmenities, societyAmenities };
};

/**
 * Formats property sub type options based on property type
*/
export const formatPropertySubTypeOptions = (
  propertySubTypeData: any,
  selectedPropertyType: string
) => {
  if (!propertySubTypeData?.data || !selectedPropertyType) {
    return [];
  }

  let subTypesForCategory = [];
  
  if (propertySubTypeData.data.residential && propertySubTypeData.data.commercial) {
    subTypesForCategory = selectedPropertyType === 'residential' 
      ? propertySubTypeData.data.residential 
      : propertySubTypeData.data.commercial;
  } else {
    const dataArray = Array.isArray(propertySubTypeData.data) 
      ? propertySubTypeData.data 
      : Object.values(propertySubTypeData.data).flat();
    
    subTypesForCategory = dataArray.filter(
      (subType: any) => String(subType.propertyTypeId) === String(selectedPropertyType) ||
                      String(subType.categoryId) === String(selectedPropertyType) ||
                      subType.category === selectedPropertyType
    );
  }

  if (!Array.isArray(subTypesForCategory)) {
    return [];
  }

  return subTypesForCategory.map((subType: any) => ({
    value: String(subType.id),
    label: subType.title,
  }));
};

/**
 * Formats amenity options
*/
export const formatAmenityOptions = (amenityData: any, category: 'flat_amenity' | 'society_amenity') => {
  if (!amenityData?.data) {
    return [];
  }

  const categoryData = amenityData.data[category];
  
  if (!Array.isArray(categoryData)) {
    return [];
  }

  return categoryData.map((amenity: any) => ({
    id: String(amenity.id),
    title: amenity.title,
  }));
};