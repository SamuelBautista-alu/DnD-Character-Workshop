export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-burgundy-dark mb-2">
            D&D Workshop
          </h1>
          <p className="text-text-dark">Your D&D companion app</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">{children}</div>
      </div>
    </div>
  );
}
