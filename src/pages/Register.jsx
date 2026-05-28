import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { useLanguage } from "../contexts/LanguageContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error(t('pleaseEnterUsernameAndPassword'));
      return;
    }

    if (form.password.length < 6) {
      toast.error(t('passwordMinLength'));
      return;
    }

    try {
      setLoading(true);
      await authService.register(form);
      toast.success(t('registerSuccess'));
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(t('registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleRegister} className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">{t('signUp')}</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">{t('username')}</label>
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          placeholder={t('username')}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">{t('password')}</label>
        <input
          className="w-full mb-4 px-3 py-2 border rounded"
          type="password"
          placeholder={t('password')}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? t('signingUp') : t('signUp')}
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {t('alreadyHaveAccount')}{' '}
          <button type="button" className="text-emerald-600 hover:underline" onClick={() => navigate('/login')}>
            {t('signIn')}
          </button>
        </div>
      </form>
    </div>
  );
}