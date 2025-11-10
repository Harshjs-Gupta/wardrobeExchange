"use client";
import { useState, useRef } from "react";
import {
  Upload,
  X,
  Camera,
  Tag,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import { ItemService } from "../../services/itemService";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import { toast } from "react-toastify";

export default function AddItemPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    size: "",
    condition: "",
    tags: [],
    brand: "",
  });

  const [images, setImages] = useState([]);
  const [newTag, setNewTag] = useState("");

  // Show loading if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Please log in to add items</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length + images.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
    setError("");
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please log in to add items");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setLoadingStep("Uploading images to ImageKit...");

      const itemData = {
        ...formData,
        userId: user.uid,
        status: "available",
      };

      // Create item with ImageKit images
      setLoadingStep("Uploading images...");
      const result = await ItemService.createItem(itemData, images, user.uid);
      setLoadingStep("Saving item details...");

      setSuccess(true);
      toast.success("Item added successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.message || "Failed to create item. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Item Added Successfully!
          </h2>
          <p className="text-gray-300">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <Navigation />

      <div className="relative z-10 max-w-4xl mx-auto p-4 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            Add New Item
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Share your fashion items with the community. Upload photos and
            provide details to help others discover your pieces.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
          )}

          {loading && (
            <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 text-blue-400" />
                <span className="text-blue-300 font-medium">
                  {loadingStep || "Processing..."}
                </span>
              </div>
              <div className="w-full bg-blue-500/20 rounded-full h-2">
                <div
                  className="bg-blue-400 h-2 rounded-full"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-white font-semibold mb-4 text-lg">
              <Camera className="inline w-5 h-5 mr-2" />
              Item Photos (Max 5)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl border-2 border-white/20 group-hover:border-purple-400/50 transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-hover w-full h-32 border-2 border-dashed border-white/30 rounded-xl flex flex-col items-center justify-center text-white hover:border-purple-400/50 hover:bg-white/5 transition-colors duration-200"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm">Add Photo</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
            <div>
              <label className="block text-white font-semibold mb-3">
                <Info className="inline w-4 h-4 mr-2" />
                Item Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-colors duration-200"
                placeholder="e.g., Vintage Denim Jacket"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-colors duration-200"
                placeholder="e.g., Levi's, Nike"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-colors duration-200 [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="">Select Category</option>
                <option value="t-shirt">T-shirt</option>
                <option value="shirt">Shirt</option>
                <option value="sweater">Sweater</option>
                <option value="hoodie">Hoodie</option>
                <option value="tank-top">Tank Top</option>
                <option value="polo-shirt">Polo Shirt</option>
                <option value="crop-top">Crop Top</option>
                <option value="jeans">Jeans</option>
                <option value="pants">Pants</option>
                <option value="shorts">Shorts</option>
                <option value="skirt">Skirt</option>
                <option value="leggings">Leggings</option>
                <option value="trousers">Trousers</option>
                <option value="joggers">Joggers</option>
                <option value="chinos">Chinos</option>
                <option value="casual-dress">Casual Dress</option>
                <option value="party-dress">Party Dress</option>
                <option value="maxi-dress">Maxi Dress</option>
                <option value="mini-dress">Mini Dress</option>
                <option value="sundress">Sundress</option>
                <option value="cocktail-dress">Cocktail Dress</option>
                <option value="jacket">Jacket</option>
                <option value="coat">Coat</option>
                <option value="blazer">Blazer</option>
                <option value="cardigan">Cardigan</option>
                <option value="denim-jacket">Denim Jacket</option>
                <option value="leather-jacket">Leather Jacket</option>
                <option value="bomber-jacket">Bomber Jacket</option>
                <option value="winter-coat">Winter Coat</option>
                <option value="sneakers">Sneakers</option>
                <option value="boots">Boots</option>
                <option value="heels">Heels</option>
                <option value="flats">Flats</option>
                <option value="sandals">Sandals</option>
                <option value="loafers">Loafers</option>
                <option value="oxfords">Oxfords</option>
                <option value="pumps">Pumps</option>
                <option value="handbag">Handbag</option>
                <option value="purse">Purse</option>
                <option value="wallet">Wallet</option>
                <option value="belt">Belt</option>
                <option value="scarf">Scarf</option>
                <option value="hat">Hat</option>
                <option value="jewelry">Jewelry</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="watch">Watch</option>
                <option value="backpack">Backpack</option>
                <option value="saree">Saree</option>
                <option value="salwar-kameez">Salwar Kameez</option>
                <option value="kurta">Kurta</option>
                <option value="dhoti">Dhoti</option>
                <option value="lehenga">Lehenga</option>
                <option value="anarkali">Anarkali</option>
                <option value="sports-jersey">Sports Jersey</option>
                <option value="track-pants">Track Pants</option>
                <option value="sports-shoes">Sports Shoes</option>
                <option value="athletic-wear">Athletic Wear</option>
                <option value="suit">Suit</option>
                <option value="formal-shirt">Formal Shirt</option>
                <option value="formal-pants">Formal Pants</option>
                <option value="tie">Tie</option>
                <option value="formal-dress">Formal Dress</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                Size *
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-colors duration-200 [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-colors duration-200 [&>option]:bg-gray-800 [&>option]:text-white"
              >
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-colors duration-200 resize-none"
              placeholder="Describe your item, including any details about style, material, or special features..."
            />
          </div>

          <div className="mb-8">
            <label className="block text-white font-semibold mb-3">
              <Tag className="inline w-4 h-4 mr-2" />
              Tags
            </label>

            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="w-4 h-4 bg-purple-400/50 rounded-full flex items-center justify-center hover:bg-red-400/50 transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-colors duration-200"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-hover px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-hover px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-500 hover:to-pink-500 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5" />
                  {loadingStep || "Processing..."}
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Add Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
