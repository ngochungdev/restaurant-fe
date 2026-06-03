export const getRawPriceValue = (value) => String(value ?? "").replace(/,/g, "");

export const formatPriceInput = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "").replace(/^0+(?=\d)/, "");

  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatPrice = (value) => {
  const rawValue = getRawPriceValue(value);
  if (!rawValue) return "";

  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) return value ?? "";

  return new Intl.NumberFormat("en-US").format(numericValue);
};
