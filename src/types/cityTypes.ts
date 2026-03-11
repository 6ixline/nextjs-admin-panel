import { PaginationMeta } from "./paginationType";


export interface City {
    id: number;
    name: string;
    url: string;
    state: string;
    code: string;
    status: string;
}

export interface PaginatedCityResponse {
    data: City[];
    pagination: PaginationMeta;
}

export interface CityResponse {
    success: boolean;
    message: string;
    data: City;
}
export interface CityUpdate{
    name: string;
    code: string;
    state: string;
    status: string;
}
export interface CreateCity{
    name: string,
    code: string;
    state: string;
    status: string;
}