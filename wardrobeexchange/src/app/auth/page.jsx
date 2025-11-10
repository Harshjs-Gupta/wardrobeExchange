"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";

export default function AuthPage() {
  const { login, signup, error, clearError, loading, user } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Show loading if checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    clearError();

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // User is signed in
      console.log("Google sign-in successful:", result.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error);
      // You may want to add error handling in your AuthContext
      // or display error message here
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.displayName);
      }
      // Toast notifications are handled in the AuthContext
      router.push("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      // Error toast is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", displayName: "" });
    clearError();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const backgroundVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.1, 0.15, 0.1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="w-full max-w-md"
        >
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              {isLogin ? "Welcome Back" : "Join Our Community"}
            </h1>
            <p className="text-gray-300 text-lg">
              {isLogin
                ? "Sign in to access your wardrobe and discover sustainable fashion"
                : "Create an account to start sharing and swapping fashion items"}
            </p>
          </motion.div>

          {/* Enhanced Form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </motion.div>
            )}

            {/* Google Sign-In Button */}
            {isLogin && (
              <motion.div variants={itemVariants} className="mb-6">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-3 bg-white px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 text-black animate-spin" />
                      <span className="text-lg font-semibold text-black">
                        Signing in...
                      </span>
                    </>
                  ) : (
                    <>
                      <FaGoogle className="text-black h-6 w-6" />
                      <span className="text-lg font-semibold text-black">
                        Sign in with Google
                      </span>
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-gray-400">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Display Name Field (Signup only) */}
            {!isLogin && (
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-white font-semibold mb-3">
                  <User className="inline w-4 h-4 mr-2" />
                  Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                    placeholder="Enter your display name"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-white font-semibold mb-3">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="mb-8">
              <label className="block text-white font-semibold mb-3">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="mb-6">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting || loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Toggle Mode */}
            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-300 mb-4">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={toggleMode}
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-center mt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                ← Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
