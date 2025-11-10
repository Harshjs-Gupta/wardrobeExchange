/**
 * ImageKit Client Configuration
 * Client-side ImageKit initialization
 */

let imagekitInstance = null;

export const getImageKitInstance = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (imagekitInstance) {
    return imagekitInstance;
  }

  try {
    const ImageKit = await import("imagekit-javascript");
    
    imagekitInstance = new ImageKit.default({
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      authenticationEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_AUTH_ENDPOINT || "/api/imagekit/auth",
    });

    return imagekitInstance;
  } catch (error) {
    console.error("Failed to initialize ImageKit:", error);
    return null;
  }
};

export default getImageKitInstance;
