import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (currentUser === null) {
      // No user logged in → redirect to login
      router.replace("/login");
    }
  }, [currentUser]);

  // While checking auth state, don’t flash content
  if (currentUser === null) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Checking authentication...
      </div>
    );
  }

  // ✅ Show protected content
  return <>{children}</>;
}
