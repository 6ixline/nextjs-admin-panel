import { PaginationMeta } from "./paginationType";

export interface Make {
  id: number;
  title: string;
  slug: string;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
}

export interface Creator {
  id: number;
  username: string;
  displayName: string;
}

export interface ProductImage {
  id: number;
  url: string;
  name: string;
}

export interface Product {
  id: number;
  make_id: number;
  category_id: number;
  name: string;
  product_code: string;
  ref_code: string | null;
  keyword: string | null;
  color: string | null;
  mrp: string | null;
  std_pkg: string | null;
  mast_pkg: string | null;
  lumax_part_no: string | null;
  varroc_part_no: string | null;
  butter_size: string | null;
  pt_bc: string | null;
  pt_tc: string | null;
  shell_name: string | null;
  ic_box_size: string | null;
  mc_box_size: string | null;
  graphic: string | null;
  varroc_mrp: string | null;
  lumax_mrp: string | null;
  visor_glass: string | null;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_by: number | null;
  updated_by: number | null;
  createdAt: string;
  updatedAt: string;
  make: Make;
  category: Category;
  creator: Creator;
  thumbnail: string | null;
  images: ProductImage[];
}

export interface PaginatedProductsResponse {
  data: Product[];
  pagination: PaginationMeta;
}

export interface GetAllProductsParams {
  page: number;
  limit: number;
  search: string;
  makeId?: number;
  categoryId?: number;
  status?: string | string[];
  refCode?: string;
  sortBy: string;
  order: 'asc' | 'desc';
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductUpdate {
  productData?: {
    makeId?: number;
    categoryId?: number;
    name?: string;
    product_code?: string;
    ref_code?: string | null;
    keyword?: string | null;
    color?: string | null;
    mrp?: string | null;
    std_pkg?: string | null;
    mast_pkg?: string | null;
    lumax_part_no?: string | null;
    varroc_part_no?: string | null;
    butter_size?: string | null;
    pt_bc?: string | null;
    pt_tc?: string | null;
    shell_name?: string | null;
    ic_box_size?: string | null;
    mc_box_size?: string | null;
    graphic?: string | null;
    varroc_mrp?: string | null;
    lumax_mrp?: string | null;
    visor_glass?: string | null;
    status?: 'active' | 'inactive' | 'out_of_stock';
  };
  imageIds?: number[];
  imagesToDelete?: number[];
}

export interface CreateProduct {
  productData: {
    makeId: number;
    categoryId: number;
    name: string;
    product_code: string;
    ref_code?: string | null;
    keyword?: string | null;
    color?: string | null;
    mrp?: string | null;
    std_pkg?: string | null;
    mast_pkg?: string | null;
    lumax_part_no?: string | null;
    varroc_part_no?: string | null;
    butter_size?: string | null;
    pt_bc?: string | null;
    pt_tc?: string | null;
    shell_name?: string | null;
    ic_box_size?: string | null;
    mc_box_size?: string | null;
    graphic?: string | null;
    varroc_mrp?: string | null;
    lumax_mrp?: string | null;
    visor_glass?: string | null;
    status?: 'active' | 'inactive' | 'out_of_stock';
  };
  imageIds?: number[];
}