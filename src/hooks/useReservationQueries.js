import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import reservationService from "../services/reservationService";
import { queryKeys } from "../lib/queryClient";

const normalizeReservations = (data) => {
  const value = data?.data || data;

  return Array.isArray(value) ? value : value?.items || [];
};

export const useReservationsQuery = (options = {}) =>
  useQuery({
    queryKey: queryKeys.reservations,
    queryFn: reservationService.getAll,
    select: normalizeReservations,
    ...options,
  });

export const useCreateReservationMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationService.createReservation,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useAcceptReservationMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationService.acceptReservation,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useRejectReservationMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reservationService.rejectReservation,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations });
      options.onSuccess?.(data, variables, context);
    },
  });
};
