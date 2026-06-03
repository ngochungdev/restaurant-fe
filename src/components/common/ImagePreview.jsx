import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ImagePreview({ alt, className = "", src, type }) {
  const { t } = useLanguage();
  const [hasError, setHasError] = useState(false);
  const previewClassName =
    type === "logo"
      ? "h-24 w-24 rounded-full object-cover"
      : "aspect-[16/7] w-full rounded-2xl object-cover";

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div className={`rounded-2xl border border-gray-200 bg-gray-50 p-4 ${className}`}>
      {!src || hasError ? (
        <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
          {t("imagePreviewUnavailable")}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className={previewClassName}
        />
      )}
    </div>
  );
}
