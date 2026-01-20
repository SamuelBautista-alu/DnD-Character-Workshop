export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-parchment">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-burgundy-dark mb-4">404</h1>
        <p className="text-2xl text-text-dark mb-8">Page Not Found</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-burgundy-dark text-white rounded hover:bg-burgundy-light"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
