import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingState from "../../../components/common/LoadingState";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getMenuId, useMenusQuery, useUpdateMenuMutation } from "../../../hooks/useMenuQueries";
import { showApiError } from "../../../utils/apiError";
import MenuForm from "./MenuForm";

const getMenuCategoryId = (item) =>
  item?.category_id || item?.categoryId || item?.category?.id || item?.category?._id || "";

export default function MenuEdit() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: menus = [], isLoading } = useMenusQuery();
  const menu = menus.find((item) => String(getMenuId(item)) === String(id));

  const updateMenuMutation = useUpdateMenuMutation({
    onSuccess: () => {
      toast.success(t("updateMenuSuccess"));
      navigate(`/admin/menu/${id}`);
    },
    onError: (error) => {
      console.error(error);
      showApiError(error, t("updateMenuFail"));
    },
  });

  if (isLoading) return <LoadingState label={t("loadingMenu")} />;
  if (!menu) return <Navigate to="/admin/menu" replace />;

  return (
    <section className="px-6 py-10">
      <div className="mb-8">
        <Link to={`/admin/menu/${id}`} className="text-sm font-semibold text-emerald-600">
          {menu.name}
        </Link>
        <h2 className="mt-3 text-3xl font-semibold text-gray-900">{t("editMenu")}</h2>
      </div>

      <MenuForm
        key={id}
        initialValues={{
          name: menu.name || "",
          price: menu.price || "",
          category_id: getMenuCategoryId(menu),
          description: menu.description || "",
        }}
        initialImage={menu.image || ""}
        submitLabel={t("saveChanges")}
        submitting={updateMenuMutation.isPending}
        onSubmit={(payload) => updateMenuMutation.mutate({ id, payload })}
      />
    </section>
  );
}
