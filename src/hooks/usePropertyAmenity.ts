import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { getAllAmenities } from '@/services/propertyServices';
import { AmenityResponse } from '@/types/propertyTypes';

export const useProepertyAmenity = () => {
  const options: UseQueryOptions<AmenityResponse, Error> = {
    queryKey: ['propertyAmenity'],
    queryFn: () => getAllAmenities(),
    placeholderData: keepPreviousData,
  };

  return useQuery(options);
};