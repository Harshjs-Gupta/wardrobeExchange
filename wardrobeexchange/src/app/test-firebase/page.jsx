"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function TestFirebasePage() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (test, success, message) => {
    setTestResults((prev) => [
      ...prev,
      { test, success, message, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Basic Firebase connection
      addTestResult(
        "Basic Connection",
        "running",
        "Testing Firebase connection..."
      );
      try {
        const testQuery = query(collection(db, "test"), limit(1));
        await getDocs(testQuery);
        addTestResult(
          "Basic Connection",
          true,
          "Firebase connection successful"
        );
      } catch (error) {
        addTestResult("Basic Connection", false, `Failed: ${error.message}`);
      }

      // Test 2: Firestore write
      addTestResult(
        "Firestore Write",
        "running",
        "Testing Firestore write permission..."
      );
      try {
        const testDoc = await addDoc(collection(db, "test"), {
          test: true,
          timestamp: serverTimestamp(),
          userId: user?.uid,
        });
        addTestResult(
          "Firestore Write",
          true,
          `Document created with ID: ${testDoc.id}`
        );
      } catch (error) {
        addTestResult("Firestore Write", false, `Failed: ${error.message}`);
      }

      // Test 3: Storage write
      addTestResult(
        "Storage Write",
        "running",
        "Testing Storage write permission..."
      );
      try {
        const testBlob = new Blob(["test"], { type: "text/plain" });
        const testFileName = `test/${user?.uid}_${Date.now()}.txt`;
        const testStorageRef = ref(storage, testFileName);

        // Add retry logic for Storage
        let uploadSuccess = false;
        let retryCount = 0;
        const maxRetries = 2;

        while (!uploadSuccess && retryCount < maxRetries) {
          try {
            await uploadBytes(testStorageRef, testBlob);
            const downloadURL = await getDownloadURL(testStorageRef);
            addTestResult(
              "Storage Write",
              true,
              `File uploaded: ${downloadURL}`
            );
            uploadSuccess = true;
          } catch (uploadError) {
            retryCount++;
            if (retryCount >= maxRetries) {
              addTestResult(
                "Storage Write",
                false,
                `Failed after ${maxRetries} attempts: ${uploadError.message}`
              );
            } else {
              // Wait before retrying
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }
      } catch (error) {
        addTestResult("Storage Write", false, `Failed: ${error.message}`);
      }

      // Test 4: User authentication
      addTestResult(
        "User Authentication",
        "running",
        "Checking user authentication..."
      );
      if (user) {
        addTestResult(
          "User Authentication",
          true,
          `User authenticated: ${user.uid}`
        );
      } else {
        addTestResult("User Authentication", false, "No user authenticated");
      }
    } catch (error) {
      addTestResult(
        "Overall Test",
        false,
        `Unexpected error: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          Firebase Connection Test
        </h1>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-8">
          <button
            onClick={runTests}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Running Tests..." : "Run Firebase Tests"}
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Test Results</h2>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    result.success === true
                      ? "bg-green-500"
                      : result.success === false
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <div className="font-semibold text-white">{result.test}</div>
                  <div className="text-gray-300 text-sm">{result.message}</div>
                </div>
                <div className="text-gray-400 text-sm">{result.timestamp}</div>
              </div>
            ))}
            {testResults.length === 0 && (
              <div className="text-gray-400 text-center py-8">
                No tests run yet. Click "Run Firebase Tests" to start.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
