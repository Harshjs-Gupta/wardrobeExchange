"use client";
import { useState, useEffect } from "react";
import {
  User,
  Package,
  TrendingUp,
  Award,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  ArrowRight,
  Loader2,
  RefreshCw,
  HardDrive,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ItemService } from "../../services/itemService";
import { UserService } from "../../services/userService";
import { SwapService } from "../../services/swapService";
import Link from "next/link";
import Navigation from "../../components/Navigation";

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [userSwaps, setUserSwaps] = useState([]);
  const [storageUsage, setStorageUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [stats, items, swaps] = await Promise.all([
        UserService.getUserStats(user.uid),
        ItemService.getUserItems(user.uid),
        SwapService.getUserSwaps(user.uid),
      ]);

      // Get storage usage synchronously
      let storageData = null;
      try {
        storageData = ItemService.getStorageUsage(user.uid);
      } catch (storageError) {
        console.error("Error getting storage usage:", storageError);
        storageData = { totalSize: 0, imageCount: 0, formattedSize: "0 B" };
      }

      setUserStats(stats);
      setUserItems(items);
      setUserSwaps(swaps);
      setStorageUsage(storageData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await ItemService.deleteItem(itemId, user.uid);
      setUserItems((prev) => prev.filter((item) => item.id !== itemId));
      // Refresh stats and storage usage
      const [newStats, newStorageUsage] = await Promise.all([
        UserService.getUserStats(user.uid),
        Promise.resolve(ItemService.getStorageUsage(user.uid)),
      ]);
      setUserStats(newStats);
      setStorageUsage(newStorageUsage);
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const pendingSwaps = userSwaps.filter(
    (swap) => swap.status === "pending"
  ).length;

  const stats = [
    {
      label: "Items Listed",
      value: userStats?.itemCount || 0,
      description: "Your wardrobe items",
      icon: Package,
      accent: "text-purple-400",
    },
    {
      label: "Completed Swaps",
      value: userStats?.completedSwaps || 0,
      description: "Successful exchanges",
      icon: TrendingUp,
      accent: "text-green-400",
    },
    {
      label: "Points Earned",
      value: userStats?.points || 0,
      description: "Community rewards",
      icon: Award,
      accent: "text-yellow-400",
    },
    {
      label: "Pending Swaps",
      value: pendingSwaps,
      description: "Awaiting response",
      icon: User,
      accent: "text-pink-400",
    },
    {
      label: "Storage Used",
      value: storageUsage?.formattedSize || "0 B",
      description: `${storageUsage?.imageCount || 0} images stored`,
      icon: HardDrive,
      accent: "text-blue-400",
    },
  ];

  const quickActions = [
    {
      label: "Add New Item",
      href: "/add-item",
      icon: Plus,
      buttonClass:
        "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
    },
    {
      label: "Browse Items",
      href: "/browse",
      icon: Eye,
      buttonClass:
        "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500",
    },
    {
      label: "Refresh Dashboard",
      href: "#refresh",
      icon: RefreshCw,
      onClick: loadDashboardData,
      buttonClass: "bg-white/10 hover:bg-white/20 text-white",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <Navigation />

      <div className="relative z-10 max-w-7xl mx-auto p-4 pt-20 space-y-16">
        <header className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
            Welcome Back,{" "}
            {userProfile?.displayName || user?.email?.split("@")[0] || "User"}!
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Manage your wardrobe, track your swaps, and discover new sustainable
            fashion opportunities.
          </p>
        </header>

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <span className="text-red-200">{error}</span>
            <button
              onClick={loadDashboardData}
              className="btn-hover flex items-center gap-2 rounded-lg border border-red-400/40 px-4 py-2 text-red-200 hover:bg-red-500/20 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map(({ label, value, description, icon: Icon, accent }) => (
            <div
              key={label}
              className="hover-lift bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${accent}`} />
                <span className="text-3xl font-semibold text-white">
                  {value}
                </span>
              </div>
              <h3 className="text-gray-200 font-semibold mb-1">{label}</h3>
              <p className="text-gray-400 text-sm">{description}</p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-4 md:flex-row md:justify-center">
            {quickActions.map(
              ({ label, href, icon: Icon, onClick, buttonClass }) => {
                const button = (
                  <div
                    className={`btn-hover flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-white shadow-lg ${buttonClass}`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </div>
                );
                return onClick ? (
                  <button key={label} onClick={onClick}>
                    {button}
                  </button>
                ) : (
                  <Link key={label} href={href}>
                    {button}
                  </Link>
                );
              }
            )}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Your Items</h2>
            <Link
              href="/add-item"
              className="btn-hover inline-flex items-center gap-2 text-purple-300 hover:text-purple-100"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Link>
          </div>

          {userItems.length === 0 ? (
            <div className="text-center rounded-3xl border border-white/10 bg-white/5 p-12">
              <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="text-2xl font-semibold text-gray-200 mb-2">
                No items yet
              </h3>
              <p className="text-gray-400 mb-6">
                Start by adding your first item to your wardrobe.
              </p>
              <Link
                href="/add-item"
                className="btn-hover inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white"
              >
                <Plus className="w-4 h-4" />
                Add Your First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userItems.map((item) => (
                <div
                  key={item.id}
                  className="hover-lift bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl"
                >
                  <div className="relative h-48">
                    <img
                      src={
                        item?.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=300&fit=crop&crop=center"
                      }
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-semibold text-white">
                      {item.status}
                    </span>
                    {item.rating > 0 && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {item.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="text-white text-lg font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Added {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span className="rounded-full bg-white/10 px-3 py-1">
                        Size: {item.size}
                      </span>
                      <span className="rounded-full capitalize bg-green-500/20 px-3 py-1 text-green-200">
                        {item.condition}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button className="btn-hover rounded-lg bg-white/10 p-2 text-white hover:bg-purple-500/30">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="btn-hover rounded-lg bg-white/10 p-2 text-white hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Link
                        href={`/item/${item.id}`}
                        className="btn-hover inline-flex items-center gap-1 text-sm text-purple-200 hover:text-purple-100"
                      >
                        View
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {userSwaps.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Recent Swaps</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userSwaps.slice(0, 6).map((swap) => (
                <div
                  key={swap.id}
                  className="hover-lift bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        swap.status === "completed"
                          ? "bg-green-500/30 text-green-200"
                          : swap.status === "pending"
                          ? "bg-yellow-500/30 text-yellow-200"
                          : swap.status === "accepted"
                          ? "bg-blue-500/30 text-blue-200"
                          : "bg-gray-500/30 text-gray-200"
                      }`}
                    >
                      {swap.status}
                    </span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>

                  <div className="space-y-3 text-sm text-gray-300">
                    <div>
                      <span className="text-gray-400">You offer:</span>{" "}
                      <span className="text-white">
                        {swap.offeredItem?.title || "Item"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">For:</span>{" "}
                      <span className="text-white">
                        {swap.targetItem?.title || "Item"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-gray-400">
                    <span>{formatDate(swap.createdAt)}</span>
                    <Link
                      href={`/swaps/${swap.id}`}
                      className="btn-hover inline-flex items-center gap-1 text-green-300 hover:text-green-200"
                    >
                      Details
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
