'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import FileInput from "@/components/form/input/FileInput";
import Button from '@/components/ui/button/Button';
import { ChevronDownIcon, EditIcon, EyeCloseIcon, EyeIcon, PlusIcon } from '@/icons';

import { getUser, createUser, updateUser } from "@/services/userServices";
import { userSchema, UserFormSchema } from "@/validations/userSchema";
import { CreateUser, UserUpdate } from "@/types/userTypes";
import { uploadSingleFile } from "@/services/fileUploadServices";
import { ExistingFile, FileUploadData } from "@/types/fileTypes";

export default function InternalUserForm() {
  const { id } = useParams();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUploadedFiles, setCurrentUploadedFiles] = useState<FileUploadData[]>([]);
  const [currentExistingFiles, setCurrentExistingFiles] = useState<(File | ExistingFile)[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (id && id[0]) {
      setIsLoading(true);
      getUser(id[0])
        .then((data) => {
          const status = data.status === "active" || data.status === "inactive" ? data.status : "active";

          if (data && data.fileData) {
            setCurrentExistingFiles(data.fileData);
          }

          reset({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            status,
          });
        })
        .catch(() => toast.error("Error loading user."))
        .finally(() => setIsLoading(false));
    }
  }, [id, reset]);

  const displayFiles = useMemo(() => {
    const existingFiles = currentExistingFiles;
    const uploadedFiles = currentUploadedFiles.map(file => file.file);
    return [...existingFiles, ...uploadedFiles];
  }, [currentExistingFiles, currentUploadedFiles]);

  const onSubmit = async (data: UserFormSchema) => {
    try {
      if (Array.isArray(id) && id[0]) {
        // Update — role doesn't change on edit, backend keeps existing role
        const updateData: UserUpdate = {
          ...data,
          fileid: undefined,
          filesToDelete,
        };

        if (Array.isArray(currentUploadedFiles) && currentUploadedFiles[0]?.id) {
          updateData.fileid = currentUploadedFiles[0].id;
        }

        const response = await updateUser(id[0], updateData);
        toast.success(response.message);
      } else {
        if (!data.password) {
          toast.error("Password is required.");
          return;
        }

        // Create — hardcode role: 'internal' so admin cannot accidentally create a dealer here
        const createUserData: CreateUser = {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          status: data.status,
          password: data.password,
          role: 'internal', 
          fileid: undefined,
        };

        if (currentUploadedFiles && currentUploadedFiles[0]?.id) {
          createUserData.fileid = currentUploadedFiles[0].id;
        }

        const response = await createUser(createUserData);
        toast.success(response.message);
      }

      router.push("/internal-user");
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message;
      toast.error(`${message}`);
    }
  };

  const handleNewFilesChange = async (files: File[]) => {
    try {
      if (!Array.isArray(files) || files.length === 0) return;

      const currentFileCount = currentUploadedFiles.length + currentExistingFiles.length;
      if (currentFileCount >= 1) {
        toast.error("Please remove the old file first");
        return;
      }

      const data = {
        ownerType: 'user' as const,
        ownerid: undefined,
        file: files[0],
        type: 'profile_pic' as const,
      };

      const response = await uploadSingleFile(data);

      if (response.success) {
        const uploadedFile: FileUploadData = {
          file: files[0],
          id: response.data.id,
        };
        setCurrentUploadedFiles([uploadedFile]);
        toast.success("Profile picture uploaded successfully");
      } else {
        toast.error("Error uploading profile picture");
      }
    } catch {
      toast.error("Error uploading profile picture");
    }
  };

  const handleFileRemoval = (fileId: string | undefined, fileName: string) => {
    setCurrentExistingFiles(prev =>
      prev.filter(file => {
        if ("fileid" in file) return (file as ExistingFile).fileid !== fileId;
        return file.name !== fileName;
      })
    );

    setCurrentUploadedFiles(prev =>
      prev.filter(uploaded => {
        const byId = fileId !== undefined ? String(uploaded.id) !== String(fileId) : true;
        const byName = uploaded.file.name !== fileName;
        return byId && byName;
      })
    );

    if (fileId) {
      setFilesToDelete(prev => [...prev, fileId]);
    }
  };

  return (
    <div>
      <PageBreadcrumb
        pageTitle={id ? "Edit Internal User" : "Add Internal User"}
        showNewButton={false}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-5 xl:py-6 space-y-6">

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              error={!!errors.name?.message}
              hint={errors.name?.message}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              error={!!errors.email?.message}
              hint={errors.email?.message}
            />
          </div>

          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              {...register("mobile")}
              error={!!errors.mobile?.message}
              hint={errors.mobile?.message}
            />
          </div>

          
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter password"
                error={!!errors.password?.message}
                hint={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label>Profile Image</Label>
            <FileInput
              onFilesChange={handleNewFilesChange}
              multiple={false}
              maxFiles={1}
              fileTypes={['image', 'pdf']}
              initialFiles={displayFiles}
              onFileRemove={handleFileRemoval}
            />
          </div>

          <div>
            <Label>Status</Label>
            <div className="relative">
              <Select
                {...register("status")}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                placeholder="Select Status"
                error={!!errors.status}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <div className="flex flex-row gap-3">
            <Button
              type="submit"
              size="sm"
              variant="primary"
              startIcon={id ? <EditIcon /> : <PlusIcon />}
            >
              {id ? "Update" : "Add"}
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