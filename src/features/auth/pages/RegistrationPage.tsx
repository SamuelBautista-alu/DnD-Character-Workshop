import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store";
import { useLanguageStore } from "../../language/store";
import { getTranslation } from "@/lib/i18n";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError("");

    // Validation
    if (!username.trim()) {
      setValidationError(t("auth.register.usernameRequired"));
      return;
    }
    if (username.length < 3) {
      setValidationError(t("auth.register.usernameMinLength"));
      return;
    }
    if (!email.trim()) {
      setValidationError(t("auth.register.emailRequired"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError(t("auth.register.emailInvalid"));
      return;
    }
    if (password.length < 6) {
      setValidationError(t("auth.register.passwordMinLength"));
      return;
    }
    if (password !== confirmPassword) {
      setValidationError(t("auth.register.passwordMismatch"));
      return;
    }

    try {
      await register(username, email, password);
      navigate("/");
    } catch {
      // Error is already in store
    }
  };

  return (
    <div
      className="flex items-center justify-center p-4"
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
          {t("auth.register.title")}
        </h2>

        {(error || validationError) && (
          <div
            className="mb-4 p-3 rounded border"
            style={{
              backgroundColor: "#fde2e2",
              color: "#8b2635",
              borderColor: "#c5a3a3",
            }}
          >
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {t("auth.register.username")}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--input-background)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
              placeholder={t("auth.register.usernamePlaceholder")}
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
              {t("auth.register.email")}
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
              placeholder={t("auth.register.emailPlaceholder")}
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
              {t("auth.register.password")}
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
                {showPassword
                  ? t("auth.register.hidePassword")
                  : t("auth.register.showPassword")}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              {t("auth.register.confirmPassword")}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded transition-all focus:outline-none focus:ring-2"
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
            {isLoading ? t("auth.register.loading") : t("auth.register.signUp")}
          </button>
        </form>

        <p
          className="text-center mt-6"
          style={{ color: "var(--muted-foreground)" }}
        >
          {t("auth.register.haveAccount")}{" "}
          <a
            href="/login"
            className="font-semibold hover:underline transition-all"
            style={{ color: "var(--primary)" }}
          >
            {t("auth.register.signIn")}
          </a>
        </p>

        <p
          className="text-center mt-4"
          style={{ color: "var(--muted-foreground)" }}
        >
          <a
            href="/forgot-password"
            className="font-semibold hover:underline transition-all"
            style={{ color: "var(--primary)" }}
          >
            {t("auth.register.forgotPassword")}
          </a>
        </p>
      </div>
    </div>
  );
}
