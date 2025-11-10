/**
 * ImageKit Authentication Endpoint
 * Generates authentication token for client-side uploads
 */

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // ImageKit private key (should be in environment variables)
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
    
    if (!privateKey) {
      return NextResponse.json(
        { error: "ImageKit private key not configured" },
        { status: 500 }
      );
    }

    // Generate token (simplified - in production, use ImageKit's server SDK)
    // For now, we'll return the configuration needed for client-side uploads
    const token = request.nextUrl.searchParams.get("token") || "";
    const expire = request.nextUrl.searchParams.get("expire") || "";

    // In production, you should use ImageKit's server SDK to generate the token
    // For development, you can use unsigned uploads with public key only
    return NextResponse.json({
      token: token,
      expire: expire,
      signature: "", // Would be generated using private key
    });
  } catch (error) {
    console.error("ImageKit authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
