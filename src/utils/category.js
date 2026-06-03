export const getMenuCategoryLabel = (item) => {
  const category = item?.category || item?.categoryName || item?.category_id;

  if (!category) return "";
  if (typeof category === "string") return category;

  return category.name || category.title || category.label || "";
};
