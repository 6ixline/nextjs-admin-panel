'use client';
import React, { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import MultiSelect, { Option } from "@/components/form/input/MultiSelectInput";
import { ChevronDownIcon, PlusIcon, TrashBinIcon } from '@/icons';
import Button from '@/components/ui/button/Button';
import { PropertyFormSchema } from "@/validations/propertySchema";

interface Room {
    id: number;
    room_type: "private" | "double" | "triple" | "3plus";
    rent: string | number;
    security_deposit: string | number;
}

interface PGDetailsProps {
    register: UseFormRegister<PropertyFormSchema>;
    errors: FieldErrors<PropertyFormSchema>;
    setValue: UseFormSetValue<PropertyFormSchema>;
    watch: UseFormWatch<PropertyFormSchema>;
    pgForOptions: Option[];
    bestSuitedForOptions: Option[];
    mealTypeOptions: Option[];
    commonAreaOptions: Option[];
    roomTypeOptions: Array<{ value: string; label: string }>;
    selectedPGFor: Option[];
    selectedBestSuitedFor: Option[];
    selectedMealTypesFor: Option[];
    selectedCommonArea: Option[];
    onPGForChange: (options: Option[]) => void;
    onBestSuitedForChange: (options: Option[]) => void;
    onMealTypeChange: (options: Option[]) => void;
    onCommonAreaChange: (options: Option[]) => void;
}

export default function PropertyPGDetails({ 
    register, 
    errors, 
    setValue, 
    watch,
    pgForOptions,
    bestSuitedForOptions,
    mealTypeOptions,
    commonAreaOptions,
    roomTypeOptions,
    selectedPGFor,
    selectedBestSuitedFor,
    selectedMealTypesFor,
    selectedCommonArea,
    onPGForChange,
    onBestSuitedForChange,
    onMealTypeChange,
    onCommonAreaChange
}: PGDetailsProps) {
    const mealsAvailable = watch("meals_available");
    const rooms = watch("rooms") || [];

    const [roomIdCounter, setRoomIdCounter] = useState(() => {
        if (rooms && rooms.length > 0) {
            return Math.max(...rooms.map((r) => r.id)) + 1;
        }
        return 1;
    });
 
    // Add new room
    const addRoom = () => {
        const newRoom: Room = {
            id: roomIdCounter,
            room_type: "private",
            rent: "",
            security_deposit: ""
        };
        setValue("rooms", [...(rooms || []), newRoom], { shouldValidate: true });
        setRoomIdCounter(prev => prev + 1);
    };

    // Remove room - Fixed typing issue
    const removeRoom = (roomId: number) => {
        if (rooms) {
            const filteredRooms = rooms.filter((room) => room.id !== roomId);
            setValue("rooms", filteredRooms, { shouldValidate: true });
        }
    };

    // Update room field - Fixed typing issue
    const updateRoomField = (roomId: number, field: keyof Room, value: string | number) => {
        if (rooms) {
            const updatedRooms = rooms.map((room) => 
                room.id === roomId ? { ...room, [field]: value } : room
            );
            setValue("rooms", updatedRooms, { shouldValidate: true });
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PG Details</h3>
            
            {/* PG Name and Total Beds */}
            <div className="flex flex-row flex-wrap gap-3">
                <div className="flex-1">
                    <Label htmlFor="pg_name">PG Name *</Label>
                    <Input 
                        {...register("pg_name")} 
                        error={!!errors.pg_name} 
                        placeholder="Enter PG name"
                    />
                    {errors.pg_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.pg_name.message}</p>
                    )}
                </div>
                <div className="flex-1">
                    <Label htmlFor="total_beds">Total Beds *</Label>
                    <Input 
                        {...register("total_beds")} 
                        type="number"
                        min={1}
                        error={!!errors.total_beds} 
                        placeholder="Number of beds"
                    />
                    {errors.total_beds && (
                        <p className="text-red-500 text-sm mt-1">{errors.total_beds.message}</p>
                    )}
                </div>
            </div>

            {/* PG For and Best Suited For */}
            <div className="flex flex-row flex-wrap gap-3">
                <div className="flex-1">
                    <MultiSelect
                        label="PG is for *"
                        options={pgForOptions}
                        value={selectedPGFor}
                        onChange={onPGForChange}
                        disabled={false}
                    />
                    {errors.pg_for && (
                        <p className="text-red-500 text-sm mt-1">{errors.pg_for.message}</p>
                    )}
                </div>
                
                <div className="flex-1">
                    <MultiSelect
                        label="Best Suited For *"
                        options={bestSuitedForOptions}
                        value={selectedBestSuitedFor}
                        onChange={onBestSuitedForChange}
                        disabled={false}
                    />
                    {errors.best_suited_for && (
                        <p className="text-red-500 text-sm mt-1">{errors.best_suited_for.message}</p>
                    )}
                </div>
            </div>

            {/* Meals Section */}
            <div className="space-y-4">
                <div>
                    <Label>Meals Available *</Label>
                    <div className="flex gap-3 mt-2">
                        {[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" }
                        ].map((option) => (
                            <button
                                key={`meals_${option.value}`}
                                type="button"
                                onClick={() => setValue("meals_available", option.value as "yes" | "no", { shouldValidate: true })}
                                className={`px-4 py-2 rounded-md border transition-colors text-sm font-medium ${
                                    mealsAvailable === option.value 
                                        ? 'bg-blue-600 text-white border-blue-600' 
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    {errors.meals_available && (
                        <p className="text-red-500 text-sm mt-1">{errors.meals_available.message}</p>
                    )}
                </div>

                {mealsAvailable === "yes" && (
                    <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                        <MultiSelect
                            label="Select Meal Types:"
                            options={mealTypeOptions}
                            value={selectedMealTypesFor}
                            disabled={false}
                            onChange={onMealTypeChange}
                        />
                        {errors.meal_types && (
                            <p className="text-red-500 text-sm mt-1">{errors.meal_types.message}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Terms & Policies */}
            <div className="flex flex-row flex-wrap gap-3">
                <div className="flex-1">
                    <Label htmlFor="notice_period">Notice Period (Days) *</Label>
                    <Input 
                        {...register("notice_period")} 
                        type="number"
                        min={1}
                        error={!!errors.notice_period} 
                        placeholder="e.g., 30"
                    />
                    {errors.notice_period && (
                        <p className="text-red-500 text-sm mt-1">{errors.notice_period.message}</p>
                    )}
                </div>

                <div className="flex-1">
                    <Label htmlFor="lock_in_period">Lock in Period (Days) *</Label>
                    <Input 
                        {...register("lock_in_period")} 
                        type="number"
                        min={1}
                        error={!!errors.lock_in_period} 
                        placeholder="e.g., 90"
                    />
                    {errors.lock_in_period && (
                        <p className="text-red-500 text-sm mt-1">{errors.lock_in_period.message}</p>
                    )}
                </div>
            </div>

            {/* Common Areas */}
            <div className="space-y-4">
                <div className="w-full">
                    <MultiSelect
                        label="Common Areas (Optional)"
                        options={commonAreaOptions}
                        value={selectedCommonArea}
                        onChange={onCommonAreaChange}
                        disabled={false}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Select the common areas available in your PG accommodation.
                    </p>
                </div>
            </div>

            {/* Room Details Section */}
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center">
                    <div>
                        <Label>Room Details *</Label>
                        <p className="text-xs text-gray-500 mt-1">
                            Add different room configurations with their respective pricing.
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        startIcon={<PlusIcon />}
                        onClick={addRoom}
                    >
                        Add Room
                    </Button>
                </div>

                {(!rooms || rooms.length === 0) && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400">No rooms added yet. Click "Add Room" to add room details.</p>
                    </div>
                )}

                {rooms && rooms.length > 0 && (
                    <div className="space-y-4">
                        {rooms.map((room, index: number) => (
                            <div key={room.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h6 className="font-medium text-gray-900 dark:text-white">Room {index + 1}</h6>
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="bg-red-500"
                                        onClick={() => removeRoom(room.id)}
                                    >
                                        <TrashBinIcon />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor={`room_${room.id}_type`}>Room Type *</Label>
                                        <div className="relative">
                                            <Select
                                                value={room.room_type}
                                                onChange={(e) => updateRoomField(room.id, 'room_type', e.target.value as "private" | "double" | "triple" | "3plus")}
                                                options={roomTypeOptions}
                                                placeholder="Select Room Type"
                                                error={false}
                                                style={{backgroundColor: "white"}}
                                            />
                                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                                <ChevronDownIcon />
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor={`room_${room.id}_rent`}>Monthly Rent (₹) *</Label>
                                        <input
                                            id={`room_${room.id}_rent`}
                                            type="number"
                                            min={1}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Monthly rent"
                                            value={room.rent}
                                            onChange={(e) => updateRoomField(room.id, 'rent', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor={`room_${room.id}_deposit`}>Security Deposit (₹) *</Label>
                                        <input
                                            id={`room_${room.id}_deposit`}
                                            type="number"
                                            min={0}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Security deposit"
                                            value={room.security_deposit}
                                            onChange={(e) => updateRoomField(room.id, 'security_deposit', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {errors.rooms && errors.rooms.message && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                        <p className="text-sm">
                            {typeof errors.rooms.message === 'string' ? errors.rooms.message : ''}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}