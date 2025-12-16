import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  subjects?: string[];
  experience?: number;
  city?: string;
  pricePerHour?: number;
  level?: string;
}

export interface Ad {
  id: string;
  userId: string;
  type: "tutor" | "student";
  subject: string;
  areas: string[];
  level: string;
  pricePerHour?: number;
  availableTimes?: string[];
  location: "online" | "in-person" | "both";
  city?: string;
  description: string;
  createdAt: string;
  user: User;
  rating?: number;
  reviews?: number;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { currentUser, login, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser && location.pathname === "/login") {
      navigate("/browse-ads", { replace: true });
    } else if (!currentUser && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate, location.pathname]);

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage onLogin={login} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return <Dashboard onLogout={logout} onUserUpdate={updateUser} />;
}

export default App;
