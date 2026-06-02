import { useMutation } from "@tanstack/react-query";
import leadService from "../services/lead.service";

export const useCreateLeadMutation = (options = {}) =>
  useMutation({
    mutationFn: leadService.create,
    ...options,
  });
