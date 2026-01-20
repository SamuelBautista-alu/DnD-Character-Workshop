import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

export default function LoginPage() {
  const navigate = useNavigate();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate("/");
    } catch {
      // Error is already in store
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-8"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "var(--foreground)" }}
        >
          {t("auth.login.title")}
        </h2>

        {error && (
          <div
            className="mb-4 p-3 rounded border"
            style={{
              backgroundColor: "#fde2e2",
              color: "#8b2635",
              borderColor: "#c5a3a3",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {t("auth.login.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--input-background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
              placeholder={t("auth.login.emailPlaceholder")}
              required
              disabled={isLoading}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 0 2px var(--ring)`)
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
          </div>

          <div>
            <label
              className="block font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {t("auth.login.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-24 rounded transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--input-background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
                placeholder="••••••••"
                required
                disabled={isLoading}
                onFocus={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px var(--ring)`)
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 my-auto px-3 py-1 text-sm font-semibold rounded transition-all"
                style={{
                  color: "var(--primary)",
                  backgroundColor: "transparent",
                  border: "1px solid var(--border)",
                }}
                disabled={isLoading}
              >
                {showPassword ? "Hide" : t("auth.login.showPassword")}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded font-semibold transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
            disabled={isLoading}
          >
            {isLoading ? t("auth.login.loading") : t("auth.login.signIn")}
          </button>
        </form>

        <p
          className="text-center mt-6"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t("auth.login.noAccount")}{" "}
          <a
            href="/register"
            className="font-semibold hover:underline transition-all"
            style={{ color: "var(--primary)" }}
          >
            {t("auth.login.register")}
          </a>
        </p>
      </div>
    </div>
  );
}
