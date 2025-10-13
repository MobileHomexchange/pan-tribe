import React, { useState } from "react";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../src/lib/firebaseConfig";

function Button({ onClick, children, className }: any) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-3 bg-green-600 text-white hover:bg-green-700 font-semibold ${className}`}
    >
      {children}
    </button>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      // Create the user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optional: Set display name
      if (name) {
        await updateProfile(user, { displayName: name });
      }

      alert("Account created successfully!");
      router.push("/tribe/my-tribe");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-center">Create an Account ✨</h1>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button onClick={handleSignup} className="w-full">
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-green-600 hover:underline cursor-pointer"
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
