'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import FileInput from "@/components/form/input/FileInput";
import SearchableSelect from "@/components/form/input/SearchableSelect";
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon, EditIcon, PlusIcon } from '@/icons';

import { getProduct, createProduct, updateProduct } from "@/services/productServices";
import { getActiveMakes, getActiveCategories } from "@/services/makeCategoryServices";
import { productSchema, ProductFormSchema } from "@/validations/productSchema";
import { CreateProduct, ProductUpdate } from "@/types/productTypes";
import { uploadSingleFile } from "@/services/fileUploadServices";
import { ExistingFile, FileUploadData } from "@/types/fileTypes";
import { MakeOption, CategoryOption } from "@/types/makeCategoryTypes";

export default function ProductForm() {
  const { id } = useParams();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [makes, setMakes] = useState<MakeOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [currentUploadedFiles, setCurrentUploadedFiles] = useState<FileUploadData[]>([]);
  const [currentExistingFiles, setCurrentExistingFiles] = useState<(File | ExistingFile)[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      makeId: 0,
      categoryId: 0,
      name: "",
      product_code: "",
      ref_code: "",
      keyword: "",
      color: "",
      mrp: "",
      std_pkg: "",
      mast_pkg: "",
      lumax_part_no: "",
      varroc_part_no: "",
      butter_size: "",
      pt_bc: "",
      pt_tc: "",
      shell_name: "",
      ic_box_size: "",
      mc_box_size: "",
      graphic: "",
      varroc_mrp: "",
      lumax_mrp: "",
      visor_glass: "",
      status: "active",
    },
  });

  // Fetch makes and categories on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [makesRes, categoriesRes] = await Promise.all([
          getActiveMakes(),
          getActiveCategories()
        ]);
        
        if (makesRes.success && makesRes.data) {
          setMakes(makesRes.data);
        }
        
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        toast.error("Failed to load makes and categories");
      }
    };

    fetchDropdownData();
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (id && id[0]) {
      setIsLoading(true);
      getProduct(id[0])
        .then((data) => {
          // Set existing images
          if (data && data.images && data.images.length > 0) {
            const existingFiles: ExistingFile[] = data.images.map(img => ({
              fileid: String(img.id),
              name: img.name || 'product-image',
              type: 'product_image',
              preview: img.url,
            }));
            setCurrentExistingFiles(existingFiles);
          }
          
          // Reset form with product data
          reset({
            makeId: data.make_id || 0,
            categoryId: data.category_id || 0,
            name: data.name || "",
            product_code: data.product_code || "",
            ref_code: data.ref_code || "",
            keyword: data.keyword || "",
            color: data.color || "",
            mrp: data.mrp || "",
            std_pkg: data.std_pkg || "",
            mast_pkg: data.mast_pkg || "",
            lumax_part_no: data.lumax_part_no || "",
            varroc_part_no: data.varroc_part_no || "",
            butter_size: data.butter_size || "",
            pt_bc: data.pt_bc || "",
            pt_tc: data.pt_tc || "",
            shell_name: data.shell_name || "",
            ic_box_size: data.ic_box_size || "",
            mc_box_size: data.mc_box_size || "",
            graphic: data.graphic || "",
            varroc_mrp: data.varroc_mrp || "",
            lumax_mrp: data.lumax_mrp || "",
            visor_glass: data.visor_glass || "",
            status: data.status || "active",
          });
        })
        .catch(() => toast.error("Error loading product."))
        .finally(() => setIsLoading(false));
    }
  }, [id, reset]);

  // Compute display files for FileInput
  const displayFiles = useMemo(() => {
    const existingFiles = currentExistingFiles;
    const uploadedFiles = currentUploadedFiles.map(file => file.file);
    return [...existingFiles, ...uploadedFiles];
  }, [currentExistingFiles, currentUploadedFiles]);

  const onSubmit = async (data: ProductFormSchema) => {
    try {
      if (Array.isArray(id) && id[0]) {
        // Update existing product
        const updateData: ProductUpdate = {
          productData: {
            makeId: data.makeId,
            categoryId: data.categoryId,
            name: data.name,
            product_code: data.product_code,
            ref_code: data.ref_code || null,
            keyword: data.keyword || null,
            color: data.color || null,
            mrp: data.mrp || null,
            std_pkg: data.std_pkg || null,
            mast_pkg: data.mast_pkg || null,
            lumax_part_no: data.lumax_part_no || null,
            varroc_part_no: data.varroc_part_no || null,
            butter_size: data.butter_size || null,
            pt_bc: data.pt_bc || null,
            pt_tc: data.pt_tc || null,
            shell_name: data.shell_name || null,
            ic_box_size: data.ic_box_size || null,
            mc_box_size: data.mc_box_size || null,
            graphic: data.graphic || null,
            varroc_mrp: data.varroc_mrp || null,
            lumax_mrp: data.lumax_mrp || null,
            visor_glass: data.visor_glass || null,
            status: data.status,
          },
          imageIds: currentUploadedFiles.map(f => f.id).filter((id): id is number => id !== undefined),
          imagesToDelete: filesToDelete,
        };
        
        const response = await updateProduct(id[0], updateData);
        toast.success(response.message);
      } else {
        // Create new product
        const createProductData: CreateProduct = {
          productData: {
            makeId: data.makeId,
            categoryId: data.categoryId,
            name: data.name,
            product_code: data.product_code,
            ref_code: data.ref_code || null,
            keyword: data.keyword || null,
            color: data.color || null,
            mrp: data.mrp || null,
            std_pkg: data.std_pkg || null,
            mast_pkg: data.mast_pkg || null,
            lumax_part_no: data.lumax_part_no || null,
            varroc_part_no: data.varroc_part_no || null,
            butter_size: data.butter_size || null,
            pt_bc: data.pt_bc || null,
            pt_tc: data.pt_tc || null,
            shell_name: data.shell_name || null,
            ic_box_size: data.ic_box_size || null,
            mc_box_size: data.mc_box_size || null,
            graphic: data.graphic || null,
            varroc_mrp: data.varroc_mrp || null,
            lumax_mrp: data.lumax_mrp || null,
            visor_glass: data.visor_glass || null,
            status: data.status,
          },
          imageIds: currentUploadedFiles.map(f => f.id).filter((id): id is number => id !== undefined),
        };
        
        const response = await createProduct(createProductData);
        toast.success(response.message);
      }
      
      router.push("/product");
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message;
      toast.error(`${message}`);
    }
  };

  const handleNewFilesChange = async (files: File[]) => {
    try {
      if (!Array.isArray(files) || files.length === 0) {
        return;
      }

      const uploadPromises = files.map(file => {
        return uploadSingleFile({
          ownerType: 'product',
          ownerid: undefined, // Will be set to product ID on backend when saving
          file: file,
          type: 'product_image'
        });
      });

      const responses = await Promise.all(uploadPromises);
      
      const uploadedFiles: FileUploadData[] = responses
        .filter(response => response.success)
        .map((response, index) => ({
          file: files[index],
          id: response.data.id,
        }));

      setCurrentUploadedFiles(prev => [...prev, ...uploadedFiles]);
      toast.success(`${uploadedFiles.length} image(s) uploaded successfully`);
    } catch (err) {
      toast.error("Error while uploading images");
    }
  };

  const handleFileRemoval = (fileId: string | undefined, fileName: string) => {
    // Remove from existing files (coming from backend)
    setCurrentExistingFiles(prev =>
      prev.filter(file => {
        if ("fileid" in file) {
          return (file as ExistingFile).fileid !== fileId;
        }
        return file.name !== fileName;
      })
    );

    // Remove from uploaded files (just uploaded in this session)
    setCurrentUploadedFiles(prev =>
      prev.filter(uploaded => {
        const byId =
          fileId !== undefined
            ? String(uploaded.id) !== String(fileId)
            : true;
        const byName = uploaded.file.name !== fileName;
        return byId && byName;
      })
    );

    // Track deletions for backend only when we have a persisted id
    if (fileId) {
      setFilesToDelete(prev => [...prev, Number(fileId)]);
    }
  };

  const makeOptions = makes.map(make => ({
    value: make.id,
    label: make.title
  }));

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.title
  }));

  return (
    <div>
      <PageBreadcrumb pageTitle={id ? "Edit Product" : "Add New Product"} showNewButton={false} />
      
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-5 xl:py-6 space-y-6">
          
          {/* Make Selection */}
          <div>
            <Label htmlFor="makeId">Make <span className="text-red-500">*</span></Label>
            <Controller
              name="makeId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={makeOptions}
                  value={field.value}
                  onChange={(value) => field.onChange(Number(value))}
                  placeholder="Select Make"
                  error={!!errors.makeId}
                />
              )}
            />
            {errors.makeId && (
              <p className="mt-1 text-xs text-red-500">{errors.makeId.message}</p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <Label htmlFor="categoryId">Category <span className="text-red-500">*</span></Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={categoryOptions}
                  value={field.value}
                  onChange={(value) => field.onChange(Number(value))}
                  placeholder="Select Category"
                  error={!!errors.categoryId}
                />
              )}
            />
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
            <Input 
              id="name" 
              {...register("name")} 
              error={!!errors.name?.message} 
              hint={errors.name?.message} 
              placeholder="Enter product name"
            />
          </div>

          {/* Product Code */}
          <div>
            <Label htmlFor="product_code">Product Code <span className="text-red-500">*</span></Label>
            <Input 
              id="product_code" 
              {...register("product_code")} 
              error={!!errors.product_code?.message} 
              hint={errors.product_code?.message} 
              placeholder="Enter product code"
            />
          </div>

          {/* Two column layout for common fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ref_code">Reference Code</Label>
              <Input 
                id="ref_code" 
                {...register("ref_code")} 
                error={!!errors.ref_code?.message} 
                hint={errors.ref_code?.message} 
                placeholder="Enter reference code"
              />
              <p className="mt-1 text-xs text-gray-500 italic">Note: Enter reference code comma seperated</p>
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Input 
                id="color" 
                {...register("color")} 
                error={!!errors.color?.message} 
                hint={errors.color?.message} 
                placeholder="Enter color"
              />
            </div>
          </div>
          {/* keyword Field */}
          <div>
            <Label htmlFor="keyword">Keywords</Label>
            <Input 
              id="keyword" 
              {...register("keyword")} 
              error={!!errors.keyword?.message} 
              hint={errors.keyword?.message} 
              placeholder="Enter Keywords comma seperated"
            />
            <p className="mt-1 text-xs text-gray-500 italic">Note: Enter keywords comma seperated</p>
          </div>

          {/* Price Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="mrp">MRP</Label>
              <Input 
                id="mrp" 
                type="number"
                step="0.01"
                {...register("mrp")} 
                error={!!errors.mrp?.message} 
                hint={errors.mrp?.message} 
                placeholder="Enter MRP"
              />
            </div>

            <div>
              <Label htmlFor="varroc_mrp">Varroc MRP</Label>
              <Input 
                id="varroc_mrp" 
                type="number"
                step="0.01"
                {...register("varroc_mrp")} 
                error={!!errors.varroc_mrp?.message} 
                hint={errors.varroc_mrp?.message} 
                placeholder="Enter Varroc MRP"
              />
            </div>

            <div>
              <Label htmlFor="lumax_mrp">Lumax MRP</Label>
              <Input 
                id="lumax_mrp" 
                type="number"
                step="0.01"
                {...register("lumax_mrp")} 
                error={!!errors.lumax_mrp?.message} 
                hint={errors.lumax_mrp?.message} 
                placeholder="Enter Lumax MRP"
              />
            </div>
          </div>

          {/* Package Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="std_pkg">Standard Package</Label>
              <Input 
                id="std_pkg" 
                {...register("std_pkg")} 
                error={!!errors.std_pkg?.message} 
                hint={errors.std_pkg?.message} 
                placeholder="Enter standard package"
              />
            </div>

            <div>
              <Label htmlFor="mast_pkg">Master Package</Label>
              <Input 
                id="mast_pkg" 
                {...register("mast_pkg")} 
                error={!!errors.mast_pkg?.message} 
                hint={errors.mast_pkg?.message} 
                placeholder="Enter master package"
              />
            </div>
          </div>

          {/* Part Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="lumax_part_no">Lumax Part Number</Label>
              <Input 
                id="lumax_part_no" 
                {...register("lumax_part_no")} 
                error={!!errors.lumax_part_no?.message} 
                hint={errors.lumax_part_no?.message} 
                placeholder="Enter Lumax part number"
              />
            </div>

            <div>
              <Label htmlFor="varroc_part_no">Varroc Part Number</Label>
              <Input 
                id="varroc_part_no" 
                {...register("varroc_part_no")} 
                error={!!errors.varroc_part_no?.message} 
                hint={errors.varroc_part_no?.message} 
                placeholder="Enter Varroc part number"
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="butter_size">Butter Size</Label>
              <Input 
                id="butter_size" 
                {...register("butter_size")} 
                error={!!errors.butter_size?.message} 
                hint={errors.butter_size?.message} 
                placeholder="Enter butter size"
              />
            </div>

            <div>
              <Label htmlFor="shell_name">Shell Name</Label>
              <Input 
                id="shell_name" 
                {...register("shell_name")} 
                error={!!errors.shell_name?.message} 
                hint={errors.shell_name?.message} 
                placeholder="Enter shell name"
              />
            </div>
          </div>

          {/* PT Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="pt_bc">PT B/C</Label>
              <Input 
                id="pt_bc" 
                {...register("pt_bc")} 
                error={!!errors.pt_bc?.message} 
                hint={errors.pt_bc?.message} 
                placeholder="Enter PT B/C"
              />
            </div>

            <div>
              <Label htmlFor="pt_tc">PT T/C</Label>
              <Input 
                id="pt_tc" 
                {...register("pt_tc")} 
                error={!!errors.pt_tc?.message} 
                hint={errors.pt_tc?.message} 
                placeholder="Enter PT T/C"
              />
            </div>
          </div>

          {/* Box Sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ic_box_size">IC Box Size</Label>
              <Input 
                id="ic_box_size" 
                {...register("ic_box_size")} 
                error={!!errors.ic_box_size?.message} 
                hint={errors.ic_box_size?.message} 
                placeholder="Enter IC box size"
              />
            </div>

            <div>
              <Label htmlFor="mc_box_size">MC Box Size</Label>
              <Input 
                id="mc_box_size" 
                {...register("mc_box_size")} 
                error={!!errors.mc_box_size?.message} 
                hint={errors.mc_box_size?.message} 
                placeholder="Enter MC box size"
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="visor_glass">Visor Glass</Label>
              <Input 
                id="visor_glass" 
                {...register("visor_glass")} 
                error={!!errors.visor_glass?.message} 
                hint={errors.visor_glass?.message} 
                placeholder="Enter visor glass"
              />
            </div>

            <div>
              <Label htmlFor="graphic">Graphic</Label>
              <Input 
                id="graphic" 
                {...register("graphic")} 
                error={!!errors.graphic?.message} 
                hint={errors.graphic?.message} 
                placeholder="Enter graphic"
              />
            </div>
          </div>

          {/* Product Images - Multiple Upload */}
          <div>
            <Label>Product Images</Label>
            <FileInput
              onFilesChange={handleNewFilesChange}
              multiple={true}
              maxFiles={10}
              fileTypes={['image']}
              initialFiles={displayFiles}
              onFileRemove={handleFileRemoval}
            />
            <p className="mt-1 text-xs text-gray-500 italic">Note: You can upload multiple images (max 10) also try too keep the image size under 10 MB</p>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <div className="relative">
              <Select
                {...register("status")}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "out_of_stock", label: "Out of Stock" },
                ]}
                placeholder="Select Status"
                error={!!errors.status}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-3">
            <Button 
              type="submit" 
              size="sm" 
              variant="primary" 
              startIcon={id ? <EditIcon /> : <PlusIcon />}
            >
              {id ? "Update Product" : "Add Product"}
            </Button>
            
            {!id && (
              <Button
                type="button"
                onClick={() => {
                  reset();
                  setCurrentUploadedFiles([]);
                  setCurrentExistingFiles([]);
                  setFilesToDelete([]);
                }}
                size="sm"
                variant="primary"
                className="bg-red-400 hover:bg-red-600"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}