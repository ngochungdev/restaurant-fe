import LoadingState from "../components/common/LoadingState";
import { useLanguage } from "../contexts/LanguageContext";
import { useAboutUsQuery } from "../hooks/useAboutUs";

export default function AboutUsPage() {
  const { t } = useLanguage();
  const { data: aboutUs, isLoading } = useAboutUsQuery();

  const title = aboutUs?.title || t("aboutHeadline");
  const description = aboutUs?.description || t("aboutText");
  const image =
    aboutUs?.image ||
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop";

  if (isLoading) return <LoadingState label="Loading about us..." />;

  return (
    <section className="bg-gray-100 px-6 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <img
          src={image}
          alt={title}
          className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
        />

        <div>
          <p className="font-semibold uppercase tracking-widest text-orange-500">
            {t('aboutUs')}
          </p>

          <h2 className="mt-4 text-5xl font-bold">{title}</h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
