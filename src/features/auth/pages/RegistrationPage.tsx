import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
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
      setValidationError("Username is required");
      return;
    }
    if (username.length < 3) {
      setValidationError("Username must be at least 3 characters");
      return;
    }
    if (!email.trim()) {
      setValidationError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
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
          Create Account
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
              Username
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
              placeholder="Choose a username"
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
              Email
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
              placeholder="your@email.com"
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
              Password
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
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label
              className="block font-semibold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Confirm Password
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
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p
          className="text-center mt-6"
          style={{ color: "var(--muted-foreground)" }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold hover:underline transition-all"
            style={{ color: "var(--primary)" }}
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
