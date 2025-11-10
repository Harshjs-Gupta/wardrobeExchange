"use client";
import { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Star,
  Calendar,
  User,
  Package,
  Tag,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { ItemService } from "../../../services/itemService";
import { SwapService } from "../../../services/swapService";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ItemDetailPage({ params }) {
  const { user } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState("");
  const [userItems, setUserItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const itemId = unwrappedParams.id;

  useEffect(() => {
    if (itemId) {
      loadItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, user?.uid]);

  const loadItem = async () => {
    try {
      setLoading(true);
      setError("");
      const itemData = await ItemService.getItem(itemId);
      setItem(itemData);

      // Check if current user has liked this item
      if (user && itemData.likedBy && Array.isArray(itemData.likedBy)) {
        setLiked(itemData.likedBy.includes(user.uid));
      } else {
        setLiked(false);
      }

      // Load user's items for swap
      if (user && itemData.userId !== user.uid) {
        const userItemsData = await ItemService.getUserItems(user.uid);
        setUserItems(
          userItemsData.filter((item) => item.status === "available")
        );
      }
    } catch (error) {
      console.error("Error loading item:", error);
      setError("Failed to load item details");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please log in to like items");
      return;
    }

    if (liking) {
      return; // Prevent multiple clicks
    }

    try {
      setLiking(true);
      const result = await ItemService.toggleLike(item.id, user.uid);

      // Update state immediately for instant UI feedback
      setLiked(result.isLiked);
      setItem((prevItem) => ({
        ...prevItem,
        likes: result.likes,
        likedBy: result.isLiked
          ? [...(prevItem.likedBy || []), user.uid]
          : (prevItem.likedBy || []).filter((id) => id !== user.uid),
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Failed to update like. Please try again.");
    } finally {
      setLiking(false);
    }
  };

  const handleSwap = async () => {
    if (!user) {
      alert("Please log in to initiate swaps");
      return;
    }

    if (!selectedItem) {
      alert("Please select an item to offer");
      return;
    }

    try {
      setSubmitting(true);
      await SwapService.createSwap(
        user.uid,
        item.id,
        selectedItem,
        swapMessage
      );
      setShowSwapModal(false);
      setSwapMessage("");
      setSelectedItem("");
      alert("Swap request sent successfully!");
    } catch (error) {
      console.error("Error creating swap:", error);
      alert(error.message || "Failed to create swap request");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Item Not Found</h2>
          <p className="text-gray-300 mb-6">
            {error || "This item doesn't exist or has been removed."}
          </p>
          <Link
            href="/browse"
            className="btn-hover inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto p-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              <img
                src={
                  item.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=600&fit=crop&crop=center"
                }
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                {item.status === "available"
                  ? "Available"
                  : item.status === "pending_swap"
                  ? "Pending"
                  : "Swapped"}
              </div>

              {/* Rating */}
              {item.rating > 0 && (
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {item.rating.toFixed(1)}
                </div>
              )}
            </div>

            {/* Additional Images */}
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {item.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="hover-lift aspect-square rounded-xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10"
                  >
                    <img
                      src={image.url}
                      alt={`${item.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {item.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{item.userId?.split("@")[0] || "User"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Listed {formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="hover-lift bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
                <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {item.views || 0}
                </div>
                <div className="text-gray-400 text-sm">Views</div>
              </div>

              <div className="hover-lift bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
                <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {item.likes || 0}
                </div>
                <div className="text-gray-400 text-sm">Likes</div>
              </div>

              <div className="hover-lift bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {item.rating?.toFixed(1) || "0.0"}
                </div>
                <div className="text-gray-400 text-sm">Rating</div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 font-semibold">
                      Category
                    </span>
                  </div>
                  <div className="text-white font-medium">{item.category}</div>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300 font-semibold">Size</span>
                  </div>
                  <div className="text-white font-medium">{item.size}</div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 font-semibold">Condition</span>
                </div>
                <div className="text-white font-medium">{item.condition}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Description
              </h3>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed">
                  {item.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLike}
                disabled={liking}
                className="btn-hover flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-red-500/30 hover:border-red-500/50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {liking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart
                    className={`w-5 h-5 ${
                      liked ? "text-red-400 fill-red-400" : "text-white"
                    }`}
                  />
                )}
                {liking ? "Updating..." : liked ? "Liked" : "Like"}
              </button>

              {user &&
                item.userId !== user.uid &&
                item.status === "available" && (
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="btn-hover flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Propose Swap
                  </button>
                )}

              <button className="btn-hover flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-blue-500/30 hover:border-blue-500/50 transition-colors duration-200">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Swap Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Propose Swap</h3>
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="btn-hover text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-3">
                    Select Item to Offer
                  </label>
                  <select
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                  >
                    <option value="">Choose an item...</option>

                    {userItems.map((userItem) => (
                      <option key={userItem.id} value={userItem.id}>
                        {userItem.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">
                    Message (Optional)
                  </label>
                  <textarea
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 resize-none"
                    placeholder="Add a message to your swap proposal..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSwapModal(false)}
                    className="btn-hover flex-1 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-gray-500/30 transition-colors duration-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSwap}
                    disabled={!selectedItem || submitting}
                    className="btn-hover flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        Send Proposal
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
