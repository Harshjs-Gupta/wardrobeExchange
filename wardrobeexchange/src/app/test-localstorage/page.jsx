"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, HardDrive, Download, Trash2 } from "lucide-react";
import { LocalStorageService } from "../../services/localStorageService";
import { useAuth } from "../../context/AuthContext";
import Navigation from "../../components/Navigation";

export default function TestLocalStoragePage() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [storedImages, setStoredImages] = useState([]);
  const [storageUsage, setStorageUsage] = useState(null);

  // Show loading if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 text-lg">
            Please log in to test localStorage
          </p>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );
    setImages(validFiles);
  };

  const storeImages = async () => {
    if (images.length === 0) {
      alert("Please select images first");
      return;
    }

    try {
      const imageIds = await LocalStorageService.storeImages(user.uid, images);
      alert(`Successfully stored ${imageIds.length} images in localStorage`);
      loadStoredImages();
      updateStorageUsage();
    } catch (error) {
      alert(`Error storing images: ${error.message}`);
    }
  };

  const loadStoredImages = () => {
    const images = LocalStorageService.getImages(user.uid);
    setStoredImages(images);
  };

  const updateStorageUsage = () => {
    const usage = LocalStorageService.getStorageUsage(user.uid);
    setStorageUsage(usage);
  };

  const deleteAllImages = () => {
    if (confirm("Are you sure you want to delete all stored images?")) {
      LocalStorageService.deleteAllUserImages(user.uid);
      setStoredImages([]);
      updateStorageUsage();
      alert("All images deleted from localStorage");
    }
  };

  const deleteImage = (imageId) => {
    LocalStorageService.deleteImages(user.uid, [imageId]);
    loadStoredImages();
    updateStorageUsage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Navigation />

      <div className="max-w-6xl mx-auto p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            localStorage Image Storage Test
          </h1>
          <p className="text-gray-300">
            Test the localStorage functionality for storing and retrieving
            images
          </p>
        </motion.div>

        {/* Storage Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <HardDrive className="w-6 h-6" />
              Storage Usage
            </h2>
            <button
              onClick={updateStorageUsage}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Refresh
            </button>
          </div>
          {storageUsage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-gray-300 text-sm">Total Size</p>
                <p className="text-white font-bold text-xl">
                  {storageUsage.formattedSize}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-gray-300 text-sm">Image Count</p>
                <p className="text-white font-bold text-xl">
                  {storageUsage.imageCount}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-gray-300 text-sm">Space Available</p>
                <p className="text-white font-bold text-xl">
                  {storageUsage.totalSize < 5 * 1024 * 1024
                    ? "✅ Available"
                    : "❌ Full"}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Upload Images</h2>

          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Select Images
            </button>
          </div>

          {images.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Selected Images ({images.length}):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={storeImages}
                className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Store in localStorage
              </button>
            </div>
          )}
        </motion.div>

        {/* Stored Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Stored Images</h2>
            <div className="flex gap-2">
              <button
                onClick={loadStoredImages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Load Images
              </button>
              <button
                onClick={deleteAllImages}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete All
              </button>
            </div>
          </div>

          {storedImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {storedImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.data}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {image.name}
                  </div>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No images stored in localStorage
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
