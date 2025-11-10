export class LocalStorageService {
  // Generate a unique key for storing user images
  static getUserImagesKey(userId) {
    return `user_images_${userId}`;
  }

  // Store images in localStorage for a specific user
  static async storeImages(userId, images) {
    try {
      const imageData = [];

      // Process all images asynchronously
      const promises = images.map((image, index) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            imageData.push({
              id: `${userId}_${Date.now()}_${index}`,
              data: reader.result,
              name: image.name,
              type: image.type,
              size: image.size,
            });
            resolve();
          };
          reader.readAsDataURL(image);
        });
      });

      // Wait for all images to be processed
      await Promise.all(promises);

      // Store in localStorage
      const existingImages = this.getImages(userId) || [];
      const updatedImages = [...existingImages, ...imageData];

      localStorage.setItem(
        this.getUserImagesKey(userId),
        JSON.stringify(updatedImages)
      );

      return imageData.map((img) => img.id);
    } catch (error) {
      console.error("Error storing images in localStorage:", error);
      throw new Error("Failed to store images in localStorage");
    }
  }

  // Get images from localStorage for a specific user
  static getImages(userId) {
    try {
      const imagesData = localStorage.getItem(this.getUserImagesKey(userId));
      return imagesData ? JSON.parse(imagesData) : [];
    } catch (error) {
      console.error("Error getting images from localStorage:", error);
      return [];
    }
  }

  // Get a specific image by ID
  static getImage(userId, imageId) {
    try {
      const images = this.getImages(userId);
      return images.find((img) => img.id === imageId);
    } catch (error) {
      console.error("Error getting image from localStorage:", error);
      return null;
    }
  }

  // Get images by IDs
  static getImagesByIds(userId, imageIds) {
    try {
      const images = this.getImages(userId);
      return images.filter((img) => imageIds.includes(img.id));
    } catch (error) {
      console.error("Error getting images by IDs from localStorage:", error);
      return [];
    }
  }

  // Delete images from localStorage
  static deleteImages(userId, imageIds) {
    try {
      const images = this.getImages(userId);
      const updatedImages = images.filter((img) => !imageIds.includes(img.id));
      localStorage.setItem(
        this.getUserImagesKey(userId),
        JSON.stringify(updatedImages)
      );
    } catch (error) {
      console.error("Error deleting images from localStorage:", error);
      throw new Error("Failed to delete images from localStorage");
    }
  }

  // Delete all images for a user
  static deleteAllUserImages(userId) {
    try {
      localStorage.removeItem(this.getUserImagesKey(userId));
    } catch (error) {
      console.error("Error deleting all user images from localStorage:", error);
      throw new Error("Failed to delete all user images from localStorage");
    }
  }

  // Check if localStorage has enough space
  static hasEnoughSpace(images) {
    try {
      // Estimate size of images (rough calculation)
      let totalSize = 0;
      images.forEach((image) => {
        totalSize += image.size;
      });

      // Convert to base64 (roughly 33% larger)
      totalSize = totalSize * 1.33;

      // Check available localStorage space (typically 5-10MB)
      const testKey = "storage_test";
      const testData = "x".repeat(1024 * 1024); // 1MB test

      try {
        localStorage.setItem(testKey, testData);
        localStorage.removeItem(testKey);
        return totalSize < 5 * 1024 * 1024; // 5MB limit
      } catch {
        return false; // localStorage is full or not available
      }
    } catch (error) {
      console.error("Error checking localStorage space:", error);
      return false;
    }
  }

  // Get storage usage for a user
  static getStorageUsage(userId) {
    try {
      const images = this.getImages(userId);
      let totalSize = 0;

      images.forEach((img) => {
        // Estimate size from base64 data
        totalSize += img.data.length * 0.75; // Base64 is roughly 33% larger than original
      });

      return {
        totalSize,
        imageCount: images.length,
        formattedSize: this.formatBytes(totalSize),
      };
    } catch (error) {
      console.error("Error getting storage usage:", error);
      return { totalSize: 0, imageCount: 0, formattedSize: "0 B" };
    }
  }

  // Format bytes to human readable format
  static formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
