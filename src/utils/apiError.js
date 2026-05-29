import { toast } from "sonner";

export const getApiErrorMessages = (error, fallback) => {
  const detail = error?.response?.data;

  if (!detail) return [fallback];

  const errors = detail.errors || detail.message || detail;

  if (Array.isArray(errors)) {
    return errors.map(String);
  }

  if (typeof errors === "object") {
    const messages = Object.values(errors)
      .flat()
      .filter((message) => typeof message === "string");

    return messages.length > 0 ? messages : [fallback];
  }

  return [String(errors)];
};

export const showApiError = (error, fallback) => {
  getApiErrorMessages(error, fallback).forEach((message) => {
    toast.error(message);
  });
};
