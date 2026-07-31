import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  LogIn,
  ShieldCheck,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import CBRILogo from "../../assets/logos/CSIRCBRI-Logo.jpg";
import SmartVillageLogo from "../../assets/logos/SmartVillage.jpeg";
import { loginAdmin } from "../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(form);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[minmax(0,1fr)_480px]">
          <div className="hidden bg-blue-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <img
                  src={CBRILogo}
                  alt="CSIR-CBRI"
                  className="h-16 w-16 rounded-lg bg-white object-contain p-2"
                />
                <img
                  src={SmartVillageLogo}
                  alt="Smart Village"
                  className="h-16 w-16 rounded-lg bg-white object-contain p-2"
                />
              </div>

              <p className="mt-10 text-sm font-semibold uppercase tracking-wider text-blue-100">
                Secure Admin Portal
              </p>

              <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight">
                CSIR Smart Village Mission
              </h1>

              <p className="mt-4 max-w-lg leading-7 text-blue-100">
                Manage content, village data, surveys, events, media, and
                project information through the CMS dashboard.
              </p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} />
                <div>
                  <p className="font-semibold">Authorized access only</p>
                  <p className="text-sm text-blue-100">
                    Use your assigned admin credentials to continue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <img
                src={CBRILogo}
                alt="CSIR-CBRI"
                className="h-12 w-12 rounded-lg border border-slate-200 object-contain p-1"
              />
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  CSIR Smart Village
                </p>
                <p className="text-xs text-slate-500">
                  CMS Admin Portal
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Lock size={24} />
              </div>

              <h2 className="text-3xl font-bold text-slate-950">
                Admin Login
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Sign in to manage the Smart Village CMS.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Username
                </span>
                <span className="relative block">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="Enter username"
                    className={inputClass}
                    value={form.username}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        username: event.target.value,
                      })
                    }
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </span>
                <span className="relative block">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className={`${inputClass} pr-12`}
                    value={form.password}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        password: event.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 rounded-md p-2 text-slate-400 transition -translate-y-1/2 hover:bg-slate-100 hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn size={18} />
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
