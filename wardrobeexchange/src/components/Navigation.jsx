"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User, Home, Plus, Search, Heart } from "lucide-react";

export default function Navigation() {
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn-hover flex items-center"
          >
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Wardrobe Exchange
            </h1>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => router.push("/")}
              className="btn-hover flex items-center gap-2 text-gray-300 transition-colors hover:text-[#D177F2]"
            >
              <Home className="w-4 h-4" />
              Home
            </button>

            <button
              onClick={() => router.push("/browse")}
              className="btn-hover flex items-center gap-2 text-gray-300 transition-colors hover:text-[#D177F2]"
            >
              <Search className="w-4 h-4" />
              Browse
            </button>

            <button
              onClick={() => router.push("/add-item")}
              className="btn-hover flex items-center gap-2 text-gray-300 transition-colors hover:text-[#D177F2]"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="btn-hover flex items-center gap-2 text-gray-300 transition-colors hover:text-[#D177F2]"
            >
              <Heart className="w-4 h-4" />
              Dashboard
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hover-lift flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">
                {userProfile?.displayName ||
                  user.email?.split("@")[0] ||
                  "User"}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn-hover flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full transition-colors duration-200 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
