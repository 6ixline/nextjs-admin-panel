import { z } from "zod";

export const productSchema = z.object({
  makeId: z.number({
    required_error: "Make is required",
    invalid_type_error: "Make must be selected",
  }).min(1, "Make is required"),
  
  categoryId: z.number({
    required_error: "Category is required",
    invalid_type_error: "Category must be selected",
  }).min(1, "Category is required"),
  
  name: z.string().min(1, "Product name is required").max(200, "Product name must be less than 200 characters"),
  
  product_code: z.string().min(1, "Product code is required").max(100, "Product code must be less than 100 characters"),
  
  status: z.enum(["active", "inactive", "out_of_stock"]),
  
  ref_code: z.string().max(500, "Reference code must be less than 500 characters").nullable().optional(),

  keyword: z.string().max(500, "Reference code must be less than 500 characters").nullable().optional(),
  
  color: z.string().max(50, "Color must be less than 50 characters").nullable().optional(),
  
  mrp: z.string().nullable().optional(),
  
  std_pkg: z.string().max(50, "Standard package must be less than 50 characters").nullable().optional(),
  
  mast_pkg: z.string().max(50, "Master package must be less than 50 characters").nullable().optional(),
  
  lumax_part_no: z.string().max(100, "Lumax part number must be less than 100 characters").nullable().optional(),
  
  varroc_part_no: z.string().max(100, "Varroc part number must be less than 100 characters").nullable().optional(),
  
  butter_size: z.string().max(50, "Butter size must be less than 50 characters").nullable().optional(),
  
  pt_bc: z.string().max(50, "PT B/C must be less than 50 characters").nullable().optional(),
  
  pt_tc: z.string().max(50, "PT T/C must be less than 50 characters").nullable().optional(),
  
  shell_name: z.string().max(100, "Shell name must be less than 100 characters").nullable().optional(),
  
  ic_box_size: z.string().max(50, "IC box size must be less than 50 characters").nullable().optional(),
  
  mc_box_size: z.string().max(50, "MC box size must be less than 50 characters").nullable().optional(),
  
  graphic: z.string().max(255, "Graphic must be less than 255 characters").nullable().optional(),
  
  varroc_mrp: z.string().nullable().optional(),
  
  lumax_mrp: z.string().nullable().optional(),
  
  visor_glass: z.string().max(100, "Visor glass must be less than 100 characters").nullable().optional(),
});

export type ProductFormSchema = z.infer<typeof productSchema>;