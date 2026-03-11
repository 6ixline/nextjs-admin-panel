export interface MakeOption {
    id: number;
    title: string;
    slug: string;
}
  
export interface CategoryOption {
    id: number;
    title: string;
    slug: string;
}
  
export interface MakesResponse {
    success: boolean;
    message: string;
    data: MakeOption[];
}
  
export interface CategoriesResponse {
    success: boolean;
    message: string;
    data: CategoryOption[];
}