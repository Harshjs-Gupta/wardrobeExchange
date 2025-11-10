import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALttc9h3ma4BZL-fEcQu9FjbnFUFHY_Pk",
  authDomain: "wardrobeexchange-dff35.firebaseapp.com",
  projectId: "wardrobeexchange-dff35",
  storageBucket: "wardrobeexchange-dff35.firebasestorage.app",
  messagingSenderId: "319735159622",
  appId: "1:319735159622:web:c9cd39c7b547dedec0a347",
  measurementId: "G-XQNYV1X8E1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { app, auth, db, storage, analytics };
