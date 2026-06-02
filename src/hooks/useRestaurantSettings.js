import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { restaurantConfig } from "../config/restaurant";
import { queryKeys } from "../lib/queryClient";
import settingsService from "../services/settings.service";

const normalizeSettings = (settings) => {
  if (!settings) return {};

  return {
    name: settings.restaurantName,
    address: settings.address,
    fullAddress: settings.fullAddress || settings.address,
    phone: settings.hotline,
    openingHours: settings.openingHours,
    logo: settings.logo,
    heroImage: settings.heroImage,
    facebook: settings.facebook,
    instagram: settings.instagram,
    zalo: settings.zalo,
    brandColor: settings.brandColor,
  };
};

export const useSettingsQuery = (options = {}) =>
  useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsService.getCurrent,
    retry: 1,
    ...options,
  });

export const useRestaurantSettings = () => {
  const { data } = useSettingsQuery();

  return useMemo(
    () => ({
      ...restaurantConfig,
      ...Object.fromEntries(
        Object.entries(normalizeSettings(data)).filter(([, value]) => value),
      ),
    }),
    [data],
  );
};
