import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { getAllPropertiesSubTypeByCategory } from '@/services/propertyServices';
import { PropertyTypeResponse } from '@/types/propertyTypes';

export const usePropertySubType = () => {
  const options: UseQueryOptions<PropertyTypeResponse, Error> = {
    queryKey: ['propertySubType'],
    queryFn: () => getAllPropertiesSubTypeByCategory(),
    placeholderData: keepPreviousData,
  };

  return useQuery(options);
};