/**
 * ImageKit Service
 * Handles image uploads and management using ImageKit.io
 */

class ImageKitService {
  constructor() {
    // ImageKit configuration - should be in environment variables
    this.urlEndpoint = "https://ik.imagekit.io/harshgupta/" || "";
    this.publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
    this.authenticationEndpoint =
      process.env.NEXT_PUBLIC_IMAGEKIT_AUTH_ENDPOINT || "/api/imagekit/auth";
  }

  /**
   * Initialize ImageKit (client-side only)
   */
  async init() {
    if (typeof window === "undefined") {
      throw new Error("ImageKit can only be initialized on the client side");
    }

    try {
      // Dynamically import ImageKit SDK
      const ImageKit = await import("imagekit-javascript");
      return new ImageKit.default({
        urlEndpoint: this.urlEndpoint,
        publicKey: this.publicKey,
        authenticationEndpoint: this.authenticationEndpoint,
      });
    } catch (error) {
      console.error("Failed to load ImageKit SDK:", error);
      throw new Error(
        "ImageKit SDK not available. Please install: npm install imagekit"
      );
    }
  }

  /**
   * Upload a single image to ImageKit
   * @param {File} file - The image file to upload
   * @param {string} userId - User ID for organizing uploads
   * @param {string} itemId - Optional item ID for organizing uploads
   * @returns {Promise<Object>} ImageKit upload response with URL
   */
  async uploadImage(file, userId, itemId = null) {
    try {
      const imagekit = await this.init();

      // Create a unique file name
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${timestamp}_${randomString}_${sanitizedFileName}`;

      // Upload file using promise-based API
      const result = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: file,
            fileName: fileName,
            folder: `/wardrobe-exchange/${userId}/${itemId || "temp"}/`,
            useUniqueFileName: false, // We're already creating unique names
            tags: ["wardrobe-exchange", userId, itemId].filter(Boolean),
            isPrivateFile: false,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      return {
        url: result.url,
        fileId: result.fileId,
        name: result.name,
        size: result.size,
        filePath: result.filePath,
        thumbnailUrl: result.thumbnailUrl || result.url,
        fileType: result.fileType,
      };
    } catch (error) {
      console.error("Error uploading image to ImageKit:", error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Upload multiple images to ImageKit
   * @param {File[]} files - Array of image files to upload
   * @param {string} userId - User ID for organizing uploads
   * @param {string} itemId - Optional item ID for organizing uploads
   * @returns {Promise<Array>} Array of uploaded image data
   */
  async uploadImages(files, userId, itemId = null) {
    try {
      if (!files || files.length === 0) {
        return [];
      }

      const uploadPromises = files.map((file) =>
        this.uploadImage(file, userId, itemId).catch((error) => {
          console.error(`Failed to upload file ${file.name}:`, error);
          throw error;
        })
      );

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error("Error uploading images to ImageKit:", error);
      throw new Error(`Failed to upload images: ${error.message}`);
    }
  }

  /**
   * Delete an image from ImageKit
   * @param {string} fileId - ImageKit file ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteImage(fileId) {
    try {
      // Note: Image deletion requires server-side API call with private key
      // This should be implemented via an API route for security
      console.warn(
        "Image deletion should be handled server-side via API route"
      );
      return true;
    } catch (error) {
      console.error("Error deleting image from ImageKit:", error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Get optimized image URL with transformations
   * @param {string} imageUrl - Original ImageKit URL
   * @param {Object} transformations - Image transformation options
   * @returns {string} Transformed image URL
   */
  getOptimizedUrl(imageUrl, transformations = {}) {
    if (!imageUrl) return "";

    // If it's already an ImageKit URL, add transformations
    if (imageUrl.includes("ik.imagekit.io")) {
      const params = new URLSearchParams();
      if (transformations.width) params.append("w", transformations.width);
      if (transformations.height) params.append("h", transformations.height);
      if (transformations.quality) params.append("q", transformations.quality);
      if (transformations.format) params.append("f", transformations.format);

      const queryString = params.toString();
      return queryString ? `${imageUrl}?${queryString}` : imageUrl;
    }

    return imageUrl;
  }

  /**
   * Get thumbnail URL
   * @param {string} imageUrl - Original ImageKit URL
   * @param {number} size - Thumbnail size (default: 300)
   * @returns {string} Thumbnail URL
   */
  getThumbnailUrl(imageUrl, size = 300) {
    return this.getOptimizedUrl(imageUrl, {
      width: size,
      height: size,
      quality: 80,
    });
  }
}

// Export singleton instance
export const imageKitService = new ImageKitService();
