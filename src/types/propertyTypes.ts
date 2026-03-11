import { ExistingFile } from "./fileTypes";
import { BaseResponse } from "./formTypes";
import { PaginationMeta } from "./paginationType";

export interface owner {
    id: number;
    name: string;
}

export interface Property {
    id: number;
    name: string;
    mobile: string;
    propertyType: string;
    ownerType: string;
    status: string;
    createdAt: string;
    owner: owner
}

export interface Room { 
    id: number; 
    room_type: "private" | "double" | "triple" | "3plus"; 
    rent: string | number; 
    security_deposit: string | number; 
}

export interface PropertyDetails extends Property {
    title: string;
    propertySubType: string;
    service: string;
    city: number;
    building_project_society: string;
    locality: string;
    possession_status: string;
    age_of_property: number;
    expected_possession_date: string;
    possessionDate: string;
    possessionStatus: string;
    location_hub: string;
    bhk: number;
    built_up_area: number;
    built_area_unit: string;
    plot_area: number,
    plot_area_unit: string;
    floor: number,
    ownedFloor: string;
    plot_length: number;
    plot_width: number;
    carpet_area: number;
    carpet_area_unit: string;
    furnish_type: string;
    ownership: string;
    description: string;
    price: number;
    securityDeposit: string;
    availableFrom: string;
    ownerId: number;
    country_code: string;
    min_number_of_seats: number;
    number_of_cabins: number;
    number_of_meeting_rooms: number;
    amenities: Amenity[],
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    slug: string;
    canonicalUrl: string;
    pg_for: ("boys" | "girls")[];
    best_suited_for: ("students" | "professionals")[];
    pg_name: string;
    total_beds: string;
    meals_available: "yes" | "no" | undefined;
    meal_types: ("breakfast" | "lunch" | "dinner")[] | ("breakfast" | "lunch" | "dinner" | undefined)[] | undefined;
    notice_period: string;
    lock_in_period: string;
    common_areas: ("living_room" | "kitchen" | "dining_hall" | "study_room" | "breakout_room" | undefined)[] | ("living_room" | "kitchen" | "dining_hall" | "study_room" | "breakout_room")[] | undefined;
    rooms: Room[];
    isPreleased: string | undefined;
    currentRent: string | undefined;
    leaseYears: string | undefined;
    roi: string | undefined;
    cityData: {
        id: number;
        name: string;
        url: string;
        state: string;
        code: string;
        status: string;
    };
    propertySubTypeData: {
        id: number;
        title: string;
    };
    imageData: ExistingFile[];
    fileData: ExistingFile[];
}

export interface PaginatedPropertyResponse {
    data: Property[];
    pagination: PaginationMeta;
}

export interface PropertyResponse {
    success: boolean;
    message: string;
    data: Property;
}

export interface PropertyRequest{
    ownerId: number | undefined;
    ownerType: string;
    title: string;
    description: string | undefined;
    furnish_type: string;
    flat_furnish: number[];
    society_furnish: number[];
    propertyType: string;
    service: string;
    country_code: string;
    mobile: string;
    propertySubType: string | undefined;
    name: string;
    city: number;
    locality: string;
    building_project_society: string;
    bhk: string | undefined;
    securityDeposit: string | undefined;
    availableFrom: string | undefined;
    built_up_area: number | undefined;
    built_area_unit: string | undefined;
    plot_area: number | undefined;
    plot_area_unit: string | undefined;
    plot_length: number | undefined;
    plot_width: number | undefined;
    possessionStatus: string | undefined;
    possessionDate: string | undefined;
    age_of_property: number | undefined;
    carpet_area: number | undefined;
    carpet_area_unit: string | undefined;
    zoneType: string | undefined;
    locationHub: string | undefined;
    locationHubOther: string | undefined;
    propertyCondition: string | undefined;
    constructionStatus: string | undefined;
    floor: number | undefined;
    ownedFloor: string | undefined;
    min_number_of_seats: number | undefined;
    number_of_cabins: number | undefined;
    number_of_meeting_rooms: number | undefined;
    isPreleased: string | undefined;
    currentRent: string | undefined;
    leaseYears: string | undefined;
    roi: string | undefined;
    price: number | undefined;
    pg_name: string | undefined;
    total_beds: string | number | undefined;
    meals_available: string | undefined;
    notice_period: string | number | undefined;
    lock_in_period: string | number | undefined;
    best_suited_for: string[] | undefined,
    pg_for: string[] | undefined,
    meal_types: string[] | undefined,
    common_areas: string[] | undefined,
    rooms: Room[] | undefined,
    propertyImageId: number[] | undefined;
    propertyDocId: number[] | undefined;
    metaTitle: string | undefined,
    metaDescription: string | undefined,
    metaKeywords: string | undefined,
    slug: string | undefined,
    canonicalUrl: string | undefined,
    status: string;
}

export interface PropertyType {
    id: number;
    title: string;
    category: string;
    iconFile?: {
        url: string;
    }
}

export interface PropertyTypeCategories {
    commercial: PropertyType[];
    residential?: PropertyType[];
}

export interface PropertyTypeResponse extends BaseResponse {
    data: PropertyTypeCategories
}

export interface Amenity {
    id: number;
    title: string;
    category: string;
    iconFile?: {
        url: string;
    }
}
export interface AmenityCategories {
    flat_amenity: Amenity[];
    society_amenity: Amenity[];
}

export interface AmenityResponse extends BaseResponse {
    data: AmenityCategories
}