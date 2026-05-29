import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import menuService from "../services/menu.service";
import { queryKeys } from "../lib/queryClient";

export const getMenuId = (item) => item?.id ?? item?._id;

export const normalizeMenus = (data) =>
  Array.isArray(data) ? data : data?.items || data?.data || [];

const normalizeMenu = (data, fallback = {}) =>
  data?.data || data?.item || (data?.name ? data : null) || fallback;

export const useMenusQuery = (options = {}) =>
  useQuery({
    queryKey: queryKeys.menus,
    queryFn: menuService.getAll,
    select: normalizeMenus,
    ...options,
  });

export const useCreateMenuMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.create,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menus });
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useUpdateMenuMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => menuService.update(id, payload),
    ...options,
    onSuccess: (data, variables, context) => {
      const menu = normalizeMenu(data, variables.payload);
      queryClient.setQueryData(queryKeys.menus, (current) =>
        normalizeMenus(current).map((item) =>
          String(getMenuId(item)) === String(variables.id) ? { ...item, ...menu } : item,
        ),
      );
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useDeleteMenuMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.delete,
    ...options,
    onSuccess: (data, id, context) => {
      queryClient.setQueryData(queryKeys.menus, (current) =>
        normalizeMenus(current).filter((item) => String(getMenuId(item)) !== String(id)),
      );
      options.onSuccess?.(data, id, context);
    },
  });
};
