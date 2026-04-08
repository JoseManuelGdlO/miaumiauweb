import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { token, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center paw-pattern">
        <p className="text-muted-foreground">…</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
