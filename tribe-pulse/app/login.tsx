import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/lib/firebaseConfig";

function Button({ onClick, children, className }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      router.push("/tribe/my-tribe");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back 👋</h1>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button onClick={handleLogin} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign up here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
