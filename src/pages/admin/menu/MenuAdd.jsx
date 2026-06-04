import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getMenuId, useCreateMenuMutation } from "../../../hooks/useMenuQueries";
import { showApiError } from "../../../utils/apiError";
import MenuForm from "./MenuForm";

export default function MenuAdd() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const createMenuMutation = useCreateMenuMutation({
    onSuccess: (data) => {
      toast.success(t("createMenuSuccess"));
      const menu = data?.data || data?.item || data;
      const id = getMenuId(menu);
      navigate(id ? `/admin/menu/${id}` : "/admin/menu");
    },
    onError: (error) => {
      console.error(error);
      showApiError(error, t("createMenuFail"));
    },
  });

  return (
    <section className="px-6 py-10">
      <div className="mb-8">
        <Link to="/admin/menu" className="text-sm font-semibold text-emerald-600">
          {t("adminMenu")}
        </Link>
        <h2 className="mt-3 text-3xl font-semibold text-gray-900">{t("addMenu")}</h2>
      </div>

      <MenuForm
        requireImage
        submitLabel={t("createMenu")}
        submitting={createMenuMutation.isPending}
        onSubmit={(payload) => createMenuMutation.mutate(payload)}
      />
    </section>
  );
}
