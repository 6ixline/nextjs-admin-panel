'use client'

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';

import { EyeCloseIcon, EyeIcon } from '@/icons';
import { adminChangePasswordSchema, AdminChangePasswordFormSchema } from "@/validations/userSchema";
import { useAdminUser } from "@/hooks/useAdminUser";
import { changePassword } from "@/services/dashboardServices";
import { PasswordChange } from "@/types/formTypes";

export default function ChangePassword() {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    const { data, isLoading, error} = useAdminUser();

    const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
    } = useForm<AdminChangePasswordFormSchema>({
        resolver: zodResolver(adminChangePasswordSchema),
        defaultValues: {
            username: data?.data.username,
            newpassword: "",
            oldpassword: "",
        },
    });

    useEffect(()=>{
        if (data?.data?.username) {
            setIsDisabled(false);
            setValue("username", data.data.username);
        }
    }, [data]);

    const onSubmit = async (data: AdminChangePasswordFormSchema) => {
        try {
            setIsDisabled(true);
            if(data.oldpassword && data.newpassword){
                const requestData : PasswordChange = {
                    oldpassword: data.oldpassword,
                    newpassword: data.newpassword
                }
               const response = await changePassword(requestData);
               setValue("oldpassword", "");
               setValue("newpassword", "");
               toast.success(response.message);
            }else{
                toast.error("Enter Old and New password");
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error.message;
            toast.error(message);
        } finally{
            setIsDisabled(false);
        }
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Change Password" showNewButton={false} />
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-5 xl:py-6 space-y-6">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" {...register("username")} placeholder="Enter Username" readOnly error={!!errors.username} />
                    </div>
                    <div>
                        <Label htmlFor="oldpassword">Old Password *</Label>
                        <div className="relative">
                            <Input
                                id="oldpassword"
                                type={showOldPassword ? "text" : "password"}
                                {...register("oldpassword")}
                                placeholder="Enter your old password"
                                error={!!errors.oldpassword}
                                hint={errors.oldpassword?.message}
                            />
                            <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                            {showOldPassword ? <EyeIcon className="fill-gray-500" /> : <EyeCloseIcon className="fill-gray-500" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="newpassword">New Password *</Label>
                        <div className="relative">
                            <Input
                                id="newpassword"
                                type={showNewPassword ? "text" : "password"}
                                {...register("newpassword")}
                                placeholder="Enter your new password"
                                error={!!errors.newpassword}
                                hint={errors.newpassword?.message}
                            />
                            <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                            {showNewPassword ? <EyeIcon className="fill-gray-500" /> : <EyeCloseIcon className="fill-gray-500" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400 italic text-xs">Note: Password should be minimum of 6 characters</p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <Button disabled={isDisabled} type="submit" size="sm" variant="primary">
                            Change Password
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
/*
*/