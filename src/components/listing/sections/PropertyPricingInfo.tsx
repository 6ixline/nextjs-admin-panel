import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { ChevronDownIcon } from '@/icons';
import { PropertyFormSchema } from '@/validations/propertySchema';

interface PropertyPricingInfoProps {
  register: UseFormRegister<PropertyFormSchema>;
  errors: FieldErrors<PropertyFormSchema>;
  watch: UseFormWatch<PropertyFormSchema>;
}

const possessionStatusData = [
  {value: "ready_to_move", label: "Ready to Move"},
  {value: "under_construction", label: "Under Construction"},
];

const possessionPlotStatusData = [
  {value: "immediate", label: "Immediate"},
  {value: "in_future", label: "In Future"},
];

const isPreleasedData = [
  {value: "yes", label: "Yes"},
  {value: "no", label: "No"},
];

export default function PropertyPricingInfo({ register, watch, errors }: PropertyPricingInfoProps) {

  const service = watch("service");
  const propertyType = watch("propertyType");
  const propertySubType = watch("propertySubType");
  const isPreleased = watch("isPreleased");
  const possessionStatus = watch("possessionStatus");

  // check if plot type
  const plotSubTypes = ["20", "21"]; 
  const isPlotType = plotSubTypes.includes(propertySubType || "");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing Information</h3>
      {
        service === "rent" && (
        <>
          <div className="flex flex-row flex-wrap gap-3">
            <div className="flex-1">
              <Label htmlFor="price">Monthly Rent</Label>
              <Input 
                id="price"
                {...register("price", { valueAsNumber: true })} 
                error={!!errors.price?.message} 
                hint={errors.price?.message} 
              />
            </div>
          </div>

          {propertyType == "residential" && <div className="flex flex-row flex-wrap gap-3">
            <div className="flex-1">
              <Label htmlFor="availableFrom">Available from</Label>
              <Input 
                type="date" 
                id="availableFrom" 
                {...register("availableFrom")} 
                error={!!errors.availableFrom?.message} 
                hint={errors.availableFrom?.message} 
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="securityDeposit">Security Deposit (in month)</Label>
              <Input 
                type="number"
                min={0} 
                id="securityDeposit" 
                {...register("securityDeposit")} 
                error={!!errors.securityDeposit?.message} 
                hint={errors.securityDeposit?.message} 
              />
            </div>
          </div>
          }
        </>
        )
      }

        {/* SELL TYPE FIELDS */}
        {service === "sell" && (
          <>
              {/* For Plot/Agricultural Land */}
              {isPlotType ? (
                  <>
                      <div className="flex flex-row flex-wrap gap-3">
                        <div className="flex-1">
                            <Label htmlFor="price">Plot Price *</Label>
                            <Input 
                                id="price" 
                                {...register("price", { valueAsNumber: true })} 
                                error={!!errors.price?.message} 
                                hint={errors.price?.message} 
                            />
                        </div>
                      
                        {/* Possession Status */}
                        {propertyType == "residential" &&
                          <div className="flex-1">
                            <Label htmlFor="possessionStatus">Possession Status</Label>
                            <div className="relative">
                              <Select
                                {...register("possessionStatus")}
                                options={[...possessionPlotStatusData]}
                                placeholder="Select Possesion Status"
                                error={!!errors.possessionStatus}
                              />
                              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                <ChevronDownIcon />
                              </span>
                            </div>
                            {errors.possessionStatus && (
                              <p className="text-red-500 text-sm mt-1">{errors.possessionStatus.message}</p>
                            )}
                          </div>
                        }
                      </div>
                      {/* Possession Date */}
                      { propertyType == "residential" && possessionStatus === "in_future" &&   <div className="flex-1">
                          <Label htmlFor="possessionDate">Possession Date</Label>
                          <Input 
                              id="possessionDate" 
                              type="date" 
                              {...register("possessionDate")} 
                              error={!!errors.possessionDate?.message} 
                              hint={errors.possessionDate?.message} 
                          />
                      </div>
                      }
                  </>
              ) : (
                  /* For other property types (not plot/agricultural) */
                  <>
                     <div className="flex flex-row flex-wrap gap-3">
                     <div className="flex-1">
                          <Label htmlFor="price">Property Price</Label>
                          <Input 
                              id="price" 
                              {...register("price", { valueAsNumber: true })} 
                              error={!!errors.price?.message} 
                              hint={errors.price?.message} 
                          />
                      </div>

                      {/* Construction Status */}
                      {propertyType == "residential" &&
                        <div className="flex-1">
                            <Label htmlFor="possessionStatus">Possession Status</Label>
                            <div className="relative">
                              <Select
                                {...register("possessionStatus")}
                                options={[...possessionStatusData]}
                                placeholder="Select Possession Status"
                                error={!!errors.possessionStatus}
                              />
                              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                <ChevronDownIcon />
                              </span>
                            </div>
                            {errors.possessionStatus && (
                              <p className="text-red-500 text-sm mt-1">{errors.possessionStatus.message}</p>
                            )}
                        </div>
                      }
                      </div>
                      {/* Possession Date */}
                      { propertyType == "residential" && possessionStatus === "under_construction"  && 
                        <div className="flex-1">
                            <Label htmlFor="possessionDate">Possession Date</Label>
                            <Input 
                                id="possessionDate" 
                                type="date" 
                                {...register("possessionDate")} 
                                error={!!errors.possessionDate?.message} 
                                hint={errors.possessionDate?.message} 
                            />
                        </div>
                      }
                  </>
              )}
          </>
      )}

      { propertyType == "commercial" && service == "sell" && 
        <> 
          <div className="flex-1">
            <Label htmlFor="">Is it pre-leased/pre-rented?</Label>
            <div className="relative">
              <Select
                {...register("isPreleased")}
                options={[...isPreleasedData]}
                placeholder="Select Lease/Rent Status"
                error={!!errors.isPreleased}
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.isPreleased && (
              <p className="text-red-500 text-sm mt-1">{errors.isPreleased.message}</p>
            )}
          </div>
          {isPreleased === "yes" && 
            <>
              <div className="flex-1">
                  <Label htmlFor="currentRent">Current Rent per month</Label>
                  <Input 
                      id="currentRent" 
                      {...register("currentRent")} 
                      error={!!errors.currentRent?.message} 
                      hint={errors.currentRent?.message} 
                  />
              </div>
              <div className="flex-1">
                  <Label htmlFor="leaseYears">Lease years</Label>
                  <Input 
                      id="leaseYears" 
                      {...register("leaseYears")} 
                      error={!!errors.leaseYears?.message} 
                      hint={errors.leaseYears?.message} 
                  />
              </div>
            </>
          }
          {isPreleased === "no" && 
            <div className="flex-1">
                <Label htmlFor="roi">Expected Return on Investment</Label>
                <Input 
                    id="roi" 
                    type="text" 
                    {...register("roi")} 
                    error={!!errors.roi?.message} 
                    hint={errors.roi?.message} 
                    msg='Note: Enter percentage value'
                />
            </div>
          }
        </>
      }


    </div>
  );
}