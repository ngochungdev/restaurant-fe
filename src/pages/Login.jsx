import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useAuthStore from "../stores/auth.store";
import { authService } from "../services/auth.service";
import { useLanguage } from "../contexts/LanguageContext";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const loginStore = useAuthStore((state) => state.login);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      if (user && user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error(t('pleaseEnterUsernameAndPassword'));
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login(form);
      loginStore(res);
      if (res.user && res.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">{t('signIn')}</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">{t('username')}</label>
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          placeholder={t('username')}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          autoComplete="username"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">{t('password')}</label>
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          type="password"
          placeholder={t('password')}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
        />

        <button
          type="submit"
          className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? t('signingIn') : t('signIn')}
        </button>

        {/* <div className="mt-4 text-center text-sm text-gray-600">
          {t('noAccountYet')}{' '}
          <button
            type="button"
            className="text-emerald-600 hover:underline"
            onClick={() => navigate('/register')}
          >
            {t('signUp')}
          </button>
        </div> */}
      </form>
    </div>
  );
}
