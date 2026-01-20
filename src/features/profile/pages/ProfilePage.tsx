/**
 * Página de Perfil de Usuario
 * Gestiona la visualización y edición de información del perfil del usuario,
 * incluyendo cambio de contraseña y cierre de sesión.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../auth/store";
import { useLanguageStore } from "@/features/language/store";
import { getTranslation } from "@/lib/i18n";

/**
 * Componente principal de la página de perfil
 * @returns {JSX.Element} Página de perfil del usuario
 */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { email, username, logout } = useAuthStore();
  const { language } = useLanguageStore();
  const t = (key: string) => getTranslation(language, key);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: username || "",
    email: email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogout = () => {
    // Cerrar sesión y redirigir a login
    logout();
    navigate("/login");
  };

  // Actualizar campo del formulario de edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    // Llamada API para actualizar perfil (por implementar)
    console.log("Saving profile:", formData);
    setIsEditModalOpen(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t("profile.passwordModal.mismatchError"));
      return;
    }
    // TODO: Implement API call to change password
    console.log("Changing password:", passwordData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordModalOpen(false);
  };

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-8"
      style={{ color: "var(--foreground)" }}
    >
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--foreground)" }}
      >
        {t("profile.title")}
      </h1>

      {/* User Info Card */}
      <div
        className="rounded-lg shadow-lg p-8 mb-8"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--foreground)" }}
        >
          {t("profile.accountInfo")}
        </h2>

        <div className="space-y-6">
          {/* Username */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t("profile.username")}
            </label>
            <div
              className="px-4 py-3 rounded"
              style={{
                backgroundColor: "var(--input-background)",
                color: "var(--foreground)",
              }}
            >
              {username || t("profile.noUsernameSet")}
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t("profile.email")}
            </label>
            <div
              className="px-4 py-3 rounded"
              style={{
                backgroundColor: "var(--input-background)",
                color: "var(--foreground)",
              }}
            >
              {email || t("profile.noEmailSet")}
            </div>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div
        className="rounded-lg shadow-lg p-8 mb-8"
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--foreground)" }}
        >
          {t("profile.security")}
        </h2>

        <div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {t("profile.changePassword")}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="flex-1 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            backgroundColor: "var(--destructive)",
            color: "var(--destructive-foreground)",
          }}
        >
          {t("profile.logout")}
        </button>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex-1 py-3 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {t("profile.editProfile")}
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="rounded-lg shadow-lg p-8 w-full max-w-md"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "var(--foreground)" }}
            >
              {t("profile.editModal.title")}
            </h2>

            <div className="space-y-6">
              {/* Username */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t("profile.editModal.username")}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 rounded border"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t("profile.editModal.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 rounded border"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--secondary-foreground)",
                }}
              >
                {t("profile.editModal.cancel")}
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                {t("profile.editModal.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div
            className="rounded-lg shadow-lg p-8 w-full max-w-md"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: "var(--foreground)" }}
            >
              {t("profile.passwordModal.title")}
            </h2>

            <div className="space-y-6">
              {/* Current Password */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t("profile.passwordModal.current")}
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 rounded border"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t("profile.passwordModal.new")}
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 rounded border"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {t("profile.passwordModal.confirm")}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 rounded border"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="flex-1 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--secondary-foreground)",
                }}
              >
                {t("profile.passwordModal.cancel")}
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                {t("profile.passwordModal.changePassword")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
