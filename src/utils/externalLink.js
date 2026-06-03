export const getExternalHref = (value, type) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;

  if (type === "zalo") {
    const digits = value.replace(/\D/g, "");
    return digits ? `https://zalo.me/${digits}` : value;
  }

  return `https://${value}`;
};
