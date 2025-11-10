"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { UserService } from "../services/userService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          // Get or create user profile
          let profile = await UserService.getUserProfile(user.uid);
          if (!profile) {
            // Create new user profile
            profile = await UserService.createUserProfile(user.uid, {
              email: user.email,
              displayName:
                user.displayName || user.email?.split("@")[0] || "User",
              photoURL: user.photoURL || null,
            });
          }
          setUserProfile(profile);

          // Removed welcome message - no longer showing automatic welcome
        } catch (error) {
          console.error("Error loading user profile:", error);
          setError("Failed to load user profile");
          toast.error("Failed to load user profile");
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      return result;
    } catch (error) {
      let errorMessage = "Login failed";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const signup = async (email, password, displayName = null) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name if provided
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      toast.success("Account created successfully!");
      return result;
    } catch (error) {
      let errorMessage = "Signup failed";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      setError("Logout failed");
      toast.error("Logout failed");
      throw error;
    }
  };

  const updateUserProfile = async (updateData) => {
    try {
      if (!user) throw new Error("No user logged in");

      setError(null);
      const updatedProfile = await UserService.updateUserProfile(
        user.uid,
        updateData
      );
      setUserProfile(updatedProfile);
      toast.success("Profile updated successfully!");
      return updatedProfile;
    } catch (error) {
      setError("Failed to update profile");
      toast.error("Failed to update profile");
      throw error;
    }
  };

  const getUserStats = async () => {
    try {
      if (!user) throw new Error("No user logged in");

      setError(null);
      return await UserService.getUserStats(user.uid);
    } catch (error) {
      setError("Failed to load user stats");
      toast.error("Failed to load user stats");
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        login,
        signup,
        logout,
        updateUserProfile,
        getUserStats,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
