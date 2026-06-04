import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import aboutUsService from "../services/about-us.service";

export const useAboutUsQuery = (options = {}) =>
  useQuery({
    queryKey: queryKeys.aboutUs,
    queryFn: aboutUsService.getCurrent,
    retry: 1,
    ...options,
  });

export const useUpdateAboutUsMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: aboutUsService.updateCurrent,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(queryKeys.aboutUs, data);
      options.onSuccess?.(data, variables, context);
    },
  });
};
