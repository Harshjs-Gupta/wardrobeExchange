import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const USERS_COLLECTION = "users";
const SWAPS_COLLECTION = "swaps";

export class UserService {
  // Create or update user profile
  static async createUserProfile(userId, userData) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          ...userData,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new user using setDoc
        await setDoc(userRef, {
          userId,
          ...userData,
          itemCount: 0,
          completedSwaps: 0,
          points: 100, // Starting points
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      return await this.getUserProfile(userId);
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(userId) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId, updateData) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });

      return await this.getUserProfile(userId);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(userId) {
    try {
      const userProfile = await this.getUserProfile(userId);
      const userItems = await this.getUserItems(userId);
      const userSwaps = await this.getUserSwaps(userId);

      return {
        profile: userProfile,
        itemCount: userItems.length,
        completedSwaps: userSwaps.filter((swap) => swap.status === "completed")
          .length,
        pendingSwaps: userSwaps.filter((swap) => swap.status === "pending")
          .length,
        totalSwaps: userSwaps.length,
        points: userProfile?.points || 0,
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      throw error;
    }
  }

  // Get user's items
  static async getUserItems(userId) {
    try {
      // Create a simple query without the status filter to avoid index requirements
      const q = query(collection(db, "items"), where("userId", "==", userId));

      const querySnapshot = await getDocs(q);
      const items = [];

      querySnapshot.forEach((doc) => {
        const itemData = { id: doc.id, ...doc.data() };
        // Filter out deleted items in memory instead of in the query
        if (itemData.status !== "deleted") {
          items.push(itemData);
        }
      });

      return items;
    } catch (error) {
      console.error("Error getting user items:", error);
      throw error;
    }
  }

  // Get user's swaps
  static async getUserSwaps(userId) {
    try {
      const q = query(
        collection(db, SWAPS_COLLECTION),
        where("participants", "array-contains", userId)
      );

      const querySnapshot = await getDocs(q);
      const swaps = [];

      querySnapshot.forEach((doc) => {
        swaps.push({ id: doc.id, ...doc.data() });
      });

      return swaps;
    } catch (error) {
      console.error("Error getting user swaps:", error);
      throw error;
    }
  }

  // Add points to user
  static async addPoints(userId, points) {
    try {
      const userProfile = await this.getUserProfile(userId);
      const currentPoints = userProfile?.points || 0;

      await updateDoc(doc(db, USERS_COLLECTION, userId), {
        points: currentPoints + points,
        updatedAt: serverTimestamp(),
      });

      return currentPoints + points;
    } catch (error) {
      console.error("Error adding points:", error);
      throw error;
    }
  }

  // Deduct points from user
  static async deductPoints(userId, points) {
    try {
      const userProfile = await this.getUserProfile(userId);
      const currentPoints = userProfile?.points || 0;

      if (currentPoints < points) {
        throw new Error("Insufficient points");
      }

      await updateDoc(doc(db, USERS_COLLECTION, userId), {
        points: currentPoints - points,
        updatedAt: serverTimestamp(),
      });

      return currentPoints - points;
    } catch (error) {
      console.error("Error deducting points:", error);
      throw error;
    }
  }

  // Get leaderboard
  static async getLeaderboard(limit = 10) {
    try {
      const q = query(
        collection(db, USERS_COLLECTION),
        where("points", ">", 0)
      );

      const querySnapshot = await getDocs(q);
      const users = [];

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      // Sort by points and limit
      return users
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, limit);
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      throw error;
    }
  }

  // Update user's swap count
  static async updateUserSwapCount(userId, increment) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const currentCount = userSnap.data().completedSwaps || 0;
        await updateDoc(userRef, {
          completedSwaps: currentCount + increment,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error updating user swap count:", error);
      throw error;
    }
  }
}
