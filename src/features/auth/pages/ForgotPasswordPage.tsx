import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguageStore } from "../../language/store";
import { getTranslation } from "@/lib/i18n";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export default function ForgotPasswordPage() {
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError(t("auth.forgotPassword.emailRequired"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t("auth.forgotPassword.emailInvalid"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      setSuccess(true);
      // For development purposes, show the reset token
      if (response.data.data?.resetToken) {
        setResetToken(response.data.data.resetToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t("auth.forgotPassword.error"));
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
          {t("auth.forgotPassword.title")}
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
                {t("auth.forgotPassword.successMessage")}
              </p>
            </div>

            {resetToken && (
              <div
                className="p-4 rounded border"
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  borderColor: "#fcd34d",
                }}
              >
                <p className="text-sm font-medium mb-2">
                  {t("auth.forgotPassword.devTokenMessage")}
                </p>
                <code className="block p-2 bg-gray-100 rounded text-xs break-all">
                  {resetToken}
                </code>
                <p className="text-xs mt-2">
                  {t("auth.forgotPassword.devTokenNote")}
                </p>
              </div>
            )}

            <div className="text-center">
              <Link
                to="/login"
                className="font-semibold hover:underline transition-all"
                style={{ color: "var(--primary)" }}
              >
                {t("auth.forgotPassword.backToLogin")}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p
              className="text-center mb-6"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t("auth.forgotPassword.description")}
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
              <div>
                <label
                  className="block font-semibold mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  {t("auth.forgotPassword.email")}
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
                  placeholder={t("auth.forgotPassword.emailPlaceholder")}
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
                className="w-full py-2 rounded font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
                disabled={isLoading}
              >
                {isLoading
                  ? t("auth.forgotPassword.loading")
                  : t("auth.forgotPassword.submit")}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="font-semibold hover:underline transition-all"
                style={{ color: "var(--primary)" }}
              >
                {t("auth.forgotPassword.backToLogin")}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
