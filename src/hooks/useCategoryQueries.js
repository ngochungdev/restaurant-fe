import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoryService from "../services/category.service";
import { queryKeys } from "../lib/queryClient";

export const getCategoryId = (category) => category?.id ?? category?._id;
export const getCategoryName = (category) => category?.name || category?.title || category?.label || "";

export const normalizeCategories = (data) =>
  Array.isArray(data) ? data : data?.items || data?.data || data?.categories || [];

const normalizeCategory = (data, fallback = {}) =>
  data?.data || data?.item || (data?.name ? data : null) || fallback;

export const useCategoriesQuery = (options = {}) =>
  useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoryService.getAll,
    select: normalizeCategories,
    ...options,
  });

export const useCreateCategoryMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.create,
    ...options,
    onSuccess: (data, variables, context) => {
      const category = normalizeCategory(data, variables);
      queryClient.setQueryData(queryKeys.categories, (current) => [
        category,
        ...normalizeCategories(current),
      ]);
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdateCategoryMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => categoryService.update(id, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      const category = normalizeCategory(data, { ...variables.payload, id: variables.id });
      queryClient.setQueryData(queryKeys.categories, (current) =>
        normalizeCategories(current).map((item) =>
          String(getCategoryId(item)) === String(variables.id) ? { ...item, ...category } : item,
        ),
      );
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useDeleteCategoryMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.delete,
    ...options,
    onSuccess: (data, id, context) => {
      queryClient.setQueryData(queryKeys.categories, (current) =>
        normalizeCategories(current).filter((item) => String(getCategoryId(item)) !== String(id)),
      );
      options.onSuccess?.(data, id, context);
    },
  });
};
