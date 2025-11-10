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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { ItemService } from "./itemService";
import { UserService } from "./userService";

const SWAPS_COLLECTION = "swaps";

export class SwapService {
  // Create a new swap request
  static async createSwap(
    initiatorId,
    targetItemId,
    offeredItemId,
    message = ""
  ) {
    try {
      // Get the items
      const targetItem = await ItemService.getItem(targetItemId);
      const offeredItem = await ItemService.getItem(offeredItemId);

      // Validate items
      if (targetItem.userId === initiatorId) {
        throw new Error("Cannot swap your own item");
      }

      if (
        targetItem.status !== "available" ||
        offeredItem.status !== "available"
      ) {
        throw new Error("One or both items are not available");
      }

      // Create swap document
      const swapDoc = {
        initiatorId,
        targetItemId,
        offeredItemId,
        targetUserId: targetItem.userId,
        message,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        participants: [initiatorId, targetItem.userId],
      };

      const docRef = await addDoc(collection(db, SWAPS_COLLECTION), swapDoc);

      // Update item statuses to "pending"
      await ItemService.updateItem(targetItemId, { status: "pending_swap" });
      await ItemService.updateItem(offeredItemId, { status: "pending_swap" });

      return { id: docRef.id, ...swapDoc };
    } catch (error) {
      console.error("Error creating swap:", error);
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

      for (const doc of querySnapshot.docs) {
        const swap = { id: doc.id, ...doc.data() };

        // Get item details
        try {
          swap.targetItem = await ItemService.getItem(swap.targetItemId);
          swap.offeredItem = await ItemService.getItem(swap.offeredItemId);
        } catch (error) {
          console.error("Error getting item details:", error);
        }

        swaps.push(swap);
      }

      return swaps;
    } catch (error) {
      console.error("Error getting user swaps:", error);
      throw error;
    }
  }

  // Get a single swap
  static async getSwap(swapId) {
    try {
      const docRef = doc(db, SWAPS_COLLECTION, swapId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const swap = { id: docSnap.id, ...docSnap.data() };

        // Get item details
        try {
          swap.targetItem = await ItemService.getItem(swap.targetItemId);
          swap.offeredItem = await ItemService.getItem(swap.offeredItemId);
        } catch (error) {
          console.error("Error getting item details:", error);
        }

        return swap;
      } else {
        throw new Error("Swap not found");
      }
    } catch (error) {
      console.error("Error getting swap:", error);
      throw error;
    }
  }

  // Accept a swap
  static async acceptSwap(swapId, userId) {
    try {
      const swap = await this.getSwap(swapId);

      // Validate user can accept
      if (swap.targetUserId !== userId) {
        throw new Error("You can only accept swaps for your items");
      }

      if (swap.status !== "pending") {
        throw new Error("Swap is not in pending status");
      }

      // Update swap status
      await updateDoc(doc(db, SWAPS_COLLECTION, swapId), {
        status: "accepted",
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update item statuses
      await ItemService.updateItem(swap.targetItemId, { status: "swapped" });
      await ItemService.updateItem(swap.offeredItemId, { status: "swapped" });

      // Add points to both users
      await UserService.addPoints(swap.initiatorId, 50);
      await UserService.addPoints(swap.targetUserId, 50);

      // Update swap counts
      await UserService.updateUserSwapCount(swap.initiatorId, 1);
      await UserService.updateUserSwapCount(swap.targetUserId, 1);

      return await this.getSwap(swapId);
    } catch (error) {
      console.error("Error accepting swap:", error);
      throw error;
    }
  }

  // Reject a swap
  static async rejectSwap(swapId, userId) {
    try {
      const swap = await this.getSwap(swapId);

      // Validate user can reject
      if (swap.targetUserId !== userId) {
        throw new Error("You can only reject swaps for your items");
      }

      if (swap.status !== "pending") {
        throw new Error("Swap is not in pending status");
      }

      // Update swap status
      await updateDoc(doc(db, SWAPS_COLLECTION, swapId), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update item statuses back to available
      await ItemService.updateItem(swap.targetItemId, { status: "available" });
      await ItemService.updateItem(swap.offeredItemId, { status: "available" });

      return await this.getSwap(swapId);
    } catch (error) {
      console.error("Error rejecting swap:", error);
      throw error;
    }
  }

  // Cancel a swap (by initiator)
  static async cancelSwap(swapId, userId) {
    try {
      const swap = await this.getSwap(swapId);

      // Validate user can cancel
      if (swap.initiatorId !== userId) {
        throw new Error("Only the initiator can cancel a swap");
      }

      if (swap.status !== "pending") {
        throw new Error("Swap is not in pending status");
      }

      // Update swap status
      await updateDoc(doc(db, SWAPS_COLLECTION, swapId), {
        status: "cancelled",
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update item statuses back to available
      await ItemService.updateItem(swap.targetItemId, { status: "available" });
      await ItemService.updateItem(swap.offeredItemId, { status: "available" });

      return await this.getSwap(swapId);
    } catch (error) {
      console.error("Error cancelling swap:", error);
      throw error;
    }
  }

  // Complete a swap (mark as completed)
  static async completeSwap(swapId, userId) {
    try {
      const swap = await this.getSwap(swapId);

      // Validate user can complete
      if (!swap.participants.includes(userId)) {
        throw new Error("You can only complete swaps you're involved in");
      }

      if (swap.status !== "accepted") {
        throw new Error("Swap must be accepted before completion");
      }

      // Update swap status
      await updateDoc(doc(db, SWAPS_COLLECTION, swapId), {
        status: "completed",
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return await this.getSwap(swapId);
    } catch (error) {
      console.error("Error completing swap:", error);
      throw error;
    }
  }

  // Get pending swaps for a user
  static async getPendingSwaps(userId) {
    try {
      const swaps = await this.getUserSwaps(userId);
      return swaps.filter((swap) => swap.status === "pending");
    } catch (error) {
      console.error("Error getting pending swaps:", error);
      throw error;
    }
  }

  // Get completed swaps for a user
  static async getCompletedSwaps(userId) {
    try {
      const swaps = await this.getUserSwaps(userId);
      return swaps.filter((swap) => swap.status === "completed");
    } catch (error) {
      console.error("Error getting completed swaps:", error);
      throw error;
    }
  }

  // Get swap statistics
  static async getSwapStats(userId) {
    try {
      const swaps = await this.getUserSwaps(userId);

      return {
        total: swaps.length,
        pending: swaps.filter((s) => s.status === "pending").length,
        accepted: swaps.filter((s) => s.status === "accepted").length,
        completed: swaps.filter((s) => s.status === "completed").length,
        rejected: swaps.filter((s) => s.status === "rejected").length,
        cancelled: swaps.filter((s) => s.status === "cancelled").length,
      };
    } catch (error) {
      console.error("Error getting swap stats:", error);
      throw error;
    }
  }
}
