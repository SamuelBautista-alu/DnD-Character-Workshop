interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-sm mx-4"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">{message}</div>

        {/* Footer */}
        <div
          className="flex gap-3 p-6 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded font-semibold transition-all"
            style={{
              backgroundColor: "var(--muted)",
              color: "var(--foreground)",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded font-semibold transition-all"
            style={{
              backgroundColor: isDangerous ? "#d9534f" : "var(--primary)",
              color: isDangerous ? "white" : "var(--primary-foreground)",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
