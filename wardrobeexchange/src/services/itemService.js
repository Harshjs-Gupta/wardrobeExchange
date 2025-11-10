import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { LocalStorageService } from "./localStorageService";

// Collection references
const ITEMS_COLLECTION = "items";
const USERS_COLLECTION = "users";
const SWAPS_COLLECTION = "swaps";

export class ItemService {
  // Create a new item with localStorage images
  static async createItem(itemData, images, userId) {
    try {
      // Store images in localStorage
      let imageIds = [];
      if (images && images.length > 0) {
        // Check if localStorage has enough space
        if (!LocalStorageService.hasEnoughSpace(images)) {
          throw new Error(
            "Not enough localStorage space for images. Please reduce image size or number of images."
          );
        }

        imageIds = await LocalStorageService.storeImages(userId, images);
      }

      // Create item document with image IDs instead of URLs
      const itemDoc = {
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        size: itemData.size,
        condition: itemData.condition,
        brand: itemData.brand,
        tags: itemData.tags || [],
        userId: userId,
        imageIds: imageIds, // Store image IDs instead of URLs
        status: "available",
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "items"), itemDoc);
      return { id: docRef.id, ...itemDoc };
    } catch (error) {
      throw new Error(`Failed to create item: ${error.message}`);
    }
  }

  // Create a new item without images (fallback method)
  static async createItemWithoutImages(itemData, userId) {
    try {
      // Create item document without images
      const itemDoc = {
        title: itemData.title,
        description: itemData.description,
        category: itemData.category,
        size: itemData.size,
        condition: itemData.condition,
        brand: itemData.brand,
        tags: itemData.tags || [],
        userId: userId,
        imageIds: [], // Empty array for no images
        status: "available",
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "items"), itemDoc);
      return { id: docRef.id, ...itemDoc };
    } catch (error) {
      throw new Error(`Failed to create item: ${error.message}`);
    }
  }

  // Get all items with optional filters and load images from localStorage
  static async getItems(filters = {}) {
    try {
      let q = collection(db, ITEMS_COLLECTION);

      // Apply filters
      if (filters.category) {
        q = query(q, where("category", "==", filters.category));
      }
      if (filters.size) {
        q = query(q, where("size", "==", filters.size));
      }
      if (filters.condition) {
        q = query(q, where("condition", "==", filters.condition));
      }
      if (filters.status) {
        q = query(q, where("status", "==", filters.status));
      }
      if (filters.userId) {
        q = query(q, where("userId", "==", filters.userId));
      }

      // Order by creation date
      q = query(q, orderBy("createdAt", "desc"));

      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }

      const querySnapshot = await getDocs(q);
      const items = [];

      querySnapshot.forEach((doc) => {
        const itemData = { id: doc.id, ...doc.data() };

        // Load images from localStorage for each item
        if (itemData.imageIds && itemData.imageIds.length > 0) {
          const images = LocalStorageService.getImagesByIds(
            itemData.userId,
            itemData.imageIds
          );
          itemData.images = images.map((img) => ({
            id: img.id,
            url: img.data, // Use base64 data as URL
            name: img.name,
            type: img.type,
          }));
        } else {
          itemData.images = [];
        }

        items.push(itemData);
      });

      return items;
    } catch (error) {
      console.error("Error getting items:", error);
      throw error;
    }
  }

  // Get a single item by ID with images from ImageKit URLs
  static async getItem(itemId) {
    try {
      const docRef = doc(db, ITEMS_COLLECTION, itemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const itemData = { id: docSnap.id, ...docSnap.data() };

        // Convert imageUrls to images format for backward compatibility
        if (itemData.imageUrls && itemData.imageUrls.length > 0) {
          itemData.images = itemData.imageUrls.map((img, index) => ({
            id: img.fileId || `img_${index}`,
            url: img.url,
            thumbnailUrl: img.thumbnailUrl || img.url,
            name: img.name || `image_${index + 1}`,
          }));
        } else if (itemData.imageIds) {
          // Legacy support for old localStorage imageIds
          itemData.images = [];
        } else {
          itemData.images = [];
        }

        return itemData;
      } else {
        throw new Error("Item not found");
      }
    } catch (error) {
      console.error("Error getting item:", error);
      throw error;
    }
  }

  // Update an item
  static async updateItem(itemId, updateData) {
    try {
      const docRef = doc(db, ITEMS_COLLECTION, itemId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      return await this.getItem(itemId);
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  }

  // Delete an item and its images from ImageKit
  static async deleteItem(itemId, userId) {
    try {
      const item = await this.getItem(itemId);

      // Delete images from ImageKit (requires server-side API)
      // Note: For now, we'll just delete the Firestore document
      // ImageKit file deletion should be handled via API route for security
      if (item.imageUrls && item.imageUrls.length > 0) {
        // TODO: Implement server-side API route to delete images from ImageKit
        // For now, images will remain in ImageKit but won't be referenced
        console.log(
          `Note: Images for item ${itemId} should be deleted via server-side API`
        );
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, ITEMS_COLLECTION, itemId));

      // Update user's item count
      await this.updateUserItemCount(userId, -1);

      return true;
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  }

  // Search items by text
  static async searchItems(searchTerm) {
    try {
      const items = await this.getItems();

      return items.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    } catch (error) {
      console.error("Error searching items:", error);
      throw error;
    }
  }

  // Update user's item count
  static async updateUserItemCount(userId, increment) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const currentCount = userSnap.data().itemCount || 0;
        await updateDoc(userRef, {
          itemCount: currentCount + increment,
        });
      } else {
        // Create user document if it doesn't exist
        await addDoc(collection(db, USERS_COLLECTION), {
          userId,
          itemCount: increment > 0 ? 1 : 0,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error updating user item count:", error);
      throw error;
    }
  }

  // Like/unlike an item
  static async toggleLike(itemId, userId) {
    try {
      const itemDocRef = doc(db, ITEMS_COLLECTION, itemId);
      const itemSnap = await getDoc(itemDocRef);

      if (!itemSnap.exists()) {
        throw new Error("Item not found");
      }

      const itemData = itemSnap.data();
      const likedBy = itemData.likedBy || [];
      const currentLikes = itemData.likes || 0;
      const isLiked = likedBy.includes(userId);

      let newLikedBy;
      let newLikes;

      if (isLiked) {
        // Unlike: remove user from likedBy array and decrement likes
        newLikedBy = arrayRemove(userId);
        newLikes = Math.max(0, currentLikes - 1);
      } else {
        // Like: add user to likedBy array and increment likes
        newLikedBy = arrayUnion(userId);
        newLikes = currentLikes + 1;
      }

      await updateDoc(itemDocRef, {
        likedBy: newLikedBy,
        likes: newLikes,
      });

      return {
        likes: newLikes,
        isLiked: !isLiked,
      };
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  }

  // Rate an item
  static async rateItem(itemId, rating, userId) {
    try {
      const item = await this.getItem(itemId);
      const currentRating = item.rating || 0;
      const totalRatings = item.totalRatings || 0;

      const newTotalRatings = totalRatings + 1;
      const newRating =
        (currentRating * totalRatings + rating) / newTotalRatings;

      await updateDoc(doc(db, ITEMS_COLLECTION, itemId), {
        rating: newRating,
        totalRatings: newTotalRatings,
      });

      return { rating: newRating, totalRatings: newTotalRatings };
    } catch (error) {
      console.error("Error rating item:", error);
      throw error;
    }
  }

  // Get featured items
  static async getFeaturedItems(limit = 8) {
    try {
      const items = await this.getItems({ limit });
      return items.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } catch (error) {
      console.error("Error getting featured items:", error);
      throw error;
    }
  }

  // Get user's items
  static async getUserItems(userId) {
    try {
      // Create a simple query without ordering to avoid index requirements
      let q = query(
        collection(db, ITEMS_COLLECTION),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const items = [];

      querySnapshot.forEach((doc) => {
        const itemData = { id: doc.id, ...doc.data() };

        // Convert imageUrls to images format for backward compatibility
        if (itemData.imageUrls && itemData.imageUrls.length > 0) {
          itemData.images = itemData.imageUrls.map((img, index) => ({
            id: img.fileId || `img_${index}`,
            url: img.url,
            thumbnailUrl: img.thumbnailUrl || img.url,
            name: img.name || `image_${index + 1}`,
          }));
        } else if (itemData.imageIds) {
          // Legacy support for old localStorage imageIds
          itemData.images = [];
        } else {
          itemData.images = [];
        }

        items.push(itemData);
      });

      // Sort in memory instead of in the query
      return items.sort((a, b) => {
        const dateA = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt);
        return dateB - dateA; // Descending order
      });
    } catch (error) {
      console.error("Error getting user items:", error);
      throw error;
    }
  }

  // Get storage usage for a user (placeholder - ImageKit doesn't provide client-side storage stats)
  static getStorageUsage(userId) {
    // ImageKit storage usage would need to be fetched from server-side API
    // For now, return placeholder data
    return {
      totalSize: 0,
      imageCount: 0,
      formattedSize: "0 B",
    };
  }
}
