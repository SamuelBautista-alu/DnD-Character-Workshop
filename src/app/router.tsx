/**
 * Sistema de Enrutamiento
 * Configura todas las rutas de la aplicación, protege rutas autenticadas y gestiona layouts
 */
import { ReactNode, useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import useAuthStore from "@/features/auth/store";

// Layouts
import MainLayout from "@/ui/layout/MainLayout";
import AuthLayout from "@/ui/layout/AuthLayout";
import PublicLayout from "@/ui/layout/PublicLayout";

// Pages
import HomePage from "@/features/characters/pages/HomePage";
import CharacterListPage from "@/features/characters/pages/CharacterListPage";
import CharacterCreatePage from "@/features/characters/pages/CharacterCreatePage";
import CharacterDetailPage from "@/features/characters/pages/CharacterDetailPage";
import CharacterBuildPage from "@/features/characters/pages/CharacterBuildPage";
import GameDashboard from "@/features/characters/gameMode/GameDashboard";
import HomebrewPage from "@/features/homebrew/pages/HomebrewPage";
import NotesPage from "@/features/notes/pages/NotesPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegistrationPage from "@/features/auth/pages/RegistrationPage";
import NotFoundPage from "@/pages/NotFoundPage";

/**
 * Componente envolvente del Layout Principal
 * Previene que el layout se remonte innecesariamente
 */
function MainLayoutWrapper() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

// Componente envolvente del Layout de Autenticación
function AuthLayoutWrapper() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

// Componente envolvente del Layout Público
function PublicLayoutWrapper() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}

/**
 * Componente de Ruta Protegida
 * Redirige a login si el usuario no está autenticado
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Public Route Component (redirect to home if already logged in)
interface PublicRouteProps {
  children: ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const { token } = useAuthStore();

  if (token) {
    return <Navigate to="/characters" replace />;
  }
  return children;
}

// Root Route Component - decides where to go based on auth
function RootRoute() {
  const { token } = useAuthStore();

  if (token) {
    return <Navigate to="/home" replace />;
  }
  return <Navigate to="/public" replace />;
}

// Router configuration with nested layouts to prevent remounting
const createRoutes = () => [
  {
    path: "/",
    element: <RootRoute />,
  },

  // Auth Routes with Auth Layout
  {
    path: "/",
    element: <AuthLayoutWrapper />,
    children: [
      {
        path: "/login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <RegistrationPage />
          </PublicRoute>
        ),
      },
    ],
  },

  // Public Home Page Route with Public Layout
  {
    path: "/",
    element: <PublicLayoutWrapper />,
    children: [
      {
        path: "/public",
        element: <HomePage />,
      },
    ],
  },

  // Main App Routes with Main Layout
  {
    path: "/",
    element: <MainLayoutWrapper />,
    children: [
      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/characters",
        element: (
          <ProtectedRoute>
            <CharacterListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/characters/new",
        element: (
          <ProtectedRoute>
            <CharacterCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/characters/:id",
        element: (
          <ProtectedRoute>
            <CharacterDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/characters/:id/build",
        element: (
          <ProtectedRoute>
            <CharacterBuildPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/characters/:id/gamemode",
        element: (
          <ProtectedRoute>
            <GameDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/homebrew",
        element: (
          <ProtectedRoute>
            <HomebrewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notes",
        element: (
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // 404 Route
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export function AppRouter() {
  // Memoize router creation to prevent unnecessary recreations
  const router = useMemo(() => createBrowserRouter(createRoutes()), []);

  return <RouterProvider router={router} />;
}

export default AppRouter;
