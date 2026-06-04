import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguageStore } from "../../language/store";
import { getTranslation } from "@/lib/i18n";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api/v1";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);

  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get token from URL parameters
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const validateForm = () => {
    if (!token.trim()) {
      setError(t("auth.resetPassword.tokenRequired"));
      return false;
    }

    if (!password) {
      setError(t("auth.resetPassword.passwordRequired"));
      return false;
    }

    if (password.length < 6) {
      setError(t("auth.resetPassword.passwordMinLength"));
      return false;
    }

    if (password !== confirmPassword) {
      setError(t("auth.resetPassword.passwordMismatch"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password,
      });

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || t("auth.resetPassword.error"));
    } finally {
      setIsLoading(false);
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
          {t("auth.resetPassword.title")}
        </h2>

        {success ? (
          <div className="space-y-4">
            <div
              className="p-4 rounded border"
              style={{
                backgroundColor: "#d1fae5",
                color: "#065f46",
                borderColor: "#a7f3d0",
              }}
            >
              <p className="text-sm font-medium">
                {t("auth.resetPassword.successMessage")}
              </p>
              <p className="text-xs mt-2">
                {t("auth.resetPassword.redirectMessage")}
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="font-semibold hover:underline transition-all"
                style={{ color: "var(--primary)" }}
              >
                {t("auth.resetPassword.goToLogin")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p
              className="text-center mb-6"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t("auth.resetPassword.description")}
            </p>

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
              {!token && (
                <div>
                  <label
                    className="block font-semibold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("auth.resetPassword.token")}
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-2 rounded transition-all focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--input-background)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    }}
                    placeholder={t("auth.resetPassword.tokenPlaceholder")}
                    required
                    disabled={isLoading}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = `0 0 0 2px var(--ring)`)
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  />
                </div>
              )}

              <div>
                <label
                  className="block font-semibold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {t("auth.resetPassword.newPassword")}
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
                    placeholder={t("auth.resetPassword.passwordPlaceholder")}
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
                      ? t("auth.resetPassword.hidePassword")
                      : t("auth.resetPassword.showPassword")}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="block font-semibold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {t("auth.resetPassword.confirmPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-24 rounded transition-all focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--input-background)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                    }}
                    placeholder={t("auth.resetPassword.confirmPlaceholder")}
                    required
                    disabled={isLoading}
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = `0 0 0 2px var(--ring)`)
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 my-auto px-3 py-1 text-sm font-semibold rounded transition-all"
                    style={{
                      color: "var(--primary)",
                      backgroundColor: "transparent",
                      border: "1px solid var(--border)",
                    }}
                    disabled={isLoading}
                  >
                    {showConfirmPassword
                      ? t("auth.resetPassword.hidePassword")
                      : t("auth.resetPassword.showPassword")}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
                disabled={isLoading}
              >
                {isLoading
                  ? t("auth.resetPassword.loading")
                  : t("auth.resetPassword.submit")}
              </button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/login")}
                className="font-semibold hover:underline transition-all"
                style={{ color: "var(--primary)" }}
              >
                {t("auth.resetPassword.backToLogin")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
