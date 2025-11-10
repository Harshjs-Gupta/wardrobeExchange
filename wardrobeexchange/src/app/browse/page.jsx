"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Heart,
  Eye,
  ArrowRight,
  Star,
  Loader2,
} from "lucide-react";
import { ItemService } from "../../services/itemService";
import { useAuth } from "../../context/AuthContext";

export default function BrowsePage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    size: "",
    condition: "",
  });
  const [filteredItems, setFilteredItems] = useState([]);
  const [likedItems, setLikedItems] = useState(new Set());

  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, []);

  // Filter items when search term or filters change
  useEffect(() => {
    filterItems();
  }, [items, searchTerm, filters]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const fetchedItems = await ItemService.getItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Apply size filter
    if (filters.size) {
      filtered = filtered.filter((item) => item.size === filters.size);
    }

    // Apply condition filter
    if (filters.condition) {
      filtered = filtered.filter(
        (item) => item.condition === filters.condition
      );
    }

    setFilteredItems(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleLike = async (itemId) => {
    if (!user) {
      alert("Please log in to like items");
      return;
    }

    try {
      await ItemService.toggleLike(itemId, user.uid);
      setLikedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto p-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            Discover Fashion
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Explore sustainable fashion from our community. Find your next
            favorite piece or list your own items to share with others.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <div className="relative flex-1 group">
            <Search className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for items, brands, or styles..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-colors duration-200 shadow-lg"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="px-2 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 [&>option]:bg-gray-800 [&>option]:text-white transition-colors duration-200"
            >
              <option value="">All Categories</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="outerwear">Outerwear</option>
              <option value="dresses">Dresses</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>

            <select
              value={filters.size}
              onChange={(e) => handleFilterChange("size", e.target.value)}
              className="px-2 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 [&>option]:bg-gray-800 [&>option]:text-white transition-colors duration-200"
            >
              <option value="">All Sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>

            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange("condition", e.target.value)}
              className="px-2 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 [&>option]:bg-gray-800 [&>option]:text-white transition-colors duration-200"
            >
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg">Loading items...</p>
            </div>
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="group hover-lift bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-purple-400/50 shadow-xl"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={
                      item.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=300&fit=crop&crop=center"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {item.status === "available"
                      ? "Available"
                      : item.status === "pending_swap"
                      ? "Pending"
                      : "Swapped"}
                  </div>

                  {item.rating > 0 && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {item.rating.toFixed(1)}
                    </div>
                  )}

                  <button
                    onClick={() => handleLike(item.id)}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors duration-200 shadow-lg"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedItems.has(item.id)
                          ? "text-red-400 fill-red-400"
                          : "text-white"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-white font-bold text-lg mb-3">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                    <span className="bg-white/10 px-3 py-1 rounded-full">
                      Size: {item.size}
                    </span>
                    <span className="px-3 py-1 capitalize bg-green-500/20 text-green-300 rounded-full font-medium">
                      {item.condition}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">
                    by {item.userId?.split("@")[0] || "User"} •{" "}
                    {formatDate(item.createdAt)}
                  </p>

                  <a
                    href={`/item/${item.id}`}
                    className="btn-hover flex items-center justify-center w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 shadow-lg"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg mb-4">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "No items match your search criteria"
                : "No items available yet"}
            </div>
            <p className="text-gray-500">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <div className="text-center mt-20">
            <button className="btn-hover px-12 py-5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/20 text-white rounded-2xl hover:from-purple-600/30 hover:to-pink-600/30 shadow-lg font-semibold text-lg">
              Load More Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
